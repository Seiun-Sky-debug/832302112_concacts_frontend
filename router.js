import { createRouter, createWebHistory } from 'vue-router'
import ContactManager from '/src/App.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ContactManager,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
