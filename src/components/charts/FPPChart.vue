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
    playerData: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    // Datos iniciales para las series
    const series = ref([
      { name: props.player2, data: [0, 0, 0, 0] },
      { name: props.player1, data: [0, 0, 0, 0] },
    ]);

    // Categorías de estadísticas principales
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

    // Actualizar datos cuando cambia playerData prop
    const updateChartData = () => {
      if (!props.playerData) return;

      const player1Stats = props.playerData.player1?.stats?.fppOnly || {};
      const player2Stats = props.playerData.player2?.stats?.fppOnly || {};

      series.value = [
        {
          name: props.player2,
          data: [
            -Math.abs(player2Stats.kills || 0),
            -Math.abs(player2Stats.headshotKills || 0),
            -Math.abs(player2Stats.assists || 0),
            -Math.abs(player2Stats.roundsPlayed || 0),
          ],
        },
        {
          name: props.player1,
          data: [
            player1Stats.kills || 0,
            player1Stats.headshotKills || 0,
            player1Stats.assists || 0,
            player1Stats.roundsPlayed || 0,
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