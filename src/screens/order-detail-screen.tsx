import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { LoadingWrapper } from "@/components/loading-wrapper";
import { Button } from "@/components/ui/button";
import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { grispiAPI } from "@/grispi/client/api";
import { UpdateTicketPayload } from "@/grispi/client/tickets/tickets.type";
import { getShipmentTracking } from "@/lib/geowix";
import { cn } from "@/lib/utils";

export const OrderDetailScreen = observer(() => {
  const {
    orders,
    shipmentTrackingDetail,
    selectedOrder,
    setSelectedOrderCode,
    setShipmentTrackingDetail,
  } = useStore().order;
  const { setScreen } = useStore().screen;
  const { bundle, ticket } = useGrispi();

  const [loading, setLoading] = useState<boolean>(true);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);

  const sortedLogs = useMemo(() => {
    return shipmentTrackingDetail?.logs
      ? [...shipmentTrackingDetail.logs].sort(
          (a, b) =>
            new Date(b.document_date).getTime() -
            new Date(a.document_date).getTime()
        )
      : [];
  }, [shipmentTrackingDetail]);

  const startingLog = shipmentTrackingDetail?.logs?.[0];

  const arrivalLog = useMemo(
    () =>
      shipmentTrackingDetail?.logs.find(
        (log) => log.shipment_status_code === "2"
      ),
    [shipmentTrackingDetail?.logs]
  );

  const syncInformations = useMemo(
    () => [
      {
        title: "Başlangıç Şubesi",
        exists: startingLog?.location_name,
      },
      {
        title: "Varış Şubesi",
        exists: arrivalLog?.location_name,
      },
      // {
      //   title: "Teslimat Durumu",
      //   exists: shipmentTrackingDetail?.shipment_status,
      // },
      {
        title: "Sürücü Adı",
        exists: shipmentTrackingDetail?.driver,
      },
      {
        title: "Sipariş Numarası",
        exists: true,
      },
      {
        title: "Kargo Takip Numarası",
        exists: true,
      },
    ],
    [startingLog, arrivalLog, shipmentTrackingDetail]
  );

  useEffect(() => {
    if (!selectedOrder?.tracking_code) return;
    if (!bundle?.settings?.apikey) return;

    const handleFetchShipmentTracking = async () => {
      setLoading(true);

      const order = await getShipmentTracking({
        apikey: bundle.settings.apikey as string,
        tracking_code: selectedOrder.tracking_code,
      });

      setShipmentTrackingDetail(order);
      setLoading(false);
    };

    handleFetchShipmentTracking();
  }, [selectedOrder, bundle]);

  const handleSyncWithGrispi = async () => {
    if (!ticket) return;
    if (!shipmentTrackingDetail) return;
    if (!selectedOrder) return;

    setSyncLoading(true);

    const fields: UpdateTicketPayload["fields"] = [
      {
        key: "tu.tracking_code",
        value: shipmentTrackingDetail.tracking_code,
      },
      {
        key: "tu.order_number",
        value: selectedOrder.order_code,
      },
    ];

    if (startingLog?.location_name) {
      fields.push({
        key: "tu.baslangc_subesi",
        value: startingLog.location_name,
      });
    }

    if (arrivalLog?.location_name) {
      fields.push({
        key: "tu.vars_subesi",
        value: arrivalLog.location_name,
      });
    }

    // if (shipmentTrackingDetail.shipment_status) {
    //   fields.push({
    //     key: "tu.teslimat_durumu",
    //     value: shipmentTrackingDetail.shipment_status,
    //   });
    // }

    if (shipmentTrackingDetail.driver) {
      fields.push({
        key: "tu.surucu_ad",
        value: shipmentTrackingDetail.driver,
      });
    }

    try {
      const promise = grispiAPI.tickets.updateTicket(ticket.key, {
        fields,
      });

      await toast.promise(promise, {
        loading: "Gönderiliyor...",
        success:
          "Gönderildi. Güncel bilgileri görmek için lütfen sayfayı yenileyin.",
        error: "Bir hata oluştu.",
      });
    } catch (err) {
      //
    } finally {
      setSyncLoading(false);
    }
  };

  const handleBack = () => {
    if (ticket && orders.length === 1) {
      setScreen("orders");
      setSelectedOrderCode(null);
      return;
    }

    if (!ticket && orders.length === 1) {
      setScreen("search-order");
      return;
    }

    setScreen("orders");
  };

  return (
    <Screen>
      <ScreenHeader onBack={handleBack}>
        <ScreenTitle>{selectedOrder?.company_name}</ScreenTitle>
      </ScreenHeader>
      <ScreenContent>
        {loading && <LoadingWrapper />}
        {!loading && (
          <div className="my-2 space-y-2">
            {ticket && (
              <div className="space-y-3 bg-white p-3 shadow">
                <div className="text-sm text-muted-foreground">
                  Aşağıdaki bilgileri Grispi'ye gönderebilirsiniz.
                </div>
                <ul className="text-sm text-gray-400">
                  {syncInformations.map((info) => (
                    <li
                      key={info.title}
                      className={cn("flex items-center gap-1", {
                        "text-green-500": info.exists,
                      })}
                    >
                      {info.exists ? (
                        <CheckCircledIcon />
                      ) : (
                        <CrossCircledIcon />
                      )}
                      <span>{info.title}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  onClick={handleSyncWithGrispi}
                  disabled={syncLoading}
                >
                  Grispi'ye Gönder
                </Button>
              </div>
            )}
            <div className="space-y-1 bg-white p-3 shadow">
              <h3 className="text-xs font-medium text-muted-foreground">
                Gönderici
              </h3>
              <div>
                <div>{shipmentTrackingDetail?.sender_name}</div>
                <div className="flex flex-col *:text-sm">
                  <span>{shipmentTrackingDetail?.sender_email}</span>
                  <span>{shipmentTrackingDetail?.sender_telephone}</span>
                  <span>{shipmentTrackingDetail?.sender_address}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1 bg-white p-3 shadow">
              <h3 className="text-xs font-medium text-muted-foreground">
                Alıcı
              </h3>
              <div>
                <div>{shipmentTrackingDetail?.receiver_name}</div>
                <div className="flex flex-col *:text-sm">
                  <span>{shipmentTrackingDetail?.receiver_email}</span>
                  <span>{shipmentTrackingDetail?.receiver_telephone}</span>
                  <span>{shipmentTrackingDetail?.receiver_address}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1 bg-white p-3 shadow">
              <ol className=" space-y-8 overflow-hidden">
                {sortedLogs.map((log, i) => (
                  <li
                    key={i}
                    className="relative flex-1 after:absolute  after:-bottom-8 after:left-4  after:inline-block after:h-full after:w-0.5 after:bg-muted after:content-[''] lg:after:left-5"
                  >
                    <div className="flex w-full items-start font-medium">
                      <span
                        className={cn(
                          "mr-3 flex aspect-square h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-muted text-sm text-muted-foreground lg:h-10 lg:w-10",
                          {
                            "bg-primary text-white":
                              log.shipment_status_code === "7",
                          }
                        )}
                      >
                        {sortedLogs.length - i}
                      </span>
                      <div className="block">
                        <div
                          className={cn("text-sm", {
                            "text-primary": log.shipment_status_code === "7",
                          })}
                        >
                          {log.shipment_status}
                        </div>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span>
                            {log.location_county}, {log.location_city}
                          </span>
                          <span>
                            {format(log.document_date, "dd.MM.yyyy HH:mm")}
                          </span>
                        </div>
                        <div className="flex flex-col text-xs">
                          {log.location_phone !== "2162323088" && (
                            <span>{log.location_phone}</span>
                          )}
                          {log.undelivered_reason &&
                            log.shipment_status_code !== "7" && (
                              <span className="text-destructive">
                                {log.undelivered_reason}
                              </span>
                            )}
                          {log.notes && <span>{log.notes}</span>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </ScreenContent>
    </Screen>
  );
});
