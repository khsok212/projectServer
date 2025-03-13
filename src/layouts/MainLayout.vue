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
          <q-btn
            v-for="menu in menuStore.menuItems"
            :key="menu.menu_id"
            flat
            dense
            :label="menu.menu_name"
            @click="navigate(menu.route)"
            class="menu-button cursor-pointer"
          />
        </div>

        <div style="margin-left: auto">
          <q-btn
            v-if="authStore.isLoggedIn"
            flat
            dense
            :label="`${authStore.loginName} 님`"
            class="menu-button with-underline"
          />
          <q-btn
            flat
            dense
            :label="authStore.isLoggedIn ? '로그아웃' : '로그인'"
            @click="handleAuthAction"
            class="menu-button cursor-pointer"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Examples </q-item-label>
        <EssentialLink title="test" icon="edit" link="/examples/testPage" />
        <EssentialLink title="icon" icon="edit" link="/examples/iconPage" />
        <EssentialLink title="input" icon="edit" link="/examples/inputPage" />
        <EssentialLink title="selbox" icon="edit" link="/examples/selboxPage" />
        <EssentialLink title="etc" icon="edit" link="/examples/etcPage" />
        <EssentialLink title="chartjs" icon="edit" link="/examples/chartPage" />
        <EssentialLink title="echartjs" icon="edit" link="/examples/echartPage" />
        <EssentialLink title="echartjs1" icon="edit" link="/examples/echartPage1" />
        <EssentialLink title="table" icon="edit" link="/examples/tablePage" />
        <EssentialLink title="tabulatorPage" icon="edit" link="/examples/tabulatorPage" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <UserInfoModal v-if="userInfoModalOpen" v-model="userInfoModalOpen" />
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import UserInfoModal from 'pages/UserInfoModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { usePermissionStore } from '@/stores/permissionStore'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const menuStore = useMenuStore()
const permissionStore = usePermissionStore()

const leftDrawerOpen = ref(false)
const userInfoModalOpen = ref(false)

function navigate(route) {
  router.push(route)
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function onLogoClick() {
  router.push({ path: '/' })
}

function handleAuthAction() {
  if (authStore.isLoggedIn) {
    logout()
  } else {
    router.push('/login')
  }
}

async function logout() {
  try {
    await fetch('http://localhost:8000/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: authStore.user.user_id }),
    })

    $q.notify({ message: '로그아웃이 되었습니다.', color: 'green', position: 'top' })
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }

  // ✅ 권한 및 메뉴 초기화
  menuStore.clearMenus()
  permissionStore.clearPermissions()
  authStore.logout()
}

// ✅ 로그인 상태 변경 감지
watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn) {
      await permissionStore.fetchPermissions()
      await menuStore.fetchMenus()
    } else {
      menuStore.clearMenus()
      permissionStore.clearPermissions()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await authStore.restoreSession()
  if (authStore.isLoggedIn) {
    await permissionStore.fetchPermissions()
    await menuStore.fetchMenus()
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
.with-underline {
  position: relative;
}
.with-underline::after {
  content: '';
  display: block;
  height: 2px;
  background-color: #1976d2;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 0.3s;
}
.with-underline:hover::after {
  background-color: #004080;
}
.cursor-pointer,
.cursor-pointer img {
  cursor: pointer !important;
}
</style>
