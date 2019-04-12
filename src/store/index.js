// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import address from './module/address'
import cart from './module/cart'
import user from './module/user'
import regionname from './module/regionname'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0
    },
    modules: {
        user,
        address,
        cart,
        regionname
    }
})

export default store
