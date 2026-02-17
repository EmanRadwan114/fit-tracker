<script setup lang="ts">
import InfoCard from "@/components/ui/InfoCard.vue";
import Loader from "@/components/ui/Loader.vue";
import { useDailyInfo } from "@/composables/daily-info.composable";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

const { userDailyNums, isLoading } = useDailyInfo();
</script>

<template>
  <Loader v-if="isLoading" />
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" v-else>
    <InfoCard v-for="num in userDailyNums" :cardData="num" :key="num.title" />
  </div>
</template>
