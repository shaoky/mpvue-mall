<template>
    <div class="container">
        <web-view :src="url"></web-view>
    </div>
</template>

<script>

export default {
    data () {
        return {
            url: ''
        }
    },

    mounted () {
        this.url = this.$root.$mp.query.url
        // 调用应用实例的方法获取全局数据
        // this.login()
    },

    onShow () {
    },

    methods: {
    }
}
</script>

<style lang="less" scoped>
</style>
