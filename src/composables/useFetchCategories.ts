import { fetchCategories } from "@/services/categories.services";
import { usecategoriesStore } from "@/stores/categories.store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

export const useFetchCategories = () => {
  const isLoading = ref(true);

  const categStore = usecategoriesStore();
  const { categories: cachedCategories } = storeToRefs(categStore);

  const fetchCategs = async () => {
    if (cachedCategories.value.data.length === 0) {
      const { data } = await fetchCategories();
      if (data) categStore.setcategories(data);
      isLoading.value = false;
    } else {
      isLoading.value = false;
    }
  };

  onMounted(fetchCategs);

  return { isLoading, cachedCategories };
};
