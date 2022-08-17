import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    datos: [],
    errores: [],
    dirapi: process.env.VUE_APP_BASE_URL,
    lista: []
  },
  getters: {
  },
  mutations: {
    loginUsuario(state, payload) {
      if(payload != '') {
        state.datos = payload
      } else {
        state.datos = []
      }
    },
    vaciarErrores(state) {
      state.errores = []
    },
    cargarErrores(state, error) {
      state.errores = error
    },
    cerrar(state) {
      state.datos = ''
      localStorage.removeItem('placa')
    },
    obtenerDatos (state) {
      return state.datos
    },
  },
  actions: {
    async iniciarSesion({commit}, payload) {
      try {
         await axios.post(process.env.VUE_APP_BASE_URL + '/amc/login', payload)
         .then(res => {
           if (res.data.length !== 0) {
            localStorage.setItem('placa', payload.usuario)
             commit('loginUsuario', res.data)
           } else {
            commit('cargarErrores', { message: 'PLACA NO EXISTE' })
           }
         })
        .catch(error => {
          commit('cargarErrores', error)
        })
      } catch (error) {
       commit('cargarErrores', error)
     }
    },
    async clearErrores({commit}) {
      await commit('vaciarErrores')
    },
  },
  modules: {
  }
})
