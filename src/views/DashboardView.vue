<script setup>
import StatsTable from "../components/StatsTable.vue";
import InvertedChart from "../components/InvertedChart.vue";
</script>

<template>
  <div class="dashboard">
    <h1>Comparación de Jugadores</h1>

    <StatsTable />
    <InvertedChart player1="sernuxo" player2="ribbly" />
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>