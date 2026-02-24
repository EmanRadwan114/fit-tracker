import { ref } from "vue";

export const calculateMacro = (serving_size: number, valuePer100g: number) => {
  return Math.round((valuePer100g * (serving_size || 0)) / 100);
};

export const formatDate = (date: Date): string =>
  date.toISOString().split("T")[0] || "";
