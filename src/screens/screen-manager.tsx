import { LoadingScreen } from "./loading-screen";
import { OrderDetailScreen } from "./order-detail-screen";
import { OrdersScreen } from "./orders-screen";
import { SearchOrderScreen } from "./search-order-screen";
import { observer } from "mobx-react-lite";

import { useStore } from "@/contexts/store-context";

export const ScreenManager = observer(() => {
  const { selectedOrderCode } = useStore().order;
  const { screen } = useStore().screen;

  if (screen === "orders") {
    return <OrdersScreen />;
  }

  if (screen === "order-detail" && selectedOrderCode) {
    return <OrderDetailScreen />;
  }

  if (screen === "search-order") {
    return <SearchOrderScreen />;
  }

  return <LoadingScreen />;
});
