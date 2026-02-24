import { supabase } from "@/utils/supabase";

// get meals
const apiurl = "https://world.openfoodfacts.org/api/v2/search";

export const fetchMealData = async (searchTerm: string) => {
  const response = await fetch(
    `${apiurl}?categories_tags_en=${searchTerm}&fields=code,product_name,nutriments`,
    {
      headers: { "User-Agent": "MyMealApp/1.0" },
    },
  );
  const data = await response.json();

  const formattedProducts = data.products.map((p: any) => ({
    name: p.product_name,
    code: p.code,
    // Mapping specific 100g keys
    calories: p.nutriments["energy-kcal_100g"] || 0,
    fats: p.nutriments.fat_100g || 0,
    proteins: p.nutriments.proteins_100g || 0,
    carbs: p.nutriments.carbohydrates_100g || 0,
  }));

  return formattedProducts;
};

// add new meal
export const addNewMeal = async (meal: any) => {
  const data = await supabase.from("meals").insert([meal]);
  return data;
};
