<template>
  <q-page class="q-pa-md">
    <q-card class="menu-card">
      <!-- 상단 타이틀 -->
      <q-card-section>
        <div class="text-h6 text-bold">🛠️ 메뉴 권한 관리</div>
      </q-card-section>
      <!-- 사용자 그룹 선택 -->
      <q-card-section>
        <q-select
          v-model="selectedRole"
          :options="roleOptions"
          label="사용자 그룹"
          outlined
          dense
          class="full-width"
          @update:model-value="onRoleChange"
        />
      </q-card-section>
      <!-- 메인 영역: 4개의 칼럼 -->
      <q-card-section class="row menu-container q-gutter-md no-wrap">
        <!-- (1) 전체 메뉴 (왼쪽) -->
        <div class="col-3">
          <q-card class="box-content">
            <q-card-section class="text-negative text-bold text-center">
              📋 전체 메뉴
              <q-btn flat dense icon="arrow_upward" @click="moveUp(allMenus, selectedAllMenus)" />
              <q-btn
                flat
                dense
                icon="arrow_downward"
                @click="moveDown(allMenus, selectedAllMenus)"
              />
            </q-card-section>
            <q-separator />
            <q-tree
              class="menu-tree"
              :nodes="allMenusWithDisable"
              node-key="menu_id"
              label-key="menu_name"
              :tick-strategy="tickStrategy"
              selected-color="negative"
              v-model:ticked="selectedAllMenus"
              v-model:selected="selectedMenuId"
              @update:selected="updateSelectedMenu"
              :no-nodes-label="'📌 등록된 메뉴가 없습니다.'"
            />
          </q-card>
        </div>
        <!-- (2) 이동 버튼 -->
        <div class="col-1 menu-actions">
          <q-btn
            icon="chevron_right"
            color="primary"
            dense
            flat
            class="q-mb-md action-btn"
            @click="moveToGranted"
            :disable="selectedAllMenus.length === 0"
          />
          <q-btn
            icon="chevron_left"
            color="negative"
            dense
            flat
            class="action-btn"
            @click="moveToUngranted"
            :disable="selectedGranted.length === 0"
          />
        </div>
        <!-- (3) 권한 있는 메뉴 (오른쪽) -->
        <div class="col-3">
          <q-card class="box-content">
            <q-card-section class="text-primary text-bold text-center">
              ✅ 권한 있는 메뉴
              <q-btn
                flat
                dense
                icon="arrow_upward"
                @click="moveUp(grantedMenus, selectedGranted)"
              />
              <q-btn
                flat
                dense
                icon="arrow_downward"
                @click="moveDown(grantedMenus, selectedGranted)"
              />
            </q-card-section>
            <q-separator />
            <q-tree
              class="menu-tree"
              :nodes="grantedMenus"
              node-key="menu_id"
              label-key="menu_name"
              tick-strategy="leaf"
              selected-color="primary"
              v-model:ticked="selectedGranted"
              v-model:selected="selectedMenuId"
              @update:selected="updateSelectedMenu"
              :no-nodes-label="'✅ 선택된 메뉴가 없습니다.'"
            />
          </q-card>
        </div>
        <!-- (4) 메뉴 상세 정보 (오른쪽 고정) -->
        <div class="col-4">
          <q-card class="detail-box">
            <q-card-section>
              <div class="text-bold text-center">📝 메뉴 상세 정보</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-input v-model="selectedMenu.menu_name" label="메뉴 이름" outlined dense />
              <q-input v-model="selectedMenu.route" label="메뉴 경로" outlined dense />
              <q-toggle v-model="selectedMenu.is_active" label="사용 여부" color="primary" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn v-if="isEditMode" label="새 메뉴 추가" color="secondary" @click="setAddMode" />
              <q-btn
                v-if="isEditMode"
                label="수정"
                color="primary"
                @click="updateMenu"
                :disable="!selectedMenuId"
              />
              <q-btn v-else label="추가" color="green" @click="addMenu" />
              <q-btn
                v-if="isEditMode"
                label="삭제"
                color="negative"
                @click="deleteMenu"
                :disable="!selectedMenuId"
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-card-section>
      <!-- 하단 적용 버튼 -->
      <q-card-actions align="right">
        <q-btn color="primary" label="적용" class="apply-btn" @click="saveChanges" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMenuStore } from '@/stores/menu'

const $q = useQuasar()
const menuStore = useMenuStore()

// 선택된 역할 및 역할 옵션
const selectedRole = ref(null)
const roleOptions = ref([])

// 관리 페이지 전용 메뉴 배열 (store와 동기화)
const allMenus = ref([])
const grantedMenus = ref([])

// 트리 체크된 항목들 및 선택된 메뉴
const selectedAllMenus = ref([])
const selectedGranted = ref([])
const selectedMenuId = ref(null)
const selectedMenu = ref({
  menu_name: '',
  route: '',
  is_active: true,
})

const isEditMode = ref(false)

// tick-strategy: 전체 선택 시 체크박스 숨김, 아니면 strict
const tickStrategy = computed(() => {
  return selectedRole.value && selectedRole.value.value === 'all' ? 'none' : 'strict'
})

// 전체 메뉴에 대해 이미 권한에 있는 메뉴는 disabled 처리
const allMenusWithDisable = computed(() => {
  return allMenus.value.map((m) => {
    const isGranted = grantedMenus.value.some((g) => +g.menu_id === +m.menu_id)
    return {
      ...m,
      disabled: isGranted,
      class: isGranted ? 'node-disabled clickable-label' : '',
    }
  })
})

function updateSelectedMenu() {
  isEditMode.value = true
  const menu = [...allMenus.value, ...grantedMenus.value].find(
    (menu) => menu.menu_id === selectedMenuId.value,
  )
  if (menu) {
    selectedMenu.value = { ...menu }
  }
}

function setAddMode() {
  isEditMode.value = false
  selectedMenuId.value = null
  selectedMenu.value = {
    menu_name: '',
    route: '',
    is_active: true,
  }
}

async function fetchRoles() {
  try {
    const response = await fetch('http://localhost:8000/api/roles')
    const roles = await response.json()
    roleOptions.value = [
      { label: '전체', value: 'all' },
      ...roles.map((role) => ({
        label: role.role_name,
        value: role.role_id,
      })),
    ]
    // 기본 선택을 '전체'로 설정하고 메뉴도 불러오기
    selectedRole.value = roleOptions.value[0]
    onRoleChange(selectedRole.value)
  } catch (error) {
    console.error('사용자 그룹 가져오기 실패:', error)
  }
}

// 역할 변경 시 store의 fetchMenusByRole 호출 후 로컬 변수에 반영
async function onRoleChange(newRole) {
  // 초기화
  selectedAllMenus.value = []
  selectedGranted.value = []
  selectedMenuId.value = null

  console.log('newRole.value', newRole.value)

  if (!newRole) return
  await menuStore.fetchMenusByRole(newRole.value)
  allMenus.value = menuStore.allMenus
  grantedMenus.value = menuStore.grantedMenus
}

function moveToGranted() {
  const selectedNodes = allMenus.value.filter((menu) =>
    selectedAllMenus.value.includes(menu.menu_id),
  )
  selectedNodes.forEach((menu) => {
    if (!grantedMenus.value.some((g) => g.menu_id === menu.menu_id)) {
      grantedMenus.value.push(menu)
    }
  })
  selectedAllMenus.value = []
}

// 순서 변경 함수
function moveUp(menuList, selectedMenus) {
  selectedMenus.forEach((menuId) => {
    const index = menuList.findIndex((m) => m.menu_id === menuId)
    if (index > 0) {
      ;[menuList[index], menuList[index - 1]] = [menuList[index - 1], menuList[index]]
    }
  })
}

function moveDown(menuList, selectedMenus) {
  for (let i = menuList.length - 1; i >= 0; i--) {
    if (selectedMenus.includes(menuList[i].menu_id) && i < menuList.length - 1) {
      ;[menuList[i], menuList[i + 1]] = [menuList[i + 1], menuList[i]]
    }
  }
}

function moveToUngranted() {
  grantedMenus.value = grantedMenus.value.filter(
    (menu) => !selectedGranted.value.includes(menu.menu_id),
  )
  selectedGranted.value = []
}

async function addMenu() {
  try {
    const response = await fetch('http://localhost:8000/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedMenu.value),
    })
    if (response.ok) {
      $q.notify({ type: 'positive', message: '메뉴가 추가되었습니다!' })
      await onRoleChange(selectedRole.value)
      isEditMode.value = true
    } else {
      throw new Error(`추가 실패: ${response.status}`)
    }
  } catch (error) {
    console.error('메뉴 추가 실패:', error)
    $q.notify({ type: 'negative', message: '메뉴 추가에 실패했습니다!' })
  }
}

async function updateMenu() {
  if (!selectedMenuId.value) return
  try {
    const response = await fetch(`http://localhost:8000/api/menus/${selectedMenuId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedMenu.value),
    })
    if (response.ok) {
      $q.notify({ type: 'positive', message: '메뉴 정보가 수정되었습니다!' })
      await onRoleChange(selectedRole.value)
    } else {
      throw new Error(`수정 실패: ${response.status}`)
    }
  } catch (error) {
    console.error('메뉴 수정 실패:', error)
    $q.notify({ type: 'negative', message: '메뉴 수정에 실패했습니다!' })
  }
}

async function deleteMenu() {
  if (!selectedMenuId.value) return
  try {
    const response = await fetch(`http://localhost:8000/api/menus/${selectedMenuId.value}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      $q.notify({ type: 'positive', message: '메뉴가 삭제되었습니다!' })
      await onRoleChange(selectedRole.value)
    } else {
      throw new Error(`삭제 실패: ${response.status}`)
    }
  } catch (error) {
    console.error('메뉴 삭제 실패:', error)
    $q.notify({ type: 'negative', message: '메뉴 삭제에 실패했습니다!' })
  }
}

async function saveChanges() {
  try {
    await fetch(`http://localhost:8000/api/menus/update-role-menus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role_id: selectedRole.value.value,
        menu_items: grantedMenus.value.map((m, index) => ({
          menu_id: m.menu_id,
          menu_order: index + 1,
        })),
      }),
    })
    $q.notify({ type: 'positive', message: '권한이 적용되었습니다!' })
  } catch (error) {
    console.error('권한 적용 실패:', error)
    $q.notify({ type: 'negative', message: '권한 적용에 실패했습니다!' })
  }
}

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
.menu-card {
  display: flex;
  flex-direction: column;
  max-width: 1300px;
  margin: auto;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
.menu-container {
  flex-wrap: nowrap;
}
.box-content,
.detail-box {
  height: 450px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 8px;
}
.menu-tree {
  max-height: 400px;
  overflow-y: auto;
}
.menu-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.apply-btn {
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
}
.full-width {
  width: 100%;
}
.node-disabled {
  opacity: 0.5;
}
.clickable-label {
  pointer-events: auto;
  cursor: pointer;
}
</style>
