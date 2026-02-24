import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Meals from "@/views/Meals.vue";
import Profile from "@/views/Profile.vue";
import Home from "@/views/Home.vue";
import { authGuard } from "@/guards/auth.gard";
import NotFound from "@/components/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "", redirect: "/login" },
    {
      path: "/login",
      component: Login,
      name: "login",
    },
    {
      path: "/register",
      component: Register,
      name: "register",
    },
    {
      path: "/dashboard",
      component: Home,
      meta: { requiresAuth: true },
      children: [
        { path: "", component: Dashboard, name: "dashboard" },
        { path: "meals", component: Meals, name: "meals" },
        { path: "profile", component: Profile, name: "profile" },
      ],
    },
    { path: "/:pathMatch(.*)*", component: NotFound },
  ],
});

router.beforeEach(authGuard);

export default router;
