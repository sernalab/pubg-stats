// Maneja todas las operaciones relacionadas con jugadores

import { fetchPubgApi } from "./api";

/**
 * Obtiene información de un jugador por su nombre
 * @param {string} playerName - Nombre del jugador
 * @returns {Promise<Object>} - Datos del jugador
 */
async function getPlayerByName(playerName) {
  try {
    const response = await fetchPubgApi(
      `/players?filter[playerNames]=${playerName}`
    );
    return response;
  } catch (error) {
    console.error(`Error al obtener el jugador ${playerName}:`, error);
    throw error;
  }
}

/**
 * Obtiene información de múltiples jugadores por sus nombres
 * @param {Array<string>} playerNames - Array con nombres de jugadores
 * @returns {Promise<Object>} - Datos de los jugadores
 */
async function getPlayersByNames(playerNames) {
  try {
    // La API permite consultar hasta 10 jugadores a la vez
    if (playerNames.length > 10) {
      throw new Error("Solo se pueden consultar hasta 10 jugadores a la vez");
    }

    const namesParam = playerNames.join(",");
    const response = await fetchPubgApi(
      `/players?filter[playerNames]=${namesParam}`
    );
    return response;
  } catch (error) {
    console.error(`Error al obtener jugadores:`, error);
    throw error;
  }
}

/**
 * Obtiene partidas recientes de un jugador
 * @param {string} playerId - ID del jugador
 * @returns {Promise<Object>} - Lista de partidas recientes
 */
async function getPlayerMatches(playerId) {
  try {
    const response = await fetchPubgApi(`/players/${playerId}`);
    return response;
  } catch (error) {
    console.error(`Error al obtener partidas del jugador ${playerId}:`, error);
    throw error;
  }
}

export { getPlayerByName, getPlayersByNames, getPlayerMatches };
