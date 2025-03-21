import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/player/:name",
    name: "player-detail",
    component: () => import("../views/PlayerDetailView.vue"),
  },
  {
    path: "/weapons",
    name: "weapons",
    component: () => import("../views/WeaponsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
