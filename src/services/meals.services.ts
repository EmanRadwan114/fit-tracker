import { supabase } from "@/utils/supabase";

// get meals
export const getMeals = async () => {
  const data = await supabase.from("meals").select("*");
  return data;
};
