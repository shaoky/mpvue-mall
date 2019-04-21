<template>
    <div class="container">
        <div class="cart-null" v-if="cartList.length === 0">
            <div class="image">
                <img src="/static/images/cart/cart-null.png">
            </div>
            <div class="goShopping">
                <div class="v-button" @click="goShopping">去逛逛</div>
            </div>
            <!-- <div class="recommend">
                <div class="title">
                    <div class="line"></div>
                    <div class="point"></div>
                    <div class="name">为您推荐</div>
                    <div class="point"></div>
                    <div class="line"></div>
                </div>
                <div class="content mt20">
                    <shop-list :list="goodsList" :loading="loading"></shop-list>
                </div>
            </div> -->
        </div>

        <div class="cart" v-if="cartList.length > 0">
            <div class="notice">
                <div class="text">注意:还差{{freeFreightMoney - countPrice > 0 ? freeFreightMoney - countPrice : 0}}元免配送，否则要支付{{freightMoney}}元配送费</div>
                <div class="right" @click="goShopping">去凑单<i class="iconfont icon-more"></i></div>
            </div>
            <div class="content">
                <div class="operation">
                    <div class="status" @click="checkAll">
                        <i class="icon-yuanxingweixuanzhong iconfont" v-if="!isCheckAll"></i>
                        <i class="icon-yuanxingxuanzhongfill iconfont" v-if="isCheckAll"></i>
                    </div>
                    <div class="shopName">{{storeName}}店铺</div>
                    <div class="delete" @click="onDelCart">删除</div>
                </div>
                <div class="scorll-view">
                    <div class="item" v-for="item in cartList" :key="item.id" @click="goInfo(item.goodsId)">
                        <div class="status" @click.stop="checkList(item)">
                            <i class="icon-yuanxingweixuanzhong iconfont" v-if="!item.selected"></i>
                            <i class="icon-yuanxingxuanzhongfill iconfont" v-if="item.selected"></i>
                        </div>
                        <div class="shop-content">
                            <div class="image" >
                                <img :src="item.goodsImage">
                            </div>
                            <div class="info">
                                <div class="title ov">{{item.goodsName}}</div>
                                <div class="spec">
                                    <!-- <span v-for="(item1, index1) in item.goodsSpec.list" :key="index1">
                                        {{item1.attr}}: {{item1.name}};
                                    </span> -->
                                </div>
                                <div class="price">
                                    <div class="left" v-if="item.openSpec">￥{{item.goodsSpec.shopPrice}}</div>
                                    <div class="left" v-if="!item.openSpec">￥{{item.shopPrice}}</div>
                                    <div class="num">
                                        <div class="reduce" @click.stop="shopNumEdit(item, 0)">
                                            <i class="iconfont icon-jianhao"></i>
                                        </div>
                                        <input type="number" v-model.number="item.goodsNum" @click.stop @change="shopNumEdit(item, 2)">
                                        <div class="add" @click.stop="shopNumEdit(item, 1)">
                                            <i class="iconfont icon-jiahao1"></i>
                                        </div>
                                    </div>
                                    <!-- 起订量 -->
                                    <!-- <div class="min">起订量{{item.minimum}}件</div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-submit">
                <div class="status" @click="checkAll">
                    <span v-if="!isCheckAll">
                        <i class="iconfont icon-yuanxingweixuanzhong"></i>全选
                    </span>
                    <span v-if="isCheckAll">
                        <i class="iconfont icon-yuanxingxuanzhongfill"></i>全选
                    </span>
                </div>
                <div class="price">
                    <div class="text">￥{{countPrice}}</div>
                    <div class="fee">另需配送费{{freeFreightMoney - countPrice > 0 ? freightMoney : 0}}元</div>
                </div>
                <div class="btn" @click="onSubmit">去结算</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCartList, editCart, editSelectedCart, editSelectedAllCart, delCart, getRecommendGoodsList } from '@/api/getData'
import { mapMutations } from 'vuex'
import shopList from '@/components/shop-list'

export default {
    data () {
        return {
            cartId: null,
            storeName: '',
            loading: false,
            search: {
                page: 0,
                size: 20
            },
            isCheckAll: true, // 是否全选中
            isHasGoods: false, // 是否有产品
            freightMoney: null, // 运费
            freeFreightMoney: null, // 满xx免邮
            cartList: [],

            recommendSearch: {
                page: 0,
                size: 20
            },
            goodsList: []
        }
    },

    computed: {
        countPrice () {
            let count = 0
            this.cartList.forEach(item => {
                if (item.selected) {
                    if (item.openSpec) {
                        count += item.shopPrice * item.goodsNum
                    } else {
                        count += item.shopPrice * item.goodsNum
                    }
                }
            })
            return count.toFixed(2)
        }
    },

    mounted () {
        // wx.getSystemInfo({
        //     success (res) {
        //         let windowHeight = res.windowHeight
        //         // windowHeight = windowHeight -
        //         this.windowHeight = windowHeight
        //     }
        // })

        this.storeName = wx.getStorageSync('ext').name

        // this.cartList = cartList.map((item) => {
        //     item.status = false
        //     item.price = item.price.toFixed(2)
        //     return item
        // })
    },

    onShow () {
        this.isCheckAll = true
        this.getCartList()
        // this.getRecommendGoodsList()
    },

    methods: {
        ...mapMutations(['setCart']),
        // 购物车列表
        async getCartList () {
            let res = await getCartList(this.search)
            if (res.code === 200) {
                res.data.list.forEach(item => {
                    if (!item.selected) {
                        this.isCheckAll = false
                    }
                })
                this.freeFreightMoney = res.data.freeFreightMoney
                this.freightMoney = res.data.freightMoney
                this.cartList = res.data.list
                this.cartId = res.data.cartId
            }
        },

        // 推荐列表
        async getRecommendGoodsList () {
            // console.log(1)
            let res = await getRecommendGoodsList()
            if (res.code === 200) {
                for (let item of res.data.list) {
                    if (item.quoteunit === 1) {
                        item.quoteunitName = '瓶'
                    }
                    if (item.quoteunit === 2) {
                        item.quoteunitName = '件'
                    }
                }
                this.goodsList = res.data.list
            }
        },

        async shopNumEdit (row, val) {
            // 0是减少，1是增加，2是监听
            let stock = row.goodsInfo.goodsStock
            // let minimum = parseInt(row.minimum)
            // let qualified = parseInt(row.qualified)
            // let goodsnumber = row.goodsnumber

            if (val === 0) {
                if (row.goodsNum <= 1) {
                    // wx.showToast({
                    //     title: `至少起订${minimum}件`,
                    //     icon: 'none'
                    // })
                    return
                }

                row.goodsNum--
            }

            if (val === 1) {
                // console.log(row)
                if (row.goodsNum > stock - 1) {
                    wx.showToast({
                        title: '超出库存，请重新选择',
                        icon: 'none'
                    })
                    return
                }
                // if (row.goodsNum > qualified - 1) {
                //     wx.showToast({
                //         title: '超出限购量，请重新选择',
                //         icon: 'none'
                //     })
                //     return
                // }
                row.goodsNum++
            }

            if (val === 2) {
                // if (row.goodsnumber <= minimum) {
                //     wx.showToast({
                //         title: `至少起订${minimum}件`,
                //         icon: 'none'
                //     })
                //     row.goodsnumber = minimum
                //     return
                // }
                if (row.goodsNum <= 0) {
                    wx.showToast({
                        title: '商品数量必须大于0',
                        icon: 'none'
                    })
                    row.goodsNum = 1
                    return
                }
                if (row.goodsNum > stock) {
                    wx.showToast({
                        title: '超出库存，请重新选择',
                        icon: 'none'
                    })
                    // if (stock < qualified) {
                    //     row.goodsnumber = stock
                    // } else {
                    //     row.goodsnumber = qualified
                    // }
                    return
                }
                // row.goodsNum = qualified
                // if (row.goodsnumber > qualified) {
                //     wx.showToast({
                //         title: '超出限购量，请重新选择',
                //         icon: 'none'
                //     })
                //     row.goodsnumber = qualified
                //     return
                // }
            }
            // row.goodsnumber = goodsnumber

            try {
                let res = await editCart({
                    cartGoodsId: row.cartGoodsId,
                    goodsNum: row.goodsNum
                })
                if (res.code === 200) {
                    wx.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                    if (val === 0) {
                        row.goodsnumber--
                    }
                    if (val === 1) {
                        row.goodsnumber++
                    }
                }
            } catch (err) {
                if (val === 2) {
                    row.goodsnumber = row.stock
                }
            }

            // this.editCartNum(row)
        },

        async checkList (item) {
            item.selected = !item.selected
            let count = 0
            let len = this.cartList.length
            // 点修改状态，有一个不是的话，就取消全选
            this.cartList.forEach(item => {
                if (item.selected) {
                    count++
                }
            })
            if (count === len) {
                this.isCheckAll = true
            } else {
                this.isCheckAll = false
            }
            await editSelectedCart({cartGoodsId: item.cartGoodsId, selected: item.selected})
        },
        async checkAll () {
            this.isCheckAll = !this.isCheckAll
            if (this.isCheckAll) {
                this.cartList.forEach(item => {
                    item.selected = true
                })
                await editSelectedAllCart({selected: true})
            } else {
                this.cartList.forEach(item => {
                    item.selected = false
                })
                await editSelectedAllCart({selected: false})
            }

            // let selected = 0
            // if (selected === 0) {
            //     this.cartList.forEach(item => {
            //         item.selected = true
            //     })
            //     selected = 1
            // } else {
            //     this.cartList.forEach(item => {
            //         item.selected = false
            //     })
            // }

            // console.log(cartList)
        },
        goShopping () {
            wx.switchTab({
                url: '/pages/goods/list/main'
            })
        },

        goInfo (id) {
            wx.navigateTo({
                url: `/pages/goods/info/main?goodsId=${id}`
            })
        },

        onDelCart () {
            // 是否选中
            let len = this.isShopSelected()
            if (len === 0) {
                wx.showToast({
                    title: '请选择商品',
                    icon: 'none'
                })
            }
            this.cartList.forEach(item => {
                if (item.selected) {
                    this.delCart(item.cartGoodsId)
                }
            })
        },

        // 判断是否选中商品
        isShopSelected () {
            let len = 0
            this.cartList.forEach(item => {
                if (item.selected) {
                    len++
                }
            })
            return len
        },

        async delCart (id) {
            let res = await delCart({cartGoodsId: id})
            if (res.code === 200) {
                wx.showToast({
                    title: res.message,
                    icon: 'none'
                })
                this.getCartList()
            }
            // let cartList = []
            // this.cartList.forEach(value => {
            //     if (!value.status) {
            //         cartList.push(value)
            //     }
            // })
            // console.log(cartList)
            // this.cartList = cartList
            // if (this.cartList.length === 0) {
            //     this.isHasGoods = false
            // }
        },

        async onSubmit () {
            let data = []
            for (let item of this.cartList) {
                if (item.goodsnumber < item.minimum) {
                    wx.showToast({
                        title: `至少起订${item.minimum}件`,
                        icon: 'none'
                    })
                    return
                }
                if (item.selected) {
                    data.push(item)
                }
            }

            if (data.length === 0) {
                wx.showToast({
                    title: '请选择商品',
                    icon: 'none'
                })
                return
            }
            // let res = await setShopCartBalance({json: data})
            // if (res.code === 200) {
            //     this.setCart(res.data)
            //     // let data = JSON.stringify(res.data)
            //     wx.navigateTo({
            //         url: '/pages/goods/confirm/main'
            //     })
            // }
            wx.navigateTo({
                url: '/pages/goods/confirm/main?cartId=' + this.cartId
            })
        }
    },

    // onReachBottom () {
    //     console.log(1)
    //     // this.loading = true
    //     setTimeout(() => {
    //         this.goodsList.push({
    //             id: 1,
    //             title: '设立喀什连锁店扣篮大赛烦都烦死了大放送的',
    //             imagePath: '/static/images/index/test-goods-01.jpg',
    //             price: '123.00'
    //         }, {
    //             id: 1,
    //             title: '设立喀什连锁店扣篮大赛烦都烦死了大放送的',
    //             imagePath: '/static/images/index/test-goods-01.jpg',
    //             price: '123.00'
    //         }, {
    //             id: 1,
    //             title: '设立喀什连锁店扣篮大赛烦都烦死了大放送的',
    //             imagePath: '/static/images/index/test-goods-01.jpg',
    //             price: '123.00'
    //         }, {
    //             id: 1,
    //             title: '设立喀什的',
    //             imagePath: '/static/images/index/test-goods-01.jpg',
    //             price: '123.00'
    //         })
    //         // this.loading = false
    //     }, 1000)
    // },

    components: {
        shopList
    }
}
</script>

<style lang="less" scoped>
    .icon-yuanxingxuanzhongfill{color: #f70044!important;}

    .cart-null{
        .image{margin-top: 46rpx; text-align: center;
            img{width: 480rpx; height: 277rpx;}
        }
        .goShopping{margin-top: 60rpx; text-align: center;}
        .recommend{ margin-top: 70rpx;
           .title{display: flex; align-items: center; justify-content: center;
                .line{width: 120rpx; border-bottom: 1rpx solid #999999;}
                .point{width: 7rpx; height: 7rpx; background-color: #999999; margin: 0 6rpx; border-radius: 50%;}
                .name{margin: 0 10rpx; font-size: 16px;}
            }
        }
    }

    .cart{margin-top: 3rpx;;
        .notice{display: flex; height: 80rpx; line-height: 80rpx; padding: 0 20rpx; background: #fff; color: #ff9900;
            .text{flex: 1; font-size: 24rpx;}
            .right{
                .iconfont{display: inline; font-size: 26rpx;}
            }
        }
        .content{margin-top: 20rpx;
            // 头部
            .operation{display: flex; align-items: center; height: 80rpx; background: #fff; border-bottom: 1px solid #e5e5e5;
                .status{margin: 0 10rpx 0 10rpx;
                    .iconfont{color: #ccc; font-size: 40rpx;}
                }
                .shopName{flex: 1; font-size: 30rpx;}
                .delete{margin-right: 20rpx; font-size: 28rpx;}
            }
            // 滚动区域
            .scorll-view{height: 100%; overflow-y: auto; margin-bottom: 105rpx;
                .item{display: flex; align-items: center; background: #fff;  padding: 24rpx 0 0;
                // border-bottom: 1px solid #e5e5e5;
                    .status{margin: 0 10rpx 0 10rpx;
                        .icon-yuanxingweixuanzhong{color: #ccc;}
                        .iconfont{font-size: 40rpx;}
                    }
                    .shop-content{border-bottom: 1px solid #e5e5e5; flex: 1; display: flex; padding-bottom: 24rpx;
                        .image{width: 160rpx; height: 160rpx;
                            img{width: 160rpx; height: 160rpx;}
                        }
                        .info{flex: 1; width: 0; margin-left: 10rpx;
                            .title{ margin-top: 5rpx;}
                            .spec{color: #999; height: 40rpx;}
                            .price{display: flex; margin-right: 24rpx; margin-top: 23rpx; position: relative;
                                .left{flex: 1; color: #ff4c4c; font-size: 28rpx;}
                                .num{display: flex; align-items: center; width: 180rpx; height: 48rpx; border: 1rpx solid #d6d6d6; border-radius: 4px;
                                    .reduce{width: 43rpx; border-right: 1rpx solid #d6d6d6; text-align: center;
                                        .iconfont{font-size: 30rpx;}
                                    }
                                    input{flex: 1; width: 100%; text-align: center;}
                                    .add{width: 43rpx; border-left: 1rpx solid #d6d6d6; text-align: center;
                                        .iconfont{font-size: 30rpx;}
                                    }
                                }
                                .min{position: absolute; right: 1rpx; bottom: 60rpx; width: 180rpx;text-align: center;}
                            }
                        }
                    }
                    &:last-child .shop-content{border: none;}
                }
            }
        }
        .cart-submit{position: fixed; z-index: 999; bottom: 0; left: 0; right: 0; display: flex; align-items: center; height: 105rpx; background: #fff;
            .status{display: flex; align-items: center; font-size: 30rpx; color: #999;
                    .icon-yuanxingweixuanzhong{color: #ccc;}
                    .iconfont{font-size: 40rpx;}
                .iconfont{display: inline; margin: 0 10rpx; font-size: 36rpx;}
            }
            .price{flex: 1; text-align: right; margin-right: 20rpx; color: #ff4c4c; line-height: 35rpx;
                .text{font-size: 32rpx;}
                .fee{font-size: 20rpx;}
            }
            .btn{width: 268rpx; background: #f70044; text-align: center; font-size: 32rpx; color: #fff; height: 100%; line-height: 105rpx;}
        }
    }
</style>
