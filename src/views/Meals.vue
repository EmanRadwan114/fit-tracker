<script setup lang="ts">
import AddModal from "@/components/modals/AddModal.vue";
import DeleteModal from "@/components/modals/DeleteModal.vue";
import ViewEditModal from "@/components/modals/ViewEditModal.vue";
import Loader from "@/components/ui/Loader.vue";
import { useFormateDate } from "@/composables/useFormateDate";
import { useDailyLogsFetch } from "@/composables/useLogFetch";
import type { IDailyEntries } from "@/types/meals.types";
import { calculateMacro } from "@/utils/meals.helpers";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-vue-next";
import { computed, ref } from "vue";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

// refs & reactives
const selectedMeal = ref<IDailyEntries | null>(null);
const activeModal = ref<"view" | "edit" | "delete" | "add" | null>(null);

// hooks
const { cachedMeals, isLoading } = useDailyLogsFetch();
const { dateFilter, changeDate, isToday, today } = useFormateDate();

// computed
const filteredMeals = computed(() => {
  return cachedMeals.value.mealsData.filter((meal) => {
    const mealDate = meal.log_date?.split("T")[0];
    return mealDate === dateFilter.value;
  });
});

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
</script>

<template>
  <!-- header actions -->
  <header
    class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
  >
    <h2 class="text-2xl font-semibold text-center md:text-start">
      Your Logged Meals
    </h2>

    <div class="flex flex-col md:flex-row gap-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
      <!-- date filter -->
      <div
        class="flex items-center justify-center gap-4 bg-white p-2 rounded-md shadow-sm border border-neutral-200 flex-1"
      >
        <!-- Previous Button -->
        <button
          @click="changeDate(-1)"
          class="p-1 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <ChevronLeft :size="20" />
        </button>

        <!-- Date Display/Input -->
        <input
          type="date"
          v-model="dateFilter"
          :max="today"
          class="outline-none font-medium text-sm cursor-pointer"
        />

        <!-- Next Button -->
        <button
          @click="changeDate(1)"
          :disabled="isToday"
          class="p-1 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100"
        >
          <ChevronRight :size="20" />
        </button>
      </div>

      <!-- add meal -->
      <Button variant="primary" @click="activeModal = 'add'" class="flex-1"
        >Add Meal</Button
      >
    </div>
  </header>

  <!-- displayed logs -->
  <Loader v-if="isLoading" />
  <div
    class="overflow-auto shadow-lg rounded-sm"
    v-else-if="filteredMeals.length > 0"
  >
    <table class="w-full bg-white border-collapse">
      <thead>
        <tr class="bg-primary/50 border-b border-neutral-300 capitalize">
          <th class="text-start px-8 py-5">name</th>
          <th class="text-start px-8 py-5">
            serving size <span class="normal-case">(g)</span>
          </th>
          <th class="text-start px-8 py-5">
            calories <span class="normal-case">(kcal)</span>
          </th>
          <th class="text-start px-8 py-5">log date</th>
          <th class="text-start px-8 py-5">actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="meal in filteredMeals"
          :key="meal.id"
          class="border-b border-neutral-300"
        >
          <td class="px-8 py-5 font-medium">
            {{ meal.meals?.name }}
          </td>
          <td class="px-8 py-5">
            {{ meal?.serving_size }}
          </td>
          <td class="px-8 py-5">
            {{ calculateMacro(meal?.serving_size, meal?.meals?.calories || 0) }}
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
  <div v-else class="flex items-center justify-center h-[40vh]">
    <p class="font-semibold text-2xl leading-relaxed">
      No meals found 😔<br />
      Add some meals
    </p>
  </div>

  <!-- delete modal -->
  <DeleteModal
    :meal="selectedMeal"
    @cancel="closeModal"
    v-if="activeModal === 'delete'"
  />

  <!-- view edit modal -->
  <ViewEditModal
    :meal="selectedMeal"
    :calories="
      calculateMacro(
        selectedMeal?.serving_size || 0,
        selectedMeal?.meals?.calories || 0,
      )
    "
    :type="activeModal"
    @close="closeModal"
    v-if="activeModal === 'view' || activeModal === 'edit'"
  />

  <!--add modal -->
  <AddModal @close="closeModal" v-if="activeModal === 'add'" />
</template>
