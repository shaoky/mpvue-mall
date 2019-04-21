<template>
    <div class="login-container">
        <div class="text">使用该小程序，需要微信授权</div>
        <!-- <div class="login">
            <div class="item">
                <input type="text" placeholder="请输入您的手机号码" maxlength="11" v-model="form.username">
            </div>
            <div class="item">
                <input password placeholder="请输入您的密码"  v-model="form.password">
            </div>
        </div> -->
        <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo" class="v-submit">绑定</button>
        <!-- <div class="v-submit" @click="onSubmit">绑定</div> -->
        <!-- <div class="bottom">
            <div class="forget" @click="goForget"><span>忘记密码</span></div>
            <div class="register" @click="goRegister">还没账号,请注册</div>
        </div> -->

    </div>
</template>

<script>
import { wxLogin } from '@/api/getData'
import { setTimeout } from 'timers'

export default {
    data () {
        return {
            form: {
                code: ''
            },
            auth: {}
        }
    },

    created () {
    },

    mounted () {
        let user = wx.getStorageSync('user')
        if (user) {
            wx.showToast({
                title: '检测到已经登陆过了，自动登录中...',
                icon: 'none'
            })
            setTimeout(() => {
                wx.switchTab({
                    url: '/pages/index/main'
                })
            }, 2000)
        }
    },

    methods: {
        checkSession () {
            const that = this
            wx.checkSession({
                success: res => {
                    console.log(res)
                    wx.login({
                        success: res => {
                            if (res.code) {
                                console.log('未过期，获取到code---------', res.code)
                                // 发送 res.code 到后台换取 openId, sessionKey, unionId

                                that.getUserInfo(res.code)
                            } else {
                                console.log('获取用户登录态失败！' + res.errMsg)
                            }
                        }
                        // session_key 未过期，并且在本生命周期一直有效
                    })
                },
                fail: function () {
                    // console.log(2)
                    // session_key 已经失效，需要重新执行登录流程
                    wx.login({
                        success: res => {
                            if (res.code) {
                                console.log(res.code)
                                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                that.getUserInfo(res.code)
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '获取用户登录失败！',
                                    showCancel: false
                                })
                            }
                        }
                    })
                }
            })
        },
        onGotUserInfo (e) {
            console.log(e)
            wx.setStorageSync('auth', e.mp.detail.userInfo)
            this.auth = e.mp.detail.userInfo
            this.checkSession()
        },
        goForget () {
            wx.navigateTo({url: '../forget/main'})
        },
        goRegister () {
            wx.navigateTo({url: '../register/main'})
        },
        async getUserInfo (code) {
            let systemInfo = wx.getSystemInfoSync({
                success: function (res) {
                    return res
                }
            })

            try {
                let location = wx.getStorageSync('location')
                let data = {
                    code: code,
                    nickname: this.auth.nickName,
                    city: this.auth.city,
                    province: this.auth.province,
                    avatarUrl: this.auth.avatarUrl,
                    systemInfo: systemInfo,
                    latitude: location.latitude,
                    longitude: location.longitude
                }
                const res = await wxLogin(data)
                console.log(res)
                // if (res.code === 40100) {
                //     wx.showToast({
                //         title: res.message,
                //         icon: 'none'
                //     })
                //     wx.navigateTo({url: '../apply/main'})
                //     return
                // }
                if (res.code === 200) {
                    wx.setStorageSync('user', res.data.userInfo)
                    wx.switchTab({
                        url: '/pages/index/main'
                    })
                }
            } catch (err) {
                console.log(err)
                if (err.code === 440) { // 待审核
                    wx.navigateTo({url: '../apply/main?state=1'})
                }
                if (err.code === 450) { // 拒绝
                    wx.navigateTo({url: '../apply/main?state=2'})
                }
            }

            // 保存数据
            // wx.setStorage({
            //     key: 'user',
            //     data: res.data
            // })
            // console.log(this.form.phone)
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../assets/less/define.less";
.login-container{
    .text{padding: 20rpx;}
    .login{background: #fff;
        .item{height: 90rpx; border-bottom: 1px solid #e5e5e5;
            input{font-size: 30rpx; height: 100%; margin-left: 20rpx;}
        }
    }
    .v-submit{margin-top: 80rpx;}
    .bottom{display:flex;padding:20rpx;
        .forget{flex:1;color: #ff0033;}
        .register{  color: #ff0033;}
    }

}

</style>
