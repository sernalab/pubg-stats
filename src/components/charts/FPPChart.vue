<template>
  <div class="chart-container">
    <div v-if="loading" class="loading">Cargando estadísticas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else id="pubg-chart">
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { ref, onMounted } from "vue";
import { comparePlayersStats } from "../../services/comparisonService";

export default {
  name: "FPPChart",
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
      { name: props.player2, data: [0, 0, 0, 0] },
      { name: props.player1, data: [0, 0, 0, 0] },
    ]);

    // Categorías simplificadas
    const categories = ["Kills", "Headshots", "Asistencias", "Partidas"];

    // Opciones del gráfico simplificadas
    const chartOptions = ref({
      chart: {
        type: "bar",
        stacked: true,
        toolbar: { show: false },
        fontFamily: "Roboto, Arial, sans-serif",
        background: "transparent",
      },
      colors: ["#1d1f26", "#f1c40f"],
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: { position: "center" },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff", "#000"],
          fontWeight: "bold",
        },
        formatter: (val) => Math.abs(val),
      },
      grid: { show: false },
      xaxis: {
        categories,
        labels: {
          formatter: (val) => Math.abs(Math.round(val)),
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      legend: { show: false },
    });

    const loadPlayersData = async () => {
      loading.value = true;
      error.value = "";

      try {
        const result = await comparePlayersStats(props.player1, props.player2);

        if (result && !result.error) {
          playersData.value = result;
          updateChartData();
        } else {
          error.value = result.error || "Error al cargar los datos";
        }
      } catch (err) {
        error.value = `Ocurrió un error: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    const updateChartData = () => {
      if (!playersData.value) return;

      const player1Stats = playersData.value.player1?.stats?.fppOnly || {};
      const player2Stats = playersData.value.player2?.stats?.fppOnly || {};

      series.value = [
        {
          name: props.player2,
          data: [
            -Math.abs(player2Stats.roundsPlayed || 0),
            -Math.abs(player2Stats.kills || 0),
            -Math.abs(player2Stats.headshotKills || 0),
            -Math.abs(player2Stats.assists || 0),
          ],
        },
        {
          name: props.player1,
          data: [
            player1Stats.roundsPlayed || 0,
            player1Stats.kills || 0,
            player1Stats.headshotKills || 0,
            player1Stats.assists || 0,
          ],
        },
      ];
    };

    onMounted(loadPlayersData);

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
  margin-top: 20px;
  border-radius: 10px;
}

.loading,
.error {
  text-align: center;
  padding: 30px;
  color: #8a8d94;
}

.error {
  color: #e74c3c;
}
</style>