<template>
  <div id="app">
    <div ref="chartContainer" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'App',
  mounted() {
    // ECharts 초기화
    this.chart = echarts.init(this.$refs.chartContainer)

    // ECharts 옵션 설정
    const options = {
      title: {
        text: 'ECharts Example',
      },
      tooltip: {},
      legend: {
        data: ['Sales'],
      },
      xAxis: {
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      },
      yAxis: {},
      series: [
        {
          name: 'Sales',
          type: 'line', // 라인 그래프
          data: [5, 20, 36, 10, 10, 20, 30],
        },
      ],
    }

    // 옵션을 ECharts에 설정
    this.chart.setOption(options)
  },
  beforeUnmount() {
    // 컴포넌트가 파괴되기 전에 차트를 dispose하여 메모리 해제
    if (this.chart) {
      this.chart.dispose()
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
