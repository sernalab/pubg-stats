<script>
import { ref } from "vue";
import StatsTable from "../components/StatsTable.vue";
import FPPChart from "../components/charts/FPPChart.vue";
import RatiosChart from "../components/charts/RatiosChart.vue";

export default {
  name: "DashboardView",
  components: {
    StatsTable,
    FPPChart,
    RatiosChart,
  },
  setup() {
    const player1 = ref("sernuxo");
    const player2 = ref("Ribbly");

    return {
      player1,
      player2,
    };
  },
};
</script>

<template>
  <div class="dashboard">
    <h1>Ribbly <span class="versus">VS</span> Sernuxo</h1>

    <div class="charts">
      <FPPChart :player1="player1" :player2="player2" />
      <RatiosChart :player1="player1" :player2="player2" />
    </div>
    <StatsTable :player1="player1" :player2="player2" />
  </div>
</template>

<style scoped>
.versus {
  color: #f1c40f;
  font-size: 5.5rem;
}

.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>