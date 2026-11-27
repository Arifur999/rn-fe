import "server-only";
import { httpClient } from "@/lib/httpClient";
import type { IDashboard } from "@/types";

export const getDashboard = (range: { from: string; to: string }) => httpClient.get<IDashboard>("/dashboard", range);
