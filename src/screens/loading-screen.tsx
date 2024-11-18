import { RocketIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import { Screen, ScreenContent } from "@/components/ui/screen";

export const LoadingScreen = observer(() => {
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
