<script setup lang="ts">
interface IProps {
  modalBoxClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {});

const emit = defineEmits(["close"]);

import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "auto";
});
</script>

<template>
  <section
    class="fixed inset-0 bg-black/40 min-h-screen z-50 flex items-start sm:items-center justify-center px-4 py-10 overflow-y-auto"
    @click="emit('close')"
  >
    <div
      :class="`bg-white shadow-md p-6 rounded-sm flex flex-col ${modalBoxClass}`"
      @click.stop=""
    >
      <div class="flex flex-col gap-5 w-full">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 5px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #e5e5e5;
  border-radius: 10px;
}
</style>
