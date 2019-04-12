import * as types from '../types'

const state = {
    default: {}
}

const getters = {
    getAddress (state) {
        return state.default || {}
    }
}

const mutations = {
    [types.MSetAddress] (state, row) {
        state.default = row
        console.log(row)
    }
}

const address = {
    state,
    getters,
    mutations
}

export default address
