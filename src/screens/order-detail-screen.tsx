import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { LoadingWrapper } from "@/components/loading-wrapper";
import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { getShipmentTracking } from "@/lib/geowix";
import { cn, formatDistance } from "@/lib/utils";

export const OrderDetailScreen = observer(() => {
  const {
    shipmentTrackingDetail,
    selectedOrder,
    setSelectedOrderCode,
    setShipmentTrackingDetail,
  } = useStore().order;
  const { ticket, settings } = useGrispi();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedOrder?.tracking_code) return;
    if (!settings?.apikey) return;

    const handleFetchShipmentTracking = async () => {
      setLoading(true);

      const order = await getShipmentTracking({
        apikey: settings.apikey,
        tracking_code: selectedOrder.tracking_code,
      });

      setShipmentTrackingDetail(order);
      setLoading(false);
    };

    handleFetchShipmentTracking();
  }, [selectedOrder, settings]);

  const sortedLogs = shipmentTrackingDetail?.logs
    ? [...shipmentTrackingDetail.logs].sort(
        (a, b) =>
          new Date(b.document_date).getTime() -
          new Date(a.document_date).getTime()
      )
    : [];

  return (
    <Screen>
      <ScreenHeader onBack={() => setSelectedOrderCode(null)}>
        <ScreenTitle>{selectedOrder?.company_name}</ScreenTitle>
      </ScreenHeader>
      <ScreenContent>
        {loading && <LoadingWrapper />}
        {!loading && (
          <div className="my-2 space-y-2">
            <div className="space-y-1 bg-white p-3 shadow">
              <h3 className="text-sm font-medium text-muted-foreground">
                Gönderici
              </h3>
              <div>
                <div className="text-lg">
                  {shipmentTrackingDetail?.sender_name}
                </div>
                <div className="flex flex-col">
                  <span>{shipmentTrackingDetail?.sender_email}</span>
                  <span>{shipmentTrackingDetail?.sender_telephone}</span>
                  <span>{shipmentTrackingDetail?.sender_address}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1 bg-white p-3 shadow">
              <h3 className="text-sm font-medium text-muted-foreground">
                Alıcı
              </h3>
              <div>
                <div className="text-lg">
                  {shipmentTrackingDetail?.receiver_name}
                </div>
                <div className="flex flex-col">
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
                          className={cn({
                            "text-primary": log.shipment_status_code === "7",
                          })}
                        >
                          {log.shipment_status}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <span>
                            {log.location_county}, {log.location_city}
                          </span>
                          <span>&bull;</span>
                          <span>{formatDistance(log.document_date)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span>{log.location_phone}</span>
                          {log.undelivered_reason && (
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