import Vue from 'vue'
import App from './list'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '地址列表'
    }
}
