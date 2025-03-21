import { createApp } from "vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";
import App from "./App.vue";
import "./style.css";

const app = createApp(App);

app.use(VueApexCharts);

app.use(router);

app.mount("#app");
