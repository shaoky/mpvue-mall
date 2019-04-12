import * as types from '../types'

const state = {
    data: {},
    isIPhoneX: false
}

const getters = {
    getUserCode (state) {
        return state.data || {}
    },
    getIPhoneX (state) {
        return state.isIPhoneX
    }
}

const mutations = {
    [types.MsetLoginCode] (state, row) {
        state.data = row
        console.log(row)
    },
    [types.MsetIPhoneX] (state, row) {
        state.isIPhoneX = row.isIPhoneX
    }
}

const user = {
    state,
    getters,
    mutations
}

export default user
