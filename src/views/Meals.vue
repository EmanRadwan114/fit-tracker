<script setup lang="ts">
import DeleteModal from "@/components/modals/DeleteModal.vue";
import Loader from "@/components/ui/Loader.vue";
import { useDailyLogsFetch } from "@/composables/fetch-logs.composable";
import { deleteMealLog } from "@/services/daily-entries.services";
import { useMealsStore } from "@/stores/meals.store";
import type { IDailyEntries } from "@/types/meals.types";
import { Eye, Pencil, Trash2, X } from "lucide-vue-next";
import { ref } from "vue";
import { useToast } from "vue-toastification";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

// refs & reactives
const selectedMeal = ref<IDailyEntries | null>(null);
const activeModal = ref<"view" | "edit" | "delete" | null>(null);

// hooks
const { cachedMeals, isLoading } = useDailyLogsFetch();
const mealsStore = useMealsStore();
const toast = useToast();

// handlers
const handleAction = (
  meal: IDailyEntries,
  action: "view" | "edit" | "delete",
) => {
  selectedMeal.value = meal;
  activeModal.value = action;
};

const closeModal = () => {
  activeModal.value = null;
  selectedMeal.value = null;
};

const handleDelete = async () => {
  const mealId = selectedMeal.value?.id;
  if (!mealId) return;

  try {
    const { error } = await deleteMealLog(mealId);

    if (error) {
      toast.error(error.message);
      return;
    }

    mealsStore.removeEntry(selectedMeal.value?.id);
    toast.success("Log deleted successfully");
    closeModal();
  } catch (err: any) {
    toast.error(err?.message || "An unexpected error occurred");
    console.error(err);
  }
};
</script>

<template>
  <!-- displayed logs -->
  <div class="overflow-auto">
    <Loader v-if="isLoading" />
    <table v-else class="w-full bg-white shadow-md rounded-sm">
      <thead>
        <tr class="capitalize bg-primary/50 border-b border-neutral-300">
          <th class="text-start px-8 py-5">name</th>
          <th class="text-start px-8 py-5">weight</th>
          <th class="text-start px-8 py-5">calories (kcal)</th>
          <th class="text-start px-8 py-5">date</th>
          <th class="text-start px-8 py-5">actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="meal in cachedMeals.mealsData"
          :key="meal.id"
          class="border-b border-neutral-300"
        >
          <td class="px-8 py-5 font-medium">
            {{ meal.meals?.name }}
          </td>
          <td class="px-8 py-5">
            {{ meal.meals?.serving_size }}
          </td>
          <td class="px-8 py-5">
            {{ meal.meals?.calories }}
          </td>
          <td class="px-8 py-5">
            {{ meal.log_date?.split("T")[0] }}
          </td>
          <td class="px-8 py-5 flex items-center gap-3">
            <Eye
              :size="25"
              class="cursor-pointer p-1 text-blue-800"
              @click="handleAction(meal, 'view')"
            />
            <Pencil
              :size="25"
              class="cursor-pointer p-1 text-yellow-600"
              @click="handleAction(meal, 'edit')"
            />
            <Trash2
              :size="25"
              class="cursor-pointer p-1 text-red-800"
              @click="handleAction(meal, 'delete')"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- delete modal -->
  <DeleteModal
    @confirm="handleDelete"
    @cancel="closeModal"
    v-if="activeModal === 'delete'"
  />
</template>
