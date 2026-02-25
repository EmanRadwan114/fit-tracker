import { useAuthStore } from "@/stores/auth.store";
import { supabase } from "@/utils/supabase";
import { onMounted, ref, computed } from "vue";
import { useToast } from "vue-toastification";

export const useFetchProfile = () => {
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const toast = useToast();

  const userEmail = computed(() => authStore.user?.email || "");
  const fullName = computed(
    () => authStore.user?.user_metadata?.full_name || "",
  );

  const profile = ref({
    id: "",
    username: "",
    weight_kg: 0,
    target_weight_kg: 0,
    daily_calorie_goal: 0,
  });

  const fetchProfile = async () => {
    const user = authStore.user as any;
    if (user?.id && (user.username || user.user_metadata?.full_name)) {
      profile.value = {
        id: user.id,
        username: user.username || user.user_metadata?.full_name || "User",
        weight_kg: user.weight_kg || 0,
        target_weight_kg: user.target_weight_kg || 0,
        daily_calorie_goal: (user as any).daily_calorie_goal || 0,
      };
      return;
    }

    try {
      isLoading.value = true;
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;

        if (data) {
          profile.value = {
            ...data,
            // Apply fallback logic during fetch
            username:
              data.username || authUser.user_metadata?.full_name || "User",
          };

          // 2. SYNC: This puts weight_kg etc. at the ROOT of the user object
          authStore.setUser({ ...authUser, ...data });
        }
      }
    } catch (error: any) {
      if (error.code !== "PGRST116") {
        toast.error("Failed to load profile details");
      }
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchProfile);

  return { profile, isLoading, fetchProfile, userEmail, fullName };
};
