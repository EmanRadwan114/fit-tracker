import type { TCategory, TMeal } from "./database.helper";

export interface IDailyEntries {
  id: string;
  log_date: string;
  meals: TMeal | null; // Joined table
  serving_size: number;
  categories: TCategory | null; // Joined table
}

export interface IMeals {
  title: string;
  data: number;
  icon?: string;
  color: string;
}

export interface IMealUpdatedData {
  log_date: string;
  category_id: string;
  serving_size: number;
}

export type TMealForm = Omit<IDailyEntries, "meals" | "categories"> & {
  meals: Omit<
    TMeal,
    | "created_at"
    | "food_fact_id"
    | "serving_size"
    | "id"
    | "user_id"
    | "calories"
  >;
  categories: Omit<TCategory, "created_at">;
};
