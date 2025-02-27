// Fachada que integra todos los servicios de PUBG

import * as playersService from "./playersService";
import * as statsService from "./statsService";

/**
 * Obtiene información y estadísticas completas de un jugador
 * @param {string} playerName - Nombre del jugador
 * @returns {Promise<Object>} - Datos completos del jugador
 */
async function getPlayerInfo(playerName) {
  try {
    // Obtener información básica del jugador
    const playerResponse = await playersService.getPlayerByName(playerName);

    // Si no se encuentra el jugador, devolver null
    if (!playerResponse.data || playerResponse.data.length === 0) {
      console.warn(`No se encontró al jugador: ${playerName}`);
      return null;
    }

    const playerData = playerResponse.data[0];
    const playerId = playerData.id;

    // Obtener estadísticas lifetime
    const statsResponse = await statsService.getPlayerLifetimeStats(playerId);

    // Procesar estadísticas
    const processedStats = statsService.processPlayerStats(statsResponse);

    // Combinar toda la información
    return {
      player: playerData,
      stats: processedStats,
    };
  } catch (error) {
    console.error(
      `Error al obtener información completa para ${playerName}:`,
      error
    );
    throw error;
  }
}

/**
 * Compara estadísticas de dos jugadores
 * @param {string} player1Name - Nombre del primer jugador
 * @param {string} player2Name - Nombre del segundo jugador
 * @returns {Promise<Object>} - Comparación de estadísticas
 */
async function comparePlayersStats(player1Name, player2Name) {
  try {
    // Obtener información de ambos jugadores en paralelo
    const [player1Info, player2Info] = await Promise.all([
      getPlayerInfo(player1Name),
      getPlayerInfo(player2Name),
    ]);

    // Si alguno de los jugadores no se encuentra, devolver lo que se pudo encontrar
    if (!player1Info || !player2Info) {
      return {
        player1: player1Info,
        player2: player2Info,
        error: !player1Info
          ? `No se encontró a ${player1Name}`
          : `No se encontró a ${player2Name}`,
      };
    }

    // Devolver la comparación
    return {
      player1: player1Info,
      player2: player2Info,
    };
  } catch (error) {
    console.error(
      `Error al comparar jugadores ${player1Name} y ${player2Name}:`,
      error
    );
    throw error;
  }
}

export { getPlayerInfo, comparePlayersStats };
