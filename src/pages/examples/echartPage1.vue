<template>
  <div id="main" ref="chartDom" style="width: 100%; height: 400px"></div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

export default {
  name: 'LifeExpectancyChart',
  setup() {
    const chartDom = ref(null) // chartDom을 ref로 설정
    let myChart = null
    let option = null
    const updateFrequency = 2000
    const countryColors = {
      Australia: '#00008b',
      Canada: '#f00',
      China: '#ffde00',
      Cuba: '#002a8f',
      Finland: '#003580',
      France: '#ed2939',
      Germany: '#000',
      Iceland: '#003897',
      India: '#f93',
      Japan: '#bc002d',
      'North Korea': '#024fa2',
      'South Korea': '#000',
      'New Zealand': '#00247d',
      Norway: '#ef2b2d',
      Poland: '#dc143c',
      Russia: '#d52b1e',
      Turkey: '#e30a17',
      'United Kingdom': '#00247d',
      'United States': '#b22234',
    }

    const getFlag = (countryName, flags) => {
      if (!countryName) return ''
      return (flags.find((item) => item.name === countryName) || {}).emoji
    }

    const updateYear = (year, data) => {
      const source = data.slice(1).filter((d) => d[4] === year)
      option.series[0].data = source
      option.graphic.elements[0].style.text = year
      myChart.setOption(option)
    }

    onMounted(async () => {
      try {
        // 데이터 로딩
        const [flagsResponse, dataResponse] = await Promise.all([
          axios.get('http://localhost:8000/get-emoji-flags'),
          axios.get('http://localhost:8000/get-life-expectancy'),
        ])

        const flags = flagsResponse.data
        const data = dataResponse.data
        const years = []
        data.forEach((item) => {
          if (!years.includes(item[4])) {
            years.push(item[4])
          }
        })

        let startIndex = 10
        let startYear = years[startIndex]

        // ECharts 옵션 설정
        option = {
          grid: {
            top: 10,
            bottom: 30,
            left: 150,
            right: 80,
          },
          xAxis: {
            max: 'dataMax',
            axisLabel: {
              formatter: function (n) {
                return Math.round(n) + ''
              },
            },
          },
          dataset: {
            source: data.slice(1).filter((d) => d[4] === startYear),
          },
          yAxis: {
            type: 'category',
            inverse: true,
            max: 10,
            axisLabel: {
              show: true,
              fontSize: 14,
              formatter: function (value) {
                return value + '{flag|' + getFlag(value, flags) + '}'
              },
              rich: {
                flag: {
                  fontSize: 25,
                  padding: 5,
                },
              },
            },
            animationDuration: 300,
            animationDurationUpdate: 300,
          },
          series: [
            {
              realtimeSort: true,
              seriesLayoutBy: 'column',
              type: 'bar',
              itemStyle: {
                color: function (param) {
                  return countryColors[param.value[3]] || '#5470c6'
                },
              },
              encode: {
                x: 0,
                y: 3,
              },
              label: {
                show: true,
                precision: 1,
                position: 'right',
                valueAnimation: true,
                fontFamily: 'monospace',
              },
            },
          ],
          animationDuration: 0,
          animationDurationUpdate: updateFrequency,
          animationEasing: 'linear',
          animationEasingUpdate: 'linear',
          graphic: {
            elements: [
              {
                type: 'text',
                right: 160,
                bottom: 60,
                style: {
                  text: startYear,
                  font: 'bolder 80px monospace',
                  fill: 'rgba(100, 100, 100, 0.25)',
                },
                z: 100,
              },
            ],
          },
        }

        // 차트 DOM 요소가 준비되었을 때 ECharts 초기화
        if (chartDom.value) {
          myChart = echarts.init(chartDom.value)
          myChart.setOption(option)
        } else {
          console.error('Chart DOM element not found')
        }

        // 연도별 업데이트
        for (let i = startIndex; i < years.length - 1; ++i) {
          setTimeout(
            function () {
              updateYear(years[i + 1], data)
            },
            (i - startIndex) * updateFrequency,
          )
        }
      } catch (error) {
        console.error('Data loading failed:', error)
      }
    })

    return {
      chartDom,
    }
  },
}
</script>

<style scoped>
#main {
  width: 100%;
  height: 400px;
}
</style>
