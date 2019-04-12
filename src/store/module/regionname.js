import * as types from '../types'

const state = {
    region:[],
    address:[]
}

const mutations = {
    [types.MsetRegionname] (state,n) {
        state.region = n[0]
        state.address = n[1]
    }
}

const regionname = {
    state,
    mutations
}

export default regionname