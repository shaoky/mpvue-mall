<template>
    <div class="address-add">
        <div class="contact">
            <div class="name">
                <div class="text">联系人</div>
                <div class="input">
                    <input type="text" v-model="form.manager" placeholder="姓名" placeholder-style="color:#999;font-size:30rpx;" >
                </div>
            </div>
            <div class="sex">
                <div :class="['btn',form.gender==1?'active':'']" @click="changeSex(1)">先生</div>
                <div :class="['btn',form.gender==2?'active':'']" @click="changeSex(2)">女士</div>
            </div>
        </div>
        <div class="phone">
            <div class="text">电话</div>
            <div class="input">
                <input type="text" maxlength="11" v-model="form.tel" placeholder="收货人电话" placeholder-style="color:#999;font-size:30rpx;" >
            </div>
        </div>
        <!-- <region @handleChange="handleChange" v-if="regionVisible"></region> -->
        <div class="address">
            <div class="region" @click="toCommonRegion"> <!-- regionVisible = true toCommonRegion  addpages -->
                <div class="text">
                    <span v-if="region.length > 0" >{{address}} </span>
                    <div v-if="form.region &&  region.length === 0 && isAdd==false">{{form.regionname}}</div>
                    <span v-if="region.length === 0 && isAdd==true" >选择地区(必填)</span>
                </div>
                <i class="iconfont icon-more"></i>
            </div>
            <div class="info" @click="getLocation">
                <!-- <input type="text" placeholder="详细地址(必填)" placeholder-style="font-size:28rpx;color:#999;" v-model="form.address"> -->
                <div class="text">{{form.address}}</div>
                <i class="iconfont icon-more"></i>
            </div>
        </div>
        <div class="default-address mt20">
            <div class="text">设置为默认地址</div>
            <switch :checked="checked" @change="check"></switch>
        </div>
        
        <div class="btn-bottom" @click="submit">确定</div>
    </div>
</template>

<script>
import region from '@/components/region'
import { getAddressInfo, editAddress, addAddress, getRegion } from '@/api/getData'

const dataStack = []

export default {
    data () {
        return {
            region: [],
            //options:[],
            id: null,
            isSubmit: true,
            isAdd: true,
            checked: false,
            regionVisible: false,
            form: '',
            address:'',
            location:'请选择详细地址'
        }
    },
    onLoad () {
        dataStack.push({...this.$data})
        this.$set(this.$data, 'form', {address:'请选择详细地址'})
    },
    onShow () {
        let len = this.$store.state.regionname.region.length
        if(len > 0){
            let obj = this.$store.state.regionname
            this.region = obj.region
            this.address = obj.address.join('-')
            this.form.regionname = obj.address.join('-')
            this.form.region = this.region[2]
            let arr = [[],[]]
            this.$store.commit('setRegionname',arr)
        }
    },
    mounted () {
        if (this.$root.$mp.query.id) {
            this.id = parseInt(this.$root.$mp.query.id)
            this.isAdd = false
            this.getAddressInfo()
            wx.setNavigationBarTitle({
                title: '编辑地址'
            })
        } else {
            this.form.mid = wx.getStorageSync('user').id
            wx.setNavigationBarTitle({
                title: '新增地址'
            })
        }

    },
    methods: {

        async getAddressInfo () {
            let res = await getAddressInfo({id: this.id})
            this.form = res.data.obj
            if (this.form.isdefault === 2) {
                this.checked = true
            }
            console.log(this.form)
        },
        check (e) {
            this.checked = e.target.value
        },
        // 选择性别
        changeSex (n) {
            this.$set(this.form, 'gender', n)
        },

        async submit () {
            if (!this.form.manager) {
                wx.showToast({title: '请输入联系人', icon: 'none'})
                return
            }
            if (!this.form.gender) {
                wx.showToast({title: '请选择性别', icon: 'none'})
                return
            }
            if (!this.form.region) {
                wx.showToast({title: '请选择地区', icon: 'none'})
                return
            }
            if (!this.form.address) {
                wx.showToast({title: '请填写地址', icon: 'none'})
                return
            }
            if (this.isSubmit) {
                let message = ''
                this.isSubmit = false
                if (this.checked) {
                    this.form.isdefault = 2
                } else {
                    this.form.isdefault = 1
                }
                if (this.isAdd) {
                    await addAddress(this.form)
                    message = '新增成功'
                } else {
                    await editAddress(this.form)
                    message = '编辑成功'
                }
                wx.showToast({
                    title: message,
                    icon: 'none',
                    success: (res) => {
                        setTimeout(function () {
                            wx.navigateBack()
                            this.isSubmit = false
                        }, 1000)
                    }
                })
            }
        },
        //跳转公共地区选择页面
        toCommonRegion(){
            wx.navigateTo({
                url:'/pages/common/region/main'
            })
        },
        getLocation(){
            wx.chooseLocation({
                success: (res) => {
                    this.form.address = res.address
                    this.form.location = res.longitude.toString() + ',' + res.latitude.toString()
                }
            })
        },
    },
    components: {
        region
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
    }
}
</script>

<style scoped lang="less">
.address-add{
    .contact{background:#fff;padding:0 20rpx;
        .name{height:86rpx;display: flex;
            .text{width:120rpx;height:100%;font-size:30rpx;color:#000;display: flex;align-items: center;justify-content: center;}
            .input{flex:1;height:100%;border-bottom:1px solid #e5e5e5;
                input{width:100%;height:100%;}
            }
        }
        .sex{display: flex;height:105rpx;align-items: center;padding-left:120rpx;border-bottom:1px solid #e5e5e5;
            .btn{width:118rpx;height:50rpx;line-height:50rpx;text-align:center;border:1px solid #e5e5e5;border-radius:4px;font-size:30rpx;color:#999;margin-right:20rpx;}
            .active{border:1px solid #007CFC;color:#007CFC;}
        }
    }
    .phone{height:80rpx;border-bottom:1px solid #e5e5e5;display:flex;background:#fff;padding:0 20rpx;
        .text{width:120rpx;height:100%;font-size:30rpx;color:#000;display: flex;align-items: center;}
        .input{flex:1;height:100%;border-bottom:1px solid #e5e5e5;
            input{width:100%;height:100%;}
        }
    }
    .address{padding:0 20rpx;background:#fff;
        .region{height:80rpx;display: flex;align-items:center;
            .text{font-size:28rpx;color:#999;}
            .iconfont{font-size:36rpx;}
        }
        .info{height:80rpx;display:flex;font-size:28rpx;align-items:center;
            .text{display:flex;align-items: center;color:#999;}
            .iconfont{font-size:36rpx;}
        }
    }
    .default-address{padding:0 20rpx;background:#fff;display: flex;align-items:center;height:88rpx;
        .text{font-size:30rpx;color:#000;flex:1;}
    }
    .btn-bottom{width:702rpx;margin:0 auto;background:#f70044;height:80rpx;line-height:80rpx;text-align:center;color:#fff;font-size:32rpx;margin-top:60rpx;border-radius:4px;}
    .choice-region{height:80rpx;display:flex;align-items:center;margin-top:20rpx;background:#fff;padding:0 20rpx;
        .title{font-size:28rpx;color:#333;margin-right:20rpx;}
        .picker-region{flex:1;font-size:28rpx;}
    }
}
</style>
