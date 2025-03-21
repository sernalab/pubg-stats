<template>
  <div class="chart-container">
    <div v-if="!playerData" class="loading">Sin datos disponibles</div>
    <div v-else id="pubg-chart">
      <div class="chart-title">Estadísticas Principales</div>

      <div class="legend">
        <div class="legend-item">
          <span
            class="color-box"
            :style="{ backgroundColor: '#3498db' }"
          ></span>
          <span>{{ player2 }}</span>
        </div>
        <div class="legend-item">
          <span
            class="color-box"
            :style="{ backgroundColor: '#f1c40f' }"
          ></span>
          <span>{{ player1 }}</span>
        </div>
      </div>

      <apexchart
        type="bar"
        height="350"
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

    // Opciones del gráfico mejoradas
    const chartOptions = ref({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "Roboto, Arial, sans-serif",
        background: "transparent",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      colors: ["#3498db", "#f1c40f"],
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "75%",
          borderRadius: 6,
          distributed: false,
          dataLabels: {
            position: "center",
          },
          columnWidth: "90%",
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff", "#000"],
          fontWeight: "bold",
          fontSize: "14px",
        },
        formatter: (val) => Math.abs(val),
      },
      stroke: {
        width: 0,
      },
      grid: {
        show: false,
        padding: {
          left: 10,
          right: 10,
        },
      },
      xaxis: {
        categories,
        labels: {
          formatter: (val) => Math.abs(Math.round(val)),
          style: {
            fontSize: "14px",
            colors: "#cccccc",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            colors: "#f1c40f",
            fontWeight: "bold",
          },
        },
      },
      legend: { show: false },
      tooltip: {
        enabled: true,
        theme: "dark",
        y: {
          formatter: (val) => Math.abs(val),
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            dataLabels: {
              fontSize: "12px",
            },
            yaxis: {
              labels: {
                fontSize: "12px",
              },
            },
          },
        },
      ],
    });

    // Actualizar datos cuando cambia playerData prop
    const updateChartData = () => {
      if (!props.playerData) return;

      const player1Stats = props.playerData.player1?.stats?.fppOnly || {};
      const player2Stats = props.playerData.player2?.stats?.fppOnly || {};

      // Representar los valores directamente (sin transformar a negativos)
      // Esto hace que sea más intuitivo y permite usar un diseño más limpio
      series.value = [
        {
          name: props.player2,
          data: [
            player2Stats.roundsPlayed || 0,
            player2Stats.kills || 0,
            player2Stats.headshotKills || 0,
            player2Stats.assists || 0,
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
  background-color: #1d1f26;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  color: #f1c40f;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #8a8d94;
}
</style>