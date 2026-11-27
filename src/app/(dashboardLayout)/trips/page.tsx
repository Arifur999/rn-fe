import type { Metadata } from "next";
import { TripsView } from "@/components/modules/Trips/TripsView";
import { dhakaToday, resolvePeriod } from "@/lib/dates";
import { loadPage } from "@/lib/loadPage";
import { pageNumber, param, type SearchParams } from "@/lib/pageParams";
import { getCars } from "@/services/car.services";
import { getDrivers } from "@/services/driver.services";
import { getTrips } from "@/services/trip.services";

export const metadata: Metadata = { title: "ট্রিপ" };

export default async function TripsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const period = resolvePeriod({ period: param(sp, "period"), from: param(sp, "from"), to: param(sp, "to") }, "month");
  const filters = {
    car: param(sp, "car"),
    driver: param(sp, "driver"),
    status: param(sp, "status"),
    due: param(sp, "due") === "1",
    q: param(sp, "q"),
  };

  const [trips, cars, drivers] = await Promise.all([
    loadPage(() =>
      getTrips({
        from: period.from,
        to: period.to,
        car_id: filters.car,
        driver_id: filters.driver,
        status: filters.status,
        due_only: filters.due || undefined,
        search: filters.q,
        page: pageNumber(sp),
      }),
    ),
    loadPage(() => getCars()),
    loadPage(() => getDrivers()),
  ]);

  return (
    <TripsView
      trips={trips.data}
      meta={trips.meta ?? { page: 1, limit: 20, total: trips.data.length, totalPage: 1 }}
      cars={cars.data}
      drivers={drivers.data}
      period={period}
      filters={filters}
      today={dhakaToday()}
      openNew={param(sp, "new") === "1"}
    />
  );
}
