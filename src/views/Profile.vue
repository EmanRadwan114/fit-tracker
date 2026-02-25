<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/utils/supabase";
import { useToast } from "vue-toastification";
import Spinner from "@/components/ui/Spinner.vue";
import { useFetchProfile } from "@/composables/useFetchProfile";
import Loader from "@/components/ui/Loader.vue";
import Button from "@/components/ui/Button.vue";
import { useAuthStore } from "@/stores/auth.store";

const toast = useToast();
const isUpdating = ref(false);

// hooks
const { profile, isLoading, userEmail } = useFetchProfile();
const { user, setUser } = useAuthStore();

const formFields = [
  {
    id: "username",
    label: "Display Name",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    id: "weight_kg",
    label: "Current Weight (kg)",
    type: "number",
    step: "0.1",
  },
  {
    id: "target_weight_kg",
    label: "Target Weight (kg)",
    type: "number",
    step: "0.1",
  },
  {
    id: "daily_calorie_goal",
    label: "Daily Calorie Target (kcal)",
    type: "number",
  },
];

// handlers
const handleUpdate = async () => {
  try {
    if (!profile.value.username) {
      toast.error("Username is required");
      return;
    }
    if (!profile.value.weight_kg) {
      toast.error("Weight is required");
      return;
    }
    if (!profile.value.target_weight_kg) {
      toast.error("Target weight is required");
      return;
    }
    if (!profile.value.daily_calorie_goal) {
      toast.error("Daily calorie goal is required");
      return;
    }

    isUpdating.value = true;

    const { error } = await supabase
      .from("users")
      .update({
        username: profile.value.username.toLowerCase(),
        weight_kg: profile.value.weight_kg,
        daily_calorie_goal: profile.value.daily_calorie_goal,
        target_weight_kg: profile.value.target_weight_kg,
      })
      .eq("id", profile.value.id);

    if (!error) {
      toast.success("Profile updated successfully!");
      setUser({ ...(user as any), ...profile.value });
    } else {
      toast.error(error.message || "Update failed");
    }
  } catch (error: any) {
    toast.error(error.message || "Update failed");
  } finally {
    isUpdating.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-2 md:p-8 min-h-screen bg-neutral-50/30">
    <Loader v-if="isLoading" />

    <template v-else>
      <!-- Header -->
      <header
        class="mb-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center gap-6"
      >
        <div
          class="w-24 h-24 bg-primary text-white rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg shadow-primary/30 transform -rotate-3"
        >
          {{ profile.username?.charAt(0).toUpperCase() }}
        </div>
        <div class="text-center md:text-left flex-1 flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Personal Profile
          </h1>
          <p class="text-neutral-600 font-medium">
            Customize your health targets and info.
          </p>
          <span class="text-neutral-500">{{ userEmail }}</span>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div
          class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm"
        >
          <span class="text-xs font-bold text-blue-500 uppercase tracking-wider"
            >Current Weight</span
          >
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-3xl font-black text-neutral-800">{{
              profile.weight_kg
            }}</span>
            <span class="text-neutral-400 font-bold">kg</span>
          </div>
        </div>
        <div
          class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm"
        >
          <span
            class="text-xs font-bold text-orange-500 uppercase tracking-wider"
            >Daily Target</span
          >
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-3xl font-black text-neutral-800">{{
              profile.daily_calorie_goal
            }}</span>
            <span class="text-neutral-400 font-bold">kcal</span>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div
        class="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden"
      >
        <form @submit.prevent="handleUpdate" class="p-4 md:p-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div
              v-for="field in formFields"
              :key="field.id"
              :class="['flex flex-col gap-2']"
            >
              <label
                :for="field.id"
                class="font-black text-neutral-600 uppercase tracking-wide"
              >
                {{ field.label }}
              </label>
              <input
                :id="field.id"
                v-model="profile[field.id as keyof typeof profile]"
                :type="field.type"
                :step="field.step"
                :placeholder="field.placeholder"
                class="w-full p-2 rounded-md border border-neutral-400 bg-neutral-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all capitalize"
              />
            </div>
          </div>

          <!-- Action Button -->
          <div class="flex justify-end pt-6">
            <Button
              type="submit"
              :disabled="isUpdating"
              class="transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 text-lg"
            >
              <Spinner v-if="isUpdating" class="w-5 h-5 text-white!" />
              {{ isUpdating ? "Saving Changes..." : "Update My Profile" }}
            </Button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>
