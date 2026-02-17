<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <Sidebar />
  <div class="lg:w-4/5 lg:ms-auto relative">
    <Container>
      <RouterView />
    </Container>
  </div>
</template>
