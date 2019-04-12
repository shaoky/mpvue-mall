<template>
    <div class="container">
        <div class="header">
            <div class="user" v-if="user.nickname">
                <div class="picture">
                    <img :src="user.userPhoto" class="icon">
                </div>
                <div class="user-info">
                    <div class="user-name" v-if="user.nickname">{{user.nickname}}</div>
                    <!-- <div class="edit-info" @click="goInformation">编辑信息 <i class="iconfont icon-more"></i></div> -->
                </div>
                <div class="message">
                    <!-- <img class="icon" src="/static/images/user/index/message.png"> -->
                </div>
            </div>
            <div class="user" v-if="!user.nickname">
                <div class="picture">
                    <img src="/static/images/common/picture.jpg" class="icon">
                </div>
                <div class="user-info">
                    <div class="user-name" style="margin-left: 10px;" @click="goLogin">登陆</div>
                </div>
            </div>
        </div>

        <!-- 订单 -->
        <div class="order mt20">
            <div class="title" @click="goOrder(0)">
                <div class="left">全部订单</div>
                <div class="right">
                    查看全部订单
                    <i class="icon-more iconfont"></i>
                </div>
            </div>
            <div class="state">
                <div class="item" @click="goOrder(7)">
                    <i class="icon-daifukuan iconfont"></i>
                    <span class="text">待接单</span>
                </div>
                <div class="item" @click="goOrder(2)">
                    <i class="icon-daifahuo iconfont"></i>
                    <span class="text">待发货</span>
                </div>
                <div class="item" @click="goOrder(3)">
                    <i class="icon-yifahuo iconfont"></i>
                    <span class="text">待收货</span>
                </div>
                <!-- <div class="item" @click="goOrder(4)">
                    <i class="icon-tuikuan iconfont"></i>
                    <span class="text">退货</span>
                </div> -->
            </div>
        </div>
        <!-- 收货地址 -->
        <div class="address mt20" @click="goAddress">
            <div class="left">
                <i class="icon-dizhi iconfont"></i>
                <span class="text">收货地址</span>
            </div>
            <i class="icon-more iconfont"></i>
        </div>

        <div class="outLogin" @click="outLogin" v-if="user.token">退出登录</div>
    </div>
</template>

<script>
import { getUserInfo } from '@/api/getData'

export default {
    data () {
        return {
            img: null, // 头像
            userInfo: {},
            isNext: true, // 防止页面多次跳转
            user: {}
        }
    },

    onShow () {
        this.user = wx.getStorageSync('user')
        // this.getInfo()
        // this.userInfo = wx.getStorageSync('user')
    },

    methods: {
        // getUserInfo (e) {
        //     wx.setStorageSync('auth', e.mp.detail.userInfo)
        //     this.user = e.mp.detail.userInfo
        // },
        async getInfo () {
            let res = await getUserInfo()
            console.log(1)
            this.userInfo = res.data.info
            this.img = wx.getStorageSync('authorize').avatarUrl
        },
        goOrder (e) {
            if (!this.user.token) {
                wx.navigateTo({
                    url: '/pages/login/index/main'
                })
                return
            }
            // if(this.isNext){
            //     this.isNext=false
            switch (e) {
            case 0:
            case 7:
            case 2:
            case 3:
                wx.navigateTo({
                    url: '/pages/user/order/main?state=' + e
                    // success: res => {
                    //             this.isNext=true
                    //     }
                })
                break
            case 4:
                wx.navigateTo({
                    url: '/pages/user/refund/main?state=' + e
                })
                break
            }
            // }
        },
        goAddress () {
            if (!this.user.token) {
                wx.navigateTo({
                    url: '/pages/login/index/main'
                })
                return
            }
            wx.navigateTo({
                url: '/pages/user/address/main'
            })
        },
        outLogin () {
            wx.showModal({
                title: '提示',
                content: '是否退出登录',
                success () {
                    wx.removeStorageSync('user')
                    wx.navigateTo({
                        url: '/pages/login/index/main'
                    })
                }
            })
        },
        goInformation () {
            wx.navigateTo({
                url: '/pages/user/information/main'
            })
        },
        goLogin () {
            wx.navigateTo({
                url: '/pages/login/index/main'
            })
        }
    },

    components: {
    }
}
</script>

<style lang="less" scoped>
.container{
    .header{height: 278rpx;display: flex;align-items: center;
    background: #fd679d;
    background: -moz-linear-gradient(left,  #fd679d 0%, #fd4858 100%);
    background: -webkit-gradient(linear, left,right, color-stop(0%,#fd679d),color-stop(100%,#fd4858));
    background: -webkit-linear-gradient(left,  #fd679d 0%,#fd4858 100%);
    background: -o-linear-gradient(left,  #fd679d 0%,#fd4858 100%);
    background: -ms-linear-gradient(left,  #fd679d 0%,#fd4858 100%);
    background: linear-gradient(to right,  #fd679d 0%,#fd4858 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fd679d', endColorstr='#fd4858',GradientType=1 );
        .user{display: flex;align-items:center;
            .picture{margin-left:40rpx;margin-right:16rpx;
                .icon{width:120rpx;height:120rpx;border-radius:50%;}
            }
            .user-info{
                .user-name{font-size:32rpx;color:#fff;}
                .edit-info{font-size:28rpx;color:#fff;display:flex;align-items:center;margin-top:10rpx;
                    .icon-more{margin-left:8rpx;font-size:28rpx;}
                }
                .login{background: none; border: none; border: 0; color: #fff; font-size: 28rpx;}
            }
            .message{position:absolute;right:50rpx;top:90rpx;
                .icon{width:40rpx;height:48rpx;}
            }
        }
    }

    .order{background:#fff;
        .title{height:78rpx;padding:0 24rpx;border-bottom:1px solid #e5e5e5;display: flex;align-items:center;
            .left{font-size:24rpx;color:#666;flex:1;}
            .right{display: flex;align-items: center;font-size:24rpx;color:#999;
                .iconfont{font-size:32rpx;}
            }
        }
        .state{height:174rpx;display:flex;
            .item{flex:1;display:flex;align-items:center;flex-direction: column;
                .iconfont{margin-top:20rpx; color: #999;}
                .text{font-size:28rpx;color:#333;}
            }
        }
    }
    .address{background:#fff;height:88rpx;display: flex;align-items:center;padding:0 24rpx;
        .left{flex:1;display: flex;align-items:center;
            .icon-dizhi{margin-right:10rpx;font-size:30rpx;color:#999;}
            .text{font-size:28rpx;color:#333;}
        }
        .icon-more{color:#999;font-size:32rpx;}
    }
    .outLogin{margin-top: 20rpx; height: 80rpx; line-height: 80rpx; text-align: center; font-size: 28rpx; background: #fff;}

}

</style>
