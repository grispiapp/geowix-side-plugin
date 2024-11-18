import {
  CornerTopLeftIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { useStore } from "@/contexts/store-context";
import { getOrders } from "@/lib/geowix";

export const SearchOrderScreen = observer(() => {
  const { bundle } = useGrispi();
  const {
    error,
    setOrders,
    loading,
    setLoading,
    setError,
    setSelectedOrderCode,
  } = useStore().order;
  const { setScreen } = useStore().screen;
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setLoading(true);
      setError(null);

      try {
        if (!bundle?.settings?.apikey) {
          throw new Error("API key bulunamadı");
        }

        if (!searchValue || searchValue.length < 3) {
          setError("Aramak için en az 3 karakter girmelisiniz.");
          return;
        }

        const orders = await getOrders({
          apikey: bundle.settings.apikey as string,
          prm: searchValue,
        }).catch((err) => {
          console.error("Geowix API Error:", err);
          throw new Error("Arama sırasında bir hata oluştu");
        });

        if (!orders?.datav) {
          throw new Error("Geçersiz API yanıtı");
        }

        if (orders.datav.length === 0) {
          setError("Aramanızla eşleşen bir kayıt bulunamadı.");
        } else {
          setOrders(orders.datav);

          if (orders.datav.length === 1) {
            setSelectedOrderCode(orders.datav[0].order_code);
            setScreen("order-detail");
          } else {
            setScreen("orders");
          }
        }
      } catch (error) {
        console.error("Search Error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Arama sırasında bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    },
    [bundle?.settings?.apikey, searchValue]
  );

  return (
    <Screen className="flex h-full flex-col bg-background">
      <ScreenHeader>
        <ScreenTitle>Kargo Ara</ScreenTitle>
      </ScreenHeader>
      <ScreenContent className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-input" className="text-xs font-medium">
                Sipariş numarası, takip kodu veya telefon numarası
              </Label>
              <Input
                id="search-input"
                className="w-full"
                placeholder="Aramak için girin..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!searchValue || searchValue.length < 3 || loading}
            >
              {loading ? (
                <CornerTopLeftIcon className="size-8 animate-spin text-primary" />
              ) : (
                <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
              )}
              Sorgula
            </Button>
          </form>
        </div>
      </ScreenContent>
    </Screen>
  );
});
