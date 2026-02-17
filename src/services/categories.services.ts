import { supabase } from "@/utils/supabase";

export const getCategories = async () => {
  const data = await supabase.from("meals-categories").select("*");
  return data;
};
