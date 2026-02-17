<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <LoginForm />
</template>
