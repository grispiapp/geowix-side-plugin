import { StickyAudioPlayer } from "./sticky-audio-player";
import * as Icons from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import { Dispatch, type FC, SetStateAction } from "react";
import toast from "react-hot-toast";

import { useAudio } from "@/contexts/audio-context";
import { formatCallDate } from "@/lib/utils";
import type { CallLog } from "@/types/geowix.type";

type CallLogsProps = {
  logs: CallLog[];
  currentAudioId: number | null;
  setCurrentAudioId: Dispatch<SetStateAction<number | null>>;
};

export const CallLogs: FC<CallLogsProps> = observer(
  ({ logs, currentAudioId, setCurrentAudioId }) => {
    const { isPlaying, togglePlay } = useAudio();

    const handleAudioClick = (log: CallLog) => {
      if (!log.record || !log.record_url) {
        return;
      }

      setCurrentAudioId(log.call_log_id);

      try {
        togglePlay(log.call_log_id, log.record_url);
      } catch (err) {
        console.error(err);
        toast.error("Ses kaydı oynatılamadı.");
      }
    };

    return (
      <div className="space-y-1 bg-white p-3 shadow">
        <h2 className="mb-2 text-base font-semibold">Arama Kayıtları</h2>
        {logs.length > 0 ? (
          <>
            <ol className="space-y-2">
              {logs?.map((log) => (
                <li
                  key={log.call_log_id}
                  className="relative flex items-center rounded-md"
                >
                  {log.disposition === "Cevaplandı" ? (
                    <button
                      onClick={() => handleAudioClick(log)}
                      className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent bg-primary text-background"
                    >
                      {isPlaying && currentAudioId === log.call_log_id ? (
                        <Icons.PauseIcon className="h-4 w-4" />
                      ) : (
                        <Icons.PlayIcon className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <span className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent bg-muted bg-orange-100 text-orange-600">
                      <Icons.CrossCircledIcon className="h-4 w-4" />
                    </span>
                  )}
                  <div className="flex-1 space-y-0.5 text-xs">
                    <div className="flex items-center gap-1 font-medium">
                      <span>{log.from}</span>
                      <Icons.ArrowRightIcon className="mx-0.5 inline h-3 w-3" />{" "}
                      <span>{log.to}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                      {log.record && (
                        <span className="flex items-center">
                          {Math.floor(log.duration / 60)}:
                          {(log.duration % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                      <span>{log.disposition}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatCallDate(log.calldate)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="pt-8">
              {currentAudioId ? <StickyAudioPlayer /> : null}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Arama kaydı bulunamadı.
            </p>
          </div>
        )}
      </div>
    );
  }
);
