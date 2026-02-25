<script setup>
import { ref, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { supabase } from "@/utils/supabase";
import Loader from "./ui/Loader.vue";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const loading = ref(true);
const chartData = ref(null);
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Calorie Intake vs. Goal (Last 7 Days)" },
  },
});

onMounted(async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch User Goal
    const { data: userData } = await supabase
      .from("users")
      .select("daily_calorie_goal")
      .eq("id", user.id)
      .single();

    // 2. Fetch Daily Entries joined with Meals
    const { data: entries, error } = await supabase
      .from("daily-entries")
      .select("log_date, serving_size, meals(calories)")
      .eq("user_id", user.id)
      .order("log_date", { ascending: false })
      .limit(50); // Get enough records to cover several days

    // 3. Process Data for Charting
    const dailyTotals = {};
    entries.forEach((entry) => {
      const date = entry.log_date;
      const calories = (entry.meals.calories * entry.serving_size) / 100;
      dailyTotals[date] = (dailyTotals[date] || 0) + calories;
    });

    // Get last 7 days (sorted)
    const labels = Object.keys(dailyTotals).sort().slice(-7);
    const intakeValues = labels.map((date) => dailyTotals[date]);
    const goalValues = labels.map(() => userData.daily_calorie_goal);

    // 4. Set Chart Data
    chartData.value = {
      labels,
      datasets: [
        {
          label: "Total Consumed",
          backgroundColor: "rgb(48, 126, 85)",
          data: intakeValues,
        },
        {
          label: "Calorie Goal",
          backgroundColor: "#e4c18a",
          data: goalValues,
        },
      ],
    };
  } catch (err) {
    console.error("Error loading chart:", err);
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <div
    class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm lg:col-span-2 h-100"
  >
    <Loader v-if="loading" />
    <Bar v-else :data="chartData" :options="chartOptions" />
  </div>
</template>
