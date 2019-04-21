<template>
    <div class="container" v-if="data.loading">
        <!-- <div :class="isIpx?'iphonex':''"></div> -->
        <div class="banner">
            <swiper indicator-dots="true" autoplay="true" interval="3000" duration="500" class="banner" :current="data.swiperCurrent" @change="swiperChange">
                <div v-for="item in getData.info.goodsBannerList" :key="item.id">
                    <swiper-item>
                        <img :src="item.imageUrl" class="slide-image" width="100%" height="150" @click='gotoLikeInfo'/>
                    </swiper-item>
                </div>
            </swiper>
           <div class="order" v-if="getData.info.goodsImageBanner">
               {{data.swiperCurrent + 1}}/{{getData.info.goodsImageBanner.length}}
           </div>
        </div>
        <div class="goods-info">
            <div class="title font-limit-2">{{getData.info.goodsName}}</div>
            <div class="price">商品价:￥{{getData.info.shopPrice}}</div>
            <div class="marketPrice">
                <div class="left del">市场价:￥{{getData.info.marketPrice}}</div>
                <div class="sales">销量: {{getData.info.saleCount}}</div>
            </div>
        </div>
        <!-- <div class="goods-more">
            <div class="item">
                <div class="icon">
                    <img src="/static/images/goods/icon-01.jpg">
                </div>
                <div class="text">起订量：{{getData.info.minimum || 0}}件</div>
            </div>
            <div class="item">
                <div class="icon">
                    <img src="/static/images/goods/icon-02.jpg">
                </div>
                <div class="text">限购量：{{getData.info.qualified || 0}}件</div>
            </div>
            <div class="item">
                <div class="icon">
                    <img src="/static/images/goods/icon-03.jpg">
                </div>
                <div class="text">库存量：{{getData.info.stock}}件</div>
            </div>
        </div> -->
        <div class="goods-details mt20" :class="isIpx?'ipx-details':''">
            <!-- <div class="v-tabs">
                <div class="item">1</div>
                <div class="item avtive">2</div>
            </div> -->
            <scroll-view scroll-x class="v-tabs">
                <div class="item" :class="data.tabsCurrent === 0 ? 'active' : ''" @click="tabsChange(0)">图文详情</div>
                <div class="item" :class="data.tabsCurrent === 1 ? 'active' : ''" @click="tabsChange(1)">规格参数</div>
            </scroll-view>
            <div class="tabs-content">
                <div class="item" v-if="data.tabsCurrent === 0">
                    <div class="image" v-for="item in getData.info.goodsDetailList" :key="item.id">
                        <img :src="item.imageUrl" mode="widthFix">
                    </div>
                </div>
                <div class="item text" v-if="data.tabsCurrent === 1">
                    <p v-for="item in getData.info.goodsAttr" :key="item.id" v-if="item.value">{{item.title}}：{{item.value}}</p>
                </div>
            </div>
            <!-- 下面这张高度不好自适应 -->
            <!-- <swiper class="tabsSwiper" :current="tabsCurrent" @change="tabsChange">
                <swiper-item class="swiper-item">
                    <div class="image" v-for="item in data.goods.imageList" :key="item.id">
                        <img :src="item">
                    </div>
                </swiper-item>
                <swiper-item>
                    1
                </swiper-item>
            </swiper> -->
        </div>
        <div class="footer" :class="isIpx?'iphonexFixed':''">
            <div class="icon-home" @click="goHome">
                <img src="/static/images/goods/icon-home.png">
            </div>
            <div class="icon-cart" @click="goCart">
                <i class="icon-gouwuche1 iconfont"></i>
            </div>
            <div class="add-cart" @click="data.popupVisible = true, isAddCart = true">加入购物车</div>
            <div class="bay" @click="data.popupVisible = true, isAddCart = false">立即购买</div>
        </div>

        <div class="v-popup v-popup-bottom" :class="data.popupVisible ? 'show' : ''">
            <div class="goods-content">
                <div class="image">
                  <img :src="getData.info.goodsImage">
                </div>
                <div class="info">
                    <div class="price">￥{{data.thisGoodsSpec.shopPrice || getData.info.shopPrice}}</div>
                    <div class="text">(库存:{{data.thisGoodsSpec.goodsStock || getData.info.goodsStock}}件)</div>
                </div>
            </div>
            <div class="goods-scroll">
                <!-- <div class="goods-spec">
                    <div class="attr" v-for="(item, index1) in getData.info.goodsSpec.goodsAttrList" :key="index1">
                        {{item.name}}
                        <ul class="value">
                            <li
                                v-for="(item1, index2) in item.children"
                                :key="index2"
                                :class="[item.activeName === item1.name ? 'active' : '']"
                                @click="onSpec(item, item1)">{{item1.name}}
                            </li>
                        </ul>
                    </div>
                </div> -->
                <div class="goods-num">
                    <div class="text">购买数量</div>
                    <div class="input">
                        <div class="reduce" @click="shopNumEdit(0)">
                            <i class="iconfont icon-jianhao"></i>
                        </div>
                        <input type="number" v-model.number="data.form.goodsNum"  @change="shopNumEdit(2)">
                        <div class="add" @click="shopNumEdit(1)">
                            <i class="iconfont icon-jiahao1"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sumbit v-submit-footer" @click="onSubmit">确认</div>
        </div>

        <div class="v-modal" v-if="data.popupVisible" @click="onModal"></div>
    </div>
</template>

<script>
import { getGoodsInfo, addCart } from '@/api/getData'
import { mapMutations, mapGetters } from 'vuex'
import { setTimeout } from 'timers'

export default {
    data () {
        return {
            search: {
                goodsId: null
            },

            isAddCart: false, // 是否加到购物车里

            getData: {
                info: {},
                // info: {
                //     goodsSpec: {
                //         goodsAttrList: {}
                //     }
                // }
            },
            shopAttrList: [],
            goods: {
                info: {}
            },
            data: {
                loading: false,
                goods: {},
                userInfo: {},
                swiperCurrent: 0,
                tabsCurrent: 0,
                popupVisible: false, // 选择规格弹框
                form: {
                    goodsNum: 1
                },
                thisGoodsSpec: {
                    shopPrice: null
                }
            },
            saveData: ''

        }
    },

    computed: {
        ...mapGetters({
            isIpx: 'getIPhoneX'
        })
    },

    mounted () {
        this.saveData = JSON.stringify(this.data)
        this.search.goodsId = parseInt(this.$root.$mp.query.goodsId)
        this.data.user = wx.getStorageSync('user')
        // this.search.goodsId = 41
        // this.search = this.$root.$mp.query
        this.getGoodsInfo()
    },

    methods: {
        ...mapMutations(['setCart']),
        // 获取商品详情
        async getGoodsInfo () {
            try {
                let res = await getGoodsInfo(this.search)
                if (res.code === 200) {
                // res.data.item.wholesalePrice = (res.data.item.regionprice * 1.1).toFixed(2)
                    // for (let item of res.data.goodsSpec.goodsAttrList) {
                    //     item.activeName = ''
                    // }
                    this.getData = res.data
                    this.data.loading = true
                    // this.data.form.goodsnumber = parseInt(this.getData.item.minimum) || 0
                }

                // let res1 = await getShopAttr({
                //     goodsclassid: this.getData.item.goodsclassid,
                //     page: 0,
                //     size: 1000
                // })
                // this.shopAttrList = res1.data
                // for (let item of this.shopAttrList) {
                //     for (let key in this.getData.item) {
                //         if (key === item.field) {
                //             item.value = this.getData.item[key]
                //         }
                //     }
                // }
               
            } catch (err) {
                if (err.code === 500) {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 2000)
                }
            }
        },

        // 添加到购物车
        async addShopCart (state) {
            console.log(1)
            let res = await addCart({
                goodsId: this.search.goodsId,
                goodsNum: this.data.form.goodsNum,
                // goodsSpec: this.data.thisGoodsSpec
            })
            if (res.code === 200) {
                wx.showToast({
                    title: res.message,
                    icon: 'none'
                })
                this.data.popupVisible = false
                if (this.getData.item.stock > 0 && state === 1) {
                    this.goCart()
                }
            }
        },

        // 没有效果，待解决
        swiperChange (e) {
            this.data.swiperCurrent = e.target.current
            // console.log('bindchange事件', `this.data.index:${this.data.index} e.detail.current:${e.detail.current}`)
        },
        tabsChange (index) {
            this.data.tabsCurrent = index
        },
        goHome () {
            wx.switchTab({
                url: '/pages/index/main'
            })
        },
        goCart () {
            wx.switchTab({
                url: '/pages/cart/main'
            })
        },
        onModal () {
            this.data.popupVisible = false
        },
        shopNumEdit (val) {
            // 0是减少，1是增加，2是监听
            let goodsNum = this.data.form.goodsNum
            let stock = this.getData.info.goodsStock
            // let qualified = this.getData.item.qualified

            if (val === 0) {
                if (goodsNum <= 1) {
                    return
                }
                goodsNum--
            }

            if (val === 1) {
                if (goodsNum > stock - 1) {
                    wx.showToast({
                        title: '超出库存，请重新选择',
                        icon: 'none'
                    })
                    return
                }
                goodsNum++
            }

            if (val === 2) {
                if (goodsNum > stock) {
                    wx.showToast({
                        title: '超出库存，请重新选择',
                        icon: 'none'
                    })
                    goodsNum = stock
                }
            }
            this.data.form.goodsNum = goodsNum
        },
        async onSubmit () {
            // if (this.data.form.goodsnumber < this.getData.item.minimum) {
            //     wx.showToast({
            //         title: `最少起订${this.getData.item.minimum}件`,
            //         icon: 'none'
            //     })
            //     return
            // }

            if (this.data.form.goodsNum <= 0) {
                wx.showToast({
                    title: '数量大于0',
                    icon: 'none'
                })
                return
            }
            // console.log(this.data.isChooseSpec)
            // if (this.getData.info.goodsSpec.goodsSkuList.length > 0 && !this.data.isChooseSpec) {
            //     wx.showToast({
            //         title: '请选择规格',
            //         icon: 'none'
            //     })
            //     return
            // }

            // if (!this.data.user.nickname) {
            //     wx.navigateTo({
            //         url: '/pages/login/index/main'
            //     })
            //     return
            // }
            if (this.isAddCart) {
                this.addShopCart(0)
            } else {
                this.addShopOrder()
            }
        },
        addShopOrder () {
            let goodsSpec = JSON.stringify(this.data.thisGoodsSpec)
            wx.navigateTo({
                url: '/pages/goods/confirm/main?goodsId=' + this.search.goodsId + '&goodsNum=' + this.data.form.goodsNum + '&goodsSpec=' + goodsSpec
            })
        },
        onSpec (item, item1) {
            item.activeName = item1.name
            let data = this.buildSpec()
            console.log(data)
            if (data) {
                this.data.thisGoodsSpec = data
                this.data.form.goodsSpec = data.list
                this.data.isChooseSpec = true
            } else {
                this.data.isChooseSpec = false
            }
            // item.$set(item, 'activeName', item1.name)
            // console.log(item)
            // console.log(this.getData)
        },
        buildSpec () {
            let goodsSkuList = this.getData.info.goodsSpec.goodsSkuList
            let goodsAttrList = this.getData.info.goodsSpec.goodsAttrList
            let activeNameArr = []
            for (let item of goodsAttrList) {
                activeNameArr.push(item.activeName)
            }

            for (let item of goodsSkuList) {
                let goodsSkuArr = []
                for (let item1 of item.list) {
                    goodsSkuArr.push(item1.name)
                }
                if (goodsSkuArr.sort().toString() === activeNameArr.sort().toString()) {
                    return item
                }
            }
            // for (var i = 0; goodsSkuList.length > i; i++) {
            //     var flag = activeNameArr.every(function (value) {
            //         return goodsSkuList[i]
            //     })
            //     if (flag) {
            //         return goodsSkuList[i]
            //     }
            // }
            // console.log(goodsSkuList)
        }
    },
    onUnload () {
        this.data = JSON.parse(this.saveData)
    }
}
</script>

<style lang="less" scoped>
// iphonex
.iphonex{bottom: 68rpx; content: ''; position: fixed; height: 68rpx; width: 100%; background: #fff;
    &::after{content: ''; position: fixed; height: 68rpx; width: 100%; background: #fff;}
}
.ipx-details{padding-bottom: 173rpx!important;}

    .banner{height: 750rpx; position: relative;
        .slide-image{width: 750rpx; height: 750rpx;}
        .order{position: absolute; right: 23rpx; bottom: 20rpx; width: 72rpx; height: 72rpx; background: rgba(0,0,0,.3); color: #fff; border-radius: 50%; line-height: 72rpx; text-align: center;}
    }

    /*商品详细*/
    .goods-info{background: #fff; padding: 32rpx 24rpx 10rpx 24rpx;
        .title{font-size: 28rpx;}
        .price{font-size: 32rpx; color: #ff4c4c; margin-top: 12rpx;}
        .marketPrice{display: flex; font-size: 24rpx; color: #999;
            .left{flex: 1;}
        }
    }

    .goods-more{display: flex; align-items: center; height: 71rpx; border-top: 1px solid #f7f7f7; background: #fff;
        .item{flex: 1; text-align: center; display: flex; justify-content: center; align-items: center;
            .icon{width: 24rpx; height: 24rpx;
                img{width: 100%; height: 100%; display: block;}
            }
            .text{margin-left: 10rpx; color: #666666;}
        }
    }

    // 商品详情
    .goods-details{padding-bottom: 105rpx; background: #fff;
        .v-tabs{
            .item{width: 375rpx;}
        }
        .tabs-content{
            .item{width: 750rpx;
                img{width: 100%;display: block;}
            }
            .text{padding: 20rpx; color: #666666; font-size: 26rpx;
                p{margin-bottom: 12rpx;}
            }
        }
    }

    // 底部
    .footer{position: fixed; left: 0; right: 0; bottom: 0; height: 104rpx; background: #fff; display: flex; align-items: center; z-index: 9;
        .icon-home{width: 110rpx; height: 62rpx; border-right: 1px solid #e5e5e5; text-align: center;
            img{width: 44rpx; height: 44rpx; margin-top: 7rpx;}
        }
        .icon-cart{width: 110rpx; height: 62rpx; border-right: 1px solid #e5e5e5; text-align: center;
            .iconfont{font-size: 42rpx;}
        }
        .add-cart{flex: 1;line-height: 104rpx; text-align: center; font-size: 32rpx;}
        .bay{background: #f70044; flex: 1; height: 100%; line-height: 104rpx; text-align: center; font-size: 32rpx; color: #fff;}
    }

    .v-popup{
        .goods-content{position: relative; height: 140rpx; padding-bottom: 30rpx;
            .image{width: 128rpx; height: 128rpx; padding: 4rpx; background: #fff; position: absolute; top: -12rpx; left: 40rpx; box-shadow: 0 0 2px #ccc;
            border-radius: 3px;
            image{width: 100%; height: 100%;}
            }
            .info{margin-left: 200rpx; padding-top: 20rpx;
            .price{color: #f71e35; font-size: 30rpx;}
            .text{color: #999999;}
            }
        }

        .goods-scroll{overflow: auto; max-height: 535rpx;

        }
        /* 规格 */
        .goods-spec{
            .attr{font-size: 28rpx; padding: 0 20rpx; margin-top: 10rpx;
                .value{flex-wrap: wrap; display: flex; padding: 20rpx 0; border-bottom: 1px solid #e5e5e5;
                    view{padding: 10rpx 20rpx; margin: 0 20rpx 10rpx 0; background: #f5f5f5; border-radius: 5px;
                        &.active{background: #f70044; color: #fff;}
                    }
                }
            }
        }

        /* 数量 */
        .goods-num{margin-bottom: 80rpx; padding: 0 20rpx; display: flex; height: 113rpx; align-items: center;
            .text{flex: 1; font-size: 28rpx;
            span{color: #999;}
            }
            .input{display: flex; align-items: center; width: 180rpx; height: 48rpx; border: 1rpx solid #d6d6d6; border-radius: 4px;
                .reduce{width: 43rpx; border-right: 1rpx solid #d6d6d6; text-align: center;
                    .iconfont{font-size: 30rpx;}
                }
                input{flex: 1; width: 100%; text-align: center;}
                .add{width: 43rpx; border-left: 1rpx solid #d6d6d6; text-align: center;
                    .iconfont{font-size: 30rpx;}
                }
            }
        }
    }
</style>
