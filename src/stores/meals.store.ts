import { reactive } from "vue";
import { defineStore } from "pinia";
import type { TMeal } from "@/types/database.helper";

export const useMealsStore = defineStore("meals", () => {
  let meals = reactive<{ data: TMeal[] }>({
    data: [],
  });

  const setMeals = (data: TMeal[]) => {
    meals.data = data;
  };

  return { meals, setMeals };
});
