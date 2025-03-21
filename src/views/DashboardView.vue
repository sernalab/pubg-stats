<template>
  <div class="dashboard">
    <h1>
      <span class="player-name">{{ player2 }}</span>
      <span class="versus">VS</span>
      <span class="player-name">{{ player1 }}</span>
    </h1>

    <div v-if="loading" class="loading-container">
      <div class="loading">Cargando datos de jugadores...</div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error">{{ error }}</div>
      <button @click="loadData" class="retry-button">Reintentar</button>
    </div>

    <div v-else>
      <div class="charts">
        <FPPChart
          :playerData="playerData"
          :player1="player1"
          :player2="player2"
        />
        <RatiosChart
          :playerData="playerData"
          :player1="player1"
          :player2="player2"
        />
      </div>

      <StatsTable
        :playerData="playerData"
        :player1="player1"
        :player2="player2"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import StatsTable from "../components/StatsTable.vue";
import FPPChart from "../components/charts/FPPChart.vue";
import RatiosChart from "../components/charts/RatiosChart.vue";
import { usePlayerData } from "../stores/playerDataStore";

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

    const playerData = ref(null);
    const loading = ref(true);
    const error = ref("");

    // Usar el store compartido
    const playerDataStore = usePlayerData();

    // Cargar datos una sola vez para todos los componentes
    const loadData = async () => {
      loading.value = true;
      error.value = "";

      try {
        const data = await playerDataStore.loadPlayerData(
          player1.value,
          player2.value
        );
        if (data) {
          playerData.value = data;
        } else if (playerDataStore.error) {
          error.value = playerDataStore.error;
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadData);

    return {
      player1,
      player2,
      playerData,
      loading,
      error,
      loadData,
    };
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.player-name {
  color: #ffffff;
}

.versus {
  color: #f1c40f;
  font-size: 3rem;
  margin: 0 1rem;
}

.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loading,
.error {
  padding: 20px;
  border-radius: 10px;
  background-color: #1d1f26;
  text-align: center;
}

.error {
  color: #e74c3c;
}

.retry-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #2980b9;
}
</style>