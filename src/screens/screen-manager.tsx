import { OrderDetailScreen } from "./order-detail-screen";
import { OrdersScreen } from "./orders-screen";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { getOrders } from "@/lib/geowix";

export const ScreenManager = observer(() => {
  const {
    selectedOrderCode,
    setSelectedOrderCode,
    setOrders,
    setLoading,
    setError,
  } = useStore().order;
  const { ticket, bundle } = useGrispi();

  useEffect(() => {
    setSelectedOrderCode(null);

    const handleFetchOrders = async () => {
      if (!ticket || !bundle?.settings?.apikey) {
        setError("Talep bilgisine ulaşılamadı.");
        setLoading(false);
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
        return;
      }

      setLoading(true);

      const orders = await getOrders({
        apikey: bundle.settings.apikey as string,
        prm: orderNumber ?? trackingCode ?? phoneNumber,
      });

      if (orders.datav.length === 0) {
        if (orderNumber) {
          setError(
            "Kullanıcının sipariş numarasıyla ilişkili bir kayıt bulunamadı."
          );
        } else if (trackingCode) {
          setError(
            "Kullanıcının takip numarasıyla ilişkili sipariş kaydı bulunamadı."
          );
        } else {
          setError(
            "Kullanıcının telefon numarasıyla ilişkili sipariş kaydı bulunamadı."
          );
        }
      } else {
        setError(null);
      }

      setOrders(orders.datav);
      setLoading(false);

      if (orders.datav.length === 1) {
        setSelectedOrderCode(orders.datav[0].order_code);
      } else if (orders.datav.length === 0) {
        setSelectedOrderCode(null);
      }
    };

    handleFetchOrders();
  }, [ticket, bundle]);

  if (selectedOrderCode) {
    return <OrderDetailScreen />;
  }

  return <OrdersScreen />;
});
