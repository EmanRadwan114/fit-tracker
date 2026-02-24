<script setup lang="ts">
import { ref } from "vue";
import Modal from "../ui/Modal.vue";
import { deleteMealLog } from "@/services/daily-entries.services";
import type { IDailyEntries } from "@/types/meals.types";
import { useToast } from "vue-toastification";
import { useMealsStore } from "@/stores/meals.store";
import Spinner from "../ui/Spinner.vue";

interface IProps {
  meal: IDailyEntries | null;
}

const props = withDefaults(defineProps<IProps>(), {});

const emit = defineEmits(["confirm", "cancel"]);

const isLoading = ref(false);

const mealsStore = useMealsStore();
const toast = useToast();

const handleDelete = async () => {
  const mealId = props.meal?.id;
  if (!mealId) return;

  try {
    isLoading.value = true;
    const { error } = await deleteMealLog(mealId);

    if (error) {
      toast.error(error.message);
      return;
    }

    mealsStore.removeEntry(props.meal?.id);
    toast.success("Meal deleted successfully");
    emit("cancel");
  } catch (err: any) {
    toast.error(err?.message || "Error during meal deletion");
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Modal
    @close="emit('cancel')"
    modalBoxClass="w-full sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-1/3"
    class="flex flex-col justify-center items-center"
  >
    <header class="flex gap-10 justify-center">
      <h2 class="text-xl font-semibold text-center">
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
      <Button
        variant="danger"
        class="flex-1 flex items-center justify-center"
        @click="handleDelete"
        :disabled="isLoading"
      >
        <Spinner v-if="isLoading" />
        <span v-else>Delete</span>
      </Button>
    </div>
  </Modal>
</template>
