<script setup lang="ts">
import InfoCard from "@/components/ui/InfoCard.vue";
import { useMealFetch } from "@/composables/meal-fetch.composable";
import { Eye, Pencil, Trash2 } from "lucide-vue-next";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
const { cachedMeals, isLoading } = useMealFetch();
</script>

<template>
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
      <tr v-for="meal in cachedMeals.data" class="border-b border-neutral-300">
        <td class="px-8 py-5 font-medium">
          {{ meal.name }}
        </td>
        <td class="px-8 py-5">
          {{ meal.serving_size }}
        </td>
        <td class="px-8 py-5">
          {{ meal.calories }}
        </td>
        <td class="px-8 py-5">
          {{ meal.created_at.split("T")[0] }}
        </td>
        <td class="px-8 py-5 flex items-center gap-3">
          <Eye :size="25" class="cursor-pointer p-1 text-blue-800" />
          <Pencil :size="25" class="cursor-pointer p-1 text-yellow-600" />
          <Trash2 :size="25" class="cursor-pointer p-1 text-red-800" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
