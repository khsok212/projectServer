<template>
  <div class="page-container">
    <!-- 검색 필터 -->
    <div class="filter-container">
      <q-input
        v-model="filterText"
        label="🔍 Search Name"
        outlined
        dense
        class="filter-input"
        @update:model-value="applyFilter"
      />
    </div>

    <!-- Tabulator 테이블 -->
    <div ref="tableContainer" class="tabulator-container"></div>

    <!-- 버튼 그룹 -->
    <div class="button-group">
      <q-btn
        label="Export to Excel"
        color="primary"
        outline
        icon="download"
        @click="exportToExcel"
      />
      <q-btn
        label="Export to CSV"
        color="secondary"
        outline
        icon="file_download"
        @click="exportToCSV"
      />
      <q-btn
        label="Get Selected Rows"
        color="orange"
        outline
        icon="check"
        @click="getSelectedRows"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_simple.min.css' // ✅ Light 테마 적용

// ✅ 엑셀 다운로드를 위해 xlsx 추가
import * as XLSX from 'xlsx'
window.XLSX = XLSX // Tabulator가 XLSX를 인식하도록 설정

// 검색 필터
const filterText = ref('')

// 테이블 데이터 및 컬럼 정의
const tableData = [
  { id: 1, name: 'John Doe', age: 28, email: 'john@example.com', country: 'USA' },
  { id: 2, name: 'Jane Smith', age: 32, email: 'jane@example.com', country: 'Canada' },
  { id: 3, name: 'Bob Johnson', age: 45, email: 'bob@example.com', country: 'UK' },
  { id: 4, name: 'Alice Brown', age: 29, email: 'alice@example.com', country: 'Germany' },
  { id: 5, name: 'Charlie Davis', age: 37, email: 'charlie@example.com', country: 'Australia' },
  { id: 6, name: 'Emma Wilson', age: 25, email: 'emma@example.com', country: 'France' },
]

const columnDefs = [
  { formatter: 'rowSelection', titleFormatter: 'rowSelection', align: 'center', headerSort: false },
  { title: 'ID', field: 'id', sorter: 'number', width: 80 },
  { title: 'Name', field: 'name', sorter: 'string', width: 150, editor: 'input' },
  { title: 'Age', field: 'age', sorter: 'number', width: 100, editor: 'number' },
  { title: 'Email', field: 'email', sorter: 'string', width: 200 },
  { title: 'Country', field: 'country', sorter: 'string', width: 150 },
]

const tableContainer = ref(null)
let tableInstance = null

onMounted(() => {
  // Tabulator 테이블 인스턴스 생성
  tableInstance = new Tabulator(tableContainer.value, {
    data: tableData,
    columns: columnDefs,
    layout: 'fitColumns',
    pagination: true, // ✅ 페이징 활성화
    paginationSize: 5, // ✅ 페이지당 5개 표시
    selectable: true, // ✅ 체크박스 선택 가능
    movableColumns: true, // ✅ 컬럼 드래그 이동 가능
    resizableRows: true, // ✅ 행 크기 조정 가능
    rowFormatter: (row) => {
      // ✅ 홀수/짝수 행 배경색 적용
      if (row.getPosition() % 2 === 0) {
        row.getElement().style.backgroundColor = '#f9f9f9'
      } else {
        row.getElement().style.backgroundColor = '#ffffff'
      }
    },
  })
})

// ✅ 검색 필터 적용
const applyFilter = () => {
  if (tableInstance) {
    tableInstance.setFilter('name', 'like', filterText.value)
  }
}

// ✅ 엑셀 다운로드 기능 추가
const exportToExcel = () => {
  if (tableInstance) {
    tableInstance.download('xlsx', 'data.xlsx', { sheetName: 'My Data' })
  }
}

// ✅ CSV 다운로드 기능 추가
const exportToCSV = () => {
  if (tableInstance) {
    tableInstance.download('csv', 'data.csv')
  }
}

// ✅ 선택된 행 가져오기
const getSelectedRows = () => {
  if (tableInstance) {
    const selectedData = tableInstance.getSelectedData()
    console.log('Selected Rows:', selectedData)
    alert(`Selected: ${selectedData.map((row) => row.name).join(', ')}`)
  }
}

// ✅ 검색 필터 실시간 반영
watch(filterText, () => {
  applyFilter()
})
</script>

<style scoped>
/* 페이지 컨테이너 스타일 */
.page-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* 필터 입력 스타일 */
.filter-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.filter-input {
  width: 250px;
}

/* 테이블 컨테이너 스타일 */
.tabulator-container {
  border-radius: 5px;
  overflow: hidden;
}

/* 버튼 그룹 스타일 */
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
}

.q-btn {
  min-width: 150px;
  font-weight: bold;
  text-transform: none;
}
</style>
