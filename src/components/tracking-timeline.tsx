import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { ShipmentLog } from "@/types/geowix.type";

interface TrackingTimelineProps {
    logs: ShipmentLog[];
}

export const TrackingTimeline: FC<TrackingTimelineProps> = ({ logs }) => {
    return (
        <div className="space-y-1 bg-white p-3 shadow">
            <ol className="space-y-8 overflow-hidden">
                {logs.map((log, i) => (
                    <li
                        key={i}
                        className="relative flex-1 after:absolute after:-bottom-8 after:left-4 after:inline-block after:h-full after:w-0.5 after:bg-muted after:content-[''] lg:after:left-5"
                    >
                        <div className="flex w-full items-start font-medium">
                            <span
                                className={cn(
                                    "mr-3 flex aspect-square h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-muted text-sm text-muted-foreground lg:h-10 lg:w-10",
                                    {
                                        "bg-primary text-white": log.shipment_status_code === "7",
                                    }
                                )}
                            >
                                {logs.length - i}
                            </span>
                            <div className="block">
                                <div
                                    className={cn("text-sm", {
                                        "text-primary": log.shipment_status_code === "7",
                                    })}
                                >
                                    {log.shipment_status}
                                </div>
                                <div className="flex flex-col text-xs text-muted-foreground">
                                    <span>
                                        {log.location_county}, {log.location_city}
                                    </span>
                                    <span>
                                        {format(new Date(log.document_date), "dd.MM.yyyy HH:mm")}
                                    </span>
                                </div>
                                <div className="flex flex-col text-xs">
                                    {log.location_phone !== "2162323088" && (
                                        <span>{log.location_phone}</span>
                                    )}
                                    {log.undelivered_reason &&
                                        log.shipment_status_code !== "7" && (
                                            <span className="text-destructive">
                                                {log.undelivered_reason}
                                            </span>
                                        )}
                                    {log.notes && <span>{log.notes}</span>}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};
