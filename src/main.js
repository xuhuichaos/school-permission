import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import '@/assets/css/global.css'
import App from './App.vue'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
axios.defaults.baseURL = 'https://api.jqrjq.cn'
// axios请求拦截器，携带token获取数据
axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token')
    return config
})

const app = createApp(App)
app.config.globalProperties.$http = axios
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.use(router)
app.use(ElementPlus)
app.mount('#app')