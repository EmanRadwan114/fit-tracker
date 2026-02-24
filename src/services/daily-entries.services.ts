import { supabase } from "@/utils/supabase";
import type {
  IDailyEntries,
  IMealUpdatedData,
  TMealForm,
} from "@/types/meals.types";

export const fetchDailyEntries = async () => {
  const { data, error } = await supabase
    .from("daily-entries")
    .select(
      `
      id,
      log_date,
      serving_size,
      meals (
        id, name, calories, protein, carbs, fats
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

// edit meals
export const editMealLog = async (
  entryId: string,
  updatedData: IMealUpdatedData,
) => {
  const entryPromise = await supabase
    .from("daily-entries")
    .update({
      log_date: updatedData.log_date,
      category_id: updatedData.category_id,
    })
    .eq("id", entryId);

  if (updatedData.serving_size) {
    const servingPromise = await supabase
      .from("daily-entries")
      .update({
        serving_size: Number(updatedData.serving_size),
      })
      .eq("id", entryId);

    return servingPromise.error || null;
  }

  return entryPromise.error || null;
};

// delete meals
export const deleteMealLog = async (id: string | undefined) => {
  const data = await supabase.from("daily-entries").delete().eq("id", id);
  return data;
};
