<template>
    <div class="container" v-bind:class="popupVisible ? 'body-hidden' : ''">
        <!-- 搜索 -->
        <div class="search">
            <div class="left">
                <i class="iconfont icon-wode" @click="onScreening(4)"></i>
                <input type="text" placeholder="商品名称" :focus="focus" v-model="search.goodsName" @change="onScreening(4)">
            </div>
            <div class="type" @click="onPopup">
                <i class="iconfont icon-sort"></i>
            </div>
        </div>

        <!-- 筛选 -->
        <div class="screening">
            <div class="item" :class="screeningCurrent === 0 ? 'active' : ''" @click="onScreening(0)">默认</div>
            <div class="item" :class="screeningCurrent === 1 ? 'active' : ''" @click="onScreening(1)">销量
               <img src="/static/images/common/icon-price.png" v-if="search.sales === null">
                <img src="/static/images/common/icon-price-bottom.png" v-if="search.sales === 1">
                <img src="/static/images/common/icon-price-top.png" v-if="search.sales === 2">
            </div>
            <!-- <div class="item" :class="screeningCurrent === 2 ? 'active' : ''" @click="onScreening(2)">价格
                <img src="/static/images/common/icon-price.png" v-if="search.prices === null">
                <img src="/static/images/common/icon-price-bottom.png" v-if="search.prices === 1">
                <img src="/static/images/common/icon-price-top.png" v-if="search.prices === 2">
            </div> -->
            <div class="item" :class="screeningCurrent === 3 ? 'active' : ''" @click="onScreening(3)">新品</div>
            <div class="icon">
                <i class="icon-shangpinfenlei iconfont" v-if="listOrder === 0" @click="listOrder = 1"></i>
                <i class="icon-liebiaoxingshi iconfont" v-if="listOrder === 1" @click="listOrder = 0"></i>
            </div>
        </div>

        <!-- 商品列表 1排 -->
        <div class="list-view" v-if="listOrder === 0">
            <div class="item" v-for="item in goodslist" :key="item.id"  @click="goInfo(item.goodsId)">
                <div class="image">
                    <img :src="item.goodsImage">
                    <div class="sell-out" v-if="item.stock === 0">已售罄</div>
                </div>
                <div class="content">
                    <div class="title font-limit-2">{{item.goodsName}}</div>
                    <div class="spec"></div>
                    <div class="price">
                        <div class="left">
                            <span>￥{{item.shopPrice}}</span>
                            <!-- <del>￥{{item.marketprice}}</del> -->
                        </div>
                        <!-- <div class="cart" @click.stop="addShopCart(item.no)"> -->
                            <!-- <i class="iconfont icon-gouwuche"></i> -->
                        <!-- </div> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- 商品列表 2排 -->
        <div class="mt20" v-if="listOrder === 1">
            <shop-list :list="goodslist"></shop-list>
        </div>

        <!-- 分类 -->
        <div class="v-popup v-popup-right" v-show="popupVisible">
            <div class="all" @click="onType('')">全部商品</div>
            <div class="type">
                <div class="item" v-for="(item, index) in typeList" :key="index">
                    <div class="title" @click="onType(item.categoryName)">{{item.categoryName}}</div>
                    <div class="content" v-if="item.children">
                        <div class="children" v-for="(item1, itemIndex) in item.children" :key="itemIndex" @click="onType(item.categoryName)">{{item1.categoryName}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="v-modal" v-if="popupVisible" @click="onModal"></div>

        <!-- <div class="weui-loadmore weui-loadmore_line" v-if="goodslist.length === 0">
            <span class="weui-loadmore__tips_in-line">暂无数据</span>
        </div> -->
        <div class="weui-loadmore" v-if="loading && isNext">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">正在加载</span>
        </div>
        <!-- <div class="pop-right">
            <div class="type">
                <div class="item" v-for="(item, index) in type" :key="index">
                    <div class="title">{{item.name}}</div>
                    <div class="children" v-for="(item1, itemIndex) in item.children" :key="itemIndex">{{item1.name}}</div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import { getGoodsList, getGoodsCategory } from '@/api/getData'
import shopList from '@/components/shop-list'

export default {
    data () {
        return {
            loading: true,
            isNext: true,
            focus: false, // 是否把光标定位在搜索框内
            popupVisible: false,
            listOrder: 1, // 0：1排，1：2排
            search: {
                sid: 3,
                orders: null,
                prices: null,
                sales: null,
                page: 0,
                size: 10
            },
            searchDefault: {},
            goodslist: [],
            screeningCurrent: 0,
            typeList: [],
            isGoodsPush: true
        }
    },

    mounted () {
        this.searchDefault = {...this.search}
        this.getGoodsList()
        // this.getGoodsCategory()
    },

    methods: {
        async getGoodsList () {
            let res = await getGoodsList(this.search)
            // this.data = res.data
            if (res.code === 200) {
                if (res.data.list.length > 0) {
                    res.data.list.forEach(item => {
                        this.goodslist.push(item)
                    })
                    if (res.data.list.length < this.search.size) {
                        this.isNext = false
                    }
                    console.log(this.goodslist)
                } else {
                    this.isNext = false
                }
            }
        },

        async getGoodsCategory () {
            let res = await getGoodsCategory()
            if (res.code === 200) {
                this.typeList = res.data
            }
        },

        onType (name) {
            this.search.goodsclassname = name
            this.goodslist = []
            this.getGoodsList()
            this.popupVisible = false
        },

        onScreening (index) {
            this.goodslist = []
            // 默认
            if (index === 0) {
                this.search = {...this.searchDefault}
            }
            // 销量
            if (index === 1) {
                this.search.orders = null
                if (this.search.sales === null || this.search.sales === 2) {
                    this.search.sales = 1
                } else if (this.search.sales === 1) {
                    this.search.sales = 2
                }
            }
            // 价格
            if (index === 2) {
                this.search.orders = null
                if (this.search.prices === null || this.search.prices === 2) {
                    this.search.prices = 1
                } else if (this.search.prices === 1) {
                    this.search.prices = 2
                }
            } else {
                // this.search.prices = 0
            }
            // 新品
            if (index === 3) {
                this.search.sales = null
                this.search.prices = null
                this.search.orders = 2
            }

            // 标题搜索
            if (index === 4) {
                this.getGoodsList()
                return
            }

            this.screeningCurrent = index

            this.getGoodsList()
        },
        onPopup () {
            this.popupVisible = true
        },
        onModal () {
            this.popupVisible = false
        },
        goInfo (id) {
            wx.navigateTo({
                url: `/pages/goods/info/main?goodsId=${id}`
            })
        },
        // 添加到购物车
        async addShopCart (no) {
            console.log(no)
            let res = await addShopCart({
                goodsno: no,
                goodsnumber: 1
            })
            if (res.code === 200) {
                wx.showToast({
                    title: res.message,
                    icon: 'none'
                })
            }
        }
    },

    onReachBottom () {
        if (this.isGoodsPush === false) { return }
        this.isGoodsPush = true
        // this.loading = true
        setTimeout(() => {
            this.search.page++
            this.getGoodsList()
        }, 1000)
    },

    components: {
        shopList
    }
}
</script>

<style lang="less" scoped>
    /* 有个问题，页面会返回到顶部，另外京东的小程序是没有屏蔽底层滑动
     * 这个效果只适用于按钮在头部这种情况
     */
    .body-hidden{ height: 100%; position: fixed;}  //overflow: hidden;

    // 搜索
    .search{display: flex; align-items: center; width: 100%; height: 60rpx; padding: 20rpx 0; background: #fff;
        .left{background: #eaeaea; margin-left: 23rpx; height: 60rpx; flex: 1; border-radius: 16rpx; display: flex; align-items: center;
            .iconfont{font-size: 34rpx; color: #999; margin: 0 16rpx 0 26rpx;}
            input{width: 100%; color: #999; font-size: 28rpx;}
        }
        .type{margin: 0 30rpx;
            .iconfont{color: #999; font-size: 50rpx;}
        }
    }

    // 筛选
    .screening{display: flex; align-items: center; height: 88rpx; background: #fff;
        .item{flex: 1; text-align: center; font-size: 28rpx; color: #999;
            img{width: 13rpx; height: 20rpx;}
            &.active{color: #f70044;}
        }
        .icon{position: relative; width: 116rpx; text-align: center;
            .icon-liebiaoxingshi{font-size: 38rpx!important;}
            .iconfont{font-size: 34rpx; color: #999; display: inline;}
            &::after{
                position: absolute;
                top: 14rpx;
                bottom: 0;
                left: 0;
                margin: 0 auto;
                height: 26rpx;
                width: 1rpx;
                background: #e5e5e5;
                display: block;
                content: "";
            }
        }
    }

    // 商品列表
    .list-view{
        .item{display: flex; padding: 28rpx 24rpx 28rpx 28rpx; background: #fff; border-top: 1rpx solid #e5e5e5;
            .image{width: 168rpx; height: 168rpx; position: relative;
                img{width: 100%; height: 100%;}
                .sell-out{position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; line-height: 120rpx; font-size: 26rpx; color: #fff; text-align: center; width: 120rpx; height: 120rpx; background: rgba(0, 0, 0, .5); border-radius: 50%;}
            }
        }
        .content{margin-left: 16rpx; flex: 1;
            .title{font-size: 28rpx; color: #222; line-height: 32rpx;}
            .price{margin-top: 15rpx; display: flex; align-items: center;
                .left{flex: 1;
                    span{font-size: 30rpx; color: #ff4c4c;}
                    del{color: #999; font-size: 24rpx; margin: -10rpx 0 0 8rpx;}
                }
                .cart{
                    .iconfont{color: #f70044; font-size: 38rpx;}
                }
            }
        }
    }

    // 商品分类
    .v-popup-right{width: 300rpx; height: 100%; text-align: center; overflow-y: auto; z-index: 2001;
        .all{height: 96rpx; line-height: 96rpx; font-size: 32rpx; color: #f70044;}
        .type{
            .item{
                .title{height: 93rpx; line-height: 93rpx; font-size: 32rpx; color: #000; border-top: 1rpx solid #e5e5e5; border-bottom: 1rpx solid #e5e5e5;}
                .content{padding: 10rpx 0;
                    .children{height: 66rpx; line-height: 66rpx; font-size: 28rpx; color: #666;}
                }
            }
        }
    }
</style>
