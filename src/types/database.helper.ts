import { type Database } from "./supabase";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

// Now you can export specific models easily:
export type TMeal = Tables<"meals">;
export type TUser = Tables<"users">;
export type TCategory = Tables<"meals-categories">;
export type TDailyEntries = Tables<"daily-entries">;

export type TMealInsert = Omit<TMeal, "id" | "created_at">;
export type TCategoryInsert = Omit<TCategory, "id" | "created_at">;
export type TDailyEntriesInsert = Omit<TDailyEntries, "id" | "created_at">;
