<script>
import { mapMutations } from 'vuex'
import { getLoginCode } from '@/api/getData'

export default {
    mounted () {
        // wx.login({
        //     success: () => {
        //     wx.getUserInfo({
        //         success: (res) => {
        //             console.log(res)
        //             this.userInfo = res.userInfo
        //         }
        //     })
        //     }
        // })
        // wx.navigateTo({
        //     url: '/pages/login/index/main'
        // })
        this.iphoneX()
        // const ext = wx.getExtConfigSync()
        // wx.setStorageSync('ext', ext)
        // console.log(ext)
        // 调用API从本地缓存中获取数据
        // const logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        this.checkSession()
    },
    methods: {
        ...mapMutations(['setLoginCode', 'setIPhoneX']),
        // 校验用户当前session_key是否有效。
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
        async getUserInfo (code) {
            let ext = wx.getStorageSync('ext')
            console.log(ext)
            let res = await getLoginCode({
                appid: ext.attr.appid,
                code: code
            })
            this.setLoginCode(res.data)
            // console.log(code)
        },
        // iphone X
        iphoneX () {
            let that = this
            wx.getSystemInfo({
                success (res) {
                    if (res.model.indexOf('iPhone X') > -1) {
                        that.setIPhoneX({isIPhoneX: true})
                    }
                }
            })
        }
    }
}
</script>

<style>
.container {
  /* height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0; */
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
