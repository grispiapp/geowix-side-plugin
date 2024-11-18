import { LoadingScreen } from "./loading-screen";
import { OrderDetailScreen } from "./order-detail-screen";
import { OrdersScreen } from "./orders-screen";
import { SearchOrderScreen } from "./search-order-screen";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { getOrders } from "@/lib/geowix";

export const ScreenManager = observer(() => {
  const { selectedOrderCode } = useStore().order;
  const { screen } = useStore().screen;

  const { setSelectedOrderCode, setOrders, setLoading, setError } =
    useStore().order;
  const { setScreen } = useStore().screen;
  const { ticket, bundle, loading: grispiLoading } = useGrispi();

  const handleScreenTransition = (
    orders: any[],
    errorMessage: string | null = null
  ) => {
    setError(errorMessage);

    if (errorMessage || orders.length === 0) {
      setSelectedOrderCode(null);
      setScreen("orders");
    } else if (orders.length === 1) {
      setSelectedOrderCode(orders[0].order_code);
      setScreen("order-detail");
    } else {
      setScreen("orders");
    }
  };

  useEffect(() => {
    console.log("ScreenManager useEffect", {
      ticket: ticket?.key,
    });

    if (grispiLoading) return;

    setSelectedOrderCode(null);

    const handleFetchOrders = async () => {
      if (!ticket || !bundle?.settings?.apikey) {
        setError("Talep bilgisine ulaşılamadı.");
        setLoading(false);
        setScreen("search-order");
        return;
      }

      const orderNumber = ticket.fieldMap["tu.order_number"]?.value;
      const trackingCode = ticket.fieldMap["tu.tracking_code"]?.value;
      const phoneNumber = bundle.context.requester.phone?.startsWith("+90")
        ? bundle.context.requester.phone.replace("+90", "")
        : null;

      if (!orderNumber && !trackingCode && !phoneNumber) {
        setError(
          "Siparişlerin listelenmesi için telefon, sipariş numarası veya takip kodu bilgilerinden biri gereklidir. Lütfen bu bilgilerden birini talep formuna ekleyip kaydedin."
        );
        setLoading(false);
        setSelectedOrderCode(null);
        setScreen("orders");
        return;
      }

      setLoading(true);

      const orders = await getOrders({
        apikey: bundle.settings.apikey as string,
        prm: orderNumber ?? trackingCode ?? phoneNumber,
      });

      let errorMessage = null;
      if (orders.datav.length === 0) {
        errorMessage = orderNumber
          ? "Kullanıcının sipariş numarasıyla ilişkili bir kayıt bulunamadı."
          : trackingCode
            ? "Kullanıcının takip numarasıyla ilişkili sipariş kaydı bulunamadı."
            : "Kullanıcının telefon numarasıyla ilişkili sipariş kaydı bulunamadı.";
      }

      setOrders(orders.datav);
      setLoading(false);
      handleScreenTransition(orders.datav, errorMessage);
    };

    handleFetchOrders();
  }, [
    ticket,
    bundle,
    grispiLoading,
    setError,
    setLoading,
    setScreen,
    setSelectedOrderCode,
  ]);

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
