<script setup lang="ts">
interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <span class="loader size-5! border-white! border-b-transparent!"></span>
</template>
