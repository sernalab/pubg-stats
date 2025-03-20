<template>
  <div class="chart-container">
    <div v-if="loading" class="loading">Cargando estadísticas...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else id="pubg-chart">
      <apexchart
        type="bar"
        height="650"
        width="1000px"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { ref, onMounted } from "vue";
import { comparePlayersStats } from "../services/comparisonService";

export default {
  name: "PubgComparisonChart",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    player2: {
      type: String,
      default: "Ribbly",
    },
    player1: {
      type: String,
      default: "sernuxo",
    },
  },
  setup(props) {
    const loading = ref(true);
    const error = ref("");
    const playersData = ref(null);

    const series = ref([
      {
        name: props.player2, // Ribbly
        data: [0, 0, 0, 0, 0],
      },
      {
        name: props.player1, // Sernuxo
        data: [0, 0, 0, 0, 0],
      },
    ]);

    // Categorías para el eje Y - Actualizadas según lo solicitado
    const categories = [
      "Kills",
      "Headshots",
      "Asistencias",
      "Partidas",
      "Victorias",
    ];

    // Opciones del gráfico
    const chartOptions = ref({
      chart: {
        type: "bar",
        height: 650,
        stacked: true,
      },
      colors: ["#3498db", "#f1c40f"], // Azul para Ribbly, Amarillo para Sernuxo
      plotOptions: {
        bar: {
          borderRadius: 5,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "all",
          horizontal: true,
          barHeight: "80%",
          dataLabels: {
            position: "center",
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#000", "#fff"], // Texto negro para barras amarillas, texto blanco para barras azules
          fontWeight: "bold",
        },
        formatter: function (val, opt) {
          return Math.abs(val);
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      tooltip: {
        shared: false,
        x: {
          formatter: function (val) {
            return categories[val - 1];
          },
        },
        y: {
          formatter: function (val) {
            return Math.abs(val);
          },
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (val) {
            return Math.abs(Math.round(val));
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ["#CCCCCC"],
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        labels: {
          colors: "#cccccc",
        },
      },
    });

    // Cargar datos utilizando el servicio
    const loadPlayersData = async () => {
      loading.value = true;
      error.value = "";

      try {
        // Intentar cargar datos reales
        const result = await comparePlayersStats(props.player1, props.player2);

        // Mostrar la estructura completa de datos recibida
        console.log("Datos recibidos de la API:", result);

        if (result && !result.error) {
          playersData.value = result;
          // Actualizar datos del gráfico
          updateChartData();
        } else {
          // Mostrar el error en lugar de usar datos falsos
          error.value = result.error || "Error al cargar los datos";
        }
      } catch (err) {
        console.error("Error en la comparación:", err);
        error.value = `Ocurrió un error: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    // Actualizar datos del gráfico - Se invierte el orden para que Ribbly quede a la izquierda
    const updateChartData = () => {
      if (!playersData.value) return;

      // Extraer estadísticas - USAR SOLO FPP
      const player1Stats = playersData.value.player1?.stats?.fppOnly || {};
      const player2Stats = playersData.value.player2?.stats?.fppOnly || {};

      // Mostrar estadísticas completas de Ribbly en la consola
      console.log("Estadísticas completas de Ribbly (FPP):", player2Stats);

      // Mostrar específicamente las partidas totales
      console.log(
        "Partidas totales de Ribbly (FPP):",
        player2Stats.roundsPlayed || 0
      );

      // Mostrar desglose por modos de juego
      console.log(
        "Desglose de partidas por modo (FPP):",
        playersData.value.player2?.stats?.modes || {}
      );

      // Preparar datos para el gráfico con las categorías solicitadas exactamente
      series.value = [
        {
          name: props.player2, // Ribbly primero (izquierda)
          data: [
            -Math.abs(player2Stats.kills || 0),
            -Math.abs(player2Stats.headshotKills || 0),
            -Math.abs(player2Stats.assists || 0),
            -Math.abs(player2Stats.roundsPlayed || 0),
            -Math.abs(player2Stats.wins || 0),
          ],
        },
        {
          name: props.player1, // Sernuxo segundo (derecha)
          data: [
            player1Stats.kills || 0,
            player1Stats.headshotKills || 0,
            player1Stats.assists || 0,
            player1Stats.roundsPlayed || 0,
            player1Stats.wins || 0,
          ],
        },
      ];
    };

    onMounted(() => {
      loadPlayersData();
    });

    return {
      loading,
      error,
      series,
      chartOptions,
    };
  },
};
</script>

<style scoped>
.chart-container {
  border-radius: 10px;
  margin-top: 20px;
  padding: 20px;
}

.chart-title {
  text-align: center;
  margin-bottom: 20px;
  color: #ffc300;
  font-size: 24px;
  font-weight: bold;
}
</style>