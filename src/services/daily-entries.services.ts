import { supabase } from "@/utils/supabase";

export const getDailyEntries = async () => {
  const data = await supabase.from("daily-entries").select("*");
  return data;
};
