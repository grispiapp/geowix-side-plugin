import { useOrderDetail } from "../hooks/use-order-detail";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import { CallLogs } from "@/components/call-logs";
import { CustomerInfo } from "@/components/customer-info";
import { LoadingWrapper } from "@/components/loading-wrapper";
import { SyncSection } from "@/components/sync-section";
import { TrackingTimeline } from "@/components/tracking-timeline";
import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { AudioProvider } from "@/contexts/audio-context";

export const OrderDetailScreen = observer(() => {
  const [currentAudioId, setCurrentAudioId] = useState<number | null>(null);

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

            <AudioProvider currentAudioId={currentAudioId}>
              <CallLogs
                currentAudioId={currentAudioId}
                setCurrentAudioId={setCurrentAudioId}
                logs={shipmentTrackingDetail?.call_logs ?? []}
              />
            </AudioProvider>
          </div>
        )}
      </ScreenContent>
    </Screen>
  );
});
