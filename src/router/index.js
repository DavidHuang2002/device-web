import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DeviceView from '../views/device/index.vue'
import AlertView from '../views/alert/index.vue'

import DefaultLayout from "../layouts/DefaultLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: DeviceView
    // },
    // {
    //   path: '/alerts',
    //   name: 'alerts',
    //   component: AlertView,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
    {
      path: "/",
      component: DefaultLayout,
      children: [
        { path: "", component: DeviceView },
        { path: "/alerts", component: AlertView },
      ],
    },
  ]
})

export default router
