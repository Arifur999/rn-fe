"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardError({ retry }: { error: Error; retry: () => void }) {
  return (
    <Card className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 p-8 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-expense-soft text-expense">
        <TriangleAlert className="size-7" />
      </div>
      <h1 className="text-lg font-bold">তথ্য আনা যায়নি</h1>
      <p className="text-sm text-ink-2">ইন্টারনেট বা সার্ভারে সমস্যা হতে পারে। একটু পরে আবার চেষ্টা করুন।</p>
      <Button onClick={() => retry()} className="mt-2">
        <RefreshCw className="size-4" /> আবার চেষ্টা করুন
      </Button>
    </Card>
  );
}
