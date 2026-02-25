<script setup lang="ts">
import DailyCaloriesChart from "@/components/DailyCaloriesChart.vue";
import DashboardHeader from "@/components/DashboardHeader.vue";
import MacroPiChart from "@/components/MacroPiChart.vue";
import InfoCard from "@/components/ui/InfoCard.vue";
import Loader from "@/components/ui/Loader.vue";
import { useDailyInfo } from "@/composables/useDailyInfo";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

const { userDailyNums, isLoading } = useDailyInfo();
</script>

<template>
  <Loader v-if="isLoading" />
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4"
    v-else
  >
    <DashboardHeader
      class="col-span-1 sm:col-span-2 lg:col-span-4"
      :consumedCals="userDailyNums[0]?.data || 0"
    />
    <InfoCard v-for="num in userDailyNums" :cardData="num" :key="num.title" />
    <DailyCaloriesChart />
    <MacroPiChart />
  </div>
</template>
