import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import vuetify from './plugins/vuetify'
import VueAxios from 'vue-axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import moment from 'moment'

Vue.use(VueAxios, Axios)
Vue.config.productionTip = false
Vue.config.devtools = true;
Vue.prototype.moment = moment

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
