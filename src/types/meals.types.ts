import type { TCategory, TMeal } from "./database.helper";

export interface IDailyEntries {
  id: string;
  created_at: string;
  log_date: string;
  meals: TMeal | null; // Joined table
  categories: TCategory | null; // Joined table
}

export interface IMeals {
  title: string;
  data: number;
  icon?: string;
  color: string;
}
