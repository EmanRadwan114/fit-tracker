<script setup lang="ts">
import { useValidateLogin } from "@/validation/login.validation";
import FormInput from "./ui/FormInput.vue";
import FormLayout from "./ui/FormLayout.vue";
import { reactive, ref } from "vue";
import { userLogin } from "@/services/auth.services";
import type { ILogin } from "@/types/auth.types";
import ErrorMsg from "./ui/ErrorMsg.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

// reactive & refs
const userData = reactive<ILogin>({
  email: "",
  password: "",
});
const isLoading = ref(false);
const formError = ref<string | undefined>("");

// hooks
const router = useRouter();
const { isValid, errors } = useValidateLogin(userData);

// pinia store
const authStore = useAuthStore();

// handlers
const handleSubmit = async () => {
  formError.value = ""; // Reset error before new attempt
  try {
    isLoading.value = true;
    const { data, error } = await userLogin(userData);

    if (error) {
      formError.value = error.message;
      return;
    }

    if (data?.session) {
      authStore.setUserSession(data.session);
      router.push("/dashboard");
    }
  } catch (error) {
    formError.value = "An unexpected error occurred";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <FormLayout>
    <div class="flex flex-col gap-3">
      <h2 class="capitalize text-center text-primary font-semibold text-xl">
        welcome back!
      </h2>
      <ErrorMsg
        :message="formError ? formError : ''"
        class="text-center capitalize font-medium mb-3"
      />
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
        <div>
          <FormInput
            type="email"
            placeholder="Enter your email"
            v-model="userData.email"
          />
          <ErrorMsg
            :message="errors.email.message"
            v-if="errors.email.message"
          />
        </div>
        <div>
          <FormInput
            type="password"
            placeholder="Enter your password"
            v-model="userData.password"
          />
          <ErrorMsg
            :message="errors.password.message"
            v-if="errors.password.message"
          />
        </div>
        <Button
          :disabled="!isValid || isLoading"
          :btnClass="`flex items-center justify-center gap-2`"
        >
          <span v-if="!isLoading">Login</span>
          <span class="loader" v-if="isLoading"></span
        ></Button>
      </form>
      <p class="text-primary-foreground text-center font-medium">
        Don't have an account?
        <RouterLink to="/register" class="text-primary underline"
          >Sign Up</RouterLink
        >
      </p>
    </div>
  </FormLayout>
</template>
