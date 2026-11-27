import { ArrowRight, Route } from "lucide-react";
import { Badge, EmptyState } from "@/components/ui/Card";
import { TRIP_STATUS_LABEL } from "@/constants/bn";
import { formatMoney, formatShortDate } from "@/lib/format";
import type { IRecentTrip } from "@/types";

export function RecentTrips({ trips, show }: { trips: IRecentTrip[]; show: "car" | "driver" }) {
  if (trips.length === 0) {
    return <EmptyState icon={<Route className="size-7" />} title="এই সময়ে কোনো ট্রিপ নেই" />;
  }
  return (
    <ul className="-my-2 divide-y divide-line-2">
      {trips.map((trip) => {
        const due = trip.status === "cancelled" ? 0 : trip.fare - trip.paid;
        return (
          <li key={trip.id} className="flex items-center gap-3 py-3">
            <div className="w-14 shrink-0 text-center text-xs font-semibold text-ink-2">{formatShortDate(trip.trip_date)}</div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate font-semibold">
                <span className="truncate">{trip.from_place}</span>
                <ArrowRight className="size-3.5 shrink-0 text-ink-3" />
                <span className="truncate">{trip.to_place}</span>
              </p>
              <p className="truncate text-xs text-ink-2">
                {show === "car" ? trip.driver?.name : `${trip.car?.name} · ${trip.car?.number}`}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-bold">{formatMoney(trip.fare)}</p>
              {trip.status === "cancelled" ? (
                <Badge tone="gray">{TRIP_STATUS_LABEL.cancelled}</Badge>
              ) : due > 0 ? (
                <p className="text-xs font-semibold text-due">বাকি {formatMoney(due)}</p>
              ) : (
                <p className="text-xs font-semibold text-income">পরিশোধ</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
