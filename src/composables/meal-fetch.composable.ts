import { getMeals } from "@/services/meals.services";
import { useMealsStore } from "@/stores/meals.store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

export const useMealFetch = () => {
  const isLoading = ref(true);

  const mealsStore = useMealsStore();
  const { meals: cachedMeals } = storeToRefs(mealsStore);

  const fetchMeals = async () => {
    if (cachedMeals.value.data.length === 0) {
      const { data } = await getMeals();
      if (data) mealsStore.setMeals(data);
      isLoading.value = false;
    } else {
      isLoading.value = false;
    }
  };

  onMounted(fetchMeals);

  return { isLoading, cachedMeals };
};
