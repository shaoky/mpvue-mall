<template>
    <div class="forget">
        <!-- 第一步 输入手机号码 -->
        <div class="box" v-if="status === 1">
            <!-- <div class="prompt">请输入您的手机号重置密码</div> -->
            <div class="v-cell" style="border: 0;">
                <div class="v-cell__bd">
                    <input class="v-input" type="text" maxlength="11" placeholder="请输入您的手机号码" v-model="form.tel">
                </div>
            </div>
            <div class="v-submit" @click="onNext">下一步</div>
        </div>

        <!-- 第二步 获取验证码 -->
        <div class="sms box" v-if="status === 2">
            <div class="v-cell">
                <div class="v-cell__bd">
                    <input class="v-input" type="text" placeholder="请输入验证码" maxlength="4" v-model="form.code">
                </div>
                <div class="code" @click="getSms" v-if="!sms">{{codeMessage}}</div>
                <div class="code send"  v-if="sms">{{smsMessage}}</div>
            </div>
            <div class="v-cell">
                <div class="v-cell__bd">
                    <input class="v-input" type="password"  placeholder="设置密码" maxlength="20" v-model="form.password">
                </div>
            </div>
            <div class="v-cell">
                <div class="v-cell__bd">
                    <input class="v-input" type="password"  placeholder="确认密码" maxlength="20" v-model="form.repeatpassword">
                </div>
            </div>
            <div class="v-submit" @click="onNext">确定</div>
        </div>
    </div>
</template>

<script>
import validator from '@/utils/validator'
import { getCode, forget } from '@/api/getData'

const dataStack = []

export default {
    data () {
        return {
            status: 1,
            form: '',
            sms: false,
            time: 60,
            smsMessage: '',
            codeMessage: '获取验证码',
            isNext: true,
            isUpload: false
        }
    },
    mounted () {
        dataStack.push({...this.$data})
        this.$data.form = {type: 6, tel: ''}
    },
    methods: {
        async onNext () {
            if (this.isNext) {
                this.isNext = false
                if (this.status === 1) {
                    const phone = validator.tel(this.form.tel, true)
                    if (phone) {
                        wx.showToast({
                            title: phone,
                            icon: 'none'
                        })
                        this.isNext = true
                        return
                    }
                    try {
                        let res = await this.getSms()
                        this.status++
                        this.isNext = true
                    } catch (err) {
                        this.isNext = true
                    }

                    // this.store.managerTel = this.form.tel
                    return
                }

                if (this.status === 2) {
                    if (this.form.sms === '') {
                        wx.showToast({
                            title: '请输入验证码',
                            icon: 'none'
                        })
                        this.isNext = true
                        return
                    }

                    if (this.form.password === '') {
                        wx.showToast({
                            title: '请输入密码',
                            icon: 'none'
                        })
                        this.isNext = true
                        return
                    }

                    if (this.form.repeatpassword !== this.form.password) {
                        wx.showToast({
                            title: '两次输入密码不一致',
                            icon: 'none'
                        })
                        this.isNext = true
                        return
                    }

                    this.form.username = this.form.tel
                    delete this.form.tel

                    try {
                        let res = await forget(this.form)
                        wx.showToast({
                            title: '设置成功',
                            icon: 'none',
                            success: () => {
                                setTimeout(() => {
                                    Object.assign(this.$data, dataStack.pop())
                                    this.isUpload = true
                                    wx.navigateTo({
                                        url: '/pages/login/index/main',
                                        success: () => {
                                            console.log('跳转成功')
                                        }
                                    })
                                }, 2000)
                            }
                        })
                        this.isNext = true
                    } catch (err) {
                        this.isNext = true
                    }
                }
            }
        },
        async getSms () {
            let res = await getCode(this.form)
            this.isUpload = false
            this.sms = true
            let countdown = 60
            this.setTime(countdown)
        },
        setTime (countdown) {
            if (this.isUpload) {
                this.isUpload = false
                return
            }
            if (countdown === 0) {
                this.codeMessage = '重新获取'
                this.sms = false
                return
            } else {
                this.smsMessage = '已发送' + '(' + countdown + ')' + 's'
            }
            countdown--
            setTimeout(
                () => this.setTime(countdown),
                1000)
        }
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
        this.isUpload = true
    }
}
</script>

<style scoped lang="less">
.forget{
    .v-cell__bd{
        .address{
            display:inline-block;
            margin-left:20rpx;
            font-size:30rpx;
            color:#999;
        }
    }
    .v-cell__text{ flex:1;padding:0 20rpx;font-size:28rpx;color:#999;}
    .v-submit{margin-top: 60rpx;}
    // .prompt{padding:10rpx 20rpx;}
    .sms{
        .tip{height: 60rpx; line-height: 60rpx; margin-left: 26rpx; color: #999;}
        .v-submit{margin-top: 30rpx;}
    }
    .code{width: 186rpx; height: 49rpx; background: #f70044; color: #fff; font-size: 24rpx; text-align: center; line-height: 49rpx; border-radius: 4px;  margin-right: 17rpx;}
    .send{background: #cccccc;}
}
</style>
