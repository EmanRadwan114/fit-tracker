import { supabase } from "@/utils/supabase";

export const fetchCategories = async () => {
  const data = await supabase.from("meals-categories").select("*");
  return data;
};
