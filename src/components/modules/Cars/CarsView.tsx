"use client";

import { CarFront, ChevronRight, FileWarning, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteCarAction } from "@/app/(dashboardLayout)/cars/_action";
import { RowMenu } from "@/components/shared/RowMenu";
import { Button } from "@/components/ui/Button";
import { Badge, Card, EmptyState, NumberPlate } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { CAR_STATUS_LABEL, CAR_STATUS_TONE, CAR_TYPE_LABEL } from "@/constants/bn";
import { useRunAction } from "@/hooks/useFormState";
import { carPaperWarnings } from "@/lib/expiry";
import { formatDaysLeft, toBnNumber } from "@/lib/format";
import type { ICar } from "@/types";
import { CarFormDialog } from "./CarFormDialog";

export function CarsView({ cars, today }: { cars: ICar[]; today: string }) {
  const [editing, setEditing] = useState<ICar | "new" | null>(null);
  const [deleting, setDeleting] = useState<ICar | null>(null);
  const remove = useRunAction();

  const running = cars.filter((c) => c.status === "active").length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="গাড়ি"
        subtitle={`মোট ${toBnNumber(cars.length)}টি গাড়ি · চালু ${toBnNumber(running)}টি`}
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-5" /> নতুন গাড়ি
          </Button>
        }
      />

      {cars.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CarFront className="size-7" />}
            title="এখনো কোনো গাড়ি নেই"
            text="প্রথমে গাড়ি যোগ করুন, তারপর ড্রাইভার আর ট্রিপ।"
            action={
              <Button onClick={() => setEditing("new")}>
                <Plus className="size-5" /> গাড়ি যোগ করুন
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => {
            const warnings = carPaperWarnings(car, today);
            return (
              <Card key={car.id} className="flex flex-col p-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <CarFront className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold">{car.name}</p>
                    <p className="text-sm text-ink-2">{CAR_TYPE_LABEL[car.type]}</p>
                  </div>
                  <RowMenu
                    items={[
                      { label: "বদলান", icon: <Pencil className="size-4" />, onSelect: () => setEditing(car) },
                      { label: "মুছে ফেলুন", icon: <Trash2 className="size-4" />, onSelect: () => setDeleting(car), danger: true },
                    ]}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <NumberPlate number={car.number} />
                  <Badge tone={CAR_STATUS_TONE[car.status]}>{CAR_STATUS_LABEL[car.status]}</Badge>
                </div>
                {warnings.length > 0 ? (
                  <div className="mt-3 flex flex-col gap-1 rounded-xl bg-due-soft px-3 py-2">
                    {warnings.map((w) => (
                      <p key={w.label} className="flex items-center gap-1.5 text-[13px] font-medium text-due">
                        <FileWarning className="size-4 shrink-0" />
                        {w.label}: {formatDaysLeft(w.days)}
                      </p>
                    ))}
                  </div>
                ) : null}
                <Link
                  href={`/cars/${car.id}`}
                  className="mt-3 -mb-1 flex items-center justify-between rounded-xl px-1 py-1.5 text-sm font-semibold text-primary hover:bg-primary-soft"
                >
                  হিসাব দেখুন <ChevronRight className="size-4" />
                </Link>
              </Card>
            );
          })}
        </div>
      )}

      {editing ? <CarFormDialog car={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} /> : null}
      <ConfirmDialog
        open={!!deleting}
        title="গাড়ি মুছে ফেলবেন?"
        message={`"${deleting?.name} (${deleting?.number})" তালিকা থেকে সরে যাবে। আগের ট্রিপ আর খরচের হিসাব থেকে যাবে।`}
        pending={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.run(() => deleteCarAction(deleting.id), () => setDeleting(null))}
      />
    </div>
  );
}
