import { useAuthStore } from "@/stores/auth.store";
import { supabase } from "@/utils/supabase";
import { type RouteLocationNormalizedLoadedGeneric } from "vue-router";

export const authGuard = async (
  to: RouteLocationNormalizedLoadedGeneric,
  from: RouteLocationNormalizedLoadedGeneric,
) => {
  const authStore = useAuthStore();

  // 1. If store is empty, check Supabase LocalStorage session
  if (!authStore.user_session) {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      authStore.setUserSession(data.session);
    }
  }

  // 2. PROTECT PRIVATE PAGES
  if (to.meta?.requiresAuth && !authStore.user_session) {
    return { name: "login" };
  }

  // 3. PREVENT LOGGED-IN USERS FROM SEEING LOGIN/REGISTER
  if (
    authStore.user_session &&
    (to.name === "login" || to.name === "register")
  ) {
    return { name: "dashboard" };
  }

  return true;
};
