import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { grispiAPI } from "@/grispi/client/api";
import { SetFieldPayload } from "@/grispi/client/tickets/tickets.type";
import { cn } from "@/lib/utils";

type SyncableField = {
  title: string;
  field?:
    | SetFieldPayload
    | {
        value: undefined;
      };
  exists?: boolean;
};

export const SyncSection = () => {
  const { shipmentTrackingDetail, selectedOrder } = useStore().order;
  const { ticket } = useGrispi();
  const [syncLoading, setSyncLoading] = useState<boolean>(false);

  const startingLog = shipmentTrackingDetail?.logs?.[0];

  const arrivalLog = useMemo(
    () =>
      shipmentTrackingDetail?.logs.find(
        (log) => log.shipment_status_code === "2"
      ),
    [shipmentTrackingDetail?.logs]
  );

  const syncableFields = useMemo<SyncableField[]>(
    () => [
      {
        title: "Başlangıç Şubesi",
        field: {
          key: "tu.baslangc_subesi",
          value: startingLog?.location_name,
        },
      },
      {
        title: "Varış Şubesi",
        field: {
          key: "tu.vars_subesi",
          value: arrivalLog?.location_name,
        },
      },
      {
        title: "Gönderici / Kurum Adı",
        field: {
          key: "tu.gonderici_kurum_ad",
          value: shipmentTrackingDetail?.sender_name,
        },
      },
      {
        title: "Sürücü Adı",
        field: {
          key: "tu.surucu_ad",
          value: shipmentTrackingDetail?.driver,
        },
      },
      {
        title: "Sipariş Numarası",
        field: {
          key: "tu.order_number",
          value: selectedOrder?.order_code,
        },
      },
      {
        title: "Kargo Takip Numarası",
        field: {
          key: "tu.tracking_code",
          value: shipmentTrackingDetail?.tracking_code,
        },
      },
      {
        title: "Medya Öğeleri",
        exists: Number(shipmentTrackingDetail?.files.length) > 0,
      },
    ],
    [
      startingLog?.location_name,
      arrivalLog?.location_name,
      selectedOrder?.order_code,
      shipmentTrackingDetail?.tracking_code,
      shipmentTrackingDetail?.driver,
      shipmentTrackingDetail?.sender_name,
    ]
  );

  const handleSyncWithGrispi = async () => {
    if (!ticket || !shipmentTrackingDetail || !selectedOrder) return;

    setSyncLoading(true);

    const fields = syncableFields
      .filter(({ field }) => field && !!field.value)
      .map(({ field }) => field as SetFieldPayload);

    const commentBody = `
    <p>Kargo servisinden gönderilen medya(lar):</p>
    ${shipmentTrackingDetail.files
      .map(({ file }) => `<img src="${file}" />`)
      .join("")}
`;

    try {
      const promise = grispiAPI.tickets.updateTicket(ticket.key, {
        fields,
        ...(shipmentTrackingDetail.files.length > 0 && {
          comment: {
            body: commentBody,
            publicVisible: false,
            creator: [{ key: "us.email", value: "api@integration.grispi.com" }],
          },
        }),
      });

      await toast.promise(promise, {
        loading: "Gönderiliyor...",
        success:
          "Gönderildi. Güncel bilgileri görmek için lütfen sayfayı yenileyin.",
        error: "Bir hata oluştu.",
      });
    } catch {
      //
    } finally {
      setSyncLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="space-y-3 bg-white p-3 shadow">
      <div className="text-sm text-muted-foreground">
        Aşağıdaki bilgileri Grispi'ye gönderebilirsiniz.
      </div>
      <ul className="text-sm text-gray-400">
        {syncableFields.map(({ title, field, exists }) => (
          <li
            key={title}
            className={cn("flex items-center gap-1", {
              "text-green-500": exists || (field && !!field.value),
            })}
          >
            {exists || (field && !!field.value) ? (
              <CheckCircledIcon />
            ) : (
              <CrossCircledIcon />
            )}
            <span>{title}</span>
          </li>
        ))}
      </ul>
      <Button size="sm" onClick={handleSyncWithGrispi} disabled={syncLoading}>
        Grispi'ye Gönder
      </Button>
    </div>
  );
};
