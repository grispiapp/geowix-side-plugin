import { useEffect, useMemo, useState } from "react";

import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { getShipmentTracking } from "@/lib/geowix";

export const useOrderDetail = () => {
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

  const sortedLogs = useMemo(() => {
    return shipmentTrackingDetail?.logs
      ? [...shipmentTrackingDetail.logs].sort(
          (a, b) =>
            new Date(b.document_date).getTime() -
            new Date(a.document_date).getTime()
        )
      : [];
  }, [shipmentTrackingDetail]);

  useEffect(() => {
    if (!selectedOrder?.tracking_code || !bundle?.settings?.apikey) return;

    const fetchShipmentTracking = async () => {
      setLoading(true);
      const order = await getShipmentTracking({
        apikey: bundle.settings.apikey as string,
        tracking_code: selectedOrder.tracking_code,
      });
      setShipmentTrackingDetail(order);
      setLoading(false);
    };

    fetchShipmentTracking();
  }, [selectedOrder, bundle]);

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

  return {
    loading,
    selectedOrder,
    shipmentTrackingDetail,
    sortedLogs,
    handleBack,
  };
};
