<script setup lang="ts">
import { ref } from "vue";
import Modal from "../ui/Modal.vue";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <Modal @close="emit('cancel')">
    <header class="flex gap-10 justify-center">
      <h2 class="text-xl font-semibold text-center mb-5">
        Are you sure you want to delete this?
      </h2>
    </header>
    <div class="flex gap-4">
      <Button
        variant="secondary"
        class="flex-1 border-red-800 text-red-800 hover:text-red-800/50! hover:bg-transparent"
        @click="emit('cancel')"
        >Cancel</Button
      >
      <Button variant="danger" class="flex-1" @click="emit('confirm')"
        >Delete</Button
      >
    </div>
  </Modal>
</template>
