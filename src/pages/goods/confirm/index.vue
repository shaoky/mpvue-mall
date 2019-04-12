<template>
    <div class="container">
        <div class="v-address" @click="goAddress" :class="{address: address}">
            <i class="iconfont icon-dizhi"></i>
            <div class="container" v-if="deAddress.addressId">
                <div class="contact">
                    <span>收货人：{{deAddress.userName}}</span>
                    <span class="tel">{{deAddress.userPhone}}</span>
                </div>
                <div class="info font-limit-2">
                    收货地址：{{deAddress.provinceName + deAddress.cityName + deAddress.countyName + deAddress.detailInfo}}
                </div>
            </div>
            <div class="container" v-if="!deAddress.addressId">
                <div class="contact" v-if="address.addressId">
                    <span>收货人：{{address.userName}}</span>
                    <span class="tel">{{address.userPhone}}</span>
                </div>
                <div class="info font-limit-2" v-if="address.addressId">
                    收货地址：{{address.provinceName + address.cityName + address.countyName + address.detailInfo}}
                </div>
                <div class="contact" v-if="!address.addressId">
                    <span>请添加地址</span>
                </div>
            </div>
            <i class="iconfont icon-more"></i>
        </div>
        <div class="icon">
            <img src="/static/images/order/jianbian.png">
        </div>

        <div class="container-list mt20 pl24">
            <div class="title">
                <i class="iconfont icon-dingdan"></i>
                <div class="text">购物清单</div>
            </div>
            <div class="box">
                 <div class="item" v-for="(item, index) in order.goodsList" :key="index"> <!-- v-for -->
                    <div class="goods-info">
                        <div class="icon">
                            <img :src="item.goodsInfo.goodsImageFull">
                        </div>
                        <div class="info">
                            <div class="goods-name font-limit-2">{{item.goodsInfo.goodsName}}</div>
                            <div class="specifications">
                                <span v-for="(item1, index1) in item.goodsSpec.list" :key="index1">
                                    {{item1.attr}}: {{item1.name}};
                                </span>
                            </div>
                        </div>
                        <div class="price" v-if="item.goodsSpec.openSpec">￥{{item.goodsSpec.shopPrice}}</div>
                        <div class="price" v-if="!item.goodsSpec.openSpec">￥{{item.goodsInfo.shopPrice}}</div>
                        <div class="num">x{{item.goodsNum}}</div>
                    </div>
                    <!-- <div class="btn-order">
                        <div class="btn">订单操作</div>
                    </div> -->
                </div>
            </div>
        </div>

        <div class="v-group mt20+">
            <div class="v-cell">
                <div class="v-cell__title">付款方式</div>
                <div class="v-cell__sub">货到付款</div>
                <i class="iconfont icon-more"></i>
            </div>
            <div class="v-cell">
                <div class="v-cell__title">商家留言</div>
                <div class="message">
                    <input type="text" placeholder="请输入留言内容" v-model="form.orderRemarks">
                </div>
                <i class="iconfont icon-more"></i>
            </div>
        </div>

        <div class="total mt20">
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

        <div class="footer" :class="isIpx?'iphonexFixed':''">
            <div class="text">实付款:<span class="price">￥{{order.payMoney}}</span></div>
            <div class="submit" @click="onSubmit">提交订单</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addOrder, getOrderGoodsPreview, getOrderCartPreview, getAddressDefault } from '@/api/getData'
import regionTransform from '@/components/regionTransform'

export default {
    data () {
        return {
            search: {
                goodsId: null,
                cartId: null,
                goodsSpec: null
            },
            order: {

            },
            form: {
                payType: 1 // 1:货到付款 2:在线支付
            },
            deAddress: {}
        }
    },

    computed: {
        ...mapGetters({
            isIpx: 'getIPhoneX',
            address: 'getAddress'
        })
    },

    onShow () {
        this.search.goodsId = parseInt(this.$root.$mp.query.goodsId)
        this.search.cartId = parseInt(this.$root.$mp.query.cartId)
        if (this.search.goodsId) {
            this.search.goodsNum = parseInt(this.$root.$mp.query.goodsNum)
            this.search.goodsSpec = JSON.parse(this.$root.$mp.query.goodsSpec)
            this.getOrderGoodsPreview()
        }
        if (this.search.cartId) {
            this.getOrderCartPreview()
        }
        this.getAddressDefault()
        // if (this.order.objaddress.length > 0) {
        //     for (let item of this.order.objaddress) {
        //         if (item.isdefault === 2) {
        //             this.deAddress = item
        //         }
        //     }
        // }

        // let that = this
        // wx.getLocation({
        //     type: 'wgs84',
        //     success: function (res) {
        //         console.log(res)
        //         that.form.latitude = res.latitude
        //         that.form.longitude = res.longitude
        //         // var speed = res.speed
        //         // var accuracy = res.accuracy
        //     }
        // })

        // console.log(this.address)

        // this.form = this.order
        // console.log(this.$root.$mp)
        // this.data = JSON.parse(this.$root.$mp.query.data)
        // console.log(this.data)
    },

    methods: {
        async getAddressDefault () {
            let res = await getAddressDefault()
            console.log(res)
            this.deAddress = res.data
        },
        async getOrderGoodsPreview () {
            let res = await getOrderGoodsPreview({goodsId: this.search.goodsId, goodsNum: this.search.goodsNum, goodsSpec: this.search.goodsSpec})
            // let goodsSpec = JSON.parse(this.$root.$mp.query.goodsSpec)
            if (this.search.goodsSpec) {
                res.data.goodsList[0].goodsSpec = this.search.goodsSpec
                res.data.goodsList[0].goodsSpec.openSpec = true
            }
            this.form.goodsList = res.data.goodsList
            this.order = res.data
            // let sku = JSON.parse(this.$root.$mp.query.sku)
            // if (sku) {
            //     this.form.goodsList[0].goodsSpec = sku
            // }
        },
        async getOrderCartPreview () {
            let res = await getOrderCartPreview({cartId: this.search.cartId})
            this.form.goodsList = res.data.goodsList
            this.order = res.data
        },
        async onSubmit () {
            console.log(this.form)
            if (this.deAddress.addressId) {
                this.form.addressId = this.deAddress.addressId
            } else {
                this.form.addressId = this.address.addressId
            }

            if (!this.form.addressId) {
                wx.showToast({
                    title: '请选择地址',
                    icon: 'none'
                })
                return
            }

            // this.form.json = this.order.obj
            // this.form.ordermoney = this.order.alltotal
            // this.form.amountable = this.order.newtotal
            // this.form.distributionfee = this.order.fee
            // console.log(this.form)
            await addOrder(this.form)
            console.log(getCurrentPages())
            wx.redirectTo({
                url: '/pages/goods/success/main'
            })
        },
        goAddress () {
            wx.navigateTo({
                url: '/pages/user/address/main?state=1'
            })
        }
    },
    components: {
        regionTransform
    }
}
</script>

<style lang="less" scoped>
    .message{flex: 3;}
    .address{height: auto;}

    .icon{height:10rpx;width:750rpx;
        img{height:10rpx;width:750rpx;display:block;}
    }
    .container-list{background:#fff;
        .title{display: flex;padding:24rpx;align-items:center; padding-left: 0;
            .iconfont{font-size:28rpx;}
            .text{margin-left:12rpx;font-size:26rpx;color:#333;}
        }
        .box{
            .item{border-top:1px solid #e5e5e5;padding-bottom:24rpx;
                .goods-info{height:176rpx;padding:0 24rpx; padding-left: 0; display: flex;align-items: center;position:relative;
                    .icon{width:120rpx;height:120rpx;margin-right:24rpx;
                        img{width:120rpx;height:120rpx;}
                    }
                    .info{width:380rpx;height:120rpx;position:relative;
                        .goods-name{font-size:26rpx;color:#333;}
                        .specifications{position:absolute;bottom:0;left:0;font-size:24rpx;color:#999;}
                    }
                    .price{position:absolute;right:24rpx;top:26rpx;font-size:26rpx;color:#333;}
                    .num{position:absolute;right:24rpx;bottom:26rpx;;font-size:26rpx;color:#333;}
                }
                .btn-order{display: flex;justify-content: flex-end;padding:0 24rpx;
                    .btn{width:180rpx;height:58rpx;line-height:58rpx;text-align:center;border:1px solid #ccc;border-radius:4px;font-size:28rpx;color:#666;}
                }
            }

        }
    }

    .total{padding:28rpx 24rpx 12rpx; background: #fff; margin-bottom: 130rpx;
        .item{display: flex;border:none;padding-bottom:0;margin-bottom:12rpx;
            .text{flex:1;font-size:24rpx;color:#333;}
            .price{font-size:24rpx;color:#333;}
        }
        .pay{
            .text{font-size:28rpx;color:#333;}
            .price{font-size:28rpx;;color:#ff4c4f;}
        }
    }

    .footer{position: fixed; bottom: 0; left: 0; right: 0; display: flex; z-index: 1000; border-top: 1rpx solid #e5e5e5; background: #fff;
        .text{flex: 1; background: #fff; line-height: 104rpx; padding-left: 20rpx; font-size: 30rpx;
          .price{color: #f71e35;}
        }
        .submit{width: 268rpx;background: #f70044; height: 100%; line-height: 104rpx; text-align: center; font-size: 32rpx; color: #fff;}
    }
</style>
