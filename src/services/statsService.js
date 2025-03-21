// src/services/statsService.js
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
 * Procesa estadísticas de un jugador para obtener datos relevantes solo de modos FPP
 * @param {Object} statsData - Datos de estadísticas de la API
 * @returns {Object} - Estadísticas FPP procesadas
 */
function processFppOnlyStats(statsData) {
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
  let totalAssists = 0;
  let totalHeadshotKills = 0;

  // Estadísticas por modo de juego FPP
  const modeStats = {};

  // Procesar solo modos FPP
  Object.keys(gameModeStats).forEach((mode) => {
    // Solo procesar si es un modo FPP
    if (mode.includes("-fpp")) {
      const stats = gameModeStats[mode];

      // Solo considerar si hay partidas jugadas
      if (stats.roundsPlayed > 0) {
        // Sumar a los totales
        totalKills += stats.kills || 0;
        totalRoundsPlayed += stats.roundsPlayed || 0;
        totalWins += stats.wins || 0;
        totalTop10s += stats.top10s || 0;
        totalAssists += stats.assists || 0;
        totalHeadshotKills += stats.headshotKills || 0;

        // Calcular ratios para este modo
        const kdRatio =
          stats.roundsPlayed > 0
            ? (stats.kills / stats.roundsPlayed).toFixed(2)
            : "0.00";
        const winRatio =
          stats.roundsPlayed > 0
            ? ((stats.wins / stats.roundsPlayed) * 100).toFixed(2)
            : "0.00";
        const top10Ratio =
          stats.roundsPlayed > 0
            ? ((stats.top10s / stats.roundsPlayed) * 100).toFixed(2)
            : "0.00";

        // Guardar estadísticas procesadas para este modo
        modeStats[mode] = {
          ...stats,
          kdRatio,
          winRatio,
          top10Ratio,
        };
      }
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

  // Estadísticas globales solo de FPP
  const globalFppStats = {
    kills: totalKills,
    roundsPlayed: totalRoundsPlayed,
    wins: totalWins,
    top10s: totalTop10s,
    assists: totalAssists,
    headshotKills: totalHeadshotKills,
    kdRatio,
    winRatio,
    top10Ratio,
  };

  return {
    global: globalFppStats,
    modes: modeStats,
  };
}

/**
 * Procesa estadísticas de un jugador para obtener datos relevantes
 * @param {Object} statsData - Datos de estadísticas de la API
 * @returns {Object} - Estadísticas procesadas y calculadas incluyendo stats solo FPP
 */
function processPlayerStats(statsData) {
  // Obtener estadísticas solo de FPP
  const fppStats = processFppOnlyStats(statsData);

  return {
    fppOnly: fppStats.global, // Solo modos FPP combinados
    modes: fppStats.modes, // Modos individuales FPP
  };
}

// Exportar las funciones necesarias
export { getPlayerLifetimeStats, processPlayerStats, processFppOnlyStats };
