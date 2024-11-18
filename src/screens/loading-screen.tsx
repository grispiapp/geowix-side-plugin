import { RocketIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { Screen, ScreenContent } from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { getOrders } from "@/lib/geowix";

export const LoadingScreen = observer(() => {
  const { setSelectedOrderCode, setOrders, setLoading, setError } =
    useStore().order;
  const { setScreen } = useStore().screen;
  const { ticket, bundle, loading: grispiLoading } = useGrispi();

  useEffect(() => {
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
        setScreen("order-detail");
      } else if (orders.datav.length === 0) {
        setSelectedOrderCode(null);
      }
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

  return (
    <Screen className="flex h-full flex-col bg-background">
      <ScreenContent className="flex flex-1 items-center justify-center overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative">
            <div className="absolute -inset-1 animate-ping rounded-full bg-primary/20" />
            <div className="relative rounded-full bg-background p-4 shadow">
              <RocketIcon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Yükleniyor
            </h2>
            <p className="text-sm text-muted-foreground">Lütfen bekleyin...</p>
          </div>
          <div className="w-16 overflow-hidden">
            <div className="rounded-full bg-primary/20">
              <div className="h-1 w-16 animate-progress rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </ScreenContent>
    </Screen>
  );
});
