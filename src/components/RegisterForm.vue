<script setup lang="ts">
import { userRegister } from "@/services/auth.services";
import FormInput from "./ui/FormInput.vue";
import FormLayout from "./ui/FormLayout.vue";
import { reactive, ref } from "vue";
import { type IRegister } from "@/types/auth.types";
import { useValidateRegister } from "@/validation/register.validation";
import ErrorMsg from "./ui/ErrorMsg.vue";
import { CircleCheckBig } from "lucide-vue-next";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

// reactive & refs
const userData = reactive<IRegister>({
  username: "",
  email: "",
  password: "",
  weight_kg: "",
  daily_calorie_goal: "",
});
const isLoading = ref(false);
const isRegisterSuccess = ref(false);
const formError = ref<string | undefined>("");

// hooks
const { isValid, errors } = useValidateRegister(userData);

// handlers
const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await userRegister(userData);

    if (error) {
      formError.value = error.message;
      return;
    }
    isRegisterSuccess.value = true;
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
    <!-- success msg -->
    <div
      v-if="isRegisterSuccess"
      class="flex flex-col items-center justify-center"
    >
      <p class="text-center">Your account Registered Successfully!</p>
      <CircleCheckBig class="text-primary my-5" :size="60" />
      <p class="font-medium mb-2 text-xl text-center">
        Please check your email to verify your account
      </p>
      <RouterLink to="/login" class="text-primary font-semibold underline"
        >Login</RouterLink
      >
    </div>
    <!-- register form -->
    <div class="flex flex-col gap-3" v-else>
      <h2
        class="capitalize text-center text-primary font-semibold text-xl mb-3"
      >
        Craete a new account
      </h2>
      <ErrorMsg
        :message="formError ? formError : ''"
        class="text-center capitalize font-medium mb-3"
      />
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
        <div>
          <FormInput
            type="text"
            placeholder="Enter your username"
            v-model="userData.username"
          />
          <ErrorMsg
            :message="errors.username.message"
            v-if="errors.username.message"
          />
        </div>
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
        <div>
          <FormInput
            type="number"
            placeholder="Enter your weight in kg"
            v-model="userData.weight_kg"
          />
          <ErrorMsg
            :message="errors.weight_kg.message"
            v-if="errors.weight_kg.message"
          />
        </div>
        <div>
          <FormInput
            type="number"
            placeholder="Enter your daily calories goal"
            v-model="userData.daily_calorie_goal"
          />
          <ErrorMsg
            :message="errors.daily_calorie_goal.message"
            v-if="errors.daily_calorie_goal.message"
          />
        </div>

        <Button
          :disabled="!isValid || isLoading"
          :btnClass="`flex items-center justify-center gap-2`"
        >
          <span v-if="!isLoading">Register</span>
          <span class="loader" v-if="isLoading"></span>
        </Button>
      </form>
      <p class="text-primary-foreground text-center font-medium">
        Already have an account?
        <RouterLink to="/login" class="text-primary underline"
          >Login</RouterLink
        >
      </p>
    </div>
  </FormLayout>
</template>
