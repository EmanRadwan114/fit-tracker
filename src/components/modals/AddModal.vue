<script setup lang="ts">
import { reactive, ref } from "vue";
import Button from "../ui/Button.vue";
import Modal from "../ui/Modal.vue";
import { useToast } from "vue-toastification";
import { useFetchCategories } from "@/composables/useFetchCategories";
import { useDailyLogsRefetch } from "@/composables/useLogFetch";
import Spinner from "../ui/Spinner.vue";
import { useMealSearch } from "@/composables/useMealFetch";
import { useFormateDate } from "@/composables/useFormateDate";

const emit = defineEmits(["close"]);
const toast = useToast();
const { refetchMeals } = useDailyLogsRefetch();

// Hook for Global Search + Caching
const { search, searchResults, isSearching, logUserMeal, isLogging } =
  useMealSearch();

const { dateFilter } = useFormateDate();

// Local UI State
const searchQuery = ref("");
const selectedMeal = ref<any>(null);

const loggedData = reactive({
  selectedCategoryId: "",
  servingSize: 100,
  logDate: dateFilter.value || new Date().toISOString().split("T")[0],
});

// Categories for the dropdown
const { cachedCategories } = useFetchCategories();

const handleSelectMeal = (meal: any) => {
  selectedMeal.value = meal;
  searchQuery.value = meal.name;
  searchResults.value = []; // clear list
};

const handleSubmit = async () => {
  if (!selectedMeal.value)
    return toast.error("Please search and select a meal first");
  if (!loggedData.selectedCategoryId)
    return toast.error("Please select a category");

  await logUserMeal({
    mealId: selectedMeal.value.id,
    servingSize: loggedData.servingSize,
    logDate: loggedData.logDate as string,
    category_id: loggedData.selectedCategoryId,
  });

  await refetchMeals();
  emit("close");
};
</script>

<template>
  <Modal
    @close="emit('close')"
    modalBoxClass="w-full sm:w-10/12 md:w-3/4 lg:w-1/2"
  >
    <header class="mb-6">
      <h2 class="text-xl font-semibold text-center">Add Daily Meal Log</h2>
    </header>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
      <!-- 1. SEARCH SECTION -->
      <div class="flex flex-col gap-2 relative">
        <label class="font-medium"
          >Search Meal (from Database or Global API)</label
        >
        <input
          v-model="searchQuery"
          type="text"
          @input="search(searchQuery)"
          placeholder="Type to search (e.g. Greek Yogurt)"
          class="bg-white p-2 rounded-sm border border-gray-300 focus:border-primary outline-none"
        />

        <!-- Search Results Dropdown -->
        <!-- Search Results Dropdown -->
        <div v-if="isSearching" class="text-xs text-gray-500 mt-1">
          Searching...
        </div>

        <!-- Add this: No Match Message -->
        <div
          v-if="
            !isSearching && searchQuery.length > 2 && searchResults.length === 0
          "
          class="absolute top-full left-0 w-full bg-white border border-gray-300 z-50 shadow-lg p-4 text-center text-gray-500 text-sm"
        >
          No matches found for "{{ searchQuery }}"
        </div>

        <ul
          v-if="searchResults.length > 0"
          class="absolute top-full left-0 w-full bg-white border border-gray-300 z-50 shadow-lg max-h-48 overflow-y-auto"
        >
          <li
            v-for="meal in searchResults"
            :key="meal.id"
            @click="handleSelectMeal(meal)"
            class="p-2 hover:bg-primary/10 cursor-pointer border-b last:border-0"
          >
            <p class="font-semibold text-sm">{{ meal.name }}</p>
            <p class="text-xs text-gray-500">{{ meal.calories }} kcal / 100g</p>
          </li>
        </ul>
      </div>

      <!-- 2. LOG DETAILS SECTION (Only visible or enabled once meal is selected) -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-5"
        :class="{ 'opacity-50 pointer-events-none': !selectedMeal }"
        v-if="selectedMeal"
      >
        <!-- Category Select -->
        <div class="flex flex-col gap-2">
          <label class="font-medium">Category</label>
          <select
            v-model="loggedData.selectedCategoryId"
            class="p-2 rounded-sm border border-gray-300 focus:border-primary outline-none bg-white"
          >
            <option value="" disabled>Select category</option>
            <option
              v-for="cat in cachedCategories.data"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Serving Size -->
        <div class="flex flex-col gap-2">
          <label class="font-medium">Serving Size (g)</label>
          <input
            v-model="loggedData.servingSize"
            type="number"
            class="p-2 rounded-sm border border-gray-300 focus:border-primary outline-none"
          />
        </div>

        <!-- Log Date -->
        <div class="flex flex-col gap-2 sm:col-span-2">
          <label class="font-medium">Log Date</label>
          <input
            v-model="loggedData.logDate"
            type="date"
            class="p-2 rounded-sm border border-gray-300 focus:border-primary outline-none"
          />
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="flex gap-2 mt-4">
        <Button
          type="button"
          variant="secondary"
          class="flex-1 text-red-800! border-red-800! hover:bg-red-50!"
          @click="emit('close')"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          class="flex-1"
          :disabled="isLogging || !selectedMeal"
        >
          <Spinner v-if="isLogging" />
          <span v-else>Log Meal</span>
        </Button>
      </div>
    </form>
  </Modal>
</template>
