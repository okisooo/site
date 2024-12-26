import { createRouter, createWebHistory } from 'vue-router'
import ThreeScene from '../components/ThreeScene.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ThreeScene
  },
  {
    path: '/releases',
    redirect: () => {
      window.location.href = 'https://distrokid.com/hyperfollow/okiso/thunder-feat-hatsune-miku'
    }
  }
]

export default createRouter({
  history: createWebHistory('/site/'),
  routes
})