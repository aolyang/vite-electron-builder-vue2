import Vue from "vue";
import App from './App.vue'

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

export const mount = (el) => {
  new Vue({
    render: (h) => h(App)
  }).$mount(el)
}
