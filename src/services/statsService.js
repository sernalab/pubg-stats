// Maneja todas las operaciones relacionadas con estadísticas

import { fetchPubgApi } from "./api";

/**
 * Obtiene estadísticas lifetime de un jugador
 * @param {string} playerId - ID del jugador
 * @returns {Promise<Object>} - Estadísticas lifetime
 */
async function getPlayerLifetimeStats(playerId) {
  try {
    const response = await fetchPubgApi(
      `/players/${playerId}/seasons/lifetime`
    );
    return response;
  } catch (error) {
    console.error(
      `Error al obtener estadísticas lifetime para ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Obtiene estadísticas de una temporada específica
 * @param {string} playerId - ID del jugador
 * @param {string} seasonId - ID de la temporada
 * @returns {Promise<Object>} - Estadísticas de la temporada
 */
async function getPlayerSeasonStats(playerId, seasonId) {
  try {
    const response = await fetchPubgApi(
      `/players/${playerId}/seasons/${seasonId}`
    );
    return response;
  } catch (error) {
    console.error(
      `Error al obtener estadísticas de temporada para ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Obtiene estadísticas de clasificación (ranked) de un jugador
 * @param {string} playerId - ID del jugador
 * @param {string} seasonId - ID de la temporada
 * @returns {Promise<Object>} - Estadísticas de clasificación
 */
async function getPlayerRankedStats(playerId, seasonId) {
  try {
    const response = await fetchPubgApi(
      `/players/${playerId}/seasons/${seasonId}/ranked`
    );
    return response;
  } catch (error) {
    console.error(
      `Error al obtener estadísticas ranked para ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Procesa estadísticas de un jugador para obtener datos relevantes
 * @param {Object} statsData - Datos de estadísticas de la API
 * @returns {Object} - Estadísticas procesadas y calculadas
 */
function processPlayerStats(statsData) {
  // Si no hay datos, devolver un objeto vacío
  if (
    !statsData ||
    !statsData.data ||
    !statsData.data.attributes ||
    !statsData.data.attributes.gameModeStats
  ) {
    return {};
  }

  const gameModeStats = statsData.data.attributes.gameModeStats;

  // Inicializar totales
  let totalKills = 0;
  let totalRoundsPlayed = 0;
  let totalWins = 0;
  let totalTop10s = 0;
  let totalLosses = 0;

  // Estadísticas por modo de juego
  const modeStats = {};

  // Procesar cada modo de juego
  Object.keys(gameModeStats).forEach((mode) => {
    const stats = gameModeStats[mode];

    // Solo procesar si hay partidas jugadas
    if (stats.roundsPlayed > 0) {
      // Sumar a los totales
      totalKills += stats.kills || 0;
      totalRoundsPlayed += stats.roundsPlayed || 0;
      totalWins += stats.wins || 0;
      totalTop10s += stats.top10s || 0;
      totalLosses += stats.losses || 0;

      // Calcular ratios para este modo
      const kdRatio = (stats.kills / stats.roundsPlayed).toFixed(2);
      const winRatio = ((stats.wins / stats.roundsPlayed) * 100).toFixed(2);
      const top10Ratio = ((stats.top10s / stats.roundsPlayed) * 100).toFixed(2);

      // Guardar estadísticas procesadas para este modo
      modeStats[mode] = {
        ...stats,
        kdRatio,
        winRatio,
        top10Ratio,
      };
    }
  });

  // Calcular ratios globales
  const kdRatio =
    totalRoundsPlayed > 0
      ? (totalKills / totalRoundsPlayed).toFixed(2)
      : "0.00";
  const winRatio =
    totalRoundsPlayed > 0
      ? ((totalWins / totalRoundsPlayed) * 100).toFixed(2)
      : "0.00";
  const top10Ratio =
    totalRoundsPlayed > 0
      ? ((totalTop10s / totalRoundsPlayed) * 100).toFixed(2)
      : "0.00";

  // Estadísticas globales
  const globalStats = {
    kills: totalKills,
    roundsPlayed: totalRoundsPlayed,
    wins: totalWins,
    top10s: totalTop10s,
    losses: totalLosses,
    kdRatio,
    winRatio,
    top10Ratio,
  };

  return {
    global: globalStats,
    modes: modeStats,
  };
}

export {
  getPlayerLifetimeStats,
  getPlayerSeasonStats,
  getPlayerRankedStats,
  processPlayerStats,
};
