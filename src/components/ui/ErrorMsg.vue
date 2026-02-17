<script setup lang="ts">
interface IProps {
  message: string;
}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <p class="text-red-800 my-1 text-sm">{{ message }}</p>
</template>
