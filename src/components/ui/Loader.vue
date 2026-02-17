<script setup lang="ts">
interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <div
    class="absolute inset-0 min-h-screen flex items-center justify-center z-999"
  >
    <span class="loader size-20! border-primary! border-b-transparent!"></span>
  </div>
</template>
