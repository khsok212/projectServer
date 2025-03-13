// routerGuard.js
import pinia from '@/plugins/pinia'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { usePermissionStore } from '@/stores/permissionStore'

export async function guardRoute(to, from, next) {
  const authStore = useAuthStore(pinia)
  const menuStore = useMenuStore(pinia)
  const permissionStore = usePermissionStore(pinia)

  // ✅ 세션 복원 먼저 실행
  await authStore.restoreSession()

  // ✅ 권한 및 승인 상태 업데이트 (비동기 호출)
  await permissionStore.fetchPermissions()

  console.log('🔹 authStore.isLoggedIn:', authStore.isLoggedIn)
  console.log('🔹 permissionStore.isApproved:', permissionStore.isApproved)
  console.log('🔹 permissionStore.hasAdminAccess:', permissionStore.hasAdminAccess)
  console.log('🔹 permissionStore.roles:', permissionStore.roles)

  // ✅ 로그인 여부 확인
  if (!authStore.isLoggedIn) {
    if (to.path === '/login' || to.path === '/welcome' || to.path.startsWith('/examples/')) {
      next()
    } else {
      next({ path: '/welcome' })
    }
    return
  }

  // ✅ 승인 여부 체크 (승인되지 않은 사용자는 승인 요청 페이지로 이동)
  if (!permissionStore.isApproved) {
    if (to.path !== '/request') {
      next({ path: '/request' })
    } else {
      next()
    }
    return
  }

  // ✅ 승인된 사용자가 `/welcome`에 접근하면 `/approval`로 이동
  if (permissionStore.isApproved && to.path === '/welcome') {
    next({ path: '/approval' })
    return
  }

  // ✅ 관리자 페이지 접근 제한 (권한 확인)
  if (to.path.startsWith('/admin/')) {
    if (permissionStore.hasAdminAccess) {
      next()
    } else {
      next({ path: '/' })
    }
    return
  }

  // ✅ 관리자 권한이 있는 경우, `/admin/dashboard`로 리다이렉트
  if (permissionStore.hasAdminAccess && to.path === '/approval') {
    next({ path: '/admin/dashboard' })
    return
  }

  // ✅ 메뉴 데이터 가져오기 (세션이 복원된 후 실행)
  if (authStore.isLoggedIn) {
    const roleIds = authStore.roles.join(',')
    menuStore.fetchMenus(roleIds)
  }

  // ✅ 기본적으로 허용
  next()
}
