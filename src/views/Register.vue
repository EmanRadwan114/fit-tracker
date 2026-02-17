<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <RegisterForm />
</template>
