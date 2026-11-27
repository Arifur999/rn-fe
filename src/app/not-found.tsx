import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-5xl">🚗💨</p>
      <h1 className="text-xl font-bold">পাতাটি পাওয়া যায়নি</h1>
      <p className="text-sm text-ink-2">হয়তো মুছে ফেলা হয়েছে বা লিংক ভুল।</p>
      <Link href="/dashboard" className={buttonClass("primary", "md", "mt-2")}>
        ড্যাশবোর্ডে যান
      </Link>
    </div>
  );
}
