import { supabase } from "@/utils/supabase";
import type { IDailyEntries } from "@/types/meals.types";

export const fetchDailyEntries = async () => {
  const { data, error } = await supabase
    .from("daily-entries")
    .select(
      `
      id,
      created_at,
      log_date,
      meals (
        id, name, calories, protein, carbs, fats, serving_size
      ), 
      categories:"meals-categories" (  
        id, name
      )
    `,
    )
    .order("log_date", { ascending: false });

  return {
    data: data as unknown as IDailyEntries[],
    error,
  };
};

// delete meals
export const deleteMealLog = async (id: string | undefined) => {
  const data = await supabase.from("daily-entries").delete().eq("id", id);
  return data;
};
