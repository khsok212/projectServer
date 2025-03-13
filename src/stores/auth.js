// src/stores/auth.js
import { defineStore } from 'pinia'
import { useMenuStore } from '@/stores/menu'
import { usePermissionStore } from '@/stores/permissionStore'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    roles: [],
    tokenExpireTime: 0, // 토큰 만료 시각 (초 단위)
    tokenExpirationInterval: null, // 자동 로그아웃 체크 interval ID
  }),

  getters: {
    isLoggedIn: (state) => Object.keys(state.user).length > 0,
    loginName: (state) => state.user?.name || '',
  },

  actions: {
    async login(expireTimestamp, roles, user) {
      this.tokenExpireTime = expireTimestamp
      this.roles = roles
      this.user = user

      sessionStorage.setItem('roles', JSON.stringify(roles))
      sessionStorage.setItem('user', JSON.stringify(user))
      sessionStorage.setItem('token_expire_time', expireTimestamp.toString())

      const permissionStore = usePermissionStore()
      await permissionStore.fetchPermissions() // 로그인 후 권한 업데이트

      const menuStore = useMenuStore()
      const roleIds = Array.isArray(roles) ? roles.join(',') : roles
      menuStore.fetchMenus(roleIds)

      this.startTokenExpirationCheck()
    },

    async restoreSession() {
      const storedExpireTime = Number(sessionStorage.getItem('token_expire_time'))
      const storedRoles = JSON.parse(sessionStorage.getItem('roles') || '[]')
      const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}')

      if (storedExpireTime) {
        this.tokenExpireTime = storedExpireTime
        this.roles = storedRoles
        this.user = storedUser
      }

      const permissionStore = usePermissionStore()
      await permissionStore.fetchPermissions()

      if (this.tokenExpireTime) {
        this.startTokenExpirationCheck()
      }
    },

    logout() {
      this.user = {}
      this.roles = []
      this.tokenExpireTime = 0

      if (this.tokenExpirationInterval) {
        clearInterval(this.tokenExpirationInterval)
        this.tokenExpirationInterval = null
      }

      sessionStorage.removeItem('roles')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token_expire_time')

      const permissionStore = usePermissionStore()
      permissionStore.clearPermissions()

      const menuStore = useMenuStore()
      menuStore.clearMenus()

      router.push('/login')
    },

    startTokenExpirationCheck() {
      if (!this.tokenExpireTime) return

      // 기존 타이머가 있으면 클리어
      if (this.tokenExpirationInterval) {
        clearInterval(this.tokenExpirationInterval)
      }

      // 1분(60000ms)마다 현재 시간과 비교
      this.tokenExpirationInterval = setInterval(() => {
        const currentTime = Date.now() // 현재 시간(밀리초 단위)
        console.log('currentTime', currentTime)
        console.log('this.tokenExpireTime', this.tokenExpireTime)
        if (currentTime >= this.tokenExpireTime) {
          this.logout()
        }
      }, 60000)
    },
  },
})
