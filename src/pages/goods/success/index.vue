<template>
    <div class="container">
        <div class="top">
            <div class="icon">
                <img src="/static/images/goods/success-icon.png">
            </div>
            <div class="text">提交成功，等待商家处理</div>
            <div class="v-submit" @click="shopping">继续采购</div>
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
</template>

<script>
import { getRecommendGoodsList } from '@/api/getData'
import shopList from '@/components/shop-list'

export default {
    data () {
        return {
            loading: false,
            goodsList: []
        }
    },

    mounted () {
        // this.getRecommendGoodsList()
    },

    methods: {
        // 推荐列表
        async getRecommendGoodsList () {
            console.log(1)
            let res = await getRecommendGoodsList()
            if (res.code === 200) {
                this.goodsList = res.data.list
            }
        },

        shopping () {
            wx.switchTab({
                url: '/pages/goods/list/main'
            })
        }
    },

    onReachBottom () {
        console.log(1)
        // this.loading = true
        setTimeout(() => {
            this.goodsList.push({
                id: 1,
                title: '设立喀什连锁店扣篮大赛烦都烦死了大放送的',
                imagePath: '/static/images/index/test-goods-01.jpg',
                price: '123.00'
            }, {
                id: 1,
                title: '设立喀什连锁店扣篮大赛烦都烦死了大放送的',
                imagePath: '/static/images/index/test-goods-01.jpg',
                price: '123.00'
            }, {
                id: 1,
                title: '设立喀什连锁店扣篮大赛烦都烦死了大放送的',
                imagePath: '/static/images/index/test-goods-01.jpg',
                price: '123.00'
            }, {
                id: 1,
                title: '设立喀什的',
                imagePath: '/static/images/index/test-goods-01.jpg',
                price: '123.00'
            })
            // this.loading = false
        }, 1000)
    },

    components: {
        shopList
    }
}
</script>

<style lang="less" scoped>
    .top{
        .icon{width: 261rpx; height: 227rpx; margin: 0 auto; margin-top: 46rpx;
            img{width: 100%; height: 100%;}
        }
        .text{font-size: 28rpx; color: #666; text-align: center; margin-top: 18rpx;}
        .v-submit{width: 200rpx; height: 64rpx; line-height: 64rpx; margin-top: 55rpx;}
    }

    .recommend{ margin-top: 70rpx;
        .title{display: flex; align-items: center; justify-content: center;
            .line{width: 120rpx; border-bottom: 1rpx solid #999999;}
            .point{width: 7rpx; height: 7rpx; background-color: #999999; margin: 0 6rpx; border-radius: 50%;}
            .name{margin: 0 10rpx; font-size: 16px;}
        }
    }

</style>
