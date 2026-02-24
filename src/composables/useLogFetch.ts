import { fetchDailyEntries } from "@/services/daily-entries.services";
import { useMealsStore } from "@/stores/meals.store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

// fetch
export const useDailyLogsFetch = () => {
  const isLoading = ref(true);

  const mealsStore = useMealsStore();
  const { meals: cachedMeals } = storeToRefs(mealsStore);

  const fetchMeals = async () => {
    if (cachedMeals.value.mealsData.length === 0) {
      const { data } = await fetchDailyEntries();
      if (data) mealsStore.setMeals(data);
      isLoading.value = false;
    } else {
      isLoading.value = false;
    }
  };

  onMounted(fetchMeals);

  return { isLoading, cachedMeals };
};

// refetch
export const useDailyLogsRefetch = () => {
  const isLoading = ref(true);

  const mealsStore = useMealsStore();
  const { meals: cachedMeals } = storeToRefs(mealsStore);

  const refetchMeals = async () => {
    const { data } = await fetchDailyEntries();
    if (data) mealsStore.setMeals(data);
    isLoading.value = false;
  };

  return { isLoading, cachedMeals, refetchMeals };
};
