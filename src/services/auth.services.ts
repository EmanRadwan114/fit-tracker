import { useAuthStore } from "@/stores/auth.store";
import type { ILogin, IRegister } from "@/types/auth.types";
import { supabase } from "@/utils/supabase";

// register
export const userRegister = async (userData: IRegister) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        username: userData.username,
        weight_kg: userData.weight_kg,
        daily_calorie_goal: userData.daily_calorie_goal,
      },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  return { data, error };
};

// login
export const userLogin = async (credentials: ILogin) => {
  const data = await supabase.auth.signInWithPassword(credentials);
  return data;
};

// logout
export const userLogout = async () => {
  supabase.auth.signOut();
};
