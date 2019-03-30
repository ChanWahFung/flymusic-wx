import Vue from 'vue'
import App from './App'
import store from './store'

Vue.prototype.$store = store;
Vue.prototype.key = '579621905'

//自定义全局组件
import SectionTitle from './components/SectionTitle'
Vue.component('section-title',SectionTitle)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
