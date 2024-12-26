import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/releases',
    beforeEnter() {
      window.location.href = 'https://distrokid.com/dashboard/album/?albumuuid=6CD90D9D-3A93-49E9-81A0EA277C878265'; // Replace with your actual releases URL
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router