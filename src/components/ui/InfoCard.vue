<script setup lang="ts">
import type { IMeals } from "@/types/meals.types";

interface IProps {
  cardData?: IMeals;
}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <div
    :class="[
      'bg-white p-3 rounded-sm flex flex-col gap-2',
      `border-b-6 ${cardData?.color}`,
    ]"
  >
    <h3 class="text-neutral-500 capitalize font-semibold">
      {{ cardData?.title }}
    </h3>
    <div class="flex justify-between items-end">
      <div class="flex gap-2 items-end">
        <span class="text-3xl font-semibold">{{ cardData?.data }}</span>
        <span class="mb-0.5 font-medium text-neutral-700">kcal</span>
      </div>

      <div>
        <img
          v-if="cardData?.icon"
          :src="cardData?.icon"
          :alt="`${cardData?.title} icon`"
          class="w-10"
        />
      </div>
    </div>
  </div>
</template>
