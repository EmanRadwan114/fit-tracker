<script setup lang="ts">
import notFoundImg from "@/assets/images/not-found.png";
interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <div class="flex items-center justify-center h-screen p-6">
    <div class="flex flex-col items-center justify-center gap-4">
      <img :src="notFoundImg" class="w-full max-w-75" alt="not found" />
      <h2 class="text-3xl font-semibold">404 Not Found</h2>
      <RouterLink
        to="/"
        class="bg-primary py-2 px-10 text-white hover:bg-primary/80 rounded-sm font-semibold transition-colors duration-300"
        >Go to Home</RouterLink
      >
    </div>
  </div>
</template>
