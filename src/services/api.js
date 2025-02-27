const API_BASE_URL = "https://api.pubg.com/shards/steam";
const API_KEY = import.meta.env.VITE_PUBG_API_KEY;

async function fetchPubgApi(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/vnd.api+json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en la petición API: ${error.message}`);
    throw error;
  }
}

export { fetchPubgApi, API_BASE_URL, API_KEY };
