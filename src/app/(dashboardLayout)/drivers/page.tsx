import type { Metadata } from "next";
import { DriversView } from "@/components/modules/Drivers/DriversView";
import { loadPage } from "@/lib/loadPage";
import { getCars } from "@/services/car.services";
import { getDrivers } from "@/services/driver.services";

export const metadata: Metadata = { title: "ড্রাইভার" };

export default async function DriversPage() {
  const [{ data: drivers }, { data: cars }] = await Promise.all([loadPage(() => getDrivers()), loadPage(() => getCars())]);
  return <DriversView drivers={drivers} cars={cars} />;
}
