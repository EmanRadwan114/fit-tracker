import { computed, onMounted } from "vue";
import proteinImg from "@/assets/images/steak-svgrepo-com.svg";
import carbsImg from "@/assets/images/bread-bun-svgrepo-com.svg";
import fatsImg from "@/assets/images/butter-svgrepo-com.svg";
import type { IMeals } from "@/types/meals.types";
import { useMealFetch } from "./meal-fetch.composable";

export const useDailyInfo = () => {
  const { isLoading, cachedMeals } = useMealFetch();

  const userDailyNums = computed(() => {
    const totals = cachedMeals.value.data.reduce(
      (acc, curr) => ({
        calories: acc.calories + (Number(curr.calories) || 0),
        protein: acc.protein + (Number(curr.protein) || 0),
        carbs: acc.carbs + (Number(curr.carbs) || 0),
        fats: acc.fats + (Number(curr.fats) || 0),
      }),
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
    ] as Array<IMeals>;
  });

  return { userDailyNums, isLoading };
};
