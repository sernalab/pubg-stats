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
  name: "RatiosChart",
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
      { name: props.player2, data: [0, 0, 0] },
      { name: props.player1, data: [0, 0, 0] },
    ]);

    // Categorías de ratios
    const categories = ["K/D Ratio", "Win Ratio", "Top 10 Ratio"];

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
        formatter: (val) => Math.abs(parseFloat(val)).toFixed(2),
      },
      grid: { show: false },
      xaxis: {
        categories,
        labels: {
          formatter: (val) => Math.abs(parseFloat(val)).toFixed(2),
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

      // Multiplicamos los ratios por 10 para que se vean mejor en la gráfica
      const scaleRatio = (value) => parseFloat(value) * 10;

      series.value = [
        {
          name: props.player2,
          data: [
            -Math.abs(scaleRatio(player2Stats.kdRatio || 0)),
            -Math.abs(scaleRatio(player2Stats.winRatio || 0)),
            -Math.abs(scaleRatio(player2Stats.top10Ratio || 0)),
          ],
        },
        {
          name: props.player1,
          data: [
            scaleRatio(player1Stats.kdRatio || 0),
            scaleRatio(player1Stats.winRatio || 0),
            scaleRatio(player1Stats.top10Ratio || 0),
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