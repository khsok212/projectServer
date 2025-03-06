<template>
  <q-page class="q-pa-md">
    <!-- Chart 영역 -->
    <div class="q-gutter-md chart-section">
      <q-toolbar>
        <q-toolbar-title>Charts</q-toolbar-title>
      </q-toolbar>

      <!-- Line Chart -->
      <div class="chart-wrapper">
        <q-card flat bordered>
          <q-card-section>
            <h6>Line Chart</h6>
            <LineChart :data="lineData" :options="lineOptions" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Bar Chart -->
      <div class="chart-wrapper">
        <q-card flat bordered>
          <q-card-section>
            <h6>Bar Chart</h6>
            <BarChart :data="barData" :options="barOptions" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Line, Bar } from 'vue-chartjs'
import { reactive } from 'vue'
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Chart.js의 필요한 요소 등록
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

export default {
  components: {
    LineChart: Line,
    BarChart: Bar,
  },
  setup() {
    // Line Chart 데이터 설정
    const lineData = reactive({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // X축 레이블
      datasets: [
        {
          label: 'Sales', // 라벨
          data: [65, 59, 80, 81, 56, 55, 40], // Y축 데이터
          borderColor: '#42A5F5', // 선 색상
          backgroundColor: 'rgba(66, 165, 245, 0.2)', // 배경 색상
          fill: true, // 선 아래 채우기 효과
          tension: 0.4, // 곡선 정도
        },
      ],
    })

    // Line Chart 옵션 설정
    const lineOptions = reactive({
      responsive: true, // 반응형
      plugins: {
        legend: {
          position: 'top', // 범례 위치
        },
        tooltip: {
          enabled: true, // 툴팁 활성화
        },
      },
      scales: {
        x: {
          beginAtZero: true, // X축 시작점 설정
        },
        y: {
          beginAtZero: true, // Y축 시작점 설정
        },
      },
    })

    // Bar Chart 데이터 설정
    const barData = reactive({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // X축 레이블
      datasets: [
        {
          label: 'Revenue', // 라벨
          data: [65, 59, 80, 81, 56, 55, 40], // Y축 데이터
          backgroundColor: '#42A5F5', // 바 색상
        },
      ],
    })

    // Bar Chart 옵션 설정
    const barOptions = reactive({
      responsive: true, // 반응형
      plugins: {
        legend: {
          position: 'top', // 범례 위치
        },
        tooltip: {
          enabled: true, // 툴팁 활성화
        },
      },
      scales: {
        x: {
          beginAtZero: true, // X축 시작점 설정
        },
        y: {
          beginAtZero: true, // Y축 시작점 설정
        },
      },
    })

    return {
      lineData,
      lineOptions,
      barData,
      barOptions,
    }
  },
}
</script>

<style scoped>
.chart-section {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
  margin-bottom: 20px;
  max-width: 700px;
}

.q-card-section h6 {
  font-weight: bold;
  font-size: 18px;
}
</style>
