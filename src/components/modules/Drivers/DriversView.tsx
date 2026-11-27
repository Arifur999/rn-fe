"use client";

import { CarFront, ChevronRight, Pencil, Phone, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteDriverAction } from "@/app/(dashboardLayout)/drivers/_action";
import { RowMenu } from "@/components/shared/RowMenu";
import { Button } from "@/components/ui/Button";
import { Badge, Card, EmptyState } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { DRIVER_STATUS_LABEL, DRIVER_STATUS_TONE } from "@/constants/bn";
import { useRunAction } from "@/hooks/useFormState";
import { toBnNumber } from "@/lib/format";
import type { ICar, IDriver } from "@/types";
import { DriverFormDialog } from "./DriverFormDialog";

const initials = (name: string) => name.trim().slice(0, 1);

export function DriversView({ drivers, cars }: { drivers: IDriver[]; cars: ICar[] }) {
  const [editing, setEditing] = useState<IDriver | "new" | null>(null);
  const [deleting, setDeleting] = useState<IDriver | null>(null);
  const remove = useRunAction();
  const working = drivers.filter((d) => d.status === "active").length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="ড্রাইভার"
        subtitle={`মোট ${toBnNumber(drivers.length)} জন · কাজে আছে ${toBnNumber(working)} জন`}
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-5" /> নতুন ড্রাইভার
          </Button>
        }
      />

      {drivers.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="size-7" />}
            title="এখনো কোনো ড্রাইভার নেই"
            text="ড্রাইভার যোগ করলে কে কয়টা ট্রিপ মেরেছে দেখা যাবে।"
            action={
              <Button onClick={() => setEditing("new")}>
                <Plus className="size-5" /> ড্রাইভার যোগ করুন
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {drivers.map((driver) => (
            <Card key={driver.id} className="flex flex-col p-4">
              <div className="flex items-start gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-soft text-xl font-bold text-accent-hover">
                  {initials(driver.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold">{driver.name}</p>
                  <a href={`tel:${driver.phone}`} className="inline-flex items-center gap-1 text-sm text-ink-2 hover:text-primary">
                    <Phone className="size-3.5" />
                    {toBnNumber(driver.phone)}
                  </a>
                </div>
                <RowMenu
                  items={[
                    { label: "বদলান", icon: <Pencil className="size-4" />, onSelect: () => setEditing(driver) },
                    { label: "মুছে ফেলুন", icon: <Trash2 className="size-4" />, onSelect: () => setDeleting(driver), danger: true },
                  ]}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone={DRIVER_STATUS_TONE[driver.status]}>{DRIVER_STATUS_LABEL[driver.status]}</Badge>
                {driver.default_car ? (
                  <Badge tone="blue">
                    <CarFront className="size-3.5" />
                    {driver.default_car.name}
                  </Badge>
                ) : null}
              </div>
              <Link
                href={`/drivers/${driver.id}`}
                className="mt-3 -mb-1 flex items-center justify-between rounded-xl px-1 py-1.5 text-sm font-semibold text-primary hover:bg-primary-soft"
              >
                হিসাব দেখুন <ChevronRight className="size-4" />
              </Link>
            </Card>
          ))}
        </div>
      )}

      {editing ? (
        <DriverFormDialog driver={editing === "new" ? undefined : editing} cars={cars} onClose={() => setEditing(null)} />
      ) : null}
      <ConfirmDialog
        open={!!deleting}
        title="ড্রাইভার মুছে ফেলবেন?"
        message={`"${deleting?.name}" তালিকা থেকে সরে যাবে। আগের ট্রিপের হিসাব থেকে যাবে।`}
        pending={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.run(() => deleteDriverAction(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}
