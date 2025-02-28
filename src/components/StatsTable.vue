<!-- src/components/InvertedBarStats.vue -->
<template>
  <div class="stats-comparison">
    <div v-if="loading" class="loading">Cargando estadísticas...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="stats-container">
      <!-- Tabla de Datos Básicos -->
      <table class="stats-table">
        <thead>
          <tr>
            <th class="left-player">{{ player2 }}</th>
            <th class="stat-name">Estadística</th>
            <th class="right-player">{{ player1 }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Kills -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("kills") }}</td>
            <td class="stat-name">Kills</td>
            <td class="right-value">{{ getPlayer1Stat("kills") }}</td>
          </tr>

          <!-- Partidas -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("roundsPlayed") }}</td>
            <td class="stat-name">Partidas</td>
            <td class="right-value">{{ getPlayer1Stat("roundsPlayed") }}</td>
          </tr>

          <!-- Victorias -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("wins") }}</td>
            <td class="stat-name">Victorias</td>
            <td class="right-value">{{ getPlayer1Stat("wins") }}</td>
          </tr>

          <!-- Top 10 -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("top10s") }}</td>
            <td class="stat-name">Top 10</td>
            <td class="right-value">{{ getPlayer1Stat("top10s") }}</td>
          </tr>

          <!-- K/D Ratio -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("kdRatio") }}</td>
            <td class="stat-name">K/D Ratio</td>
            <td class="right-value">{{ getPlayer1Stat("kdRatio") }}</td>
          </tr>

          <!-- Win Ratio -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("winRatio") }}%</td>
            <td class="stat-name">Win Ratio</td>
            <td class="right-value">{{ getPlayer1Stat("winRatio") }}%</td>
          </tr>

          <!-- Top 10 Ratio -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("top10Ratio") }}%</td>
            <td class="stat-name">Top 10 Ratio</td>
            <td class="right-value">{{ getPlayer1Stat("top10Ratio") }}%</td>
          </tr>
        </tbody>
      </table>

      <!-- Sección de Modalidad de Juego -->
      <div class="game-mode-selector">
        <button
          v-for="mode in gameModes"
          :key="mode.value"
          :class="['mode-button', { active: selectedMode === mode.value }]"
          @click="selectedMode = mode.value"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { comparePlayersStats } from "../services/comparisonService";

export default {
  name: "InvertedBarStats",
  setup() {
    const player1 = ref("sernuxo");
    const player2 = ref("Ribbly");
    const loading = ref(true);
    const error = ref("");
    const playersData = ref(null);
    const selectedMode = ref("global");

    const gameModes = [
      { value: "global", label: "Todos" },
      { value: "solo-fpp", label: "Solo FPP" },
      { value: "duo-fpp", label: "Duo FPP" },
      { value: "squad-fpp", label: "Squad FPP" },
    ];

    // Cargar datos utilizando el servicio existente
    const loadPlayersData = async () => {
      loading.value = true;
      error.value = "";

      try {
        // Usar el servicio de comparación
        const result = await comparePlayersStats(player1.value, player2.value);
        playersData.value = result;

        // Verificar si hay errores
        if (result.error) {
          error.value = result.error;
        }
      } catch (err) {
        console.error("Error en la comparación:", err);
        error.value = `Ocurrió un error: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    // Obtener estadística para jugador 1
    const getPlayer1Stat = (statName) => {
      if (
        !playersData.value ||
        !playersData.value.player1 ||
        !playersData.value.player1.stats
      ) {
        return "-";
      }

      if (selectedMode.value === "global") {
        return playersData.value.player1.stats.global[statName] || 0;
      } else {
        return (
          playersData.value.player1.stats.modes[selectedMode.value]?.[
            statName
          ] || 0
        );
      }
    };

    // Obtener estadística para jugador 2
    const getPlayer2Stat = (statName) => {
      if (
        !playersData.value ||
        !playersData.value.player2 ||
        !playersData.value.player2.stats
      ) {
        return "-";
      }

      if (selectedMode.value === "global") {
        return playersData.value.player2.stats.global[statName] || 0;
      } else {
        return (
          playersData.value.player2.stats.modes[selectedMode.value]?.[
            statName
          ] || 0
        );
      }
    };

    onMounted(() => {
      loadPlayersData();
    });

    return {
      player1,
      player2,
      loading,
      error,
      selectedMode,
      gameModes,
      getPlayer1Stat,
      getPlayer2Stat,
    };
  },
};
</script>

<style scoped>
.stats-comparison {
  background-color: #222429;
  border-radius: 10px;
  padding: 20px;
  color: #ffffff;
  max-width: 900px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 30px;
  color: #8a8d94;
}

.error {
  color: #e74c3c;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
}

.stats-table th,
.stats-table td {
  padding: 12px 15px;
  text-align: center;
}

.stats-table th {
  background-color: #1d1f26;
  color: #ffc300;
  font-weight: bold;
}

.stats-table tr:nth-child(odd) {
  background-color: #2a2e39;
}

.stats-table tr:nth-child(even) {
  background-color: #272a34;
}

.left-value,
.right-value {
  font-size: 18px;
  font-weight: bold;
}

.left-value {
  color: #60a5fa;
}

.right-value {
  color: #f87171;
}

.stat-name {
  font-size: 16px;
  color: #a1a1aa;
}

.game-mode-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.mode-button {
  padding: 8px 15px;
  background-color: #15171c;
  border: none;
  border-radius: 5px;
  color: #8a8d94;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-button:hover {
  background-color: #2a2e39;
  color: #fff;
}

.mode-button.active {
  background-color: #ffc300;
  color: #15171c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .stats-table th,
  .stats-table td {
    padding: 8px 10px;
    font-size: 14px;
  }

  .left-value,
  .right-value {
    font-size: 16px;
  }

  .mode-button {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>