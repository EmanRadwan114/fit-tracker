<script setup lang="ts">
import { useAttrs } from "vue";

interface IProps {
  inputClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {});
const model = defineModel();

const attr = useAttrs();
</script>

<template>
  <input
    v-bind="attr"
    v-model="model"
    :class="`${props.inputClass && props.inputClass} p-2 outline outline-primary-foreground/75 placeholder:text-primary-foreground/60 w-full focus-within:outline-2 focus-within:outline-primary/75 rounded-sm text-primary-foreground`"
  />
</template>
