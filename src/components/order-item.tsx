import { Button } from "./ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useStore } from "@/contexts/store-context";
import { Order } from "@/types/geowix.type";

type OrderItemProps = {
  order: Order;
};

export const OrderItem: FC<OrderItemProps> = observer(({ order }) => {
  const { order: orderStore } = useStore();
  const { setScreen } = useStore().screen;

  const handleSelect = () => {
    orderStore.setSelectedOrderCode(order.order_code);
    setScreen("order-detail");
  };

  return (
    <div className="w-full rounded bg-white px-3 py-2 shadow">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <h2 className="font-medium">{order.company_name}</h2>
            <div className="text-muted-foreground">
              {format(order.date, "dd.MM.yyyy HH:mm")}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Sipariş Kodu</span>
            <span>{order.order_code}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Takip Kodu</span>
            <span>{order.tracking_code}</span>
          </div>
        </div>
        <Button onClick={handleSelect}>
          <ArrowRightIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
});
