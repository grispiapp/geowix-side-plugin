import { observer } from "mobx-react-lite";
import { useState } from "react";

import { LoadingWrapper } from "@/components/loading-wrapper";
import { OrderItem } from "@/components/order-item";
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
  const { loading: grispiLoading } = useGrispi();

  const isLoading = ordersLoading || grispiLoading;

  return (
    <Screen>
      <ScreenHeader>
        <ScreenTitle>Geowix Sipariş Listesi</ScreenTitle>
      </ScreenHeader>
      <ScreenContent className="space-y-3 p-6">
        {isLoading && <LoadingWrapper />}
        {!isLoading &&
          !error &&
          orders?.map((order) => (
            <OrderItem key={order.order_code} order={order} />
          ))}
        {!isLoading && error && <div>{error}</div>}
      </ScreenContent>
    </Screen>
  );
});
