<template>
    <div style="display: inline">
        {{str}}
    </div>
</template>

<script>
import { getRegion } from '@/api/getData'

export default {
    data () {
        return {
            options: [],
            regionNumber: [],
            str: '',
            region_1: '',
            region_2: '',
            region_3: '',
            index1: '',
            index2: '',
            addressInfo: ''
        }
    },
    props: ['region', 'address'], // 传入三级编号
    mounted () {
        if (this.region) {
            this.regionNumber.push(this.region.slice(0, 2) + '000000', this.region.slice(0, 4) + '0000', this.region)
        }
        if (this.address) {
            this.addressInfo = this.address
        }
        // console.log(this.region)
        this.getRegion().then(
            () => {
                if (this.regionNumber.length > 0) {
                    this.options.forEach(
                        (item1, index1) => {
                            if (item1.value == this.regionNumber[0]) {
                                this.region_1 = this.options[index1].label
                                this.index1 = index1
                            }
                        }
                    )
                    if (this.index1 != null) {
                        this.options[this.index1].children.forEach(
                            (item1, index1) => {
                                if (item1.value == this.regionNumber[1]) {
                                    this.region_2 = this.options[this.index1].children[index1].label
                                    this.index2 = index1
                                }
                            }
                        )
                    }
                    if (this.index2 != null) {
                        this.options[this.index1].children[this.index2].children.forEach(
                            (item1, index1) => {
                                if (item1.value == this.regionNumber[2]) { this.region_3 = item1.label }
                            }
                        )
                    }
                    this.str = this.region_1 + this.region_2 + this.region_3 + this.addressInfo
                }

                // console.log(this.str)
            }
        )
    },
    methods: {
        async getRegion () {
            // console.log(wx.getStorageSync('region'))
            if (wx.getStorageSync('region')) {
                this.options = JSON.parse(wx.getStorageSync('region'))
            } else {
                let res = await getRegion({ id: '00000000' })
                res = this.buildModel(res.data.regions)
                // console.log(res)
                wx.setStorageSync('region', JSON.stringify(res))
                // window.localStorage.setItem('region', JSON.stringify(res))
                this.options = res
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
</style>
