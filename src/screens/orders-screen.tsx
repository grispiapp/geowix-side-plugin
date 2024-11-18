import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import { LoadingWrapper } from "@/components/loading-wrapper";
import { OrderItem } from "@/components/order-item";
import { Button } from "@/components/ui/button";
import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";

export const OrdersScreen = observer(() => {
  const { orders, loading: ordersLoading, error } = useStore().order;
  const { setScreen } = useStore().screen;
  const { ticket, loading: grispiLoading } = useGrispi();

  const isLoading = ordersLoading || grispiLoading;

  return (
    <Screen>
      <ScreenHeader>
        <ScreenTitle>Geowix Sipariş Listesi</ScreenTitle>
      </ScreenHeader>
      <ScreenContent className="space-y-3 p-6">
        {isLoading && <LoadingWrapper />}
        {!isLoading && !error && (
          <>
            {!ticket && (
              <Button
                className="mb-4 w-full"
                onClick={() => {
                  setScreen("search-order");
                }}
              >
                <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                <span>Sipariş Bul</span>
              </Button>
            )}
            {orders?.map((order) => (
              <OrderItem key={order.order_code} order={order} />
            ))}
          </>
        )}
        {!isLoading && error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </ScreenContent>
    </Screen>
  );
});
