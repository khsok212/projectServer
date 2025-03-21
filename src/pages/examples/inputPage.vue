<template>
  <q-page class="q-pa-md">
    <!-- Input 영역 -->
    <div class="q-gutter-md input-section">
      <q-toolbar>
        <q-toolbar-title>Input</q-toolbar-title>
      </q-toolbar>

      <!-- 기본 입력 필드 -->
      <div class="input-wrapper">
        <q-input class="custom-input" v-model="text" label="Standard" />
        <div class="input-value">{{ text }}</div>
      </div>

      <!-- 채운 입력 필드 -->
      <div class="input-wrapper">
        <q-input class="custom-input" filled v-model="text" label="Filled" />
        <div class="input-value">{{ text }}</div>
      </div>

      <!-- 외곽선 입력 필드 -->
      <div class="input-wrapper">
        <q-input class="custom-input" outlined v-model="text" label="Outlined" />
        <div class="input-value">{{ text }}</div>
      </div>

      <!-- 강조 입력 필드 -->
      <div class="input-wrapper">
        <q-input class="custom-input" standout v-model="text" label="Standout" />
        <div class="input-value">{{ text }}</div>
      </div>

      <!-- 커스터마이징 된 강조 입력 필드 -->
      <div class="input-wrapper">
        <q-input
          class="custom-input"
          standout="bg-teal text-white"
          v-model="text"
          label="Custom standout"
        />
        <div class="input-value">{{ text }}</div>
      </div>

      <div class="input-wrapper">
        <q-input clearable filled color="purple-12" v-model="text" label="Label"></q-input>
        <div class="input-value">{{ text }}</div>
      </div>

      <div class="input-wrapper">
        <!-- clear-icon -->
        <q-input
          clearable
          clear-icon="close"
          filled
          color="purple-12"
          v-model="text"
          label="Label"
        ></q-input>
        <div class="input-value">{{ text }}</div>
      </div>
    </div>

    <!-- Filled 영역 -->
    <div class="q-gutter-md filled-section">
      <q-toolbar>
        <q-toolbar-title>Filled</q-toolbar-title>
      </q-toolbar>
      <q-toggle v-model="dense" label="Dense QInput"></q-toggle>
      <div>dense 사용 시 : 입력 필드나 버튼이 더 좁고 작은 크기로 렌더링</div>

      <!-- 여러가지 입력 필드들 -->
      <q-input class="custom-input" filled v-model="text" :dense="dense"></q-input>
      <q-input
        class="custom-input"
        filled
        v-model="text"
        label="Label (stacked)"
        stack-label
        :dense="dense"
      ></q-input>
      <q-input class="custom-input" filled v-model="text" label="Label" :dense="dense"></q-input>
      <q-input
        class="custom-input"
        filled
        square
        v-model="text"
        hint="With perfect square borders"
        :dense="dense"
      ></q-input>
      <q-input class="custom-input" filled v-model="text" :dense="dense">
        <template v-slot:prepend>
          <q-icon name="event"></q-icon>
        </template>
      </q-input>

      <q-input
        class="custom-input"
        filled
        bottom-slots
        v-model="text"
        label="Label"
        counter
        :dense="dense"
      >
        <template v-slot:prepend>
          <q-icon name="place"></q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer"></q-icon>
        </template>
        <template v-slot:hint> Field hint </template>
      </q-input>

      <q-input
        class="custom-input"
        filled
        v-model="text"
        hint="Disable"
        :dense="dense"
        disable
      ></q-input>
      <q-input
        class="custom-input"
        filled
        v-model="text"
        hint="Readonly"
        :dense="dense"
        readonly
      ></q-input>
      <q-input
        class="custom-input"
        filled
        v-model="text"
        hint="Disable and readonly"
        :dense="dense"
        disable
        readonly
      ></q-input>
    </div>

    <!-- Clearable 영역 -->
    <div class="q-gutter-md inputtype-section">
      <q-toolbar>
        <q-toolbar-title>Input</q-toolbar-title>
      </q-toolbar>
      <q-badge color="secondary">Phone model: "{{ phone }}"</q-badge>
      <q-input
        class="custom-input"
        filled
        v-model="phone"
        label="Phone"
        mask="### - #### - ####"
        unmasked-value
        hint="Mask: ### - #### - ####"
      ></q-input>

      <q-badge color="secondary">Card model: "{{ card }}"</q-badge>
      <q-input
        filled
        v-model="card"
        label="Card"
        mask="#### - #### - #### - ####"
        fill-mask="#"
        unmasked-value
        hint="Mask: #### - #### - #### - ####"
      ></q-input>

      <q-input
        filled
        v-model="model"
        label="Type here"
        bottom-slots
        hint="Max 3 characters"
        error-message="Please use maximum 3 characters"
        :error="!isValid"
      ></q-input>

      <q-input
        v-model="text"
        label="이름 입력"
        maxlength="3"
        counter
        hint="최대 3자까지 입력 가능"
      />

      <!-- 날짜 입력 필드 -->
      <div class="custom-input">
        <!-- 날짜 선택 필드 -->
        <q-input
          v-model="selectedDate"
          label="Select a Date"
          mask="####-##-##"
          fill-mask
          readonly
          @focus="showDatePicker1 = true"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click="showDatePicker1 = true" />
          </template>

          <!-- Date Picker 팝업 -->
          <q-popup-proxy v-model="showDatePicker1" transition-show="scale" transition-hide="scale">
            <q-date
              v-model="selectedDate"
              color="yellow"
              text-color="black"
              mask="YYYY-MM-DD"
              emit-immediately
              @update:model-value="updateDate"
            />
          </q-popup-proxy>
        </q-input>

        <!-- 선택된 날짜 출력 -->
        <div v-if="selectedDate">
          <p>
            Selected Date: <strong>{{ selectedDate }}</strong>
          </p>
        </div>
      </div>

      <!-- 날짜 입력 필드 -->
      <div class="custom-input">
        <q-input
          v-model="formattedDateRange"
          label="Select Date Range"
          readonly
          filled
          @focus="showDatePicker = true"
        >
          <template v-slot:prepend>
            <q-icon name="event"></q-icon>
          </template>
        </q-input>

        <!-- Date Picker 팝업 -->
        <q-popup-proxy v-model="showDatePicker" transition-show="scale" transition-hide="scale">
          <q-date
            v-model="selectedDateRange"
            :min="minDate"
            :max="maxDate"
            range
            color="primary"
            mask="YYYY-MM-DD"
          />
        </q-popup-proxy>
      </div>

      <div class="q-mb-sm">
        <q-badge color="teal"> Model: {{ date }} </q-badge>
      </div>

      <q-btn icon="event" round color="primary">
        <q-popup-proxy
          @before-show="updateProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="proxyDate">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup></q-btn>
              <q-btn label="OK" color="primary" flat @click="save" v-close-popup></q-btn>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const text = ref('')
    const dense = ref(true)
    const phone = ref('')
    const card = ref('')
    const model = ref('')

    // 선택된 날짜
    const selectedDate = ref('')

    // DatePicker 팝업을 보여줄지 여부
    const showDatePicker1 = ref(false)

    // 날짜 업데이트 함수
    const updateDate = (val) => {
      selectedDate.value = val
      showDatePicker1.value = false // 날짜 선택 후 팝업 닫기
    }

    // 범위
    // 시작일과 종료일을 선택할 변수
    const selectedDateRange = ref({ from: '', to: '' })

    // 날짜 선택 팝업을 보여줄지 여부를 결정하는 변수
    const showDatePicker = ref(false)

    // 날짜 범위 설정
    const minDate = ref('2024-01-01') // 최소 날짜
    const maxDate = ref('2025-12-31') // 최대 날짜

    const formattedDateRange = computed(() => {
      if (selectedDateRange.value?.from && selectedDateRange.value?.to) {
        return `${selectedDateRange.value?.from} ~ ${selectedDateRange.value?.to}`
      }
      return 'Select Date Range'
    })

    const date = ref('2019/03/01')
    const proxyDate = ref('2019/03/01')

    function updateProxy() {
      proxyDate.value = date.value
    }

    function save() {
      date.value = proxyDate.value
    }

    return {
      text,
      dense,
      phone,
      card,
      model,
      isValid: computed(() => model.value.length <= 3),
      filterLoginDate: ref(''), // 날짜 필터
      selectedDateRange,
      showDatePicker,
      minDate,
      maxDate,
      showDatePicker1,
      selectedDate,
      updateDate,
      formattedDateRange,
      date,
      proxyDate,
      updateProxy,
      save,
    }
  },
}
</script>

<style scoped>
.q-gutter-md {
  max-width: 1000px;
  margin: 0 auto;
}

/* Input Section */
.input-section {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between; /* 요소들 간의 간격을 일정하게 유지 */
}

.custom-input {
  flex-grow: 1;
  width: 400px; /* 모든 입력 필드의 width를 동일하게 설정 */
}

.input-value {
  width: 400px;
  margin-left: 10px;
  font-size: 1.1em;
  color: #0077b6;
  font-weight: bold;
  white-space: nowrap; /* 텍스트가 한 줄로만 표시되도록 함 */
  text-overflow: ellipsis; /* 텍스트가 너무 길면 ... 처리 */
  overflow: hidden; /* 텍스트가 영역을 넘지 않도록 함 */
}

/* Filled Section */
.filled-section {
  padding: 20px;
  background-color: #e8f4f8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.inputtype-section {
  padding: 20px;
  background-color: #e9e9e9e1;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>
