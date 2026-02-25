import { supabase } from "@/utils/supabase";

// get meals
const apiurl = "https://world.openfoodfacts.org";

export const fetchMealData = async (searchTerm: string) => {
  const response = await fetch(
    `${apiurl}/cgi/search.pl?search_terms=${searchTerm}&search_simple=1&action=process&json=1&fields=code,product_name,product_name_ar,nutriments`,
    {
      headers: { "User-Agent": "MyMealApp/1.0", Accept: "application/json" },
    },
  );
  const data = await response.json();

  const formattedProducts = data.products.map((p: any) => {
    const nutrients = p.nutriments || {};

    return {
      name: p.product_name_ar || p.product_name || "منتج غير معروف",
      code: p.code,
      calories: nutrients["energy-kcal_100g"] ?? nutrients["energy-kcal"] ?? 0,
      fats: nutrients.fat_100g ?? 0,
      proteins: nutrients.proteins_100g ?? 0,
      carbs: nutrients.carbohydrates_100g ?? 0,
    };
  });

  return formattedProducts;
};

// add new meal
export const addNewMeal = async (meal: any) => {
  const data = await supabase.from("meals").insert([meal]);
  return data;
};
