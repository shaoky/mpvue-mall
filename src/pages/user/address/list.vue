<template>
    <div class="address-list">
        <div class="container-list">
            <div class="item" v-for="(item,index) in list" :key="index" @click="select(item)"> <!--  -->
                <div class="info">
                    <div class="contact">
                        <div class="name">{{item.userName}}</div>
                        <div class="phone">{{item.userPhone}}</div>
                    </div>
                    <div class="address-info font-limit-3">
                        {{item.provinceName + item.cityName + item.countyName + item.detailInfo}}
                    </div>
                </div>
                <div class="btn">
                    <div class="default">
                        <i class="iconfont icon-yuanxingweixuanzhong" v-if="!item.isDefault" @click="showIcon(item,index)"></i>
                        <i class="iconfont icon-yuanxingxuanzhongfill" v-if="item.isDefault"  @click="showIcon(item,index)"></i>
                        <div class="text">设为默认</div>
                    </div>
                    <!-- <div class="edit" @click.stop="edit(item.id)">
                        <i class="iconfont icon-Shapecopy"></i>
                        <div class="text">编辑</div>
                    </div> -->
                    <div class="delete" @click.stop="del(item)">
                        <i class="iconfont icon-shanchu"></i>
                        <div class="text">删除</div>
                    </div>
                </div>
            </div>
            <div class="weui-loadmore" v-if="loading">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
        </div>
        <div class="btn-bottom" @click="chooseAddress">
            新增地址
        </div>
    </div>
</template>

<script>
import { getAddressList, setAddressDefault, delAddress, addAddress } from '@/api/getData'
import { mapMutations } from 'vuex'

const dataStack = []

export default {
    data () {
        return {
            loading: true,
            list: '',
            isOrder: false
        }
    },
    // onLoad () {
    //     dataStack.push({...this.$data})
    //     this.$set(this.$data, 'list', [])
    // },
    onShow () {
        // this.getAddressList()
    },
    mounted () {
        this.getAddressList()
        // 如果this.$root.$mp.query.state==1 则是订单页面过来
        if (this.$root.$mp.query.state === '1') {
            this.isOrder = true
        }
    },
    methods: {
        ...mapMutations(['setAddress']),
        async getAddressList () {
            let res = await getAddressList()
            // res.data.forEach((val, index) => {
            //     if (val.isdefault === 2) {
            //         this.$set(val, 'visible', true)
            //     } else if (val.isdefault === 1) {
            //         this.$set(val, 'visible', false)
            //     }
            // })
            this.list = res.data.list
            this.loading = false
        },

        chooseAddress () {
            let that = this
            wx.chooseAddress({
                success: function (res) {
                    that.addAddress(res)
                }
            })
        },

        async addAddress (data) {
            let res = await addAddress(data)
            if (res.code === 200) {
                this.getAddressList()
            }
        },

        // 删除地址
        del (item) {
            wx.showModal({
                title: '提示',
                content: '确定要删除此地址吗',
                success:
                    async (res) => {
                        if (res.confirm) {
                            let res = await delAddress({id: item.addressId})
                            console.log(res)
                            if (res.code === 200) {
                                wx.showToast({title: '删除成功', icon: 'none'})
                            }
                            this.getAddressList()
                        } else {

                        }
                    }
            })
        },
        // 跳转新增页面
        goAdd () {
            wx.navigateTo({
                url: '/pages/user/address/add/main'
            })
        },
        // 跳转编辑页面
        edit (id) {
            wx.navigateTo({
                url: '/pages/user/address/add/main?id=' + id
            })
        },
        // 显示选中icon
        showIcon (item, index) {
            if (item.isdefault === 2) {
                return
            }
            wx.showModal({
                title: '提醒',
                content: '是否设置为默认地址？',
                success: async (res) => {
                    if (res.confirm) {
                        await setAddressDefault({id: item.addressId})
                        this.getAddressList()
                    }
                }
            })
        },
        // 选择返回
        select (item) {
            if (this.isOrder) {
                var pages = getCurrentPages()
                var prevPage = pages[pages.length - 2] // 上一个页面
                prevPage.setData({
                    areaInfo: item,
                    areaStatus: 2
                })
                let a = {
                    b: 2
                }
                this.$store.commit('MSetAddress', a)
                this.setAddress(item)
                wx.navigateBack()
            }
        }
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
    }
}
</script>

<style scoped lang="less">
.address-list{padding-bottom:100rpx;
    .container-list{
        .item{background:#fff;margin-bottom:20rpx;
            .info{padding:10rpx 24rpx;min-height:80rpx;border-bottom:1px solid #e5e5e5;
                .contact{display: flex;justify-content: space-between;font-size:30rpx;color:#333;
                    .name{flex:1;}
                }
                .address-info{font-size:28rpx;color:#999;margin-top:10rpx;}
            }
            .btn{height:88rpx;display: flex;align-items:center;padding:0 24rpx;
                .default{flex:1;display: flex;align-items:center;
                    .text{font-size:24rpx;color:#333;margin-left:20rpx;}
                    .iconfont{font-size:28rpx;}
                    .icon-yuanxingxuanzhongfill{color: #f70044;}
                }
                .edit,.delete{display: flex;align-items:center;margin-left:20rpx;
                    .text{font-size:24rpx;color:#333;margin-left:10rpx;}
                    .iconfont{font-size:28rpx;}
                }
            }
        }
    }
    .btn-bottom{width:750rpx;height:90rpx;line-height:90rpx;text-align:center;font-size:36rpx;background:#f70044;color:#fff;position: fixed;;bottom:0;left:0;}
    .iconfont{font-size:36rpx;}
}
</style>
