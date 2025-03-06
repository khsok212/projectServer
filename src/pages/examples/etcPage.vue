<template>
  <q-page class="q-pa-md">
    <!-- Filled 영역 -->
    <div class="q-gutter-md filled-section">
      <q-toolbar>
        <q-toolbar-title>checkBox</q-toolbar-title>
      </q-toolbar>

      <div class="q-gutter-sm">
        <q-checkbox v-model="teal" label="Teal" color="teal"></q-checkbox>
        <q-checkbox v-model="orange" label="Orange" color="orange"></q-checkbox>
        <q-checkbox v-model="red" label="Red" color="red"></q-checkbox>
        <q-checkbox v-model="cyan" label="Cyan" color="cyan"></q-checkbox>
      </div>

      <div class="q-gutter-sm">
        <q-checkbox v-model="selection" val="teal" label="Teal" color="teal"></q-checkbox>
        <q-checkbox v-model="selection" val="orange" label="Orange" color="orange"></q-checkbox>
        <q-checkbox v-model="selection" val="red" label="Red" color="red"></q-checkbox>
        <q-checkbox v-model="selection" val="cyan" label="Cyan" color="cyan"></q-checkbox>
      </div>

      <div class="q-px-sm">
        The model data: <strong>{{ selection }}</strong>
      </div>

      <div class="q-gutter-sm">
        <q-checkbox size="xs" v-model="shape" val="xs" label="Size 'xs'"></q-checkbox>
        <q-checkbox size="sm" v-model="shape" val="sm" label="Size 'sm'"></q-checkbox>
        <q-checkbox size="md" v-model="shape" val="md" label="Size 'md'"></q-checkbox>
        <q-checkbox size="lg" v-model="shape" val="lg" label="Size 'lg'"></q-checkbox>
        <q-checkbox size="xl" v-model="shape" val="xl" label="Size 'xl'"></q-checkbox>

        <!-- custom size -->
        <q-checkbox size="150px" v-model="shape" val="150px" label="Size '150px'"></q-checkbox>
      </div>

      <div class="q-gutter-sm">
        <q-checkbox
          v-model="customModel"
          color="secondary"
          label="Do you agree with the terms & conditions?"
          true-value="yes"
          false-value="no"
        ></q-checkbox>
      </div>

      <div class="q-px-sm">
        The model data: <strong>'{{ customModel }}'</strong>
      </div>

      <div class="q-pa-md">
        <q-option-group :options="options" type="checkbox" v-model="group"></q-option-group>
      </div>
    </div>

    <!-- Clearable 영역 -->
    <div class="q-gutter-md inputtype-section">
      <q-toolbar>
        <q-toolbar-title>radio</q-toolbar-title>
      </q-toolbar>

      <div class="q-gutter-sm">
        <q-radio v-model="shapeCheck" val="line" label="Line"></q-radio>
        <q-radio v-model="shapeCheck" val="rectangle" label="Rectangle"></q-radio>
        <q-radio v-model="shapeCheck" val="ellipse" label="Ellipse"></q-radio>
        <q-radio v-model="shapeCheck" val="polygon" label="Polygon"></q-radio>
      </div>

      <div class="q-gutter-sm">
        <q-radio left-label v-model="shapeCheck" val="line" label="Line"></q-radio>
        <q-radio left-label v-model="shapeCheck" val="rectangle" label="Rectangle"></q-radio>
        <q-radio left-label v-model="shapeCheck" val="ellipse" label="Ellipse"></q-radio>
        <q-radio left-label v-model="shapeCheck" val="polygon" label="Polygon"></q-radio>
      </div>

      <div class="q-px-sm">
        Your selection is: <strong>{{ shapeCheck }}</strong>
      </div>

      <div class="q-gutter-sm">
        <q-radio v-model="color" val="teal" label="Teal" color="teal"></q-radio>
        <q-radio v-model="color" val="orange" label="Orange" color="orange"></q-radio>
        <q-radio v-model="color" val="red" label="Red" color="red"></q-radio>
        <q-radio v-model="color" val="cyan" label="Cyan" color="cyan"></q-radio>
      </div>
      <div class="q-gutter-sm">
        <q-radio keep-color v-model="color" val="teal" label="Teal" color="teal"></q-radio>
        <q-radio keep-color v-model="color" val="orange" label="Orange" color="orange"></q-radio>
        <q-radio keep-color v-model="color" val="red" label="Red" color="red"></q-radio>
        <q-radio keep-color v-model="color" val="cyan" label="Cyan" color="cyan"></q-radio>
      </div>
      <div class="q-px-sm q-mt-sm">
        Your selection is: <strong>{{ color }}</strong>
      </div>

      <div class="q-gutter-sm">
        <q-radio size="xs" v-model="shapeSize" val="xs" label="Size 'xs'"></q-radio>
        <q-radio size="sm" v-model="shapeSize" val="sm" label="Size 'sm'"></q-radio>
        <q-radio size="md" v-model="shapeSize" val="md" label="Size 'md'"></q-radio>
        <q-radio size="lg" v-model="shapeSize" val="lg" label="Size 'lg'"></q-radio>
        <q-radio size="xl" v-model="shapeSize" val="xl" label="Size 'xl'"></q-radio>

        <!-- custom size -->
        <q-radio size="150px" v-model="shapeSize" val="150px" label="Size '150px'"></q-radio>
      </div>

      <div class="q-px-sm">
        Your selection is: <strong>{{ shapeSize }}</strong>
      </div>

      <div class="q-pa-md">
        <q-option-group :options="options" type="radio" v-model="groupRadio"></q-option-group>
      </div>

      <div class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-radio name="shapeCheck" v-model="shapeCheck" val="line" label="Line"></q-radio>
          <q-radio
            name="shapeCheck"
            v-model="shapeCheck"
            val="rectangle"
            label="Rectangle"
          ></q-radio>
          <q-radio name="shapeCheck" v-model="shapeCheck" val="ellipse" label="Ellipse"></q-radio>
          <q-radio name="shapeCheck" v-model="shapeCheck" val="polygon" label="Polygon"></q-radio>

          <div>
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
          </div>
        </q-form>

        <q-card
          v-if="submitResult.length > 0"
          flat
          bordered
          class="q-mt-md"
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
        >
          <q-card-section
            >Submitted form contains the following formData (key = value):</q-card-section
          >
          <q-separator></q-separator>
          <q-card-section class="row q-gutter-sm items-center">
            <div
              v-for="(item, index) in submitResult"
              :key="index"
              class="q-px-sm q-py-xs bg-grey-8 text-white rounded-borders text-center text-no-wrap"
            >
              {{ item.name }} = {{ item.value }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-lg">
        <!-- as string -->
        <q-option-group
          v-model="modelOne"
          :options="options1"
          color="primary"
          option-value="key"
          option-label="title"
          option-disable="inactive"
        ></q-option-group>
      </div>
    </div>

    <!-- Clearable 영역 -->
    <div class="q-gutter-md etctype-section">
      <q-toolbar>
        <q-toolbar-title>etc</q-toolbar-title>
      </q-toolbar>
      <div class="q-pa-md">
        <q-toggle v-model="toggleVal"></q-toggle>
        <q-toggle v-model="toggleVal" color="green"></q-toggle>
        <q-toggle v-model="toggleVal" color="yellow"></q-toggle>
        <q-toggle v-model="toggleVal" color="red"></q-toggle>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const submitResult = ref([])

    function onSubmit(evt) {
      const formData = new FormData(evt.target)
      const data = []

      for (const [name, value] of formData.entries()) {
        data.push({
          name,
          value,
        })
      }

      submitResult.value = data
    }

    return {
      text: ref(''),
      teal: ref(true),
      orange: ref(false),
      red: ref(false),
      cyan: ref(true),
      shape: ref(['line']),
      shapeCheck: ref('line'),
      selection: ref(['teal', 'red']),
      customModel: ref('no'),
      group: ref([]),
      color: ref('teal'),
      shapeSize: ref('line'),
      options: [
        { label: 'Battery too low', value: 'bat' },
        { label: 'Friend request', value: 'friend', color: 'green' },
        { label: 'Picture uploaded', value: 'upload', color: 'red' },
      ],
      groupRadio: ref(null),
      submitResult,
      toggleVal: ref(true),
      onSubmit,
      modelOne: ref('op1'),
      options1: [
        {
          title: 'Option 1',
          key: 'op1',
          inactive: false,
        },
        {
          title: 'Option 2 (disabled)',
          key: 'op2',
          inactive: true,
        },
        {
          title: 'Option 3',
          key: 'op3',
          inactive: false,
        },
      ],

      optValueFn: (item) => item.key,
      optLabelFn: (item) => item.title,
      optDisableFn: (item) => item.inactive,
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

.etctype-section {
  padding: 20px;
  background-color: #fdbfbfe1;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>
