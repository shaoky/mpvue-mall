<template>
    <div class="information">
        <div class="v-cell-height">
            <div class="v-cell__title">头像</div>
            <div class="right-box">
                <div class="img">
                    <img :src="userInfo.img">
                </div>
                <i class="iconfont icon-more v-cell__sub"></i>
            </div>
        </div>
        <div class="v-cell">
            <div class="v-cell__title">用户名称</div>
            <div class="content">{{userInfo.username}}</div>
        </div>
        <div class="v-cell">
            <div class="v-cell__title">企业名称</div>
            <div class="content">{{userInfo.name}}</div>
        </div>
        <div class="decs">安全设置</div>
        <div class="v-cell" @click="goRevise">
            <div class="v-cell__title">修改密码</div>
            <i class="iconfont icon-more v-cell__sub"></i>
        </div>
    </div>
</template>

<script>
import { getUserInfo } from '@/api/getData'

export default {
    data() {
        return {
            userInfo:{}
        }
    },
    mounted() {
        this.getUserInfo()
    },
    methods: {
        async getUserInfo () {
            let res = await getUserInfo()
            this.userInfo = res.data.info
            this.userInfo.img = wx.getStorageSync('authorize').avatarUrl
        },
        goRevise () {
            wx.navigateTo({
                url:'/pages/user/revisePassword/main'
            })
        }
    }
}
</script>

<style scoped lang="less">
.information{
    .v-cell-height{height:140rpx;
        .right-box{display:flex;
            .img{height:80rpx;width:80rpx;border-radius:50%;
                img{height:100%;width:100%;border-radius:50%;}
            }
        }
    }
    .v-cell__sub{margin-right:10rpx;}
    .content{font-size:28rpx;color:#999;margin-right:20rpx;}
    .decs{height:90rpx;line-height:90rpx;padding-left:20rpx;font-size:28rpx;color:#999;}
}
</style>
