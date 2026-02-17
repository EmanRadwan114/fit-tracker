<script setup lang="ts">
interface IProps {
  containerClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <div
    :class="[
      `container p-5 sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl m-auto`,
      containerClass,
    ]"
  >
    <slot></slot>
  </div>
</template>
