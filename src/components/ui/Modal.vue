<script setup lang="ts">
interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

const emit = defineEmits(["close"]);
</script>

<template>
  <section
    class="fixed inset-0 bg-black/40 min-h-screen flex items-center justify-center"
    @click="emit('close')"
  >
    <div
      class="bg-white shadow-md p-6 rounded-sm min-h-36 flex items-center justify-center"
      @click.stop=""
    >
      <div>
        <slot></slot>
      </div>
    </div>
  </section>
</template>
