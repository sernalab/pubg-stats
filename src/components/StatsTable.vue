<template>
  <div class="stats-comparison">
    <div v-if="!playerData" class="loading">Sin datos disponibles</div>

    <div v-else class="stats-container">
      <!-- Tabla de Datos -->
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

          <!-- Headshots -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("headshotKills") }}</td>
            <td class="stat-name">Headshots</td>
            <td class="right-value">{{ getPlayer1Stat("headshotKills") }}</td>
          </tr>

          <!-- Asistencias -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("assists") }}</td>
            <td class="stat-name">Asistencias</td>
            <td class="right-value">{{ getPlayer1Stat("assists") }}</td>
          </tr>

          <!-- Partidas -->
          <tr>
            <td class="left-value">{{ getPlayer2Stat("roundsPlayed") }}</td>
            <td class="stat-name">Partidas</td>
            <td class="right-value">{{ getPlayer1Stat("roundsPlayed") }}</td>
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

      <!-- Selector de Modalidad de Juego -->
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
import { ref } from "vue";

export default {
  name: "StatsTable",
  props: {
    player1: {
      type: String,
      default: "sernuxo",
    },
    player2: {
      type: String,
      default: "Ribbly",
    },
    playerData: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const selectedMode = ref("global");

    const gameModes = [
      { value: "global", label: "Todos FPP" },
      { value: "solo-fpp", label: "Solo FPP" },
      { value: "duo-fpp", label: "Duo FPP" },
      { value: "squad-fpp", label: "Squad FPP" },
    ];

    const getPlayer1Stat = (statName) => {
      if (!props.playerData || !props.playerData.player1?.stats) {
        return "-";
      }

      if (selectedMode.value === "global") {
        return props.playerData.player1.stats.fppOnly?.[statName] || 0;
      } else {
        return (
          props.playerData.player1.stats.modes?.[selectedMode.value]?.[
            statName
          ] || 0
        );
      }
    };

    const getPlayer2Stat = (statName) => {
      if (!props.playerData || !props.playerData.player2?.stats) {
        return "-";
      }

      if (selectedMode.value === "global") {
        return props.playerData.player2.stats.fppOnly?.[statName] || 0;
      } else {
        return (
          props.playerData.player2.stats.modes?.[selectedMode.value]?.[
            statName
          ] || 0
        );
      }
    };

    return {
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
  border-radius: 10px;
  padding: 20px;
  color: #ffffff;
  max-width: 900px;
  margin: 20px auto;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #8a8d94;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
  border-radius: 10px;
}

.stats-table th,
.stats-table td {
  padding: 12px 15px;
  text-align: center;
}

.stats-table th {
  background-color: #15171c;
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
  color: #3498db; /* Azul para player2 (Ribbly) */
}

.right-value {
  color: #f1c40f; /* Amarillo para player1 (Sernuxo) */
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