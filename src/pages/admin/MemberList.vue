<template>
  <q-page class="q-pa-lg">
    <q-toolbar>
      <q-toolbar-title>회원 관리</q-toolbar-title>
    </q-toolbar>

    <div class="filter-container q-mb-md">
      <div class="filter-item">
        <label for="userId">ID</label>
        <q-input v-model="filterUserId" debounce="300" @keyup.enter="fetchMembers" id="userId" />
      </div>
      <div class="filter-item">
        <label for="name">이름</label>
        <q-input v-model="filterName" debounce="300" @keyup.enter="fetchMembers" id="name" />
      </div>
      <div class="filter-item">
        <label for="email">이메일</label>
        <q-input v-model="filterEmail" debounce="300" @keyup.enter="fetchMembers" id="email" />
      </div>
      <div class="filter-item">
        <label for="phone">전화번호</label>
        <q-input v-model="filterPhone" debounce="300" @keyup.enter="fetchMembers" id="phone" />
      </div>
      <div class="filter-item">
        <label for="approvalStatus">승인여부</label>
        <q-select
          v-model="filterApprovalStatus"
          :options="approvalStatusOptions"
          clearable
          :emit-value="true"
          :map-options="true"
          @keyup.enter="fetchMembers"
          class="approval-status-select"
          id="approvalStatus"
        />
      </div>
      <div class="filter-item">
        <label for="roleIds">권한</label>
        <q-select
          v-model="filterRoleIds"
          :options="roleOptions"
          clearable
          :emit-value="true"
          :map-options="true"
          multiple
          @keyup.enter="fetchMembers"
          class="role-select"
          id="roleIds"
        />
      </div>
      <div class="filter-item">
        <q-btn label="조회" color="primary" @click="fetchMembers" :loading="loading" />
      </div>
    </div>

    <div class="action-buttons q-mb-md">
      <q-btn
        label="회원 등록"
        color="primary"
        @click="registerMemberPopup = true"
        class="q-ml-md"
        v-if="isAdmin"
      />
      <q-btn
        v-if="isAdmin"
        label="승인처리"
        color="positive"
        @click="approveSelectedMembers"
        class="q-ml-md"
        :disabled="!selected.length"
      />
      <q-btn
        v-if="isAdmin"
        label="회원 삭제"
        color="negative"
        @click="deleteSelectedMembers"
        class="q-ml-md"
        :disabled="!selected.length"
      />
    </div>

    <!-- 테이블: 서버에서 받아온 현재 페이지 데이터만 표시 -->
    <q-table
      :rows="members"
      :columns="columns"
      row-key="user_id"
      :loading="loading"
      :selection="isAdmin ? 'multiple' : 'none'"
      v-model:selected="selected"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-approval_status="props">
        <q-td
          :props="props"
          :class="{
            'text-red': props.row.approval_status === 'N',
            'text-green': props.row.approval_status === 'Y',
          }"
        >
          {{ props.row.approval_status === 'Y' ? '승인' : '미승인' }}
        </q-td>
      </template>
      <template v-slot:body-cell-role_ids="props">
        <q-td :props="props">
          {{ getRoleNames(props.row.role_ids).join(', ') }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ formatDate(props.row.created_at) }}
        </q-td>
      </template>
    </q-table>

    <!-- 페이지네이션 + 페이지당 개수 선택 -->
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
          max-pages="5"
        ></q-pagination>
      </div>

      <!-- 페이지당 개수 선택 -->
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

    <!-- 회원 상세 모달 -->
    <q-dialog v-model="memberPopup">
      <UserInfoModal :userId="selectedMemberId" @close="handleClose" />
    </q-dialog>

    <!-- 회원등록 모달 -->
    <q-dialog v-model="registerMemberPopup">
      <RegisterPage @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import UserInfoModal from '@/pages/UserInfoModal.vue'
import { useQuasar } from 'quasar'

export default {
  components: {
    RegisterPage,
    UserInfoModal,
  },
  setup() {
    const $q = useQuasar()
    const loading = ref(true)

    // 필터 상태
    const filterUserId = ref('')
    const filterName = ref('')
    const filterEmail = ref('')
    const filterPhone = ref('')
    const filterApprovalStatus = ref('')
    const filterRoleIds = ref([])

    // 테이블 데이터 & 페이징
    const members = ref([]) // 서버에서 받은 현재 페이지 데이터
    const totalCount = ref(0) // 서버에서 받은 전체 데이터 개수
    const current = ref(1) // 현재 페이지
    const rowsPerPage = ref(10) // 한 페이지당 표시 개수

    // 총 페이지 수
    const totalPages = computed(() => Math.ceil(totalCount.value / rowsPerPage.value))

    // 선택된 행(회원)
    const selected = ref([])

    // 역할/권한
    const roles = ref(JSON.parse(sessionStorage.getItem('roles')) || [])
    const isAdmin = computed(() => roles.value.includes(0))

    const registerMemberPopup = ref(false)
    const memberPopup = ref(false)
    const selectedMemberId = ref(null)

    const approvalStatusOptions = [
      { label: '승인', value: 'Y' },
      { label: '미승인', value: 'N' },
    ]

    const roleOptions = [
      { label: '슈퍼관리자', value: 0 },
      { label: '관리자', value: 1 },
      { label: '일반사용자', value: 2 },
    ]

    // 테이블 컬럼 정의
    const columns = [
      { name: 'index', label: '순번', align: 'left', field: 'index', sortable: true },
      { name: 'user_id', label: 'ID', align: 'left', field: 'user_id', sortable: true },
      { name: 'name', label: '이름', align: 'left', field: 'name', sortable: true },
      { name: 'email', label: '이메일', align: 'left', field: 'email', sortable: true },
      { name: 'phone', label: '전화번호', align: 'left', field: 'phone', sortable: true },
      { name: 'address', label: '주소', align: 'left', field: 'address', sortable: true },
      {
        name: 'approval_status',
        label: '승인여부',
        align: 'left',
        field: 'approval_status',
        sortable: true,
      },
      {
        name: 'role_ids',
        label: '권한',
        align: 'left',
        field: 'role_ids',
      },
      {
        name: 'created_at',
        label: '가입일',
        align: 'left',
        field: 'created_at',
        sortable: true,
      },
    ]

    // 서버에서 현재 페이지 데이터만 받아오는 함수
    const fetchMembers = async () => {
      loading.value = true
      try {
        // 필터 + 페이징 파라미터
        const queryParams = new URLSearchParams({
          user_id: filterUserId.value.trim(),
          name: filterName.value.trim(),
          email: filterEmail.value.trim(),
          phone: filterPhone.value.trim(),
          approval_status: filterApprovalStatus.value || '',
          role_ids:
            filterRoleIds.value && filterRoleIds.value.length > 0
              ? filterRoleIds.value.join(',')
              : '',
          // 페이지 & 페이지당 개수
          page: current.value,
          limit: rowsPerPage.value,
        })

        const response = await fetch(`http://localhost:8000/api/users?${queryParams}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // 서버가 { items: [...], totalCount: ... } 형태로 응답한다고 가정
        const data = await response.json()

        // 현재 페이지 데이터
        members.value = data.items.map((member, index) => ({
          ...member,
          // 순번 필드는 (index + 1) 형태로 부여
          index: (current.value - 1) * rowsPerPage.value + index + 1,
        }))

        // 전체 데이터 개수
        totalCount.value = data.totalCount
      } catch (error) {
        console.error('데이터 불러오기 실패:', error)
      } finally {
        loading.value = false
      }
    }

    // 페이지나 rowsPerPage가 바뀔 때마다 다시 조회
    watch([current, rowsPerPage], () => {
      fetchMembers()
    })

    // 처음 진입 시 조회
    onMounted(() => {
      fetchMembers()
    })

    // 회원등록 / 상세 모달 닫힌 뒤 재조회
    const handleClose = async () => {
      registerMemberPopup.value = false
      memberPopup.value = false
      await fetchMembers()
    }

    // 날짜 포맷
    const formatDate = (timestamp) => {
      const date = new Date(timestamp)
      return date
        .toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\./g, '-')
    }

    // 권한명
    const getRoleNames = (roleIds) => {
      const roleNames = {
        0: '슈퍼관리자',
        1: '관리자',
        2: '일반사용자',
      }
      return roleIds.map((id) => roleNames[id] || '알 수 없음')
    }

    // 선택한 회원 삭제
    const deleteSelectedMembers = async () => {
      if (!isAdmin.value || selected.value.length === 0) return

      const confirmed = confirm('선택한 회원을 삭제하시겠습니까?')
      if (!confirmed) return

      try {
        const userIds = selected.value.map((member) => member.user_id)

        const response = await fetch(`http://localhost:8000/api/users/`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_ids: userIds }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        await fetchMembers()
        selected.value = []
      } catch (error) {
        console.error('회원 삭제 실패:', error)
      }
    }

    // 선택한 회원 승인
    const approveSelectedMembers = async () => {
      if (!isAdmin.value || selected.value.length === 0) return

      $q.dialog({
        title: '회원 승인',
        message: '선택한 회원을 승인하시겠습니까?',
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          try {
            const userIds = selected.value.map((member) => member.user_id)

            const response = await fetch(`http://localhost:8000/api/users/approve`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_ids: userIds }),
            })

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchMembers()
            selected.value = []
          } catch (error) {
            console.error('회원 승인 실패:', error)
          }
        })
        .onCancel(() => {
          console.log('승인 취소됨')
        })
    }

    return {
      loading,
      filterUserId,
      filterName,
      filterEmail,
      filterPhone,
      filterApprovalStatus,
      approvalStatusOptions,
      filterRoleIds,
      roleOptions,

      members,
      totalCount,
      current,
      rowsPerPage,
      totalPages,
      selected,
      isAdmin,

      columns,

      registerMemberPopup,
      memberPopup,
      selectedMemberId,

      fetchMembers,
      deleteSelectedMembers,
      approveSelectedMembers,
      handleClose,
      formatDate,
      getRoleNames,
    }
  },
}
</script>

<style scoped>
.text-red {
  color: red;
}

.text-green {
  color: green;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  align-items: center;
}

.filter-item {
  margin-bottom: 16px;
  min-width: 170px;
}

.filter-item:last-child {
  margin-left: auto; /* 마지막 필터 항목 오른쪽 정렬 */
  min-width: 20px;
}

.action-buttons {
  display: flex;
  margin-bottom: 20px;
  justify-content: flex-end; /* 오른쪽 정렬 */
}

.approval-status-select {
  min-width: 100px;
}

.role-select {
  min-width: 250px;
}
</style>
