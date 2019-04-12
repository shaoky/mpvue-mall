<template>
    <div class="order-info" v-if="order.orderId">
        <div class="img" v-if="order.orderStatus !== 8">
            <img src="/static/images/order/waitingList.png" v-if="order.orderStatus == 1 || order.orderStatus == 7">
            <img src="/static/images/order/toSendTheGoods.png"  v-if="order.orderStatus == 2">
            <img src="/static/images/order/forTheGoods.png"  v-if="order.orderStatus == 3">
            <img src="/static/images/order/completed.png"  v-if="order.orderStatus == 4">
            <img src="/static/images/order/closed.png"  v-if="order.orderStatus == 5 || order.orderStatus == 8">
        </div>
        <div class="v-address">
            <i class="iconfont icon-dizhi"></i>
            <div class="container">
                <div class="contact">
                    <span>收货人：{{order.userAddress.userName}}</span>
                    <span class="tel">{{order.userAddress.userPhone}}</span>
                </div>
                <div class="info font-limit-2">
                    收货地址：{{order.userAddress.provinceName + order.userAddress.cityName + order.userAddress.countyName + order.userAddress.detailInfo}}
                </div>
            </div>
            <i class="iconfont icon-more"></i>
        </div>
        <div class="icon">
            <img src="/static/images/order/jianbian.png">
        </div>
        <div class="container-list mt20">
            <div class="title">
                <i class="iconfont icon-dingdan"></i>
                <div class="text">购物清单</div>
            </div>
            <div class="box">
                <div class="item" v-for="(item,index1) in order.goodsList" :key="index1"> <!-- v-for -->
                    <div class="goods-info">
                        <div class="icon">
                            <img :src="item.goodsInfo.goodsImage"> <!-- {{goodsItem.goodsthumb}} -->
                        </div>
                        <div class="info">
                            <div class="goods-name font-limit-2">{{item.goodsInfo.goodsName}}</div>
                            <div class="specifications">
                                <span v-for="(item1, index2) in item.goodsSpec.list" :key="index2">
                                    {{item1.attr}}: {{item1.name}};
                                </span>
                            </div>
                        </div>
                        <div class="price" v-if="item.goodsSpec.openSpec">￥{{item.goodsSpec.shopPrice}}</div>
                        <div class="price" v-if="!item.goodsSpec.openSpec">￥{{item.goodsInfo.shopPrice}}</div>
                        <div class="num">x{{item.goodsNum}}</div>
                    </div>
                </div>
                <div class="total">
                    <div class="item">
                        <div class="text">商品金额</div>
                        <div class="price">￥{{order.totalMoney}}</div>
                    </div>
                    <div class="item">
                        <div class="text">运费</div>
                        <div class="price">￥{{order.freightMoney}}</div>
                    </div>
                    <div class="item pay">
                        <div class="text">实际支付</div>
                        <div class="price">￥{{order.payMoney}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-info mt20">
            <div class="title">
                <i class="iconfont icon-dingdan1"></i>
                <div class="text">订单信息</div>
            </div>
            <div class="public-box">
                <div class="text">订单号：{{order.orderNo}}</div>
                <div class="copy" @click="copy">复制</div> <!-- 传入订单号 -->
            </div>
            <div class="public-box">
                <div class="text">下单时间：{{order.createTime}}</div>
            </div>
            <div class="note">
                <div>订单备注：</div>
                <div class="text">{{order.orderRemarks}}</div>
            </div>
        </div>
        <!-- 待付款 -->
        <div class="btn-box" :class="isIpx?'iphonexFixed':''" v-if="order.orderstatus==1">
            <div class="item marked" >立即付款</div>
        </div>
        <!-- 待发货 -->
        <div class="btn-box" :class="isIpx?'iphonexFixed':''" v-if="order.orderstatus==2">
            <div class="item">申请售后</div>
            <div class="item marked">提醒发货</div>
        </div>
        <!-- 待收货 -->
        <div class="btn-box" :class="isIpx?'iphonexFixed':''" v-if="order.orderstatus==3">
            <div class="item">申请售后</div>
            <div class="item marked">确认收货</div>
        </div>
        <!-- 交易完成 -->
        <div class="btn-box" :class="isIpx?'iphonexFixed':''" v-if="order.orderstatus==4">
            <div class="item">申请售后</div>
        </div>
        <!-- <div class="btn-box" v-if="order.orderstatus==2">
            <div class="item" @click="dialogVisible = true">申请售后</div>
        </div> -->
        <!-- 待收货 -->
        <!-- <div class="btn-box" :class="isIpx?'iphonexFixed':''" v-if="order.orderstatus==3">
            <div class="item marked" @click="confirm">确认收货</div>
        </div> -->
        <!-- 交易完成 -->
        <!-- <div class="btn-box" v-if="order.orderstatus==4">
            <div class="item">删除订单</div>
        </div> -->
        <!-- 待接单 -->
        <div class="btn-box" :class="isIpx?'iphonexFixed':''" v-if="order.orderstatus==7">
            <div class="item" @click="cancel">取消订单</div>
        </div>
        <!-- 交易完成 -->
        <div class="btn-box" :class="isIpx?'iphonexFixed':''" v-if="order.orderstatus==5">
            <div class="item">删除订单</div>
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
import { mapGetters } from 'vuex'
import { getOrderInfo, confirmOrder, cancelorder, delorder, backapply } from '@/api/getData'
import { getTimeStr } from '@/utils/date.js'
const dataStack = []

export default {
    data () {
        return {
            orderId: null,
            sno: null,
            dialogVisible: false,
            remarks: null,
            goodsInfo: [],
            order: {}
        }
    },
    computed: {
        ...mapGetters({
            isIpx: 'getIPhoneX'
        })
    },
    onLoad () {
        dataStack.push({...this.$data})
    },
    mounted () {
        console.log(this.$root.$mp.query)
        this.orderId = parseInt(this.$root.$mp.query.orderId)
        this.sno = this.$root.$mp.query.sno
        this.getOrderInfo()
    },
    methods: {
        // 获取订单详情
        async getOrderInfo () {
            let res = await getOrderInfo({orderId: this.orderId})
            console.log(res)
            this.order = res.data
            // this.goodsInfo = res.data.info
            this.order.createTime = getTimeStr(this.order.createTime * 1000)
        },
        // 复制
        copy () {
            wx.setClipboardData({
                data: this.order.ordersn,
                success:
                    res => {
                        wx.showToast({
                            title: '复制成功',
                            icon: 'none'
                        })
                    }
            })
        },
        // 申请退款
        async apply () {
            let res = await backapply({ordersn: this.orderno, remarks: this.remarks})
            if (res.code === 200) {
                this.dialogVisible = false
                wx.showToast({title: '申请成功', icon: 'none'})
                this.getOrderListInfo()
            }
        },
        // 确认收货
        confirm () {
            wx.showModal({
                title: '提醒',
                content: '是否收货',
                success:
                    async (res) => {
                        if (res.confirm) {
                            let response = await confirmOrder({ordersn: this.orderno, sno: this.sno})
                            wx.showToast({
                                title: '操作成功',
                                icon: 'none'
                            })
                            this.getOrderListInfo()
                        }
                    }
            })
        },
        // 取消订单
        cancel () {
            wx.showModal({
                title: '提醒',
                content: '是否取消订单',
                success:
                    async (res) => {
                        if (res.confirm) {
                            let response = await cancelorder({ordersn: this.orderno})
                            wx.showToast({
                                title: '取消成功',
                                icon: 'none'
                            })
                            this.getOrderListInfo()
                        }
                    }
            })
        }
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
    }
}
</script>

<style scoped lang="less">
.order-info{padding-bottom:100rpx;
    .img{height:200rpx;
        img{width:750rpx;height:200rpx;}
    }
    //height多加了30
    .icon{height:10rpx;width:750rpx;
        img{height:10rpx;width:750rpx;display:block;}
    }
    .container-list{background:#fff; padding-left: 24rpx;
        .title{display: flex; padding-right: 24rpx; height: 80rpx; border-bottom:1px solid #e5e5e5;align-items:center;
            .iconfont{font-size:28rpx;}
            .text{margin-left:24rpx;font-size:26rpx;color:#333;}
        }
        .box{
            .item{border-bottom:1px solid #e5e5e5;
                .goods-info{height:176rpx;padding:0 24rpx; padding-left: 0; display: flex;align-items: center;position:relative;
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
                .btn-order{display: flex;justify-content: flex-end;padding:0 24rpx;
                    .btn{width:180rpx;height:58rpx;line-height:58rpx;text-align:center;border:1px solid #ccc;border-radius:4px;font-size:28rpx;color:#666;}
                }
            }
            .total{padding:28rpx 24rpx 12rpx;
                .item{display: flex;border:none;padding-bottom:0;margin-bottom:12rpx;
                    .text{flex:1;font-size:24rpx;color:#333;}
                    .price{font-size:24rpx;color:#333;}
                }
                .pay{
                    .text{font-size:28rpx;color:#333;}
                    .price{font-size:28rpx;;color:#ff4c4f;}
                }
            }
        }
    }
    .container-info{background:#fff; padding-left: 24rpx;
        .title{height:80rpx;border-bottom:1px solid #e5e5e5;display: flex;align-items:center;
            .iconfont{font-size:30rpx;}
            .text{margin-left:24rpx;font-size:28rpx;color:#333;}
        }
        .public-box{height:80rpx;display:flex;align-items:center;margin-right: 24rpx; justify-content: space-between;border-bottom:1px solid #e5e5e5;
            .text{font-size:28rpx;color:#666;}
            .copy{width:108rpx;height:41rpx;line-height:41rpx;text-align:center;border:1px solid #e5e5e5;font-size:24rpx;color:#666;border-radius:4px;}
        }
        .note{min-height:80rpx;padding:20rpx 24rpx; padding-left: 0; margin-right: 24rpx; display:flex;font-size:28rpx;color:#666;
            .text{flex:1;}
        }
    }
    .btn-box{height:80rpx;width:730rpx;display:flex;justify-content:flex-end;align-items:center;background:#fff;position:fixed;bottom:0;left:0;border-top:1px solid #f5f5f5;padding-right:20rpx;
        .item{width:180rpx;height:58rpx;line-height:58rpx;text-align:center;border:1px solid #ccc;border-radius:4px;margin-right:40rpx;}
        .item:last-child{margin-right:0;}
        .marked{color:#f70044;border:1px solid #f70044;}
    }
    .iconfont{font-size:36rpx;}
    .dialog{width:100%;height:100%;background-color:#000;opacity:0.5;position: fixed;;left:0px;top:0px;z-index:1000;}
    .dialog-container{width:710rpx;background:#fff;position:fixed;left:50%;top:20%;transform:translate(-50%);z-index:1001;padding:20rpx 20rpx 0;
        .textarea{width:710rpx;height:200rpx;font-size:28rpx;}
        .dialog-btn{width:710rpx;height:80rpx;border-top:1px solid #f5f5f5;display:flex;align-items:center;justify-content: flex-end;
            .btn-item{width:160rpx;height:58rpx;line-height:58rpx;text-align:center;border:1px solid #ccc;border-radius:4px;}
        }
    }
}
</style>
