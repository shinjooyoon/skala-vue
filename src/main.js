import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// [Hands on - Weather UI Library] 외부 UI 라이브러리로 Element Plus를 선정해 전역 등록합니다.
app.use(ElementPlus)

app.mount('#app')
