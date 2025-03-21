// src/stores/playerDataStore.js
import { reactive, ref } from "vue";
import { comparePlayersStats } from "../services/comparisonService";

const playerDataStore = reactive({
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,

  async loadData(player1, player2) {
    if (
      this.data &&
      this.data.player1?.player?.attributes?.name === player1 &&
      this.data.player2?.player?.attributes?.name === player2 &&
      this.lastUpdated &&
      Date.now() - this.lastUpdated < 5 * 60 * 1000
    ) {
      console.log("Usando datos en caché para", player1, "y", player2);
      return this.data;
    }

    // Si estamos cargando, no iniciar otra carga
    if (this.loading) {
      console.log("Ya hay una carga en progreso");
      return null;
    }

    this.loading = true;
    this.error = null;

    try {
      console.log("Cargando datos frescos para", player1, "y", player2);
      const result = await comparePlayersStats(player1, player2);

      if (result && !result.error) {
        this.data = result;
        this.lastUpdated = Date.now();
      } else {
        this.error = result?.error || "Error al cargar los datos";
        console.error("Error en la carga de datos:", this.error);
      }

      return this.data;
    } catch (err) {
      this.error = err.message;
      console.error("Error en la carga de datos:", err);
      return null;
    } finally {
      this.loading = false;
    }
  },

  // Método para limpiar caché
  clearCache() {
    this.data = null;
    this.lastUpdated = null;
  },
});

// Hook personalizado para usar el store
export function usePlayerData() {
  return {
    loadPlayerData: async (player1, player2) =>
      playerDataStore.loadData(player1, player2),
    playerData: playerDataStore.data,
    isLoading: playerDataStore.loading,
    error: playerDataStore.error,
    clearCache: () => playerDataStore.clearCache(),
  };
}
