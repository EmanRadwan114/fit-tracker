<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Button from "../ui/Button.vue";
import Modal from "../ui/Modal.vue";
import type { IDailyEntries, TMealForm } from "@/types/meals.types";
import { useToast } from "vue-toastification";
import { editMealLog } from "@/services/daily-entries.services";
import { useFetchCategories } from "@/composables/useFetchCategories";
import { useDailyLogsRefetch } from "@/composables/useLogFetch";
import Spinner from "../ui/Spinner.vue";
import { calculateMacro } from "@/utils/meals.helpers";

interface IProps {
  meal: IDailyEntries | null;
  type: "view" | "edit";
  calories: number;
}

const props = withDefaults(defineProps<IProps>(), {});

const emit = defineEmits(["close"]);

const isLoading = ref(false);

const toast = useToast();

// refetch meals after update
const { refetchMeals } = useDailyLogsRefetch();

// categories
const { cachedCategories, isLoading: isLoadingCategories } =
  useFetchCategories();

// form state
const createEmptyMeal = (): TMealForm => ({
  id: "",
  log_date: "",
  serving_size: 0,
  meals: {
    name: "",
    carbs: 0,
    protein: 0,
    fats: 0,
  },
  categories: {
    name: "",
    id: "",
  },
});

const form = ref<TMealForm>(createEmptyMeal());

const formFields = [
  {
    id: "name",
    path: "name",
    label: "Name",
    type: "text",
    isNested: true,
    isReadOnly: false,
  },
  {
    id: "categories",
    path: "categories",
    label: "category",
    type: "select",
    isNested: false,
    isReadOnly: false,
  },
  {
    id: "weight",
    path: "serving_size",
    label: "Serving Size (g)",
    type: "number",
    isNested: false,
    isReadOnly: false,
  },
  {
    id: "date",
    path: "log_date",
    label: "Log Date",
    type: "date",
    isNested: false,
    isReadOnly: false,
  },
  {
    id: "calories",
    path: "calories",
    label: "Calories (kcal)",
    type: "number",
    isNested: true,
    isReadOnly: true,
  },
  {
    id: "fats",
    path: "fats",
    label: "Fats",
    type: "number",
    isNested: true,
    isReadOnly: true,
  },
  {
    id: "carbs",
    path: "carbs",
    label: "Carbs",
    type: "number",
    isNested: true,
    isReadOnly: true,
  },
  {
    id: "protein",
    path: "protein",
    label: "Protein",
    type: "number",
    isNested: true,
    isReadOnly: true,
  },
];

// watchers
watch(
  () => props.meal,
  (newMeal) => {
    if (newMeal) {
      form.value = JSON.parse(JSON.stringify(newMeal));
    }
  },
  { immediate: true },
);

// handlers
const handleEditMeal = async () => {
  const entryId = props.meal?.id;
  if (!entryId) return;

  try {
    isLoading.value = true;
    const updatedData = {
      log_date: form.value.log_date,
      category_id: form.value.categories.id as string,
      serving_size: Number(form.value.serving_size),
    };
    const error = await editMealLog(entryId, updatedData);

    if (error) {
      toast.error(error.message);
      return;
    }

    await refetchMeals();

    if (!isLoadingCategories.value) {
      toast.success("Meal edited successfully");
      emit("close");
    }
  } catch (err: any) {
    toast.error(err?.message || "Error during meal edit");
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Modal
    @close="emit('close')"
    modalBoxClass="w-full sm:w-10/12 md:w-3/4 lg:w-2/3 xl:w-1/2"
  >
    <header class="flex gap-10 justify-center">
      <h2 class="text-xl font-semibold text-center">
        {{ type === "edit" ? "Edit Meal" : "View Meal" }}
      </h2>
    </header>
    <form
      @submit.prevent="type === 'edit' && handleEditMeal()"
      class="flex flex-col gap-5"
    >
      <!-- meal data -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          v-for="field in formFields"
          :key="field.id"
          :class="['flex flex-col gap-2']"
        >
          <label :for="field.id" class="font-medium">{{ field.label }}</label>

          <!-- 1. Nested Fields (form.meals) -->
          <!-- 1. Category Select -->
          <select
            v-if="field.id === 'categories' && type !== 'view'"
            :id="field.id"
            v-model="form.categories.id"
            class="bg-white p-2 rounded-sm border border-gray-300 focus:border-primary outline-none"
          >
            <option value="" disabled>Select a category</option>
            <option
              v-for="cat in cachedCategories.data"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>

          <!-- 2. Category Read-only (View Mode) -->
          <input
            v-else-if="field.id === 'categories' && type === 'view'"
            :id="field.id"
            readonly
            :value="form.categories.name"
            class="bg-neutral-200 cursor-default p-2 rounded-sm border border-gray-300 outline-none"
          />

          <!-- 3. macros-->
          <input
            v-else-if="
              ['protein', 'carbs', 'fats', 'calories'].includes(field.id)
            "
            :id="field.id"
            :type="field.type"
            :readonly="field.isReadOnly || type === 'view'"
            :value="
              calculateMacro(
                +form.serving_size,
                +form.meals[field.path as keyof typeof form.meals],
              )
            "
            :class="[
              field.isReadOnly || type === 'view'
                ? 'bg-neutral-200 cursor-default'
                : 'bg-white focus:border-primary',
              'p-2 rounded-sm border border-gray-300 outline-none',
            ]"
          />
          <!-- 4. Standard Nested Inputs (Meals)-->
          <input
            v-else-if="field.isNested"
            :id="field.id"
            :type="field.type"
            :readonly="field.isReadOnly || type === 'view'"
            v-model="form.meals[field.path as keyof typeof form.meals]"
            :class="[
              field.isReadOnly || type === 'view'
                ? 'bg-neutral-200 cursor-default'
                : 'bg-white focus:border-primary',
              'p-2 rounded-sm border border-gray-300 outline-none',
            ]"
          />

          <!-- 5. Standard root Inputs -->
          <input
            v-else-if="!field.isNested"
            :id="field.id"
            :type="field.type"
            :readonly="field.isReadOnly || type === 'view'"
            v-model="form[field.path as keyof typeof form]"
            :class="[
              field.isReadOnly || type === 'view'
                ? 'bg-neutral-200 cursor-default'
                : 'bg-white focus:border-primary',
              'p-2 rounded-sm border border-gray-300 outline-none',
            ]"
          />
        </div>
      </div>

      <!-- submit and cancel buttons -->
      <div class="flex gap-2">
        <Button
          :variant="type === 'view' ? 'primary' : 'secondary'"
          :class="[
            'flex-1',
            type === 'view'
              ? 'hover:text-white!'
              : 'text-red-800! hover:text-red-800/70! border-red-800! hover:border-red-800/70! hover:bg-transparent!',
          ]"
          @click="emit('close')"
          >{{ type === "view" ? "Close" : "Cancel" }}</Button
        >
        <Button
          variant="primary"
          class="flex-1"
          v-if="type === 'edit'"
          :disabled="isLoading"
        >
          <Spinner v-if="isLoading" />
          <span v-else>Edit</span>
        </Button>
      </div>
    </form>
  </Modal>
</template>
