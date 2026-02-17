import { ref } from "vue";
import { defineStore } from "pinia";
import type { Session } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const user_session = ref<Session | null>(null);

  const setUserSession = (session: Session | null) => {
    user_session.value = session;
  };

  return { user_session, setUserSession };
});
