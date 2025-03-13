// src/router/index.js
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import { guardRoute } from './routerGuard'
import routes from './routes'

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.VUE_ROUTER_BASE),
})

// ✅ 라우터 가드 추가
router.beforeEach(guardRoute)

// ✅ 라우터 인스턴스를 export
export default router
