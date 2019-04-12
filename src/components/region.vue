<template>
    <div class="region-components">
        <div class="v-cell" v-for="item in options" :key="item.id" @click="getChild(item)">
          <div class="v-cell-title">{{item.label}}</div>
          <i class="iconfont icon-more"></i>
        </div>
    </div>
</template>

<script>
import { getRegion } from '@/api/getData'

export default {
    data () {
        return {   
            region: [],
            options: [],
            selectedOptions: [],
            address: []
        }
    },
    props: {
        selected: {
            type: Array,
            default () {
                // 不设默认值，需要，请按照下面格式传入
                // return ['11000000', '11010000', '11010100']
            }
        }
    },
    mounted () {
        wx.showLoading({
            title: '加载中',
        })
        this.selectedOptions = this.selected
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
        setTimeout( () => {
            this.$nextTick(
                () => {
                    wx.hideLoading()
                }
            )
        },100)
        
        // console.log(this.options)
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
                // let obj = {
                //     id: val.id,
                //     name: val.name
                // }
                this.region.push(val.value)
                this.address.push(val.label)
            } else {
                // 选择最后一项，返回
                this.region.push(val.value)
                this.address.push(val.label)
                this.$emit('handleChange', this.region, this.address)
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
    }
}
</script>

<style scoped lang="less">
    .region-components{position: fixed; z-index: 99; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: #fff; overflow-y: auto;}
    .v-cell{padding:0 20rpx;}
    .v-cell-title{font-size: 28rpx; flex: 1;}
    .iconfont{color: #ccc;}
</style>
