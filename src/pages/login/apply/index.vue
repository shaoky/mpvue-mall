<template>
    <div class="container">
        <div class="apply" v-if="status == 0 ">
            <div class="image">
                <img src="/static/images/login/apply-01.png">
            </div>
            <div class="v-submit" @click="applySee">申请进入该店铺</div>
        </div>
        <div class="audit" v-if="status == 1 ">
            <div class="image">
                <img src="/static/images/login/apply-02.png">
            </div>
            <div class="text">
                <div class="t1">请等待管理员审核！</div>
                <div class="t2" @click="call" v-if="data.phone">客服联系电话：{{data.phone}}</div>
            </div>
        </div>
        <div class="failure" v-if="status == 2 ">
            <div class="image">
                <img src="/static/images/login/apply-03.png">
            </div>
            <div class="text">
                <div class="t1">抱歉，您进入店铺的申请未通过！</div>
                <div class="t2" @click="call" v-if="data.phone">客服联系电话：{{data.phone}}</div>
            </div>
            <!-- <div class="v-submit" @click="applySee">重新申请进入该店铺</div> -->
        </div>
    </div>
</template>

<script>
import { applySee, checkApply, getRexian } from '@/api/getData'
export default {
    data () {
        return {
            status: '',
            data: {}
        }
    },

    mounted () {
        this.status = this.$root.$mp.query.state
        // this.checkApply()
        this.getRexian()
    },

    methods: {
        async getRexian () {
            let res = await getRexian()
            this.data = res.data.obj
        },
        // 申请查看
        async applySee () {
            let res = await applySee()
        },
        // 查看是否申请成功
        async checkApply () {
            let res = await checkApply()
            console.log(res)
            if (res.data.obj[0].state == 'normal') {
                wx.switchTab({
                    url: '/pages/index/main'
                })
            }
            this.status = res.data.obj[0].state
        },
        call () {
            wx.makePhoneCall({
                phoneNumber: '18758930471' // 仅为示例，并非真实的电话号码
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../assets/less/define.less";
    .container{height: 100vh;}

    // 描述文字
    .text{text-align: center; margin-top: 60rpx;
        .t1{font-size: 30rpx; color: #333;}
        .t2{margin-top: 20rpx; font-size: 28rpx; color: #999;}
    }

    // 申请
    .apply{
        .image{width: 415rpx; height: 305rpx; margin: 0 auto; margin-top: 316rpx;
            img{width: 100%; height: 100%;}
        }
        .v-submit{margin-top: 60rpx;}
    }

    // 审核中
    .audit{height: 100%; background: #fff;
        .image{width: 750rpx; height: 453rpx;
            img{width: 100%; height: 100%;}
        }
    }

    // 申请失败
    .failure{height: 100%; background: #fff;
        .image{width: 750rpx; height: 549rpx;
            img{width: 100%; height: 100%;}
        }
        .v-submit{margin-top: 58rpx; width: 320rpx;}
    }

</style>
