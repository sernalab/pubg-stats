<template>
  <div class="chart-container">
    <div v-if="!playerData" class="loading">Sin datos disponibles</div>
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
import { ref, watch } from "vue";

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
    playerData: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    // Datos iniciales para las series
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
        formatter: function (val) {
          return parseFloat(Math.abs(val)).toFixed(2);
        },
      },
      grid: { show: false },
      xaxis: {
        categories,
        labels: {
          formatter: function (val) {
            return parseFloat(Math.abs(val)).toFixed(2);
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      legend: { show: false },
    });

    // Actualizar datos cuando cambia playerData prop
    const updateChartData = () => {
      if (!props.playerData) return;

      const player1Stats = props.playerData.player1?.stats?.fppOnly || {};
      const player2Stats = props.playerData.player2?.stats?.fppOnly || {};

      // Función auxiliar para convertir ratios a números y escalarlos
      const prepareRatio = (value) => {
        // Asegurar que el valor es un número
        const numValue = parseFloat(value) || 0;
        // Escalar para mejor visualización
        return numValue * 5;
      };

      series.value = [
        {
          name: props.player2,
          data: [
            -Math.abs(prepareRatio(player2Stats.kdRatio)),
            -Math.abs(prepareRatio(player2Stats.winRatio)),
            -Math.abs(prepareRatio(player2Stats.top10Ratio)),
          ],
        },
        {
          name: props.player1,
          data: [
            prepareRatio(player1Stats.kdRatio),
            prepareRatio(player1Stats.winRatio),
            prepareRatio(player1Stats.top10Ratio),
          ],
        },
      ];
    };

    // Observar cambios en los datos para actualizar el gráfico
    watch(() => props.playerData, updateChartData, { immediate: true });

    return {
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

.loading {
  text-align: center;
  padding: 30px;
  color: #8a8d94;
}
</style>