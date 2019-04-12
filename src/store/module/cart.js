import * as types from '../types'

const state = {
    data: {}
}

const getters = {
    getCart (state) {
        return state.data || {}
    }
}

const mutations = {
    [types.MSetCart] (state, row) {
        state.data = row
        console.log(row)
    }
}

const cart = {
    state,
    getters,
    mutations
}

export default cart
