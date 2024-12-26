import { createRouter, createWebHistory } from 'vue-router'

// Import your existing components
import Home from '../views/Home.vue'
// ... import other components as needed

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // ... your other routes

  // Redirect /releases to the external releases link
  {
    path: '/releases',
    beforeEnter() {
      window.location.href = 'https://external-link.com/releases'; // Replace with your actual releases URL
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router