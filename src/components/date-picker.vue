<template>
    <div class="datePicker-components">
        <el-date-picker
            v-model="search.timeRange"
            @change="timePick"
            type="datetimerange"
            :picker-options="timePickOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
        </el-date-picker>
    </div>
</template>

<script>
import DatetimePick from '@/mixins/DatetimePick'
export default {
    mixins: [DatetimePick],
    data () {
        return {
            search: {


            }
        }
    },
    props: {

    },
    mounted () {


    },
    methods: {
        timePick () {
            let arr = this.search.timeRange
            arr.forEach(
                function (val, index) {
                    arr[index] = val.getTime()
                }
            )
            this.$emit('timePick', this.search.timeRange)
        }
    }
}
</script>

<style scoped lang="less">

</style>
