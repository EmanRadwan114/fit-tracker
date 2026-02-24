import { reactive } from "vue";
import { defineStore } from "pinia";
import type { IDailyEntries } from "@/types/meals.types";

export const useMealsStore = defineStore("meals", () => {
  let meals = reactive<{ mealsData: IDailyEntries[] }>({
    mealsData: [],
  });

  const setMeals = (data: IDailyEntries[]) => {
    meals.mealsData = data;
  };
  const updateMealById = (id: string, data: IDailyEntries) => {
    meals.mealsData = meals.mealsData.map((item) =>
      item.id === id ? data : item,
    );
  };
  const removeEntry = (mealId: string | undefined) => {
    meals.mealsData = meals.mealsData.filter((item) => item.id !== mealId);
  };

  return { meals, setMeals, removeEntry, updateMealById };
});
