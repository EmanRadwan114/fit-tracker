import { reactive } from "vue";
import { defineStore } from "pinia";
import type { ICategories } from "@/types/categories.types";

export const usecategoriesStore = defineStore("categories", () => {
  let categories = reactive<{ data: ICategories[] }>({
    data: [],
  });

  const setcategories = (data: ICategories[]) => {
    categories.data = data;
  };

  return { categories, setcategories };
});
