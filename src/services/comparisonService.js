// src/services/comparisonService.js
import { getPlayerByName } from "./playerService";
import { getPlayerLifetimeStats, processPlayerStats } from "./statsService";

/**
 * Compara las estadísticas de dos jugadores
 * @param {string} player1Name - Nombre del primer jugador
 * @param {string} player2Name - Nombre del segundo jugador
 * @returns {Promise<Object>} - Objeto con las estadísticas comparativas
 */
async function comparePlayersStats(player1Name, player2Name) {
  try {
    // Paso 1: Obtener IDs de los jugadores
    const [player1Data, player2Data] = await Promise.all([
      getPlayerByName(player1Name),
      getPlayerByName(player2Name),
    ]);

    // Verificar que se encontraron los jugadores
    if (!player1Data?.data?.length) {
      throw new Error(`No se encontró al jugador: ${player1Name}`);
    }
    if (!player2Data?.data?.length) {
      throw new Error(`No se encontró al jugador: ${player2Name}`);
    }

    const player1Id = player1Data.data[0].id;
    const player2Id = player2Data.data[0].id;

    // Paso 2: Obtener estadísticas lifetime de los jugadores
    const [player1Stats, player2Stats] = await Promise.all([
      getPlayerLifetimeStats(player1Id),
      getPlayerLifetimeStats(player2Id),
    ]);

    // Paso 3: Procesar estadísticas
    const processedPlayer1Stats = processPlayerStats(player1Stats);
    const processedPlayer2Stats = processPlayerStats(player2Stats);

    // Paso 4: Devolver comparación
    return {
      player1: {
        player: player1Data.data[0],
        stats: processedPlayer1Stats,
      },
      player2: {
        player: player2Data.data[0],
        stats: processedPlayer2Stats,
      },
    };
  } catch (error) {
    console.error("Error al comparar jugadores:", error);
    return { error: error.message };
  }
}

export { comparePlayersStats };
