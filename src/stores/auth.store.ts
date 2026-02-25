import { ref } from "vue";
import { defineStore } from "pinia";
import type { Session, User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const user_session = ref<Session | null>(null);
  const user = ref<User | null>(null);

  const setUserSession = (session: Session | null) => {
    user_session.value = session;
  };

  const setUser = (date: User | null) => {
    user.value = date;
  };

  return { user_session, setUserSession, user, setUser };
});
