// src/stores/permissionStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    roles: [],
    isApproved: false,
  }),

  getters: {
    hasAdminAccess: (state) => state.roles.includes(0) || state.roles.includes(1),
  },

  actions: {
    async fetchPermissions() {
      const authStore = useAuthStore()

      // ✅ 로그인이 되어있을 때만 실행
      if (authStore.isLoggedIn) {
        this.roles = authStore.roles
        this.isApproved = authStore.user.approval_status === 'Y'
      } else {
        this.clearPermissions()
      }
    },

    clearPermissions() {
      this.roles = []
      this.isApproved = false
    },
  },
})
