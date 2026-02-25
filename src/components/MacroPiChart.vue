<script setup>
import { ref, onMounted } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { supabase } from "@/utils/supabase";
import Loader from "./ui/Loader.vue";

ChartJS.register(ArcElement, Tooltip, Legend);

const loading = ref(true);
const chartData = ref(null);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    title: { display: true, text: "Today's Macro Breakdown (Grams)" },
  },
};

onMounted(async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    // Fetch entries for TODAY only
    const { data: entries, error } = await supabase
      .from("daily-entries")
      .select("serving_size, meals(protein, carbs, fats)")
      .eq("user_id", user.id)
      .eq("log_date", today);

    if (error) throw error;

    // Initialize totals
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    // Calculate totals based on serving size
    entries.forEach((entry) => {
      const multiplier = entry.serving_size / 100; // Database values are per 100g
      totalProtein += (entry.meals.protein || 0) * multiplier;
      totalCarbs += (entry.meals.carbs || 0) * multiplier;
      totalFats += (entry.meals.fats || 0) * multiplier;
    });

    // Populate Chart Data
    chartData.value = {
      labels: ["Protein", "Carbohydrates", "Fats"],
      datasets: [
        {
          backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
          hoverOffset: 10,
          data: [
            totalProtein.toFixed(1),
            totalCarbs.toFixed(1),
            totalFats.toFixed(1),
          ],
        },
      ],
    };
  } catch (err) {
    console.error("Chart Error:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div
    class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-100 lg:col-span-2"
  >
    <Loader v-if="loading" />
    <Doughnut v-else :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped></style>
