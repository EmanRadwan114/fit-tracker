import type { IRegister, IRegisterErrors } from "@/types/auth.types";
import { computed, reactive, watch } from "vue";

export const useValidateRegister = (userData: IRegister) => {
  const errors = reactive<IRegisterErrors>({
    username: { message: "" },
    email: { message: "" },
    password: { message: "" },
    weight_kg: { message: "" },
    daily_calorie_goal: { message: "" },
  });

  const touched = reactive({
    username: false,
    email: false,
    password: false,
    weight_kg: false,
    daily_calorie_goal: false,
  });

  // Validation Logic wrapped in a function
  const validate = () => {
    // Username
    if (userData.username === "" && touched.username) {
      errors.username.message = "Username is required";
    } else if (userData.username.length < 3 && touched.username) {
      errors.username.message = "Username must be at least 3 characters";
    } else {
      errors.username.message = "";
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email === "" && touched.email) {
      errors.email.message = "Email is required";
    } else if (!emailPattern.test(userData.email) && touched.email) {
      errors.email.message = "Please enter a valid email address";
    } else {
      errors.email.message = "";
    }

    // Password
    if (userData.password === "" && touched.password) {
      errors.password.message = "Password is required";
    } else if (userData.password.length < 8 && touched.password) {
      errors.password.message = "Password must be at least 8 characters";
    } else {
      errors.password.message = "";
    }

    // Weight & Calories
    if (userData.weight_kg === "" && touched.weight_kg) {
      errors.weight_kg.message = "Please enter a valid weight";
    } else {
      errors.weight_kg.message = "";
    }

    if (userData.daily_calorie_goal === "" && touched.daily_calorie_goal) {
      errors.daily_calorie_goal.message =
        "Please enter a valid calories amount";
    } else {
      errors.daily_calorie_goal.message = "";
    }
  };

  const isValid = computed(() => {
    const isNameValid = errors.username.message === "" && touched.username;
    const isEmailValid = errors.email.message === "" && touched.email;
    const isPasswordValid = errors.password.message === "" && touched.password;
    const isWeightValid = errors.weight_kg.message === "" && touched.weight_kg;
    const isCalGoalValid =
      errors.daily_calorie_goal.message === "" && touched.daily_calorie_goal;

    return (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isWeightValid &&
      isCalGoalValid
    );
  });

  watch(
    () => userData,
    (newData) => {
      if (newData.username) touched.username = true;
      if (newData.email) touched.email = true;
      if (newData.password) touched.password = true;
      if (newData.weight_kg) touched.weight_kg = true;
      if (newData.daily_calorie_goal) touched.daily_calorie_goal = true;

      validate();
    },
    { deep: true, immediate: true },
  );

  return { isValid, errors };
};
