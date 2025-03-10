<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: white; color: black">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-img
          src="icons/cncitylogo.png"
          style="width: 120px; height: 50px; margin-left: 20px"
          alt="Logo"
          class="cursor-pointer"
          @click="onLogoClick"
        />

        <div class="q-toolbar__menu">
          <!-- 조건부 렌더링: roles 배열에 0이 포함되어 있을 때만 표시 -->
          <q-btn
            v-if="hasMemberManagementRole"
            flat
            dense
            label="회원 관리"
            @click="goToMemberManagement"
            class="menu-button"
          />

          <q-btn
            v-if="hasMemberManagementRole"
            flat
            dense
            label="접속 이력"
            @click="goToAccessHistory"
            class="menu-button"
          />

          <q-btn
            v-if="hasMemberManagementRole"
            flat
            dense
            label="접속 이력(페이징처리)"
            @click="goToNewAccessHistory"
            class="menu-button"
          />
        </div>

        <div style="margin-left: auto">
          <!-- 로그인된 사용자 이름 표시 -->
          <q-btn
            v-if="isLoggedIn"
            flat
            dense
            :label="`${loginName} 님`"
            class="menu-button with-underline"
            @click="openUserInfoModal"
          />

          <q-btn
            flat
            dense
            :label="isLoggedIn ? '로그아웃' : '로그인'"
            @click="isLoggedIn ? logout() : goToLoginPage()"
            class="menu-button"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Examples </q-item-label>
        <!-- <EssentialLink title="Quasar Docs" icon="school" link="https://quasar.dev" /> -->
        <!-- 개발모음 quasar -->
        <EssentialLink title="test" icon="edit" link="/examples/testPage" />
        <EssentialLink title="icon" icon="edit" link="/examples/iconPage" />
        <EssentialLink title="input" icon="edit" link="/examples/inputPage" />
        <EssentialLink title="selbox" icon="edit" link="/examples/selboxPage" />
        <EssentialLink title="etc" icon="edit" link="/examples/etcPage" />
        <EssentialLink title="chartjs" icon="edit" link="/examples/chartPage" />
        <EssentialLink title="echartjs" icon="edit" link="/examples/echartPage" />
        <EssentialLink title="echartjs1" icon="edit" link="/examples/echartPage1" />
        <EssentialLink title="table" icon="edit" link="/examples/tablePage" />

        <!-- <EssentialLink title="접속 이력" icon="history" link="/admin/accessHistory" /> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :loginSuccess="loginSuccess" />
    </q-page-container>

    <UserInfoModal v-if="userInfoModalOpen" v-model="userInfoModalOpen" />
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'
import UserInfoModal from 'pages/UserInfoModal.vue'

const $q = useQuasar()
const router = useRouter()

// sessionStorage에서 초기화 (없으면 빈 배열/객체, 만료 시각은 0)
const roles = ref(JSON.parse(sessionStorage.getItem('roles')) || [])
const user = ref(JSON.parse(sessionStorage.getItem('user')) || {})
// tokenExpireTime: JWT 토큰이 만료되는 시각 (밀리초 단위 타임스탬프)
const tokenExpireTime = ref(0)

const leftDrawerOpen = ref(false)
const userInfoModalOpen = ref(false)
const logoutTimer = ref(null)
const GRACE_PERIOD = 5000 // 5초 여유

// 자동 로그아웃 타이머 설정 함수
const setupAutoLogout = () => {
  if (!tokenExpireTime.value) return

  const remainingTime = tokenExpireTime.value - Date.now() - GRACE_PERIOD
  console.log('remainingTime', remainingTime)
  if (remainingTime <= 0) {
    logout() // 이미 만료된 경우 즉시 로그아웃
  } else {
    logoutTimer.value = setTimeout(() => {
      logout()
    }, remainingTime)
  }
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goToMemberManagement() {
  router.push({ path: '/admin/memberList' })
}

function goToAccessHistory() {
  router.push({ path: '/admin/accessHistory' })
}

function goToNewAccessHistory() {
  router.push({ path: '/admin/newAccessHistory' })
}

function goToLoginPage() {
  router.push({ path: '/login' })
}

function onLogoClick() {
  router.push({ path: '/' })
}

const isLoggedIn = computed(() => Object.keys(user.value).length > 0)
const loginName = computed(() => (user.value ? user.value.name : ''))

// 권한 체크: roles 배열에 0(슈퍼관리자) 또는 1(관리자)와 승인 상태가 'Y'인 경우
const hasMemberManagementRole = computed(() => {
  return roles.value.includes(0) || (roles.value.includes(1) && user.value.approval_status === 'Y')
})

// 로그아웃 함수: 로그아웃 API 호출 후 세션스토리지와 반응형 변수 초기화
async function logout() {
  const logoutHistory = {
    user_id: user.value.user_id,
    request_path: '/logout',
    memo: '로그아웃 성공',
  }

  try {
    const response = await fetch('http://localhost:8000/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logoutHistory),
    })

    if (response.status === 401) {
      $q.notify({
        message: '세션이 종료되었습니다.',
        color: 'red',
        position: 'top',
      })
    } else if (!response.ok) {
      throw new Error(`Failed to log out history: ${response.status}`)
    } else {
      $q.notify({
        message: '로그아웃이 되었습니다.',
        color: 'green',
        position: 'top',
      })
    }

    router.push('/login')
  } catch (error) {
    console.error('Error logging out history:', error)
    $q.notify({
      message: '로그아웃에 실패하였습니다.',
      color: 'red',
      position: 'top',
    })
  }

  sessionStorage.removeItem('roles')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('token_expire_time')

  roles.value = []
  user.value = {}
  tokenExpireTime.value = ref(0)
}

// 로그인 성공 시 호출되는 함수
// expireTimestamp: 토큰 만료 시각(밀리초 단위), newRoles: 역할 배열, newUser: 사용자 정보(JSON 문자열)
function loginSuccess(expireTimestamp, newRoles, newUser) {
  sessionStorage.setItem('roles', JSON.stringify(newRoles))
  sessionStorage.setItem('user', newUser)
  sessionStorage.setItem('token_expire_time', expireTimestamp.toString())

  roles.value = newRoles
  user.value = JSON.parse(newUser) || {}
  tokenExpireTime.value = Number(expireTimestamp) || 0

  setupAutoLogout() // 로그인 후 타이머 재설정
}

function openUserInfoModal() {
  userInfoModalOpen.value = true
}

onMounted(() => {
  // 페이지 로드 시 sessionStorage에서 토큰 만료 시각을 읽어 타이머를 설정
  const storedExpireTime = Number(sessionStorage.getItem('token_expire_time'))
  if (storedExpireTime) {
    tokenExpireTime.value = storedExpireTime
    setupAutoLogout()
  }
})

onUnmounted(() => {
  if (logoutTimer.value) {
    clearTimeout(logoutTimer.value)
  }
})
</script>

<style>
.q-toolbar__menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 100%;
}

.menu-button {
  margin-left: 10px;
  font-weight: bold;
  color: #333;
  height: 100%;
  padding: 10px;
}

.menu-button:hover {
  color: #1976d2;
  transition: color 0.3s;
}

/* 밑줄 스타일을 위한 클래스 추가 */
.with-underline {
  position: relative;
}

.with-underline::after {
  content: '';
  display: block;
  height: 2px; /* 밑줄 두께 */
  background-color: #1976d2; /* 밑줄 색상 */
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0; /* 버튼의 하단에 위치 */
  transition: all 0.3s;
}

.with-underline:hover::after {
  background-color: #004080; /* 마우스 오버 시 밑줄 색상 변경 */
}
</style>
