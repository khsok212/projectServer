<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-2 rounded-borders" style="width: 100%; max-width: 450px">
      <q-card-section>
        <div class="text-h5 text-center">로그인</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="user_id" label="아이디" type="text" outlined @keyup.enter="login" />
        <q-input
          v-model="password"
          label="비밀번호"
          type="password"
          outlined
          class="q-mt-md"
          @keyup.enter="login"
        />
      </q-card-section>

      <q-card-actions class="q-mt-md flex flex-center">
        <q-btn label="로그인" color="primary" @click="login" class="full-width" />
      </q-card-actions>

      <q-card-section class="text-center">
        <q-btn flat label="회원가입" color="blue" @click="showRegisterModal = true" />
      </q-card-section>
    </q-card>

    <!-- 회원가입 모달 -->
    <q-dialog v-model="showRegisterModal">
      <RegisterPage @close="showRegisterModal = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import RegisterPage from '@/pages/RegisterPage.vue'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  components: {
    RegisterPage,
  },
  setup() {
    const user_id = ref('')
    const password = ref('')
    const showRegisterModal = ref(false)
    const router = useRouter()
    const $q = useQuasar()
    const authStore = useAuthStore()

    const login = async () => {
      try {
        const response = await fetch(`http://localhost:8000/login/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id.value.trim(),
            password: password.value,
          }),
        })

        if (response.ok) {
          const result = await response.json()

          if (result.status === 'block') {
            $q.notify({
              message: '차단된 IP 사용자입니다.',
              color: 'red',
              position: 'top',
            })
            return
          }

          // 토큰 만료 시간(ms) 계산 (예: 30분 후)
          const expireMin = result.token_expire_min
          const expireTimestamp = Date.now() + expireMin * 60 * 1000

          // authStore를 통해 로그인 정보 저장 및 자동 로그아웃 타이머 설정
          authStore.login(expireTimestamp, result.roles, result.user)

          $q.notify({
            message: result.message,
            color: 'green',
            position: 'top',
          })

          router.push('/')
        } else {
          console.error('로그인 실패:', response.statusText)
          $q.dialog({
            title: '로그인 실패',
            message: '사용자 ID 또는 비밀번호를 확인하세요.',
            color: 'red',
            icon: 'warning',
            ok: {
              label: '확인',
              color: 'negative',
            },
          })
        }
      } catch (error) {
        console.error('로그인 중 오류 발생:', error)
        $q.dialog({
          title: '로그인 오류',
          message: '로그인 중 오류가 발생했습니다.',
          color: 'red',
          icon: 'warning',
          ok: {
            label: '확인',
            color: 'negative',
          },
        })
      }
    }

    return {
      user_id,
      password,
      showRegisterModal,
      login,
    }
  },
})
</script>
