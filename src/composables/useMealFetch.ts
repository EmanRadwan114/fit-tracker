import { addNewMeal, fetchMealData } from "@/services/meals.services";
import { supabase } from "@/utils/supabase";
import { ref } from "vue";
import { useToast } from "vue-toastification";

export function useMealSearch() {
  const searchResults = ref<any[]>([]);
  const isSearching = ref(false);
  const isLogging = ref(false); // New state for the final save
  let debounceTimer: ReturnType<typeof setTimeout>;

  const toast = useToast();

  const search = async (query: string) => {
    if (query.length < 3) {
      searchResults.value = [];
      return;
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      isSearching.value = true;
      const normalizedQuery = query.toLowerCase().trim();

      try {
        // 1. Check local DB (Cache)
        const { data: localData } = await supabase
          .from("meals")
          .select("*")
          .ilike("name", `%${normalizedQuery}%`);

        if (localData && localData.length > 0) {
          searchResults.value = localData;
          return;
        }

        // 2. Fetch from API
        const apiData = await fetchMealData(normalizedQuery);

        if (apiData.length > 0) {
          const mealsToCache = apiData.slice(0, 5).map((m: any) => ({
            name: m.name,
            food_fact_id: String(m.code),
            calories: m.calories,
            fats: m.fats,
            protein: m.proteins,
            carbs: m.carbs,
          }));

          const { data: cachedData, error: upsertError } = await supabase
            .from("meals")
            .upsert(mealsToCache, { onConflict: "food_fact_id" })
            .select();

          if (upsertError) {
            console.error("Upsert Error:", upsertError);
          }

          searchResults.value = cachedData || apiData;
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch meals");
      } finally {
        isSearching.value = false;
      }
    }, 500);
  };

  /**
   * New Function: Logs the selected meal with a specific serving size
   * @param mealId - The UUID from your 'meals' table
   * @param servingSize - The weight in grams entered by the user
   */
  const logUserMeal = async ({
    mealId,
    servingSize,
    logDate,
    category_id,
  }: {
    mealId: string;
    servingSize: number;
    logDate: string;
    category_id: string;
  }) => {
    isLogging.value = true;
    try {
      const user_id = (await supabase.auth.getUser()).data.user?.id;

      const { error } = await supabase.from("daily-entries").insert([
        {
          meal_id: mealId,
          serving_size: servingSize,
          log_date: logDate,
          user_id: user_id,
          category_id: category_id,
        },
      ]);

      if (!error) {
        toast.success("Meal logged successfully!");
      } else {
        toast.error(error.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isLogging.value = false;
    }
  };

  return {
    search,
    searchResults,
    isSearching,
    isLogging,
    logUserMeal,
  };
}
