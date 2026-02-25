<script setup lang="ts">
import { computed } from "vue";
import { useFormateDate } from "@/composables/useFormateDate";
import { useFetchProfile } from "@/composables/useFetchProfile";

interface IProps {
  consumedCals: number;
}

const props = defineProps<IProps>();

const { today } = useFormateDate();
const { profile } = useFetchProfile();

// Dynamic greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
});

// Format the date for display
const displayDate = computed(() => {
  return new Date(today).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
});
</script>

<template>
  <header
    class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100"
  >
    <!-- Left Side: Title & Date -->
    <div class="flex flex-col gap-1">
      <h1
        class="text-2xl md:text-3xl font-bold text-neutral-800 tracking-tight"
      >
        {{ greeting }},
        <span class="text-primary capitalize">{{ profile.username }}</span
        >!
      </h1>
      <p class="text-neutral-500 font-medium flex items-center gap-2">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        {{ displayDate }}
      </p>
    </div>

    <!-- Right Side: Stats & Actions -->
    <div class="flex items-center gap-3 md:gap-6">
      <div class="flex flex-col border-e border-neutral-200 pr-6">
        <span
          class="text-sm font-bold text-neutral-700 uppercase tracking-widest"
          >Your Fitness Monitor</span
        >
        <span
          class="font-semibold text-neutral-500"
          v-if="profile.daily_calorie_goal"
        >
          {{ profile.daily_calorie_goal }} kcal - {{ props.consumedCals }} kcal
          = {{ profile.daily_calorie_goal - props.consumedCals }} kcal</span
        >
      </div>

      <!-- Profile Avatar -->
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold border border-primary/20"
        >
          {{ profile.username?.charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>
  </header>
</template>
