import { createRouter, createWebHashHistory } from 'vue-router'
import ThreeScene from '../components/ThreeScene.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ThreeScene
  }
  // Remove the /releases route
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})