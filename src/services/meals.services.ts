import { supabase } from "@/utils/supabase";

// get meals
export const fetchMealData = async (searchTerm: string) => {
  const { data, error } = await supabase.functions.invoke(
    `searchMeals?searchTerm=${encodeURIComponent(searchTerm)}`,
    {
      method: "GET",
    },
  );

  if (error) throw error;
  return data;
};

// add new meal
export const addNewMeal = async (meal: any) => {
  const data = await supabase.from("meals").insert([meal]);
  return data;
};
