<template>
    <div class="revise-password">
        <div class="v-cell">
            <div class="v-cell__bd">
                <input maxlength="20" class="v-input" type="password" placeholder="请输入旧密码" v-model="form.old">
            </div>
        </div>
        <div class="v-cell">
            <div class="v-cell__bd">
                <input maxlength="20" class="v-input" type="password" placeholder="请输入新密码" v-model="form.new">
            </div>
        </div>
        <div class="v-submit" @click="submit">确定</div>
    </div>
</template>

<script>
import { revisePassword } from '@/api/getData'

const resetData = []

export default {
    data () {
        return {
            form: null
        }
    },
    onLoad () {
        resetData.push(...this.$data)
        this.form = { old: '', new: '' }
    },
    mounted () {

    },
    methods: {
        async submit () {
            let res = await revisePassword(this.form)
            if (res.code === 200) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'none',
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack()
                        }, 2000)
                    }
                })
            }
        }
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
    }
}
</script>

<style scoped lang="less">
.revise-password{
    .v-submit{margin-top:40rpx;}
}
</style>
