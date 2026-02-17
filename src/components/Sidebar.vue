<script setup lang="ts">
import { ref, type Component } from "vue";
import { House, Salad, User, LogOut, X, Menu } from "lucide-vue-next";
import { userLogout } from "@/services/auth.services";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

interface IProps {}

const props = withDefaults(defineProps<IProps>(), {});

const router = useRouter();

const navLinks: { path: string; title: string; icon: Component }[] = [
  { path: "/dashboard", title: "home", icon: House },
  { path: "/dashboard/meals", title: "meals", icon: Salad },
  { path: "/dashboard/profile", title: "profile", icon: User },
];

const isSideNavOpen = ref(false);

const toggleSideNav = () => {
  isSideNavOpen.value = !isSideNavOpen.value;
};

const authStore = useAuthStore();

// handlers
const handleLogout = async () => {
  await userLogout();
  authStore.setUserSession(null);
  router.push("/login");
};
</script>

<template>
  <div class="flex">
    <!-- Desktop Sidebar -->
    <aside
      class="hidden lg:flex flex-col p-4 bg-white w-[20%] fixed left-0 top-0 h-full"
    >
      <h2
        class="text-primary-foreground/90 font-bold text-3xl tracking-tight mb-5 border-b pb-5 text-center"
      >
        Fit<span class="text-primary ms-px">Tracker</span>
      </h2>

      <nav class="flex-1">
        <ul class="flex flex-col gap-4">
          <li v-for="link in navLinks" :key="link.path">
            <RouterLink
              :to="link.path"
              class="flex items-center gap-3 px-4 py-3 font-semibold rounded-md hover:bg-primary hover:text-white group transition-colors"
              exact-active-class="bg-primary text-white!"
            >
              <component :is="link.icon" :size="20" />
              <span class="capitalize">{{ link.title }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <Button
        variant="danger"
        class="flex items-center mt-auto"
        @click="handleLogout"
      >
        <LogOut class="rotate-180 me-3" :size="20" />
        <span>Logout</span>
      </Button>
    </aside>

    <!-- Mobile Navigation Bar -->
    <div class="flex-1 flex flex-col">
      <nav
        class="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center"
      >
        <span class="font-bold text-2xl tracking-tight"
          >Fit<span class="text-primary">Tracker</span></span
        >
        <Menu class="cursor-pointer" :size="30" @click="toggleSideNav" />
      </nav>

      <!-- Mobile Sidebar Overlay -->
      <div class="lg:hidden">
        <!-- 1. Backdrop Transition (Fade) -->
        <Transition name="fade">
          <div
            v-if="isSideNavOpen"
            class="fixed inset-0 bg-black/50 z-40"
            @click="toggleSideNav"
          ></div>
        </Transition>

        <!-- 2. Sidebar Transition (Slide) -->
        <Transition name="slide">
          <aside
            v-if="isSideNavOpen"
            class="fixed left-0 top-0 h-full w-4/5 sm:w-1/3 bg-white p-5 shadow-xl flex flex-col z-50"
          >
            <div class="flex justify-between items-center mb-5 border-b pb-5">
              <span class="font-bold text-2xl"
                >Fit<span class="text-primary">Tracker</span></span
              >
              <X
                class="cursor-pointer transition-colors hover:text-primary-foreground/60"
                @click="toggleSideNav"
              />
            </div>

            <ul class="flex flex-col gap-4 flex-1">
              <li
                v-for="link in navLinks"
                :key="link.path"
                @click="toggleSideNav"
              >
                <RouterLink
                  :to="link.path"
                  class="flex items-center gap-3 px-4 py-3 font-semibold rounded-md hover:bg-primary hover:text-white group transition-colors"
                  exact-active-class="bg-primary text-white!"
                >
                  <component :is="link.icon" :size="22" />
                  <span class="capitalize">{{ link.title }}</span>
                </RouterLink>
              </li>
            </ul>

            <Button
              variant="danger"
              class="flex items-center mt-auto"
              @click="handleLogout"
            >
              <LogOut class="rotate-180 me-3" />
              <span>Logout</span>
            </Button>
          </aside>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade Transition for Backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Transition for Sidebar Content */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
