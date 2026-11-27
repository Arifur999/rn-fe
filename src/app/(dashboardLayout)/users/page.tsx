import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UsersView } from "@/components/modules/Users/UsersView";
import { loadPage } from "@/lib/loadPage";
import { getMe } from "@/services/auth.services";
import { getUsers } from "@/services/user.services";

export const metadata: Metadata = { title: "ইউজার" };

// Super admin only. Anyone else gets "not found" (the API also refuses them).
export default async function UsersPage() {
  const { data: me } = await loadPage(() => getMe());
  if (me.role !== "super_admin") notFound();
  const { data: users } = await loadPage(() => getUsers());
  return <UsersView users={users} myEmail={me.email} />;
}
