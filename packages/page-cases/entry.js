import Vue from "vue";
import App from './App.vue'


export const mount = (el) => {
  new Vue({
    render: (h) => h(App)
  }).$mount(el)
}
