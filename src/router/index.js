import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LoginChoferes',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginChofer.vue')
  },
  {
    path: '/planviaje',
    name: 'Viajes',
    component: () => import(/* webpackChunkName: "about" */ '../components/ShowViaje.vue')
  },
  {
    path: '/mensaje',
    name: 'Notificaciones',
    component: () => import(/* webpackChunkName: "about" */ '../components/ModalNotificacion.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
