<template>
  <div class="q-pa-md">
    <q-btn
      label="Export to Excel"
      color="primary"
      class="q-ml-md"
      icon="download"
      @click="exportToExcel"
    />
    <q-table
      title="Treats"
      :rows="paginatedRows"
      :columns="columns"
      row-key="name"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    ></q-table>

    <div class="q-mt-md flex justify-between">
      <!-- 페이지네이션 -->
      <div class="q-mt-md flex-grow flex justify-center" style="flex-grow: 1">
        <q-pagination
          v-model="current"
          :max="totalPages"
          direction-links
          flat
          color="grey"
          active-color="primary"
          boundary-links
        ></q-pagination>
      </div>

      <!-- 페이지당 개수 선택, 오른쪽 정렬 -->
      <div class="q-mt-md">
        <q-select
          v-model="rowsPerPage"
          :options="[5, 10, 20, 40]"
          label="Rows per page"
          dense
          outlined
          style="width: 120px"
        ></q-select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import * as XLSX from 'xlsx'

export default {
  setup() {
    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
      { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
      { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
      { name: 'protein', label: 'Protein (g)', field: 'protein' },
      { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
      {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
    ]

    const rows = ref([
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%',
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%',
      },
      {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
      },
      {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%',
      },
      {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
        calcium: '7%',
        iron: '16%',
      },
      {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
        calcium: '0%',
        iron: '0%',
      },
      {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
        calcium: '0%',
        iron: '2%',
      },
      {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
        calcium: '0%',
        iron: '45%',
      },
      {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
        calcium: '2%',
        iron: '22%',
      },
      {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%',
      },
    ])

    const current = ref(1) // 현재 페이지
    const rowsPerPage = ref(5) // 한 페이지에 표시할 개수

    // 총 페이지 수 계산
    const totalPages = computed(() => Math.ceil(rows.value.length / rowsPerPage.value))

    // 현재 페이지에 맞는 데이터 필터링
    const paginatedRows = computed(() => {
      const start = (current.value - 1) * rowsPerPage.value
      return rows.value.slice(start, start + rowsPerPage.value)
    })

    const filterText = ref('') // 검색어

    // ✅ 엑셀 다운로드 기능
    const exportToExcel = () => {
      let worksheet = XLSX.utils.json_to_sheet(filteredRows.value)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Desserts')
      XLSX.writeFile(workbook, 'desserts.xlsx')
    }

    // ✅ 필터링 적용
    const filteredRows = computed(() => {
      if (!filterText.value) return rows.value

      return rows.value.filter((row) => {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(filterText.value.toLowerCase()),
        )
      })
    })

    // ✅ 필터링 변경 시 자동 적용
    watch(filterText, () => {
      current.value = 1 // 검색 시 첫 페이지로 이동
    })

    return {
      columns,
      rows,
      current,
      rowsPerPage,
      totalPages,
      paginatedRows,
      exportToExcel,
    }
  },
}
</script>

<style scoped>
/* 테이블 디자인 개선 */
.q-table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* 홀수/짝수 행 배경색 변경 */
:deep(tbody tr:nth-child(odd)) {
  background-color: #f9f9f9;
}

:deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

/* 검색창 스타일 */
.q-input {
  width: 250px;
  max-width: 300px;
}

/* 버튼 스타일 */
.q-btn {
  min-width: 150px;
  font-weight: bold;
  text-transform: none;
}
</style>
