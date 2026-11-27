import type { Metadata } from "next";
import { CarsView } from "@/components/modules/Cars/CarsView";
import { dhakaToday } from "@/lib/dates";
import { loadPage } from "@/lib/loadPage";
import { getCars } from "@/services/car.services";

export const metadata: Metadata = { title: "গাড়ি" };

export default async function CarsPage() {
  const { data: cars } = await loadPage(() => getCars());
  return <CarsView cars={cars} today={dhakaToday()} />;
}
