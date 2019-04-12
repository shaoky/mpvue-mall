<template>
    <div class="container">
        <!-- 第一步 输入手机号码 -->
        <div class="box" v-if="status === 1">
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
                    <input class="v-input" type="password"  placeholder="请输入密码" maxlength="20" v-model="form.password">
                </div>
            </div>
            <div class="tip">密码长度6-20字符</div>
            <div class="v-submit" @click="onNext">下一步</div>
        </div>

        <!-- 第三步 完善信息 -->
        <div class="box" v-if="status === 3">
            <div class="v-cell">
                <div class="v-cell__bd">
                    <input class="v-input" type="text" placeholder="店铺名称" v-model="store.name">
                </div>
            </div>
            <div class="v-cell mt20">
                <div class="v-cell__bd">
                    <input maxlength="11" class="v-input" type="text" placeholder="联系人" v-model="store.manager">
                </div>
            </div>
            <div class="v-cell">
                <div class="v-cell__bd">
                    <input class="v-input" type="text" placeholder="联系电话"   v-model="store.managerTel" maxlength="11">
                </div>
            </div>
            <!-- <region @handleChange="handleChange" v-if="regionVisible"></region> -->
            <div class="v-cell mt20" @click="toCommonRegion">
                <div class="v-cell__bd">
                    <span v-if="region.length > 0" class="address">{{address}} </span>
                    <span v-if="region.length === 0" class="address">选择地区(必填)</span>
                </div>
                <i class="iconfont icon-more"></i>
            </div>
            <div class="v-cell" @click="getLocation">
                <div class="v-cell__text">
                    {{store.address}}
                </div>
                <i class="iconfont icon-more"></i>
            </div>
            <div class="upload">
                <div class="item" @click="chioce(1)">
                    <img :src="upload1">
                </div>
                <div class="item" @click="chioce(2)">
                    <img :src="upload2">
                </div>
            </div>
            <!-- <div class="map mt20">
                <map name="" :latitude="data.latitude" :longitude="data.longitude"></map>
            </div> -->
            <div class="v-submit-footer" @click="onSubmit" >提交</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import validator from '@/utils/validator'
import { getCode, testCode, mregister } from '@/api/getData'
import region from '@/components/region'

const dataStack = []

export default {
    data () {
        return {
            status: 1,
            form: '',
            store: '',
            sms: false,
            time: 60,
            smsMessage: '',
            codeMessage: '获取验证码',
            upload1: '/static/images/login/register-upload1.png',
            upload2: '/static/images/login/register-upload2.png',
            address: '',
            region: '',
            regionVisible: false,
            isUpload:false, 
            isRegister: true,
            isNext:true,
            ischeck:false
        }
    },
    onLoad () {
        dataStack.push({...this.$data})
        this.$data.form = {type: 5, tel: ''}
        this.$data.store = {address: '请选择详细地址', name: '' }
        this.$data.region = []
    },
    onShow () {
        let len = this.$store.state.regionname.region.length
        if (len > 0) {
            let obj = this.$store.state.regionname
            this.region = obj.region
            this.address = obj.address.join('-')
            this.store.regionname = obj.address.join('-')
            this.store.region = this.region[2]
            let arr = [[],[]]
            this.$store.commit('setRegionname',arr)
        }
    },
    computed: {
        ...mapGetters({
            userCode: 'getUserCode'
        })
    },

    mounted () {
    },

    methods: {
        async onNext () {
            if(this.isNext){
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
                    try {
                        let res = await testCode(this.form)
                        this.status++
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
            if(this.isUpload){
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
        },
        handleChange (val, name) {
            this.region = val
            this.store.region = val[2]
            this.store.regionname = name.join('-')
            this.address = name.join('/')
            this.regionVisible = false
        },
        chioce (n) {
            wx.chooseImage({
                success: (res) => {
                    var filePaths = res.tempFilePaths
                    wx.showLoading({
                        title: '上传中'
                    })
                    wx.uploadFile({
                        url: 'https://api.jsojs.com/admin/upload/public',
                        filePath: filePaths[0],
                        name: 'file',
                        header: {
                            'content-type': 'application/json',
                            'Authorization': wx.getStorageSync('user').token
                        },
                        success: (response) => {
                            console.log(JSON.parse(response.data))
                            if (n === 1) {
                                this.upload1 = JSON.parse(response.data).file
                                this.store.doorheader = JSON.parse(response.data).file
                            } else if (n === 2) {
                                this.upload2 = JSON.parse(response.data).file
                                this.store.businesslicense = JSON.parse(response.data).file
                            }
                        }
                    })
                    wx.hideLoading()
                }
            })
        },
        async onSubmit () {
            this.store.username = this.form.tel
            this.store.password = this.form.password
            if (!this.store.name) {
                wx.showToast({
                    title: '请填写店铺名称',
                    icon: 'none'
                })
                return
            }
            if (!this.store.name) {
                wx.showToast({
                    title: '请填写店铺名称',
                    icon: 'none'
                })
                return
            }
            if (!this.store.manager) {
                wx.showToast({
                    title: '请填写联系人',
                    icon: 'none'
                })
                return
            }
            if (!this.store.managerTel) {
                wx.showToast({
                    title: '请填写联系人电话',
                    icon: 'none'
                })
                return
            }
            if (!this.store.region) {
                wx.showToast({
                    title: '请选择区域',
                    icon: 'none'
                })
                return
            }
            if (!this.store.address) {
                wx.showToast({
                    title: '请填写详细地址',
                    icon: 'none'
                })
                return
            }
            if (!this.store.doorheader) {
                wx.showToast({
                    title: '请上传门头照',
                    icon: 'none'
                })
                return
            }
            if (!this.store.businesslicense) {
                wx.showToast({
                    title: '请上营业执照',
                    icon: 'none'
                })
                return
            }
            this.store = {...this.store, ...this.userCode}
            if(this.isRegister){
                this.isRegister=false
                try {
                    let res = await mregister(this.store)
                     wx.showToast({
                        title: '注册成功',
                        icon: 'none',
                        success:() => {
                            setTimeout(() => {
                                Object.assign(this.$data, dataStack.pop())
                                this.isUpload = true
                                wx.navigateTo({
                                    url: '/pages/login/index/main',
                                    success: () => {
                                        
                                        console.log('跳转成功')
                                    }   
                                })
                                
                            },2000)
                        }
                    })
                    this.isRegister=true
                } catch (err) {
                    this.isRegister=true
                }
            }
        },
        getLocation () {
            wx.chooseLocation({
                success: (res) => {
                    this.store.address = res.address
                    this.store.latitude = res.latitude.toString()
                    this.store.longitude = res.longitude.toString()
                }
            })
        },
        //跳转公共地区选择页面
        toCommonRegion(){
            wx.navigateTo({
                url:'/pages/common/region/main'
            })
        },
    },
    components: {
        region
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
        this.isUpload = true
    }
}
</script>

<style lang="less" scoped>
// @import "../../../assets/less/define.less";
    .v-submit{margin-top: 60rpx;}
    .sms{
        .tip{height: 60rpx; line-height: 60rpx; margin-left: 26rpx; color: #999;}
        .v-submit{margin-top: 30rpx;}
    }
    .code{width: 186rpx; height: 49rpx; background: #f70044; color: #fff; font-size: 24rpx; text-align: center; line-height: 49rpx; border-radius: 4px;  margin-right: 17rpx;}
    .send{background: #cccccc;}
    .upload{display: flex; height: 250rpx; padding: 0 13rpx; margin-top: 18rpx;
        .item{flex: 1; margin: 0 11rpx;height:100%;
            img{width: 100%; height: 100%;}
        }
    }
    .v-cell__bd{
        .address{
            display:inline-block;
            margin-left:20rpx;
            font-size:30rpx;
            color:#999;
        }
    }
    .v-cell__text{ flex:1;padding:0 20rpx;font-size:28rpx;color:#999;}
</style>
