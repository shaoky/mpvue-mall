<template>
    <div class="container">
        <!-- v-if="user.token" -->
        <!-- 搜索 -->
        <div class="top">
            <!-- <div class="search" @click="goSearch">
                <div class="icon">
                    <i class="iconfont icon-wode"></i>
                </div>
                <div class="text">搜索商品</div>
            </div> -->
            <!-- 轮播图 -->
            <div class="banner">
                <swiper autoplay="true" indicator-dots="true" interval="3000" duration="500" class="banner-item">
                    <div v-for="item in adList" :key="item.id">
                        <swiper-item>
                            <img :src="item.imageUrl" class="slide-image" width="100%" height="150" @click='goBannerInfo(item)'/>
                        </swiper-item>
                    </div>
                </swiper>
            </div>
            <!-- <div class="swiper-container">
                <div :class="['swiper-icon',current == index?'active':'']" v-for="(item,index) in adlist.length" :key="index"></div>
            </div> -->
        </div>

        <!-- 热销产品 -->
        <div class="goods mt20">
            <div class="title">热销商品</div>
            <div class="content">
                <div class="item" v-for="item in goodsList" :key="item.id" @click="goInfo(item.goodsId)">
                    <div class="image">
                        <img :src="item.goodsImage">
                    </div>
                    <div class="text">
                        <div class="goods-title ov">{{item.goodsName}}</div>
                        <div class="price">
                            <div class="left">
                                <span>￥{{item.shopPrice}}</span>
                                <!-- <del>￥{{item.marketPrice}}</del> -->
                            </div>
                            <!-- <div class="sales">已售{{item.saleCount}}件</div> -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- 查看更多 -->
            <div class="weui-loadmore" v-if="loading">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            <!-- <div class="more" @click="onMore" v-if="!loading && isNext">查看更多</div> -->
        </div>

    </div>
</template>

<script>
import { getIndexData, getGoodsList } from '@/api/getData'

export default {
    data () {
        return {
            loading: true,
            isNext: true,
            user: {},
            search: {},
            adList: [],
            goodsList: [],
            isPush: true
        }
    },

    mounted () {
        // 调用应用实例的方法获取全局数据
        // this.login()
        this.getGoodsList()
    },

    onShow () {
        // this.hotlist = []
        this.search = {
            // sid: 3,
            page: 0,
            size: 10
        }
        this.getIndexData()

        // wx.getLocation({
        //     type: 'wgs84',
        //     success: (res) => {
        //         wx.setStorageSync('location', res)
        //     }
        // })
    },
    onReachBottom () {
        this.loading = true
        this.search.page++
        this.getGoodsList()
        setTimeout(() => {
            this.loading = false
        }, 1000)
    },
    onPullDownRefresh () {
        // setTimeout(() => {},1500)
        this.goodsList = []
        this.search = {
            // sid: 3,
            page: 0,
            size: 10
        }
        // if (this.isPush) {
        this.getIndexData()
        this.getGoodsList()
        // }

        // this.getRecommendList()
        // setTimeout(() => {
        //     wx.stopPullDownRefresh()
        // }, 1500)
    },

    methods: {
        // 获取产品图片
        async getGoodsList () {
            let res = await getGoodsList(this.search)
            console.log(res.data)
            if (res.code === 200) {
                for (let item of res.data.list) {
                    this.goodsList.push(item)
                }
                if (res.data.list.length < this.search.size) {
                    this.loading = false
                }
            }
        },
        async getIndexData () {
            const res = await getIndexData()
            this.adList = res.data.adList
        },

        goBannerInfo (item) {
            // 跳商品
            if (item.type === 1) {
                console.log()
                if (item.opertation === '') {
                    return
                }
                if (isNaN(item.opertation)) {
                    return
                }
                wx.navigateTo({
                    url: `/pages/goods/info/main?goodsno=${item.opertation}`
                })
            }

            if (item.type === 2) {
                if (!item.opertation) {
                    return
                }
                wx.navigateTo({
                    url: `/pages/h5/main?url=${item.opertation}`
                })
            }
        },

        onMore () {

        },
        goSearch () {
            const url = '../goods/list/main'
            wx.switchTab({ url })
        },
        getUserInfo () {
        // 调用登录接口
        // wx.login({
        //     success: () => {
        //     wx.getUserInfo({
        //         success: (res) => {
        //         this.userInfo = res.userInfo
        //         }
        //     })
        //     }
        // })
        },
        clickHandle (msg, ev) {
            console.log('clickHandle:', msg, ev)
        },
        goInfo (id) {
            wx.navigateTo({
                url: `/pages/goods/info/main?goodsId=${id}`
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/define.less";
    .container{}
    .top{}
    .search{display: flex; align-items: center; justify-content: center;height: 68rpx; margin: 0 24rpx; background: #f0f0f0;
        .icon{ margin: 0 16rpx 0 30rpx;
            .iconfont{color: #999; font-size: 40rpx;}
        }
        .text{color: #999; font-size: 26rpx;}
    }
    .banner-title{ height: 107rpx; line-height: 107rpx; font-weight: 700; text-align: center; font-size: 32rpx;}
    .banner{ height: 398rpx; position: relative;
        .banner-item{height: 100%;}
        .slide-image{width: 100%; height: 398rpx;}
    }
    .swiper-container{height:60rpx;padding-bottom:20rpx;display:flex;justify-content: center;align-items:center;
        .swiper-icon{width:12rpx;height:12rpx;border-radius:50%;background:#999;content:'';margin-right:20rpx;}
        .active{width:40rpx;height:12rpx;border-radius:10rpx;background:#333;content:'';}
        .swiper-icon:last-child{margin-right:0rpx;}
    }
    .goods{width: 100%; margin-top: 35rpx; background: #fff; padding-bottom: 10rpx;
        .title{height: 92rpx; line-height: 92rpx; font-size: 32rpx; font-weight: 700; text-indent: 31rpx;}
        .content{padding: 0 17rpx;
            .item{width: 342rpx; float: left; margin: 0 7rpx 16rpx; border: 1px solid #eeeeee;
                .image{width: 342rpx; height: 342rpx;
                    img{width: 342rpx; height: 342rpx;}
                }
                .integral{
                    span{border-radius: 5px; margin-right: 12rpx; color: #fff; padding: 0 5rpx;}
                    .orange{background: #ff9900;}
                    .red{background: #ff0060;}
                }
                .text{padding: 0 15rpx;
                    .goods-title{font-size: 28rpx; height: 58rpx; line-height: 58rpx;}
                    .price{display: flex; align-items: center; height: 60rpx; padding-bottom: 16rpx;
                        .left{flex: 1;
                            span{font-size: 30rpx; color: #ff4c4c; display: inline-block;}
                            del{color: #999; font-size: 30rpx; margin: 0 0 0 18rpx; display: inline-block;}
                        }
                    }
                }
            }
            &::after{.clear;}
        }
        .weui-loadmore{margin:  12rpx 0 15rpx 0; height: 54rpx;}
        .more{width: 214rpx; height: 54rpx; line-height: 54rpx; text-align: center; border-radius: 5px; color: #333;
        margin: 24rpx auto 0 auto; border: 1rpx solid #999;}
    }
</style>
