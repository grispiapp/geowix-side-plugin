import { observer } from "mobx-react-lite";
import { CustomerInfo } from "@/components/customer-info";
import { TrackingTimeline } from "@/components/tracking-timeline";
import { SyncSection } from "@/components/sync-section";
import { useOrderDetail } from "../hooks/use-order-detail";

import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { LoadingWrapper } from "@/components/loading-wrapper";

export const OrderDetailScreen = observer(() => {
  const {
    loading,
    selectedOrder,
    shipmentTrackingDetail,
    sortedLogs,
    handleBack,
  } = useOrderDetail();

  return (
    <Screen>
      <ScreenHeader onBack={handleBack}>
        <ScreenTitle>{selectedOrder?.company_name}</ScreenTitle>
      </ScreenHeader>
      <ScreenContent>
        {loading ? (
          <LoadingWrapper />
        ) : (
          <div className="my-2 space-y-2">
            <SyncSection />

            <CustomerInfo
              title="Gönderici"
              customer={{
                name: shipmentTrackingDetail?.sender_name,
                email: shipmentTrackingDetail?.sender_email,
                phone: shipmentTrackingDetail?.sender_telephone,
                address: shipmentTrackingDetail?.sender_address,
              }}
            />

            <CustomerInfo
              title="Alıcı"
              customer={{
                name: shipmentTrackingDetail?.receiver_name,
                email: shipmentTrackingDetail?.receiver_email,
                phone: shipmentTrackingDetail?.receiver_telephone,
                address: shipmentTrackingDetail?.receiver_address,
              }}
            />

            <TrackingTimeline logs={sortedLogs} />
          </div>
        )}
      </ScreenContent>
    </Screen>
  );
});
