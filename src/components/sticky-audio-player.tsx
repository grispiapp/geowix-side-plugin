import { observer } from "mobx-react-lite";
import { type FC } from "react";

import { useAudio } from "@/contexts/audio-context";

export const StickyAudioPlayer: FC = observer(() => {
  const { progress, currentTime, duration, seek } = useAudio();

  return (
    <div className="fixed bottom-0 left-0 right-0 space-y-2 border-t bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>{currentTime}</p>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          // onChange={(e) => seek(Number(e.target.value))}
          className="h-1 flex-1 appearance-none rounded-full bg-gray-200 accent-primary"
          readOnly
        />
        <p>{duration}</p>
      </div>
    </div>
  );
});
