import { formatDate } from "@/utils/meals.helpers";
import { computed, ref } from "vue";

const todayStr = formatDate(new Date());
const dateFilter = ref<string>(todayStr);

export const useFormateDate = () => {
  const changeDate = (days: number) => {
    const current = new Date(dateFilter.value);
    current.setDate(current.getDate() + days);
    dateFilter.value = formatDate(current);
  };

  const isToday = computed(() => dateFilter.value === todayStr);

  return {
    dateFilter,
    changeDate,
    isToday,
    today: todayStr,
  };
};
