import { createApp } from 'vue'
// 导入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入 Element Plus 的 CSS 样式
import App from './App.vue'

const app = createApp(App)

// 3. 全局使用 Element Plus
app.use(ElementPlus)
app.mount('#app')
