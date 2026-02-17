import type { ILogin, ILoginErrors } from "@/types/auth.types";
import { computed, reactive, watch } from "vue";

export const useValidateLogin = (userData: ILogin) => {
  const errors = reactive<ILoginErrors>({
    email: { message: "" },
    password: { message: "" },
  });

  const touched = reactive({
    email: false,
    password: false,
  });

  // Validation Logic wrapped in a function
  const validate = () => {
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
  };

  const isValid = computed(() => {
    const isEmailValid = errors.email.message === "" && touched.email;
    const isPasswordValid = errors.password.message === "" && touched.password;

    return isEmailValid && isPasswordValid;
  });

  watch(
    () => userData,
    (newData) => {
      if (newData.email) touched.email = true;
      if (newData.password) touched.password = true;

      validate();
    },
    { deep: true, immediate: true },
  );

  return { isValid, errors };
};
