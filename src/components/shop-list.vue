<template>
    <div class="shop-list">
        <div class="item" v-for="item in list" :key="item.id" @click="goInfo(item)">
            <div class="image">
                <img :src="item.goodsImage">
                <div class="sell-out" v-if="item.stock === 0">已售罄</div>
            </div>
            <div class="text">
                <div class="goods-title ov">{{item.goodsName}}</div>
                <div class="price">
                    <div class="left">￥{{item.shopPrice}}<br/>
                    <!-- <del>￥{{item.marketprice}}</del> -->
                    </div>
                    <!-- <div class="addCart" @click.stop="addShopCart(item)"> -->
                        <!-- <i class="icon-gouwuche iconfont"></i> -->
                    <!-- </div> -->
                </div>
            </div>
        </div>
        <div class="weui-loadmore" v-if="loading">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">正在加载</span>
        </div>
    </div>
</template>

<script>
import { addShopCart } from '@/api/getData'

export default {
    data () {
        return {
            loading: true
        }
    },

    props: ['list', 'loading'],

    methods: {
        goInfo (row) {
            // let no = row.no || row.goodsno
            wx.navigateTo({
                url: `/pages/goods/info/main?goodsId=${row.goodsId}`
            })
        },
        // 添加到购物车
        async addShopCart (row) {
            let res = await addShopCart({
                goodsno: row.no || row.goodsno,
                goodsnumber: 1
            })
            if (res.code === 200) {
                wx.showToast({
                    title: res.message,
                    icon: 'none'
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import "../assets/less/define.less";

.shop-list{margin-left: -16rpx;
    .item{width: 367rpx; float: left; margin: 0 0 15rpx 16rpx; background: #fff; padding-bottom: 10rpx;
        .image{width: 367rpx; height: 342rpx; position: relative;
            img{width: 367rpx; height: 342rpx;}
            .sell-out{position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; line-height: 120rpx; font-size: 26rpx; color: #fff; text-align: center; width: 120rpx; height: 120rpx; background: rgba(0, 0, 0, .5); border-radius: 50%;}
        }
        .text{padding: 0 15rpx;
            .goods-title{font-size: 28rpx; height: 58rpx; line-height: 70rpx;}
            .price{display: flex; align-items: center;
                .left{flex: 1; color: #ff4c4c; font-size: 30rpx;
                    del{font-size: 24rpx; color: #999; margin: -8rpx 0 0 8rpx;}
                }
                .addCart{
                    .iconfont{
                        // margin-top: 5rpx;
                        font-size: 38rpx; color: #f70044; display: inline-block;}
                }
            }
        }
    }
    &::after{.clear;}
}
</style>
