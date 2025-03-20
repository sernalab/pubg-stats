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
    console.log(
      `Datos originales de la API para el jugador ${playerId}:`,
      response
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

  let totalKills = 0;
  let totalRoundsPlayed = 0;
  let totalWins = 0;
  let totalAssists = 0; // Agregado: asistencias
  let totalHeadshotKills = 0; // Agregado: headshots

  const modeStats = {};

  // Procesar solo modos FPP
  Object.keys(gameModeStats).forEach((mode) => {
    // Solo procesar si es un modo FPP
    if (mode.includes("-fpp")) {
      const stats = gameModeStats[mode];

      if (stats.roundsPlayed > 0) {
        // Sumar a los totales
        totalKills += stats.kills || 0;
        totalRoundsPlayed += stats.roundsPlayed || 0;
        totalWins += stats.wins || 0;
        totalAssists += stats.assists || 0; // Agregado: asistencias
        totalHeadshotKills += stats.headshotKills || 0; // Agregado: headshots

        // Guardar estadísticas procesadas para este modo
        modeStats[mode] = {
          ...stats,
        };
      }
    }
  });

  // Estadísticas globales solo de FPP
  const globalFppStats = {
    kills: totalKills,
    roundsPlayed: totalRoundsPlayed,
    wins: totalWins,
    assists: totalAssists, // Agregado: asistencias
    headshotKills: totalHeadshotKills, // Agregado: headshots
  };

  return {
    global: globalFppStats,
    modes: modeStats,
  };
}

/**
 * Procesa estadísticas de un jugador para obtener datos relevantes
 * @param {Object} statsData - Datos de estadísticas de la API
 * @returns {Object} - Estadísticas procesadas y calculadas
 */
function processPlayerStats(statsData) {
  if (
    !statsData ||
    !statsData.data ||
    !statsData.data.attributes ||
    !statsData.data.attributes.gameModeStats
  ) {
    return {};
  }

  // Obtener estadísticas solo de FPP
  const fppStats = processFppOnlyStats(statsData);

  return {
    fppOnly: fppStats.global, // Usamos directamente las estadísticas FPP globales
    modes: fppStats.modes, // Modos individuales FPP
  };
}

// Exportar las funciones necesarias
export { getPlayerLifetimeStats, processPlayerStats };
