<template>
    <div class="region-components">
        <div class="v-cell" v-for="(item,index) in options" :key="index" @click="getChild(item)">
          <div class="v-cell-title">{{item.label}}</div>
          <i class="iconfont icon-more"></i>
        </div>
    </div>
</template>

<script>
import { getRegion } from '@/api/getData'

const reset = []

export default {
    data () {
        return {
            region: [],
            options: [],
            address: [],
            arr: []
        }
    },
    onLoad () {
        reset.push({...this.$data})
        this.$data.region = []
        this.$data.options = []
        this.$data.address = []
        this.$data.arr = []
    },
    mounted () {
        wx.showLoading({
            title: '加载中'
        })

        let value = ''
        // 获取存储的地址，用户第一次进来就去获取接口，拿到保存下来
        if (wx.getStorageSync('region')) {
            value = JSON.parse(wx.getStorageSync('region'))
        }
        if (value === '') {
            this.getRegion()
        } else {
            this.options = value
        }
        setTimeout(() => {
            this.$nextTick(
                () => { wx.hideLoading() }
            )
        }, 4)
    },
    methods: {
        async getRegion () {
            let res = await getRegion({
                id: '00000000'
            })
            res = this.buildModel(res.data.regions)
            this.options = res

            // 保存数据
            wx.setStorageSync('region', JSON.stringify(res))
        },
        getChild (val) {
            if (typeof val.children === 'object') {
                this.options = val.children
                this.region.push(val.value)
                this.address.push(val.label)
            } else {
                // 选择最后一项，返回
                this.region.push(val.value)
                this.address.push(val.label)
                // this.$emit('handleChange', this.region, this.address)
                this.arr[0] = this.region
                this.arr[1] = this.address
                this.$store.commit('setRegionname', this.arr)
                wx.navigateBack()
            }
        },
        buildModel (data) {
            data.forEach((val) => {
                val.value = val.id
                val.label = val.name
                if (typeof val.regions === 'object') {
                    val.children = val.regions
                    delete val.regions
                    this.buildModel(val.children)
                }
                delete val.id
                delete val.name
            })
            return data
        }
    },
    onUnload () {
        Object.assign(this.$data, reset.pop())
    }
}
</script>

<style scoped lang="less">
    .region-components{position: fixed; z-index: 99; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: #fff; overflow-y: auto;}
    .v-cell{padding:0 20rpx;}
    .v-cell-title{font-size: 28rpx; flex: 1;}
    .iconfont{color: #ccc;}
</style>
