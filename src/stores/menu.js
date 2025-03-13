// src/stores/menu.js
import { defineStore } from 'pinia'
import { usePermissionStore } from '@/stores/permissionStore'
import _ from 'lodash'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    // MainLayout 에서 사용할 메뉴 (로그인한 사용자 권한 기반)
    menuItems: [],
    // MenuManagement 에서 사용할 데이터
    allMenus: [],
    grantedMenus: [],
    ungrantedMenus: [],
  }),
  actions: {
    // 로그인 사용자의 메뉴 불러오기 (메인 레이아웃)
    async fetchMenus() {
      try {
        const permissionStore = usePermissionStore()
        // 승인되지 않은 경우 빈 배열 처리
        if (!permissionStore.isApproved) {
          this.menuItems = []
          return
        }
        const roleIds = permissionStore.roles.join(',')
        console.log('roleIds', roleIds)
        if (!roleIds) return

        const response = await fetch(`http://localhost:8000/get_menus?role_id=${roleIds}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()
        console.log('data', data)

        this.menuItems = data
      } catch (error) {
        console.error('메뉴 불러오기 실패:', error)
      }
    },

    // 관리 화면에서 선택된 역할에 따른 메뉴 불러오기 (전체, 권한 분리)
    async fetchMenusByRole(roleId) {
      try {
        // 초기화
        this.allMenus = []
        this.grantedMenus = []
        this.ungrantedMenus = []

        if (_.isNil(roleId)) return

        if (roleId === 'all') {
          const response = await fetch('http://localhost:8000/api/menus/all')
          const data = await response.json()
          this.allMenus = data.menus || []
          // 전체 선택일 경우, grantedMenus는 빈 배열, ungrantedMenus는 전체 메뉴로 설정
          this.grantedMenus = []
          this.ungrantedMenus = data.menus || []
        } else {
          const response = await fetch(`http://localhost:8000/api/menus/by-role/${roleId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          const data = await response.json()
          this.allMenus = data.all_menus || []
          this.grantedMenus = data.granted_menus || []
          this.ungrantedMenus = data.ungranted_menus || []
        }
      } catch (error) {
        console.error('메뉴 불러오기 실패:', error)
      }
    },

    clearMenus() {
      this.menuItems = []
      this.allMenus = []
      this.grantedMenus = []
      this.ungrantedMenus = []
    },
  },
})
