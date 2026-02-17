<script setup lang="ts">
import { computed, useAttrs } from "vue";

interface IProps {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  btnClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  variant: "primary",
  loading: false,
});

const btnStyle = computed(() => [
  props.variant === "primary"
    ? "text-white bg-primary hover:bg-primary/85 disabled:bg-primary/85"
    : props.variant === "secondary"
      ? "text-primary bg-transparent border-primary border-2 hover:bg-primary hover:text-white"
      : props.variant === "danger"
        ? "bg-red-800 hover:bg-red-800/85 text-white"
        : "",
  "w-full p-2 rounded-sm capitalize font-medium cursor-pointer disabled:cursor-not-allowed transition-all duration-300",
]);

const attrs = useAttrs();
</script>

<template>
  <button
    v-bind="attrs"
    :class="[btnStyle, btnClass]"
    :disabled="loading || attrs.disabled === true"
  >
    <slot></slot>
  </button>
</template>
