
<template>
    <div class="v-popup v-popup-right">
        <slot></slot>
    </div>
</template>

<script>
/**
 * 弹出框
 * @author shaoky
 */
export default {
    props: {
        /**
         * 弹出位置
         * 可选值：'top','right', 'bottom', 'left'
         */
        position: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="less" scoped>
    .v-popup{
        position: fixed;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        backface-visibility: hidden;
        transition: .2s ease-out;
    }
    .v-popup-right{
        top: 50%;
        right: 0;
        bottom: auto;
        left: auto;
        height: 100%;
        transform: translate3d(0, -50%, 0);
        background: #fff;
    }
</style>
