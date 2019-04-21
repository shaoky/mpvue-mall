<template>
    <div class="order-index">
        <div class="tabs">
            <div class="tabs-container">
                <div class="item" v-for="(item, index) in tabs" :key="index">
                    <span @click="switchTabs(item.id)" :class="['text', search.orderStatus==item.id?'active':'']" >{{item.state}}</span>
                </div>
            </div>
        </div>
        <div class="order-box">
            <div class="order-info" v-for="(item, index1) in list" :key="index1">
                <div class="title">
                    <div class="left">
                        订单时间 {{item.createTime}}
                        <i class="iconfont icon-more"></i>
                    </div>
                    <div class="right">{{item.orderStatusName}}</div>
                </div>
                <div class="goods-info" @click="goInfo(item.orderId)" v-for="(goodsItem, index2) in item.goodsList" :key="index2"> <!-- 带订单id -->
                    <div class="icon">
                        <img :src="goodsItem.goodsInfo.goodsImage">
                    </div>
                    <div class="info">
                        <div class="goods-name font-limit-2">{{goodsItem.goodsInfo.goodsName}}</div>
                        <div class="specifications">
                            <span v-for="(item1, index3) in goodsItem.goodsSpec.list" :key="index3">
                                {{item1.attr}}: {{item1.name}};
                            </span>
                        </div>
                    </div>
                    <div class="price" v-if="goodsItem.goodsSpec.openSpec">￥{{goodsItem.goodsSpec.shopPrice}}</div>
                    <div class="price" v-if="!goodsItem.goodsSpec.openSpec">￥{{goodsItem.goodsInfo.shopPrice}}</div>
                    <div class="num">x{{goodsItem.goodsNum}}</div>
                </div>
                <div class="total">
                    <div class="total-num">
                        <!-- 共{{item.goodsList.length}}件商品 -->
                    </div>
                    <div class="total-price">合计:<span class="text">￥{{item.payMoney}}(含运费￥{{item.freightMoney}})</span></div>
                </div>
                <!-- 待付款 -->
                <!-- <div class="btn-box" v-if="item.orderstatus == 1">
                    <div class="item marked" @click="confirm(item.ordersn, item.sno)">立即支付</div>
                    <div class="item" @click="cancel(item.ordersn)">取消订单</div>
                </div> -->
                <!-- 待接单 -->
                <div class="btn-box" v-if="item.orderStatus == 1">
                    <div class="item marked" @click="onPay">立即支付</div>
                    <div class="item" @click="onCancel(item.orderId)">取消订单</div>
                </div>
                <!-- 待发货 -->
                <div class="btn-box" v-if="item.orderstatus == 2">
                    <!-- <div class="item" @click="dialogVisible = true;applysn=item.ordersn">申请退款</div> -->
                    <div class="item" @click="cancel(item.ordersn)">取消订单</div>
                </div>
                <!-- 待收货 -->
                <div class="btn-box" v-if="item.orderstatus == 3">
                    <div class="item marked" @click="confirm(item.ordersn, item.sno)">确认收货</div>
                </div>
                <!-- 已完成 -->
                <div class="btn-box" v-if="item.orderstatus == 4">
                    <div class="item" @click="del(item.ordersn)">删除订单</div>
                </div>
                <!-- 待接单 -->
                <div class="btn-box" v-if="item.orderstatus == 7">
                    <div class="item" @click="cancel(item.ordersn)">取消订单</div>
                </div>

                <!-- <div class="btn-box" v-if="item.orderstatus == 5">
                    <div class="item">删除订单</div>
                </div>
                <div class="btn-box" v-if="item.orderstatus == 6">
                    <div class="item">删除订单</div>
                </div> -->
            </div>
        </div>
        <div class="weui-loadmore" >
            <i class="weui-loading" v-if="loading && hasNext"></i>
            <span class="weui-loadmore__tips">{{bottomText}}</span>
        </div>
        <div class="slot" v-if="dialogVisible" >
            <div class="dialog" @click="dialogVisible=false"></div>
            <div class="dialog-container" >
                <textarea v-model="remarks" maxlength="-1" fixed="true" auto-focus="true" placeholder="请输入退款原因" placeholder-style="color:#999;font-size:28rpx;" class="textarea"></textarea>
                <div class="dialog-btn">
                    <div class="btn-item" @click="apply">申请</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getOrderList, confirmOrder, orderStatusSet, delorder, backapply } from '@/api/getData'
import { getTimeStr } from '@/utils/date.js'

const dataStack = []

export default {
    data () {
        return {
            search: '',
            tabs: [{state: '所有状态', id: '0'}, {state: '待付款', id: '1'}, {state: '待发货', id: '2'}, {state: '待收货', id: '3'}],
            list: '',
            bottomText: '加载更多',
            applysn: '',
            remarks: '',
            loading: false,
            hasNext: true,
            dialogVisible: false
        }
    },
    onLoad () {
        dataStack.push({...this.$data})
        this.$data.search = { page: 0, size: 20 }
        this.$data.list = []
    },
    mounted () {
        this.search.orderStatus = parseInt(this.$root.$mp.query.state)
        // this.getOrderList()
    },
    onShow () {
        dataStack.push({...this.$data})
        this.$data.search = { page: 0, size: 20 }
        this.$data.list = []
        this.getOrderList()
    },
    methods: {
        async getOrderList () {
            this.loading = true
            this.bottomText = '正在加载'
            let res = await getOrderList(this.search)
            this.loading = false
            this.bottomText = '加载更多'
            console.log(res)
            res.data.list.forEach((item, index) => {
                item.createTime = getTimeStr(item.createTime * 1000)
            })
            this.list.push(...res.data.list)
            if (res.data.list.length < this.search.size) {
                this.hasNext = false
                this.bottomText = '无更多数据'
            }
        },
        switchTabs (n) {
            if (this.search.orderStatus === n) {

            } else {
                this.list = []
                this.search.page = 0
                this.search.orderStatus = parseInt(n)
                this.getOrderList()
            }
        },
        goInfo (id) {
            // if (state === 5 || state === 6) {
            //     wx.navigateTo({
            //         url: '/pages/user/refund/info/main?orderId=' + id
            //     })
            // } else {
            //     wx.navigateTo({
            //         url: '/pages/user/order/info/main?orderId=' + id
            //     })
            // }
            wx.navigateTo({
                url: '/pages/user/order/info/main?orderId=' + id
            })
        },
        onPay () {
            wx.showModal({
                title: '支付',
                content: '请联系微信:shaoky1234进行转账，付款后发货'
            })
        },
        // 取消订单
        onCancel (orderId) {
            wx.showModal({
                title: '提醒',
                content: '是否取消订单',
                success:
                    async (res) => {
                        if (res.confirm) {
                            await orderStatusSet({orderId: orderId, orderStatus: 7})
                            wx.showToast({
                                title: '取消成功',
                                icon: 'none'
                            })
                            this.list = []
                            this.search.page = 0
                            this.getOrderList()
                        }
                    }
            })
        },
        // 确认收货
        confirm (ordersn, sno) {
            wx.showModal({
                title: '提醒',
                content: '是否收货',
                success:
                    async (res) => {
                        if (res.confirm) {
                            let response = await confirmOrder({ordersn: ordersn, sno: sno})
                            wx.showToast({
                                title: '操作成功',
                                icon: 'none'
                            })
                            this.list = []
                            this.search.page = 0
                            this.getOrderList()
                        }
                    }
            })
        },
        // 删除订单
        del (ordersn) {
            wx.showModal({
                title: '提醒',
                content: '是否删除订单',
                success:
                    async (res) => {
                        if (res.confirm) {
                            let response = await delorder({ordersn: ordersn})
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none'
                            })
                            this.list = []
                            this.search.page = 0
                            this.getOrderList()
                        }
                    }
            })
        },
        // 申请退款
        async apply () {
            let res = await backapply({ordersn: this.applysn, remarks: this.remarks})
            if (res.code === 200) {
                this.dialogVisible = false
                wx.showToast({title: '申请成功', icon: 'none'})
                this.list = []
                this.search.page = 0
                this.getOrderList()
            }
        }
    },
    onReachBottom () {
        if (this.hasNext) {
            this.search.page++
            this.getOrderList()
        } else {
            this.bottomText = '无更多数据'
        }
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
    }
}
</script>

<style scoped lang="less">
.order-index{padding-bottom:15rpx;padding-top:79rpx;

    .tabs{height:80rpx;background:#fff;border-bottom:1px solid #e5e5e5;position:fixed;top:0;left:0; z-index: 99;width:750rpx;
        .item{display: inline-block;width:187.5rpx;text-align:center;height:80rpx;line-height:80rpx;
            .text{font-size:28rpx;color:#666;height:80rpx;display: inline-block;}
            .active{color:#f70044;position:relative;}
            .active:after{position:absolute;bottom:0;left:0;width:100%;height:4rpx;background:#f70044;content: "";display: block;}
        }
    }
    .order-box{
        .order-info{background:#fff;margin-bottom:20rpx; padding-left: 24rpx;
            .title{height:78rpx;border-bottom:1px solid #e5e5e5;padding:0 24rpx;display:flex;align-items:center;
                .left{flex:1;font-size:24rpx;color:#333;display: flex;align-items:center;
                    .iconfont{font-size:36rpx;color:#999;}
                }
                .right{font-size:28rpx;color:#ff9900;}
            }
            .goods-info{height:176rpx;padding:0 24rpx;display: flex;align-items: center;position:relative;
                .icon{width:120rpx;height:120rpx;margin-right:24rpx;
                    img{width:120rpx;height:120rpx;}
                }
                .info{width:380rpx;height:120rpx;position:relative;
                    .goods-name{font-size:24rpx;color:#333;}
                    .specifications{position:absolute;bottom:0;left:0;font-size:24rpx;color:#999;}
                }
                .price{position:absolute;right:24rpx;top:26rpx;font-size:24rpx;color:#333;}
                .num{position:absolute;right:24rpx;bottom:26rpx;;font-size:24rpx;color:#333;}
            }
            .total{height:78rpx;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:0 24rpx;display:flex;align-items:center;
                .total-num{flex:1;text-align:right;margin-right:42rpx;font-size:24rpx;color:#333;}
                .total-price{font-size:24rpx;color:#333;
                    .text{}
                }
            }
            .btn-box{height: 115rpx;padding:0 24rpx;display:flex;justify-content:flex-end;align-items:center;
                .item{width:180rpx;height:54rpx;line-height:54rpx;text-align:center;border:1px solid #ccc;border-radius:4px;margin-right:60rpx;color: #666;}
                .item:last-child{margin-right:0;}
                .marked{color:#f70044;border:1px solid #f70044;}
            }
        }
        .order-info:last-child{margin-bottom:0rpx;}
    }
    .weui-loadmore{margin-top:40rpx;}
    .dialog{width:100%;height:100%;background-color:#000;opacity:0.5;position: fixed;;left:0px;top:0px;z-index:1000;}
    .dialog-container{width:710rpx;background:#fff;position:fixed;left:50%;top:20%;transform:translate(-50%);z-index:1001;padding:20rpx 20rpx 0;
        .textarea{width:710rpx;height:200rpx;font-size:28rpx;}
        .dialog-btn{width:710rpx;height:80rpx;border-top:1px solid #f5f5f5;display:flex;align-items:center;justify-content: flex-end;
            .btn-item{width:160rpx;height:58rpx;line-height:58rpx;text-align:center;border:1px solid #ccc;border-radius:4px;}
        }
    }
}
</style>
