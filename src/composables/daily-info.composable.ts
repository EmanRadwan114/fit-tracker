import { computed, onMounted } from "vue";
import proteinImg from "@/assets/images/steak-svgrepo-com.svg";
import carbsImg from "@/assets/images/bread-bun-svgrepo-com.svg";
import fatsImg from "@/assets/images/butter-svgrepo-com.svg";
import type { IDailyEntries, IMeals } from "@/types/meals.types";
import { useDailyLogsFetch } from "./fetch-logs.composable";

export const useDailyInfo = () => {
  const today = new Date().toISOString().split("T")[0];
  const { isLoading, cachedMeals } = useDailyLogsFetch();

  const userDailyNums = computed(() => {
    const totals = cachedMeals.value.mealsData
      .filter((entry: IDailyEntries) => entry.log_date === today)
      .reduce(
        (acc, curr: IDailyEntries) => {
          const meal = curr.meals;

          return {
            calories: acc.calories + (meal?.calories ?? 0),
            protein: acc.protein + (meal?.protein ?? 0),
            carbs: acc.carbs + (meal?.carbs ?? 0),
            fats: acc.fats + (meal?.fats ?? 0),
          };
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 },
      );

    return [
      {
        title: "today's calories",
        data: totals.calories,
        color: "border-b-amber-500",
      },
      {
        title: "protein",
        data: totals.protein,
        icon: proteinImg,
        color: "border-b-blue-500",
      },
      {
        title: "carbs",
        data: totals.carbs,
        icon: carbsImg,
        color: "border-b-red-500",
      },
      {
        title: "fats",
        data: totals.fats,
        icon: fatsImg,
        color: "border-b-green-500",
      },
    ] as IMeals[];
  });

  return { userDailyNums, isLoading };
};
