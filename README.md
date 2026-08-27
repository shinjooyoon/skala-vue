## Getting Started with Vue.js — 학습 정리

## 1. Local Development Environment 구축

Vue.js 프로젝트를 직접 실행해보기 위해 먼저 로컬 개발 환경을 구성했다.

## Homebrew 설치

macOS에서 패키지를 편리하게 설치하고 관리하기 위해 Homebrew를 설치했다.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 과정에서 맥북 비밀번호를 입력했고, 최종적으로 `Installation successful!` 메시지가 출력되는 것을 확인했다.

설치 후에는 새로운 터미널 세션에서 Homebrew의 PATH가 정상적으로 적용되는 것도 확인했다.

## Node.js 설치

Vue 프로젝트를 생성하고 개발 도구를 실행하기 위해 Node.js를 설치했다.

```bash
brew install node
```

설치가 끝난 뒤 Node.js와 npm의 버전을 확인했다.

```bash
node -v   # v24.16.0
npm -v    # 11.13.0
```

두 명령어 모두 정상적으로 버전이 출력되어 설치가 제대로 완료된 것을 확인했다.

---

## 2. Vue 프로젝트 생성

## skala-vue 프로젝트 생성

Vue 프로젝트를 직접 만들어보기 위해 `create-vue`를 사용했다. 실습에서는 버전 차이로 인한 패키지 충돌을 방지하기 위해 `create-vue@3.22.3` 버전을 사용했다.

```bash
mkdir -p ~/projects
cd ~/projects
npm create vue@3.22.3
```

프로젝트를 생성하면서 다음과 같이 옵션을 설정했다.

| 항목                  | 선택      |
| --------------------- | --------- |
| Project name          | skala-vue |
| TypeScript            | No        |
| JSX Support           | No        |
| Vue Router (SPA)      | Yes       |
| Pinia (상태 관리)     | Yes       |
| Vitest (Unit Testing) | No        |
| E2E Testing           | No        |
| ESLint                | Yes       |
| Prettier              | Yes       |

이렇게 프로젝트 개발에 필요한 기본 폴더와 설정 파일 등을 자동으로 만들어주는 과정을 project Scaffolding이라고 한다.

직접 파일과 폴더를 하나씩 만드는 대신 기본적인 프로젝트 뼈대를 자동으로 만들어준다고 이해했다.

## 프로젝트 실행

프로젝트 생성 후 해당 디렉터리로 이동해 필요한 패키지를 설치하고 개발 서버를 실행했다.

```bash
cd skala-vue
npm install
npm run format
npm run dev
```

각 명령어의 역할은 다음과 같다.

- `npm install`: `package.json`에 정의된 의존성 패키지 설치
- `npm run dev`: 개발 서버 실행

개발 서버가 실행된 후 브라우저에서 `localhost:5173`으로 접속해 Vue 기본 화면이 정상적으로 나타나는 것을 확인했다.

### 2-3. 프로젝트 구조 확인

생성된 프로젝트를 살펴보면서 주요 파일들이 어떤 역할을 하는지 확인했다.

| 파일/폴더                 | 역할                                               |
| ------------------------- | -------------------------------------------------- |
| `src/views/HomeView.vue`  | Home 페이지                                        |
| `src/views/AboutView.vue` | About 페이지                                       |
| `src/router/index.js`     | 브라우저가 최초로 보여주는 단 하나의 진짜 html파일 |
| `src/App.vue`             | 애플리케이션의 최상위 컴포넌트                     |
| `src/components/`         | 여러 화면에서 재사용할 컴포넌트를 관리             |

처음에는 파일이 많아 복잡해 보였지만, `App.vue`를 중심으로 여러 컴포넌트가 연결되고 Router가 URL에 맞는 View를 보여주는 구조라는 것을 확인할 수 있었다.

---

## 3. HMR (Hot Module Replacement)

개발 서버를 실행한 상태에서 `AboutView.vue`의 `<template>` 내용을 직접 수정해봤다.

파일을 저장하자 브라우저를 직접 새로고침하지 않았는데도 변경한 내용이 바로 화면에 반영됐다.

이 과정에서 Vite의 HMR(Hot Module Replacement) 기능이 동작한다는 것을 확인했다.

HMR은 코드를 수정했을 때 페이지 전체를 매번 새로고침하는 대신 변경된 모듈을 실행 중인 애플리케이션에 반영해주는 기능이다.

---

## 4. Vue Devtools 확인

Vue Devtools를 직접 사용해보면서 프로젝트 내부 상태와 구조를 확인했다.

| 메뉴             | 확인한 내용                                            |
| ---------------- | ------------------------------------------------------ |
| Overview         | 프로젝트의 기본 정보와 전체적인 상태                   |
| Components       | 컴포넌트 구조와 State, Props, Emits                    |
| Pages            | 프로젝트의 페이지 구조 확인                            |
| Timeline         | 애플리케이션에서 발생하는 여러 동작을 시간 순서로 확인 |
| Assets           | 프로젝트에서 사용하는 이미지, 폰트 등의 정적 파일 확인 |
| Router           | 등록된 Route와 현재 URL의 매칭 상태 확인               |
| Pinia            | Store의 State와 Actions 확인 및 수정                   |
| Graph            | 프로젝트 내 모듈 간 의존 관계 확인                     |
| Inspect / Search | 모듈 정보 확인 및 프로젝트 검색                        |

특히 `Components`를 통해 화면에 보이는 컴포넌트가 어떤 구조로 연결되어 있는지 확인할 수 있었고, `Router`와 `Pinia`도 Devtools에서 직접 확인할 수 있다는 점이 유용했다.

# 과제1 🌤️ Weather Mockup

## 📌 과제에서 추가한 기능

수업 시간에 배운 Vue 기능들을 직접 사용해보기 위해 기존 Weather Mockup에 기능을 추가해보았습니다.

기존에는 도시별 날씨 정보, 검색창, 기온에 따른 더움/선선함 표시와 상세보기 기능이 있었고, 이번 과제에서는 아래 기능을 추가했습니다.

- 검색어와 일치하지 않는 도시 카드를 흐리게 표시
- 3일치 비 예보와 미세먼지 데이터를 이용한 세차지수 기능 추가
- 날씨 데이터를 이용한 추천 준비물 표시
- 상세보기에서 도시의 현재 온도와 날씨 확인

---

## v-for 활용

수업 시간에 배열 데이터를 반복해서 화면에 출력할 때 `v-for`를 사용하는 방법을 배웠습니다.

기존에는 `weatherList`의 도시 목록을 출력할 때 사용했는데, 이번에는 각 도시의 `rainForecast`에 들어있는 3일치 비 예보도 `v-for`로 출력해보았습니다.

도시 목록을 반복하는 `v-for` 안에서 다시 3일치 예보를 반복해서 보여주면서 중첩된 `v-for`를 사용해 보았습니다.

---

## v-if / v-else 활용

수업에서 배운 조건부 렌더링을 날씨에 따라 화면을 다르게 보여주는 데 활용했습니다.
기존에는 기온이 25도 이상인지에 따라 더움/선선함을 표시했고, 추가로 다음과 같은 부분에도 적용해보았습니다.

- 비 예보가 있으면 ☔ 표시
- 비 예보가 없으면 ☀️ 표시
- 비가 오면 우산 추천
- 기온이 25도 이상이면 물병 추천
- 검색 결과가 없으면 안내 문구 표시

특히 비가 오면서 기온도 25도 이상일 수 있기 때문에 우산과 물병이 동시에 표시될 수 있도록 각각의 조건을 따로 처리했습니다.

---

## v-bind (`:class`) 활용

처음에는 검색어와 일치하지 않는 도시를 목록에서 아예 제거하는 방법을 생각했습니다.

하지만 검색할 때마다 카드가 사라지면서 화면이 움직이는 것이 조금 불편해서, 수업에서 배운 `:class`를 이용해 검색어와 일치하지 않는 카드만 흐리게 표시하도록 바꿔보았습니다.

세차지수에서도 결과에 따라 다른 CSS 클래스가 적용되도록 해서 세차하기 좋은 날과 좋지 않은 날을 구분했습니다.

---

## v-on 활용

카드를 클릭했을 때 선택된 도시를 표시하기 위해 `@click`을 사용했습니다.

상세보기 버튼에는 `@click.stop`이 있어 버튼을 눌렀을 때 부모 카드의 클릭 이벤트까지 같이 실행되는 이벤트 버블링이 막아졌습니다.

또한 수업 시간에 이벤트 핸들러에 여러 인자를 전달하는 방법을 배워서 상세보기 함수에 다음 데이터를 전달해보았습니다.

- 도시 이름
- 날씨 상태
- 현재 온도

상세보기 버튼을 누르면 해당 도시의 온도와 현재 날씨를 `alert`로 확인할 수 있도록 구현했습니다.

---

## 검색창

`v-model`을 사용했을 때 한글 입력 시 IME 문자 조합이 완료되기 전에는 `searchQuery`에 입력값이 바로 반영되지 않는 문제가 있기 때문에 검색어가 입력될 때마다 바로 화면에 반영되도록 하기 위해 `v-model` 대신 `:value`와 `@input`을 사용했습니다.

@input을 사용하여 입력 이벤트가 발생할 때마다 e.target.value를 searchQuery에 직접 저장하도록 구현했습니다.

---

## 본인만의 데이터 - 세차지수

과제에서 본인만의 데이터를 추가하는 부분이 있어서 날씨 데이터와 연결할 수 있는 기능을 생각하다가 세차지수를 만들어보았습니다.

각 도시 데이터에 다음 정보를 추가했습니다.

- `rainForecast` : 앞으로 3일 동안의 비 예보
- `dustLevel` : 미세먼지 상태

3일 동안 비 예보가 없고 미세먼지 상태도 나쁘지 않으면 "세차하기 좋아요"라고 표시하도록 만들었습니다.

단순히 데이터를 화면에 출력하는 것보다, 여러 날씨 데이터를 조건으로 사용해서 사용자에게 하나의 정보를 제공하는 기능을 만들어보고 싶어서 추가했습니다.

# 과제2 Weather Composition

## 📌 과제에서 추가한 기능

기존 Weather Mockup 코드에 수업 시간에 배운 반응형 상태 변수, `computed`, `watch`를 활용해보기 위해 폭염 경고 기준 온도 설정 기능을 추가했습니다.

- `ref`를 이용한 폭염 경고 기준 온도 추가
- `computed`를 이용한 폭염 주의 도시 계산
- `watch`를 이용한 기준 온도 변경 감지
- `v-model.number`를 이용한 숫자 입력값 연결

---

## 반응형 상태 변수 추가

사용자가 직접 폭염 경고 기준 온도를 설정할 수 있도록 `alertThreshold`라는 반응형 상태 변수를 추가했습니다.

```
const alertThreshold = ref(30)
```

수업에서 배운 `ref()`를 사용하여 기준 온도의 기본값을 `30°C`로 설정했습니다.

화면에서는 사용자가 직접 기준 온도를 변경할 수 있도록 숫자 입력창과 연결했습니다.

```
<input type="number" v-model.number="alertThreshold" />
```

숫자를 입력받는 부분이기 때문에 `v-model.number`를 사용하여 입력값을 숫자로 처리하도록 했습니다.

---

## Computed를 활용한 폭염 주의 도시 계산

사용자가 설정한 기준 온도를 초과하는 도시를 자동으로 계산하기 위해 `hotAlertCities`를 추가했습니다.

```
const hotAlertCities = computed(() => {
  return weatherList.value.filter((item) => item.temp > alertThreshold.value)
})
```

수업에서 배운 `computed`가 내부에서 사용하는 반응형 데이터를 자동으로 추적한다는 점을 활용했습니다.

`filter()`를 사용하여 각 도시의 `temp`가 사용자가 설정한 `alertThreshold`보다 높은 도시만 남도록 구현했습니다.

예를 들어 기준 온도를 `25°C`로 설정하면 다음과 같이 계산됩니다.

- 서울 28°C → 폭염 주의
- 수원 24°C → 제외
- 부산 26°C → 폭염 주의

따라서 서울과 부산이 폭염 주의 도시로 표시됩니다.

---

## Watcher를 활용한 기준 온도 변경 감지

사용자가 폭염 기준 온도를 변경했을 때 값의 변화를 확인하기 위해 `watch`를 추가했습니다.

```
watch(alertThreshold, (newValue, oldValue) => {
  console.log(
    `⚠️ [watch 감지] 폭염 경고 기준 온도가 ${oldValue}°C → ${newValue}°C로 변경되었습니다.`,
  )
})
```

`watch`에 감시할 대상인 `alertThreshold`를 직접 지정했습니다.

또한 `watch`의 콜백에서 새로운 값과 이전 값을 받을 수 있다는 점을 활용하여 기준 온도가 어떻게 변경되었는지 콘솔에서 확인할 수 있도록 했습니다.

예를 들어 기준 온도를 `30°C`에서 `27°C`로 변경하면 다음과 같이 확인할 수 있습니다.

```text
⚠️ 폭염 경고 기준 온도가 30°C → 27°C로 변경되었습니다.
```

---

## 폭염 주의 도시 화면 출력

`computed`로 계산한 `hotAlertCities`를 화면에 출력하기 위해 기존에 배운 `v-if`, `v-else`, `v-for`도 함께 활용했습니다.

```html
<div v-if="hotAlertCities.length > 0" class="alert-list">
  <p>🔥 {{ alertThreshold }}°C를 초과하는 폭염 주의 도시</p>

  <ul>
    <li v-for="item in hotAlertCities" :key="item.id">{{ item.name }} ({{ item.temp }}°C)</li>
  </ul>
</div>

<p v-else>현재 기준 온도를 초과하는 도시가 없습니다.</p>
```

`hotAlertCities`에 도시가 하나 이상 있으면 `v-for`를 이용해 해당 도시들을 출력하고, 하나도 없다면 `v-else`를 이용해 안내 문구가 표시되도록 구현했습니다.

---

## 과제를 하면서

이번 과제에서는 기존 Weather Mockup에 수업 시간에 배운 `ref`, `computed`, `watch`를 활용하여 폭염 경고 기준 기능을 추가해보았습니다.

`ref`로 폭염 기준 온도를 반응형 상태로 만들고, 기준 온도가 변경되면 `computed`가 조건에 맞는 도시를 다시 계산하도록 했습니다.

또한 `watch`를 사용하여 기준 온도가 변경되기 전의 값과 변경된 후의 값을 확인해보았습니다.

이를 통해 하나의 반응형 상태값이 변경되었을 때 `computed`와 `watch`가 각각 어떻게 반응하는지 확인할 수 있었습니다.

# 과제3 Weather Component

## 과제에서 변경한 내용

기존 Weather Composition에서 구현한 기능을 유지하면서, 하나의 컴포넌트에 있던 화면과 기능을 역할에 따라 여러 컴포넌트로 분리했습니다.

이번 과제에서는 다음과 같이 컴포넌트를 구성했습니다.

- `WeatherParent.vue` : 반응형 데이터와 이벤트 처리
- `BaseDashboardCard.vue` : 검색창과 날씨 목록에서 공통으로 사용하는 카드 UI
- `SearchBar.vue` : 도시 검색 UI와 검색 이벤트 처리
- `WeatherCard.vue` : 도시별 날씨 정보와 카드 이벤트 처리
- `AlertBox.vue` : 폭염 경고 기준 온도 설정
- `props`를 이용한 부모 → 자식 데이터 전달
- `emits`를 이용한 자식 → 부모 이벤트 전달
- `<slot>`을 이용한 공통 카드 컴포넌트 구성
- `<style scoped>`를 이용한 컴포넌트별 스타일 분리

---

## WeatherParent.vue

`WeatherParent.vue`에서는 기존에 사용하던 날씨 데이터와 검색어, 선택된 도시, 폭염 기준 온도 등의 반응형 상태를 관리했습니다.

```js
const weatherList = ref([...])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const alertThreshold = ref(30)
```

컴포넌트를 분리한 뒤에도 주요 데이터는 부모인 `WeatherParent`에서 관리하고, 자식 컴포넌트에서 필요한 값은 `props`로 전달했습니다.

자식 컴포넌트에서 값이 변경된 경우에는 `emit`으로 이벤트를 전달하고 부모에서 실제 값을 변경하도록 했습니다.

예를 들어 검색어가 변경되면 `SearchBar`에서 전달한 값을 다음 함수에서 처리했습니다.

```js
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}
```

날씨 카드를 선택하거나 상세보기 버튼을 클릭했을 때의 처리도 `WeatherParent`에서 담당했습니다.

---

## BaseDashboardCard.vue와 Slot

검색 영역과 날씨 목록 영역은 안에 들어가는 내용은 다르지만 카드 형태의 UI는 공통으로 사용하고 있습니다.

중복되는 부분을 줄이기 위해 `BaseDashboardCard.vue`를 만들었습니다.

```html
<template>
  <section class="dashboard-card">
    <h3>{{ title }}</h3>
    <slot />
  </section>
</template>
```

카드 제목은 `props`로 전달하고, 카드 내부의 내용은 `<slot>`을 사용해 부모 컴포넌트에서 넣을 수 있도록 했습니다.

```html
<BaseDashboardCard title="도시 검색">
  <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
</BaseDashboardCard>
```

같은 카드 컴포넌트를 사용하면서도 `<slot>` 안에는 검색창이나 날씨 목록처럼 서로 다른 내용을 넣을 수 있도록 했습니다.

---

## SearchBar.vue - Props와 Emits

도시 검색 기능은 `SearchBar.vue`로 분리했습니다.

검색어는 부모인 `WeatherParent`에서 관리하고 있기 때문에 현재 검색어를 `props`로 전달받았습니다.

```js
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})
```

입력창에서는 전달받은 `searchQuery`를 사용했습니다.

```html
<input type="text" :value="searchQuery" @input="onInput" placeholder="검색할 도시 이름 입력" />
```

사용자가 검색어를 입력하면 `update-query` 이벤트를 발생시켜 입력한 값을 부모 컴포넌트로 전달했습니다.

```js
const emit = defineEmits(['update-query'])

const onInput = (event) => {
  emit('update-query', event.target.value)
}
```

부모에서 자식으로 값을 전달할 때는 `props`, 자식에서 부모로 이벤트를 전달할 때는 `emit`을 사용했습니다.

---

## WeatherCard.vue - 도시 객체 전달

도시별 날씨 정보를 보여주는 부분은 `WeatherCard.vue`로 분리했습니다.

`WeatherParent`에서 `v-for`로 도시 목록을 반복하면서 각 도시 객체를 `city`라는 `props`로 전달했습니다.

```html
<WeatherCard
  v-for="item in weatherList"
  :key="item.id"
  :city="item"
  :dimmed="!isMatched(item)"
  :highlighted="isSearching && isMatched(item)"
  @select-card="handleSelectCard"
  @click-detail="handleClickDetail"
/>
```

`WeatherCard.vue`에서는 필요한 값을 다음과 같이 `props`로 받았습니다.

```js
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  dimmed: {
    type: Boolean,
    default: false,
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
})
```

`city`에는 도시의 날씨 정보가 들어 있고, `dimmed`와 `highlighted`는 검색 결과에 따라 카드의 스타일을 변경할 때 사용했습니다.

---

## WeatherCard의 이벤트 전달

날씨 카드를 클릭했을 때는 `select-card`, 상세보기 버튼을 클릭했을 때는 `click-detail` 이벤트를 부모로 전달했습니다.

```js
const emit = defineEmits(['select-card', 'click-detail'])

const onSelectCard = () => {
  emit('select-card', props.city)
}

const onClickDetail = () => {
  emit('click-detail', props.city)
}
```

이벤트를 전달할 때 현재 카드의 `city` 객체도 함께 전달해서 부모에서 어떤 도시가 선택되었는지 확인할 수 있도록 했습니다.

상세보기 버튼에는 `@click.stop`을 사용했습니다.

```html
<button class="btn-detail" @click.stop="onClickDetail">상세보기</button>
```

상세보기 버튼을 눌렀을 때 카드에 등록된 클릭 이벤트까지 함께 실행되지 않도록 처리했습니다.

---

## 추가 Component - AlertBox.vue

추가 컴포넌트로 과제2에서 구현했던 폭염 경고 기준 설정 부분을 `AlertBox.vue`로 분리했습니다.

기준 온도와 기준 온도를 초과한 도시 목록은 부모에서 관리하고, `AlertBox`에서는 `threshold`와 `hotCities`를 `props`로 전달받았습니다.

```js
defineProps({
  threshold: {
    type: Number,
    required: true,
  },
  hotCities: {
    type: Array,
    required: true,
  },
})
```

사용자가 기준 온도를 변경하면 `update-threshold` 이벤트를 부모로 전달했습니다.

```js
const emit = defineEmits(['update-threshold'])

const onInput = (event) => {
  emit('update-threshold', Number(event.target.value))
}
```

기존에 `WeatherParent`에 있던 기능을 별도의 컴포넌트로 분리하면서 실제 데이터는 부모에서 계속 관리하도록 했습니다.

---

## style scoped 적용

컴포넌트를 분리하면서 각 컴포넌트에서 사용하는 CSS도 `<style scoped>`로 나누었습니다.

```html
<style scoped>
  .dashboard-card {
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 16px;
  }
</style>
```

`BaseDashboardCard`, `SearchBar`, `WeatherCard`, `AlertBox`, `WeatherParent`에서 필요한 스타일을 각각의 컴포넌트에 작성했습니다.

`scoped`를 사용해서 작성한 스타일이 다른 컴포넌트에 불필요하게 영향을 주지 않도록 했습니다.

---

## 과제를 하면서

이번 과제에서는 기존 Weather Composition의 기능을 여러 컴포넌트로 나누고, 컴포넌트 사이에서 데이터를 주고받는 방법을 실습했습니다.

주요 상태는 `WeatherParent`에서 관리하고 필요한 데이터는 `props`로 전달했으며, 자식 컴포넌트에서 발생한 이벤트는 `emit`으로 부모에 전달했습니다.

또한 `BaseDashboardCard`에 `<slot>`을 사용해서 공통 UI를 재사용하고, 각 컴포넌트의 스타일도 `scoped`를 사용해 분리했습니다.

수업에서 배운 `props`, `emits`, `slot`, `style scoped`를 기존 날씨 대시보드에 직접 적용해보았습니다.

---

# 과제4 Weather Router

## 과제에서 추가한 기능

기존 날씨 대시보드에 Vue Router를 적용해서 URL에 따라 다른 화면이 표시되도록 변경했습니다.

이번 과제에서는 다음 기능을 추가했습니다.

- 라우터 지연 로딩(Lazy Loading) 적용
- 메인 날씨 대시보드 `/` 구성
- 서비스 소개 페이지 `/about` 구성
- 도시별 상세 페이지 `/weather/:cityId` 구성
- 정의되지 않은 주소를 처리하는 Catch-all Route 추가
- `router.push()`를 이용한 상세 페이지 이동
- 검색어와 URL Query String 동기화

---

## Vue Router 설정

`src/router/index.js`에서 각 페이지에 사용할 경로를 설정했습니다.

```js
const routes = [
  {
    path: '/',
    name: 'weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/about',
    name: 'weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
```

각 View는 `() => import(...)` 형태로 등록해서 해당 경로에 접근했을 때 필요한 컴포넌트를 불러오도록 했습니다.

이를 통해 Router에서 Lazy Loading을 적용했습니다.

---

## Programmatic Navigation

기존에는 상세보기 버튼을 클릭하면 `window.alert()`로 도시 정보를 보여주었습니다.

이번 과제에서는 `router.push()`를 사용해서 해당 도시의 상세 페이지로 이동하도록 변경했습니다.

```js
const handleClickDetail = (city) => {
  router.push('/weather/' + city.id)
}
```

도시의 `id`를 URL에 포함해서 각 도시의 상세 페이지로 이동하도록 했습니다.

예를 들어 서울의 `id`가 `city_01`이라면 다음 주소로 이동합니다.

```text
/weather/city_01
```

---

## 동적 경로를 이용한 상세 페이지

도시마다 별도의 상세 페이지를 만드는 대신 `/weather/:cityId` 형태의 동적 경로를 사용했습니다.

`WeatherDetailView.vue`에서는 `useRoute()`를 사용해서 현재 URL에 들어 있는 `cityId` 값을 가져왔습니다.

가져온 `cityId`를 이용해서 Mock Data에서 해당 도시를 찾고 상세 정보를 화면에 표시했습니다.

상세 페이지에서는 지역, 현재 기온, 날씨 상태, 습도, 풍속 등의 정보를 확인할 수 있도록 했습니다.

---

## Catch-all Route

Router에 등록되지 않은 주소로 접근했을 때 보여줄 페이지도 추가했습니다.

```js
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
}
```

정의되지 않은 URL로 접근하면 `NotFoundView.vue`가 표시되도록 했습니다.

해당 화면에서는 다시 날씨 메인 페이지로 이동할 수 있도록 했습니다.

---

## Query String 사용

검색어는 URL의 Query String과 연결했습니다.

검색어가 변경되면 현재 검색어가 URL의 `q` 값에도 반영되도록 했습니다.

```js
watch(searchQuery, (newQuery) => {
  router.replace({
    query: {
      ...route.query,
      q: newQuery || undefined,
    },
  })
})
```

예를 들어 서울을 검색하면 URL에 다음과 같이 검색어가 표시됩니다.

```text
/?q=서울
```

검색 기능에 Query String을 적용하면서 Router를 화면 이동뿐만 아니라 현재 검색 상태를 URL에 나타내는 데에도 사용했습니다.

---

## 과제를 하면서

이번 과제에서는 Vue Router를 사용해서 기존 날씨 대시보드를 여러 화면으로 나누었습니다.

`router.push()`를 사용해 상세 페이지로 이동하고, `/weather/:cityId`와 같은 동적 경로를 이용해서 도시별 상세 화면을 처리했습니다.

또한 Lazy Loading, Query String, Catch-all Route를 적용하면서 수업에서 배운 Router 기능을 날씨 대시보드에 직접 사용해보았습니다.

---

# 과제5 Weather Store

## 과제에서 추가한 기능

여러 컴포넌트에서 함께 사용하는 상태를 Pinia Store로 분리했습니다.

이번 과제에서는 다음 기능을 추가했습니다.

- `configStore`를 이용한 날씨 단위 상태 관리
- 섭씨(°C) / 화씨(°F) 단위 변경
- `UnitToggler.vue`를 이용한 단위 변경 UI
- Store 상태에 따른 온도 단위 변환
- 추가 Store로 `favoriteStore` 구현
- 도시별 즐겨찾기 등록 및 해제

---

## configStore 구성

날씨 단위를 여러 컴포넌트에서 함께 사용할 수 있도록 `stores/configStore.js`를 만들었습니다.

```js
export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    unitSymbol: (state) => (state.unit === 'fahrenheit' ? '°F' : '°C'),
  },

  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
```

`state`에는 현재 사용하고 있는 온도 단위를 저장했습니다.

`unitSymbol` getter에서는 현재 단위에 따라 `°C` 또는 `°F`를 반환하도록 했습니다.

`toggleUnit` action에서는 현재 값이 `celsius`이면 `fahrenheit`로, `fahrenheit`이면 `celsius`로 변경했습니다.

---

## UnitToggler 컴포넌트

단위를 변경하는 UI는 `UnitToggler.vue`로 분리했습니다.

`UnitToggler.vue`에서 `configStore`를 가져와 현재 단위를 표시하고, 버튼을 클릭하면 `toggleUnit` action을 실행하도록 했습니다.

```html
<span> {{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }} </span>

<button @click="configStore.toggleUnit">단위변경</button>
```

단위 상태를 Store에서 관리하기 때문에 다른 컴포넌트에서도 같은 값을 사용할 수 있도록 했습니다.

---

## 날씨 온도 단위 변환

기존 날씨 데이터의 온도는 섭씨 값으로 유지하고, 화면에 표시할 때 현재 Store의 상태에 따라 온도를 변환했습니다.

```js
const displayTemp = computed(() => {
  const rawTemp = props.city.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})
```

`configStore.unit`이 `fahrenheit`이면 화씨 변환 공식을 적용하고, `celsius`이면 기존 값을 그대로 사용했습니다.

원본 날씨 데이터 자체를 변경하지 않고 화면에 표시되는 값만 `computed`에서 계산하도록 했습니다.

---

## favoriteStore

과제에서 요구한 추가 Store로 즐겨찾기 기능을 관리하는 `favoriteStore`를 만들었습니다.

```js
export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favoriteCityIds: [],
  }),

  getters: {
    isFavorite: (state) => (cityId) => state.favoriteCityIds.includes(cityId),

    favoriteCount: (state) => state.favoriteCityIds.length,
  },

  actions: {
    toggleFavorite(cityId) {
      if (this.favoriteCityIds.includes(cityId)) {
        this.favoriteCityIds = this.favoriteCityIds.filter((id) => id !== cityId)
      } else {
        this.favoriteCityIds.push(cityId)
      }
    },
  },
})
```

`favoriteCityIds` 배열에는 즐겨찾기로 등록한 도시의 `id`를 저장했습니다.

`isFavorite` getter에서는 특정 도시가 즐겨찾기에 등록되어 있는지 확인하고, `favoriteCount`에서는 현재 즐겨찾기한 도시의 개수를 확인할 수 있도록 했습니다.

`toggleFavorite()` action에서는 이미 등록된 도시라면 배열에서 제거하고, 등록되지 않은 도시라면 배열에 추가했습니다.

---

## WeatherCard와 favoriteStore 연결

`WeatherCard.vue`에서도 `favoriteStore`를 사용해서 각 도시의 즐겨찾기 상태를 확인하고 변경할 수 있도록 했습니다.

즐겨찾기 버튼을 클릭하면 현재 도시의 `id`를 `toggleFavorite()`에 전달했습니다.

```js
const onToggleFavorite = () => {
  favoriteStore.toggleFavorite(props.city.id)
}
```

버튼에는 `@click.stop`을 사용해서 즐겨찾기 버튼을 눌렀을 때 날씨 카드의 클릭 이벤트가 함께 실행되지 않도록 했습니다.

```html
<button @click.stop="onToggleFavorite">{{ favoriteStore.isFavorite(city.id) ? '★' : '☆' }}</button>
```

즐겨찾기 상태를 Store에 저장해서 여러 컴포넌트에서 같은 즐겨찾기 정보를 사용할 수 있도록 했습니다.

---

## 과제를 하면서

이번 과제에서는 Pinia를 사용해서 여러 컴포넌트에서 함께 사용하는 상태를 Store로 관리했습니다.

`configStore`에서는 섭씨와 화씨 단위를 관리하고, `UnitToggler`와 날씨 카드에서 같은 상태를 사용했습니다.

추가 Store로 `favoriteStore`를 만들어 즐겨찾기한 도시의 `id`를 관리하고, getter와 action을 사용해서 즐겨찾기 확인과 등록 및 해제를 처리했습니다.

# 과제6 Weather Axios

## 과제에서 추가한 기능

기존에는 날씨 정보를 mock 데이터로 사용했는데, 이번 과제에서는 Axios를 설치하고 OpenWeatherMap API를 연결해서 실제 날씨 데이터를 받아오도록 변경했습니다.

이번 과제에서는 다음 기능을 추가했습니다.

- Axios 설치 및 OpenWeatherMap API 키 발급
- 기존 mock 데이터를 OpenWeatherMap 현재 날씨 API로 변경
- 대기오염 API를 이용한 미세먼지 정보 추가
- 5일/3시간 예보 API를 이용한 3일치 비 예보 추가
- countries.dev API를 이용한 세계 도시 검색 및 국가 정보 표시

---

## mock 데이터를 실제 API 데이터로 변경

기존에는 도시별 날씨 정보를 직접 작성한 배열로 사용했습니다.

이번에는 `cityDefs`에 등록한 8개 도시를 기준으로 OpenWeatherMap API를 호출해서 실제 기온과 날씨 상태를 가져오도록 변경했습니다.

여러 도시의 정보를 한 번에 불러오기 위해 `Promise.all`을 사용했습니다.

```js
const fetchRealWeatherData = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const results = await Promise.all(
      cityDefs.map(async (city) => {
        const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: city.englishName,
            appid: API_KEY,
            units: 'metric',
            lang: 'kr',
          },
        })

        return {
          id: city.id,
          name: city.name,
          temp: weatherRes.data.main.temp,
          status: weatherRes.data.weather[0].description,
        }
      }),
    )

    weatherList.value = results
  } catch (error) {
    loadError.value = '실시간 날씨 데이터를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}
```

API를 불러오는 동안에는 `isLoading`을 사용해서 로딩 상태를 관리했습니다.

호출에 실패한 경우에는 `loadError`에 안내 문구를 저장해서 화면에서 확인할 수 있도록 했습니다.

---

## 대기오염 API로 미세먼지 정보 추가

현재 날씨 정보와 함께 미세먼지 상태도 보여주기 위해 OpenWeatherMap의 Air Pollution API를 추가로 사용했습니다.

현재 날씨 API 응답에는 도시의 위도와 경도가 들어 있기 때문에, 해당 좌표를 이용해서 같은 도시의 대기오염 정보를 조회했습니다.

```js
const { lat, lon } = weatherRes.data.coord

const airRes = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
  params: {
    lat,
    lon,
    appid: API_KEY,
  },
})
```

API에서 제공하는 대기오염 지수는 숫자 값으로 들어오기 때문에, 기존 날씨 카드에서 사용하기 편하도록 `좋음`, `보통`, `나쁨`으로 바꾸는 함수를 만들었습니다.

```js
export const aqiToDustLevel = (aqi) => {
  if (aqi <= 2) return '좋음'
  if (aqi === 3) return '보통'
  return '나쁨'
}
```

이 값을 기존에 사용하던 미세먼지 정보와 연결해서 날씨 카드에 표시했습니다.

---

## 예보 API로 3일치 비 예보 만들기

기존 세차지수에서는 직접 작성한 `rainForecast` 배열을 사용했습니다.

이번에는 OpenWeatherMap의 5일/3시간 예보 API를 사용해서 앞으로 3일 동안 비가 오는지 직접 계산하도록 변경했습니다.

API 응답은 3시간 단위로 들어오기 때문에 먼저 날짜별로 데이터를 묶었습니다.

그다음 오늘 날짜를 제외하고 앞으로 3일 동안 각 날짜에 비 예보가 하나라도 있는지 확인했습니다.

```js
export const buildRainForecast = (list) => {
  const byDate = new Map()

  list.forEach((entry) => {
    const dateKey = entry.dt_txt.slice(0, 10)

    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, [])
    }

    byDate.get(dateKey).push(entry)
  })

  const futureDays = Array.from(byDate.keys()).slice(1, 4)

  return futureDays.map((dateKey) =>
    byDate.get(dateKey).some((entry) => entry.weather[0].main === 'Rain'),
  )
}
```

이렇게 만든 배열은 기존 세차지수 계산에 그대로 사용했습니다.

3일 동안 비 예보가 없고 미세먼지 상태도 나쁘지 않으면 세차하기 좋은 날로 표시했습니다.

---

## countries.dev API 추가

과제에서 요구한 다른 외부 API로 `countries.dev`를 사용했습니다.

도시 이름을 검색하면 먼저 OpenWeatherMap에서 해당 도시의 날씨를 조회하고, 응답에 포함된 국가 코드를 이용해서 countries.dev에서 국가 정보를 추가로 가져왔습니다.

```js
try {
  const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: cityName,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  worldWeather.value = weatherRes.data
} catch (error) {
  worldSearchError.value = '도시를 찾을 수 없습니다.'
  return
}

try {
  const countryRes = await axios.get(
    `https://countries.dev/alpha/${worldWeather.value.sys.country}`,
  )

  worldCountry.value = countryRes.data
} catch (error) {
  console.error('국가 정보 조회 실패:', error)
}
```

날씨 조회와 국가 정보 조회는 각각 따로 `try/catch`로 처리했습니다.

도시 날씨 조회에 실패하면 검색을 중단하고, 국가 정보 조회만 실패한 경우에는 날씨 정보는 그대로 보여주도록 했습니다.

검색된 도시의 현재 기온과 날씨 상태를 이용해서 여행할 때 필요한 준비물도 함께 표시하도록 했습니다.

---

## API 키 관리

처음에는 테스트를 위해 API 키를 코드에 직접 작성했지만, 이후 `.env` 파일로 옮겼습니다.

```js
export const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
```

`.env` 파일은 `.gitignore`에 추가해서 Git에 API 키가 올라가지 않도록 했습니다.

코드에서는 `import.meta.env.VITE_OPENWEATHER_API_KEY`를 통해 값을 가져오도록 정리했습니다.

---

## 과제를 하면서

이번 과제에서는 기존 mock 데이터를 실제 API 데이터로 바꾸는 작업을 해보았습니다.

현재 날씨 API뿐만 아니라 대기오염 API와 예보 API도 함께 사용해서 기존에 만들었던 미세먼지 정보와 세차지수를 실제 데이터와 연결했습니다.

또한 countries.dev API를 추가해서 날씨 API에서 받은 국가 코드를 다른 API의 요청에 다시 사용하는 방식도 적용해보았습니다.

여러 API를 함께 사용할 때는 한 번에 모든 요청을 처리하기보다, 필요한 단계마다 `try/catch`를 나누어서 오류가 발생했을 때 어떤 데이터까지 사용할 수 있는지 구분해서 처리했습니다.

Axios를 이용한 API 요청, `async/await`, `Promise.all`, 여러 API의 응답 데이터를 조합하는 과정을 직접 실습해보았습니다.

# 과제7 Weather UI Library

## 과제에서 추가한 기능

이번 과제에서는 Element Plus를 적용해서 기존 화면의 UI를 라이브러리 컴포넌트로 변경했습니다.

과제 6에서 구현한 날씨 API 로직은 그대로 유지하고, 카드나 입력창, 버튼, 상태 표시 같은 화면 요소를 Element Plus로 교체했습니다.

이번 과제에서는 다음 기능을 적용했습니다.

- Element Plus 설치 및 적용
- `el-card`와 `#header` 슬롯을 이용한 카드 구성
- `v-loading`을 이용한 로딩 상태 표시
- `el-input`, `el-button`, `ElMessage`를 이용한 검색 기능 구성
- `el-tag`를 이용한 날씨 상태 표시
- 기존 Store 기능인 화씨/섭씨 변경, 폭염 경고, 즐겨찾기 기능 적용
- 즐겨찾기한 도시를 별도 영역에 표시

---

## Element Plus 적용

프로젝트에 Element Plus를 설치하고, 기존에 직접 작성했던 UI 중 일부를 Element Plus 컴포넌트로 변경했습니다.

날씨 데이터나 검색 로직 같은 기능은 그대로 두고 화면에서 사용하는 컴포넌트만 라이브러리 방식으로 바꾸었습니다.

---

## el-card로 카드 구성

기존에는 카드 형태의 UI를 직접 컴포넌트와 CSS로 만들었는데, 이번에는 Element Plus의 `el-card`를 사용했습니다.

카드 제목은 `#header` 슬롯을 이용해서 넣었습니다.

```html
<el-card class="section-card" shadow="never">
  <template #header>
    <div class="card-header">지역별 실시간 날씨</div>
  </template>

  ...
</el-card>
```

검색 영역이나 날씨 목록처럼 여러 영역에서 같은 카드 형태를 사용할 수 있도록 `el-card`를 적용했습니다.

---

## v-loading으로 로딩 상태 표시

기존에는 API 데이터를 불러오는 동안 로딩 문구를 직접 화면에 표시했습니다.

이번에는 Element Plus의 `v-loading` 디렉티브를 사용해서 데이터를 불러오는 동안 카드 위에 로딩 화면이 나타나도록 했습니다.

```html
<el-card
  v-loading="isLoading"
  element-loading-text="실시간 기상 데이터를 불러오는 중입니다..."
  class="section-card"
  shadow="never"
></el-card>
```

기존에 사용하던 `isLoading` 상태를 그대로 연결해서 API 요청이 진행 중일 때만 로딩 화면이 표시되도록 했습니다.

---

## el-input과 el-button을 이용한 도시 검색

세계 도시 검색 입력창과 검색 버튼도 Element Plus 컴포넌트로 변경했습니다.

입력창에는 `el-input`, 검색 버튼에는 `el-button`을 사용했습니다.

```html
<el-input v-model="worldCityInput" clearable @keyup.enter="handleSearchWorldCity" />

<el-button type="primary" :loading="isSearchingWorld" @click="handleSearchWorldCity">
  검색
</el-button>
```

검색 중에는 `el-button`의 `loading` 속성에 `isSearchingWorld`를 연결해서 버튼에도 로딩 상태가 표시되도록 했습니다.

---

## ElMessage를 이용한 입력값 검증

도시 검색 전에 입력값을 확인하고, 조건에 맞지 않으면 Element Plus의 `ElMessage`로 안내 문구를 보여주도록 했습니다.

```js
const handleSearchWorldCity = async () => {
  const cityName = worldCityInput.value.trim()

  if (!cityName) {
    ElMessage.warning('검색할 도시명을 입력해주세요.')
    return
  }

  if (!/^[a-zA-Z\s]+$/.test(cityName)) {
    ElMessage.warning('영문 도시명으로 입력해주세요. (예: Tokyo, Paris)')
    return
  }

  // API 호출

  ElMessage.success(`${weatherRes.data.name} 날씨 정보를 불러왔습니다.`)
}
```

검색어가 비어 있거나 영문 도시명이 아닌 경우에는 API를 호출하지 않고 바로 안내 메시지를 보여주도록 했습니다.

검색이 정상적으로 완료된 경우에도 `ElMessage.success()`를 사용해서 결과를 불러왔다는 것을 표시했습니다.

---

## el-tag로 날씨 상태 표시

검색한 도시가 더운지 선선한지를 보여주는 부분에는 `el-tag`를 사용했습니다.

```html
<el-tag :type="isHotDestination ? 'danger' : 'info'" size="small" round>
  {{ isHotDestination ? '더움' : '선선함' }}
</el-tag>
```

현재 기온이 25도 이상인지 확인하는 값은 `computed`로 만들었습니다.

```js
const isHotDestination = computed(
  () => Boolean(worldWeather.value) && worldWeather.value.main.temp >= 25,
)
```

조건에 따라 `danger` 또는 `info` 타입이 적용되도록 해서 상태를 구분했습니다.

---

## 기존 Store 기능 적용

과제 5에서 만든 `configStore`와 `favoriteStore`도 그대로 사용했습니다.

`UnitToggler`를 이용한 화씨/섭씨 변경과 `AlertBox`의 폭염 경고 기준 설정을 Element Plus를 적용한 화면에서도 사용할 수 있도록 했습니다.

또한 상세보기와 서비스 소개 페이지는 기존 Vue Router를 계속 사용했습니다.

```js
const handleClickDetail = (city) => {
  router.push('/library/weather/' + city.id)
}
```

상세보기 버튼을 클릭하면 선택한 도시의 `id`를 이용해서 `/library/weather/:cityId` 경로로 이동하도록 했습니다.

---

## 즐겨찾기 도시 분리

즐겨찾기한 도시는 전체 날씨 목록과 따로 볼 수 있도록 별도의 영역에 표시했습니다.

즐겨찾기 여부에 따라 도시 목록을 두 개로 나누기 위해 `computed`를 사용했습니다.

```js
const favoriteCities = computed(() =>
  weatherList.value.filter((item) => favoriteStore.isFavorite(item.id)),
)

const nonFavoriteWeatherList = computed(() =>
  weatherList.value.filter((item) => !favoriteStore.isFavorite(item.id)),
)
```

즐겨찾기한 도시도 이름만 표시하지 않고 기존 `WeatherCard` 컴포넌트를 사용해서 온도와 날씨 정보를 함께 확인할 수 있도록 했습니다.

또한 즐겨찾기 영역에 표시된 도시는 전체 목록에서는 제외해서 같은 도시가 두 번 보이지 않도록 했습니다.

---

## 과제를 하면서

이번 과제에서는 기존에 직접 작성했던 UI를 Element Plus 컴포넌트로 바꾸어보았습니다.

`el-card`, `v-loading`, `el-input`, `el-button`, `ElMessage`, `el-tag`를 사용해서 카드, 로딩 화면, 검색 입력창, 버튼, 안내 메시지, 상태 표시를 구성했습니다.

기존에 작성한 API 로직이나 Store는 그대로 두고 UI 부분만 변경하면서, 기존 기능과 외부 UI Library를 함께 사용하는 방법을 실습했습니다.
