<script setup>
import { supabase } from "@/utils/supabase";
import googleImg from "@/assets/images/Google.svg";
import { userLoginWithGoogle } from "@/services/auth.services";
import { useToast } from "vue-toastification";

const toast = useToast();

const handleGoogleLogin = async () => {
  const { data, error } = await userLoginWithGoogle();

  if (error) {
    toast.error(error.message || "Login failed");
  }
};
</script>

<template>
  <button
    @click="handleGoogleLogin"
    class="flex items-center justify-center gap-3 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm w-full font-medium cursor-pointer"
  >
    <img :src="googleImg" alt="Google Logo" class="w-5 h-5" />
    <span>Continue with Google</span>
  </button>
</template>
