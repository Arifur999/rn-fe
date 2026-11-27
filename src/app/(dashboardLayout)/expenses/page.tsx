import type { Metadata } from "next";
import { ExpensesView } from "@/components/modules/Expenses/ExpensesView";
import { dhakaToday, resolvePeriod } from "@/lib/dates";
import { loadPage } from "@/lib/loadPage";
import { pageNumber, param, type SearchParams } from "@/lib/pageParams";
import { getCars } from "@/services/car.services";
import { getDrivers } from "@/services/driver.services";
import { getExpenses } from "@/services/expense.services";

export const metadata: Metadata = { title: "খরচ" };

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const period = resolvePeriod({ period: param(sp, "period"), from: param(sp, "from"), to: param(sp, "to") }, "month");
  const filters = { category: param(sp, "category"), car: param(sp, "car"), driver: param(sp, "driver") };

  const [expenses, cars, drivers] = await Promise.all([
    loadPage(() =>
      getExpenses({
        from: period.from,
        to: period.to,
        category: filters.category,
        car_id: filters.car,
        driver_id: filters.driver,
        page: pageNumber(sp),
        limit: 30,
      }),
    ),
    loadPage(() => getCars()),
    loadPage(() => getDrivers()),
  ]);

  return (
    <ExpensesView
      expenses={expenses.data}
      meta={expenses.meta ?? { page: 1, limit: 30, total: expenses.data.length, totalPage: 1 }}
      cars={cars.data}
      drivers={drivers.data}
      period={period}
      filters={filters}
      today={dhakaToday()}
    />
  );
}
