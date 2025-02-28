<template>
  <div class="chart-container">
    <div id="pubg-chart">
      <h2 class="chart-title">TOTAL FPP</h2>
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
      default: "ribbly",
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

    // Datos de estadísticas
    const series = ref([
      {
        name: props.player1,
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: props.player2,
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ]);

    // Categorías para el eje Y - Exactamente como solicitadas
    const categories = [
      "Kills",
      "Partidas",
      "Victorias",
      "Top 10",
      "K/D Ratio",
      "Win Ratio",
      "Top 10 Ratio",
    ];

    // Opciones del gráfico
    const chartOptions = ref({
      chart: {
        type: "bar",
        height: 650,
        stacked: true,
      },
      colors: ["#f1c40f", "#1d1f26"], // Amarillo y Negro como en tu primera imagen
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
          colors: ["#000", "#fff"], // Texto negro para barras amarillas, texto blanco para barras negras
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

    // Mantén las funciones originales de agregación de datos
    const aggregateFppStats = () => {
      if (!playersData.value) return;

      // Para jugador 1
      if (playersData.value.player1?.stats?.modes) {
        const player1Modes = playersData.value.player1.stats.modes;
        let totalKills = 0;
        let totalRoundsPlayed = 0;
        let totalWins = 0;
        let totalTop10s = 0;

        // Sumar solo modos FPP
        for (const mode in player1Modes) {
          if (mode.includes("-fpp")) {
            const stats = player1Modes[mode];
            totalKills += stats.kills || 0;
            totalRoundsPlayed += stats.roundsPlayed || 0;
            totalWins += stats.wins || 0;
            totalTop10s += stats.top10s || 0;
          }
        }

        // Calcular ratios
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

        // Crear estadísticas FPP
        playersData.value.player1.stats.fppOnly = {
          kills: totalKills,
          roundsPlayed: totalRoundsPlayed,
          wins: totalWins,
          top10s: totalTop10s,
          kdRatio,
          winRatio,
          top10Ratio,
        };
      }

      // Para jugador 2
      if (playersData.value.player2?.stats?.modes) {
        const player2Modes = playersData.value.player2.stats.modes;
        let totalKills = 0;
        let totalRoundsPlayed = 0;
        let totalWins = 0;
        let totalTop10s = 0;

        // Sumar solo modos FPP
        for (const mode in player2Modes) {
          if (mode.includes("-fpp")) {
            const stats = player2Modes[mode];
            totalKills += stats.kills || 0;
            totalRoundsPlayed += stats.roundsPlayed || 0;
            totalWins += stats.wins || 0;
            totalTop10s += stats.top10s || 0;
          }
        }

        // Calcular ratios
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

        // Crear estadísticas FPP
        playersData.value.player2.stats.fppOnly = {
          kills: totalKills,
          roundsPlayed: totalRoundsPlayed,
          wins: totalWins,
          top10s: totalTop10s,
          kdRatio,
          winRatio,
          top10Ratio,
        };
      }
    };

    // Cargar datos utilizando el servicio
    const loadPlayersData = async () => {
      loading.value = true;
      error.value = "";

      try {
        // En caso de error o para pruebas, usar datos de ejemplo
        const exampleData = {
          player1: {
            player: { attributes: { name: props.player1 } },
            stats: {
              global: {
                kills: 1747,
                roundsPlayed: 1990,
                wins: 48,
                top10s: 514,
                kdRatio: 1.16,
                winRatio: 2.41,
                top10Ratio: 25.83,
              },
              modes: {
                "solo-fpp": {
                  kills: 59,
                  roundsPlayed: 83,
                  wins: 0,
                  top10s: 7,
                  kdRatio: 0.71,
                  winRatio: 0,
                  top10Ratio: 8.43,
                },
                "duo-fpp": {
                  kills: 861,
                  roundsPlayed: 967,
                  wins: 13,
                  top10s: 213,
                  kdRatio: 0.89,
                  winRatio: 1.34,
                  top10Ratio: 22.03,
                },
                "squad-fpp": {
                  kills: 533,
                  roundsPlayed: 593,
                  wins: 28,
                  top10s: 220,
                  kdRatio: 0.89,
                  winRatio: 4.72,
                  top10Ratio: 37.1,
                },
              },
            },
          },
          player2: {
            player: { attributes: { name: props.player2 } },
            stats: {
              global: {
                kills: 1520,
                roundsPlayed: 1800,
                wins: 42,
                top10s: 480,
                kdRatio: 1.09,
                winRatio: 2.33,
                top10Ratio: 26.67,
              },
              modes: {
                "solo-fpp": {
                  kills: 50,
                  roundsPlayed: 75,
                  wins: 0,
                  top10s: 6,
                  kdRatio: 0.67,
                  winRatio: 0,
                  top10Ratio: 8.0,
                },
                "duo-fpp": {
                  kills: 780,
                  roundsPlayed: 880,
                  wins: 10,
                  top10s: 194,
                  kdRatio: 0.89,
                  winRatio: 1.14,
                  top10Ratio: 22.05,
                },
                "squad-fpp": {
                  kills: 490,
                  roundsPlayed: 545,
                  wins: 25,
                  top10s: 190,
                  kdRatio: 0.9,
                  winRatio: 4.59,
                  top10Ratio: 34.86,
                },
              },
            },
          },
        };

        // Intentar cargar datos reales si es posible
        try {
          const result = await comparePlayersStats(
            props.player1,
            props.player2
          );
          if (result && !result.error) {
            playersData.value = result;
          } else {
            playersData.value = exampleData;
          }
        } catch (err) {
          console.log("Usando datos de ejemplo debido a: ", err.message);
          playersData.value = exampleData;
        }

        // Agregar estadísticas solo FPP
        aggregateFppStats();

        // Actualizar datos del gráfico
        updateChartData();
      } catch (err) {
        console.error("Error en la comparación:", err);
        error.value = `Ocurrió un error: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    // La clave está aquí: valores positivos para el jugador 1, negativos para el jugador 2
    const updateChartData = () => {
      if (!playersData.value) return;

      // Extraer estadísticas - USAR SOLO FPP
      const player1Stats = playersData.value.player1?.stats?.fppOnly || {};
      const player2Stats = playersData.value.player2?.stats?.fppOnly || {};

      // Factor de escala para diferentes tipos de estadísticas
      const getScaledValue = (value, type) => {
        if (type === "ratio") {
          // Multiplicar ratios por 10 para que sean más visibles
          return value * 10;
        }
        return value;
      };

      // Preparar datos para el gráfico con las categorías solicitadas exactamente
      series.value = [
        {
          name: props.player1,
          data: [
            player1Stats.kills || 0,
            player1Stats.roundsPlayed || 0,
            player1Stats.wins || 0,
            player1Stats.top10s || 0,
            getScaledValue(parseFloat(player1Stats.kdRatio) || 0, "ratio"),
            getScaledValue(parseFloat(player1Stats.winRatio) || 0, "ratio"),
            getScaledValue(parseFloat(player1Stats.top10Ratio) || 0, "ratio"),
          ],
        },
        {
          name: props.player2,
          data: [
            -Math.abs(player2Stats.kills || 0),
            -Math.abs(player2Stats.roundsPlayed || 0),
            -Math.abs(player2Stats.wins || 0),
            -Math.abs(player2Stats.top10s || 0),
            -Math.abs(
              getScaledValue(parseFloat(player2Stats.kdRatio) || 0, "ratio")
            ),
            -Math.abs(
              getScaledValue(parseFloat(player2Stats.winRatio) || 0, "ratio")
            ),
            -Math.abs(
              getScaledValue(parseFloat(player2Stats.top10Ratio) || 0, "ratio")
            ),
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
}

.chart-title {
  text-align: center;
  margin-bottom: 20px;
  color: #ffc300;
  font-size: 24px;
  font-weight: bold;
}
</style>