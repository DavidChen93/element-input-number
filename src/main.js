import Vue from 'vue'
import App from './App.vue'
import { Input } from 'element-ui'
import InputNumber from '@/components/inputNumer/index.js'

Vue.config.productionTip = false
Vue.use(Input)
Vue.use(InputNumber)

new Vue({
  render: h => h(App),
}).$mount('#app')
