import { supabase, supabaseKey } from "@/utils/supabase";

// get meals
export const fetchMealData = async (searchTerm: string) => {
  const response = await fetch(
    `https://aulmhefinbmppfiouebn.supabase.co/functions/v1/searchMeals?searchTerm=${encodeURIComponent(searchTerm)}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );
  const meals = await response.json();
  return meals;
};

// add new meal
export const addNewMeal = async (meal: any) => {
  const data = await supabase.from("meals").insert([meal]);
  return data;
};
