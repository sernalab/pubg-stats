<script>
import { ref } from "vue";
import StatsTable from "../components/StatsTable.vue";
import PubgFppComparisonChart from "../components/PubgFppComparisonChart.vue";

export default {
  name: "DashboardView",
  components: {
    StatsTable,
    PubgFppComparisonChart,
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

    <PubgFppComparisonChart :player1="player1" :player2="player2" />
    <StatsTable :player1="player1" :player2="player2" />
  </div>
</template>

<style scoped>
.versus {
  color: #f1c40f;
  font-size: 5.5rem;
}
</style>