<script setup lang="ts">
interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});
</script>

<template>
  <main class="flex items-center justify-center min-h-[95vh]">
    <Container>
      <section class="w-full md:w-4/5 lg:w-1/2 xl:w-1/3 m-auto">
        <h1
          class="text-primary-foreground/90 font-bold text-center text-4xl mb-6 tracking-tight"
        >
          Fit<span class="text-primary ms-px">Tracker</span>
        </h1>
        <div class="p-6 rounded-sm bg-white shadow-md">
          <slot></slot>
        </div>
      </section>
    </Container>
  </main>
</template>
