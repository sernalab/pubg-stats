<script setup>
import StatsTable from "../components/StatsTable.vue";
import PubgFppComparisonChart from "../components/PubgFppComparisonChart.vue";
</script>

<template>
  <div class="dashboard">
    <h1>Ribbly <span class="versus">VS</span> Sernuxo</h1>

    <PubgFppComparisonChart player1="sernuxo" player2="ribbly" />
    <StatsTable />
  </div>
</template>

<style scoped>
.versus {
  color: #f1c40f;
  font-size: 5.5rem;
}
</style>