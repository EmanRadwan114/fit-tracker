import { supabase } from "@/utils/supabase";

// get meals
const apiurl = import.meta.env.DEV
  ? "/food-api"
  : "https://world.openfoodfacts.org";

export const fetchMealData = async (searchTerm: string) => {
  const response = await fetch(
    `${apiurl}/api/v2/search?categories_tags_en=${encodeURIComponent(searchTerm)}&lc=en&lc=ar&tags_lc=en,ar&fields=code,product_name_en,product_name,product_name_ar,nutriments&page_size=20`,
    {
      headers: {
        "User-Agent": "MyMealApp/1.0 (contact@example.com)",
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  const formattedProducts = data.products.map((p: any) => {
    const nutrients = p.nutriments || {};

    return {
      name:
        p.product_name_ar ||
        p.product_name_en ||
        p.product_name ||
        "unknown product",
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
