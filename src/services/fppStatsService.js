// src/services/fppStatsService.js
import { fetchPubgApi } from "./api";

/**
 * Obtiene estadísticas normales (no ranked) lifetime de un jugador
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
 * Obtiene estadísticas de una temporada específica (no ranked)
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
 * Obtiene estadísticas clasificatorias (ranked) de un jugador
 * @param {string} playerId - ID del jugador
 * @param {string} seasonId - ID de la temporada actual
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
 * Obtiene la temporada actual
 * @returns {Promise<string>} - ID de la temporada actual
 */
async function getCurrentSeason() {
  try {
    const response = await fetchPubgApi("/seasons");
    // Encontrar la temporada actual
    const currentSeason = response.data.find(
      (season) => season.attributes.isCurrentSeason
    );
    return currentSeason ? currentSeason.id : null;
  } catch (error) {
    console.error("Error al obtener temporadas:", error);
    throw error;
  }
}

/**
 * Procesa estadísticas lifetime (no ranked) filtrando solo modos FPP
 * @param {Object} statsData - Datos de estadísticas de la API
 * @returns {Object} - Estadísticas FPP procesadas
 */
function processFppStats(statsData) {
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

  // Estadísticas por modo de juego FPP
  const modeStats = {};

  // Procesar cada modo de juego
  Object.keys(gameModeStats).forEach((mode) => {
    const stats = gameModeStats[mode];

    // Solo procesar si hay partidas jugadas y es un modo FPP
    if (stats.roundsPlayed > 0 && mode.includes("-fpp")) {
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

/**
 * Procesa estadísticas clasificatorias (ranked)
 * @param {Object} rankedData - Datos de estadísticas ranked de la API
 * @returns {Object} - Estadísticas ranked procesadas
 */
function processRankedStats(rankedData) {
  // Si no hay datos, devolver un objeto vacío
  if (
    !rankedData ||
    !rankedData.data ||
    !rankedData.data.attributes ||
    !rankedData.data.attributes.rankedGameModeStats
  ) {
    return {};
  }

  const rankedGameModeStats = rankedData.data.attributes.rankedGameModeStats;

  // Procesar cada modo de juego ranked
  const rankedModes = {};

  Object.keys(rankedGameModeStats).forEach((mode) => {
    const stats = rankedGameModeStats[mode];

    // Guardar estadísticas procesadas para este modo
    rankedModes[mode] = {
      ...stats,
      // La API ya proporciona kda, kdr y winRatio para ranked
      // Podemos agregar cálculos adicionales si es necesario
    };
  });

  // Acumular estadísticas totales
  let totalKills = 0;
  let totalDeaths = 0;
  let totalRoundsPlayed = 0;
  let totalWins = 0;
  let totalTop10s = 0;

  Object.values(rankedModes).forEach((stats) => {
    totalKills += stats.kills || 0;
    totalDeaths += stats.deaths || 0;
    totalRoundsPlayed += stats.roundsPlayed || 0;
    totalWins += stats.wins || 0;
    // Algunas estadísticas pueden no estar disponibles en todos los modos
    if (stats.top10Ratio) {
      totalTop10s +=
        Math.round((stats.top10Ratio * stats.roundsPlayed) / 100) || 0;
    }
  });

  // Calcular ratios globales
  const kdr = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : "0.00";
  const winRatio =
    totalRoundsPlayed > 0
      ? ((totalWins / totalRoundsPlayed) * 100).toFixed(2)
      : "0.00";
  const top10Ratio =
    totalRoundsPlayed > 0
      ? ((totalTop10s / totalRoundsPlayed) * 100).toFixed(2)
      : "0.00";

  // Estadísticas globales
  const globalRankedStats = {
    kills: totalKills,
    deaths: totalDeaths,
    roundsPlayed: totalRoundsPlayed,
    wins: totalWins,
    top10s: totalTop10s,
    kdr,
    winRatio,
    top10Ratio,
  };

  return {
    global: globalRankedStats,
    modes: rankedModes,
  };
}

/**
 * Obtiene estadísticas completas de un jugador (normales y ranked, solo FPP)
 * @param {string} playerId - ID del jugador
 * @param {string} playerName - Nombre del jugador
 * @returns {Promise<Object>} - Estadísticas completas procesadas
 */
async function getCompletePlayerStats(playerId, playerName) {
  try {
    // Obtener estadísticas lifetime (no ranked)
    const lifetimeStats = await getPlayerLifetimeStats(playerId);
    const fppStats = processFppStats(lifetimeStats);

    // Intentar obtener estadísticas ranked de la temporada actual
    let rankedStats = {};
    try {
      const currentSeason = await getCurrentSeason();
      if (currentSeason) {
        const ranked = await getPlayerRankedStats(playerId, currentSeason);
        rankedStats = processRankedStats(ranked);
      }
    } catch (error) {
      console.warn(
        `No se pudieron obtener estadísticas ranked para ${playerName}`
      );
      // No hacemos rethrow aquí para que el proceso pueda continuar
    }

    return {
      playerName,
      playerId,
      normal: fppStats,
      ranked: rankedStats,
    };
  } catch (error) {
    console.error(
      `Error al obtener estadísticas completas para ${playerName}:`,
      error
    );
    throw error;
  }
}

/**
 * Compara estadísticas completas de dos jugadores
 * @param {string} player1Id - ID del primer jugador
 * @param {string} player2Id - ID del segundo jugador
 * @param {string} player1Name - Nombre del primer jugador
 * @param {string} player2Name - Nombre del segundo jugador
 * @returns {Promise<Object>} - Comparación de estadísticas
 */
async function comparePlayersFppStats(
  player1Id,
  player2Id,
  player1Name,
  player2Name
) {
  try {
    // Obtener estadísticas de ambos jugadores en paralelo
    const [player1Stats, player2Stats] = await Promise.all([
      getCompletePlayerStats(player1Id, player1Name),
      getCompletePlayerStats(player2Id, player2Name),
    ]);

    return {
      player1: player1Stats,
      player2: player2Stats,
    };
  } catch (error) {
    console.error(
      `Error al comparar jugadores ${player1Name} y ${player2Name}:`,
      error
    );
    throw error;
  }
}

export {
  getPlayerLifetimeStats,
  getPlayerSeasonStats,
  getPlayerRankedStats,
  getCurrentSeason,
  processFppStats,
  processRankedStats,
  getCompletePlayerStats,
  comparePlayersFppStats,
};
