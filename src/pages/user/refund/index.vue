<template>
    <div class="refund">
        <div class="tabs">
            <div class="tabs-container">
                <div class="item" v-for="(item,index) in tabs" :key="index">
                    <span @click="switchTabs(item.id)" :class="['text',search.orderstatus==item.id?'active':'']" >{{item.state}}</span>
                </div>
            </div>
        </div>
		<div class="container">
			<div class="container-list" v-for="(item,index) in list" :key="index">
				<div class="item">
					<div class="item-header">
						<div class="time">申请时间：{{item.backtime}}</div>
						<div class="state">{{item.state}}</div>
					</div>
					<div class="box" v-for="(goodsitem,goodsindex) in item.item" :key="goodsindex" @click="goInfo(item.backsn)"><!-- v-for="" -->
						<div class="box-item">
							<div class="goods-img">
								<img :src="goodsitem.goodsthumb">
							</div>
							<div class="info">
								<div class="goods-name font-limit-1">{{goodsitem.goodsname}}</div>
								<div class="num">
									<div class="text">单价：￥{{goodsitem.goodsprice}}</div>
									<div class="text">数量：{{goodsitem.account}}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="amount">退款金额：<span class="text">￥{{item.total}}</span></div>
				</div>
			</div>
		</div>
		<div class="weui-loadmore" >
            <i class="weui-loading" v-if="loading"></i>
            <span class="weui-loadmore__tips">{{bottomText}}</span>
        </div>
    </div>
</template>

<script>
import { getBackOrderList } from '@/api/getData'
import { getTimeStr } from '@/utils/date.js'

const dataStack = []

export default {
    data () {
        return {
            tabs: [ {state: '全部', id: '3'}, {state: '申请中', id: '5'}, {state: '已拒绝', id: '9'}, {state: '已通过', id: '6'} ],
            search: '',
            list: '',
            bottomText: '加载更多',
            loading: false,
            hasNext: true
        }
    },
    onLoad () {
        dataStack.push({...this.$data})
        this.$data.search = { page: 0, size: 20 }
        this.$data.list = []
    },
    mounted () {
        if (this.$root.$mp.query.state == 4) {
            this.search.orderstatus = 3
        }
        this.getBackOrderList()
    },
    methods: {
        // 获取列表
        async getBackOrderList () {
            this.loading = true
            this.bottomText = '正在加载'
            let res = await getBackOrderList(this.search)
            this.loading = false
            this.bottomText = '加载更多'
            console.log(res)
            res.data.list.forEach(
                (item, index) => {
                    item.backtime = getTimeStr(item.backtime * 1000)
                    if (item.backstatus === 5) {
                        this.$set(item, 'state', '申请中')
                    } else if (item.backstatus === 6) {
                        this.$set(item, 'state', '已通过')
                    } else if (item.backstatus === 9) {
                        this.$set(item, 'state', '已拒绝')
                    }
                }
            )
            if (res.data.list.length < this.search.size) {
                this.hasNext = false
                this.bottomText = '无更多数据'
            }
            this.list.push(...res.data.list)
            console.log(this.list)
        },
        switchTabs (n) {
            if (this.search.orderstatus === n) {

            } else {
                this.list = []
                this.search.page = 0
                this.search.orderstatus = parseInt(n)
                this.getBackOrderList()
            }
        },
        goInfo (n) {
            wx.navigateTo({
                url: '/pages/user/refund/info/main?backsn=' + n
            })
        }
    },
    onReachBottom () {
        if (this.hasNext) {
            this.search.page++
            this.getOrderList()
        } else {
            this.bottomText = '无更多数据'
        }
    },
    onUnload () {
        Object.assign(this.$data, dataStack.pop())
    }
}
</script>

<style scoped lang="less">
.refund{padding-top:80rpx;padding-bottom:15rpx;
	.tabs{height:80rpx;background:#fff;border-bottom:1px solid #e5e5e5;position:fixed;top:0;left:0; z-index: 99;width:750rpx;
        .item{display: inline-block;width:187.5rpx;text-align:center;height:80rpx;line-height:80rpx;
            .text{font-size:28rpx;color:#666;height:80rpx;display: inline-block;}
            .active{color:#f70044;position:relative;}
            .active:after{position:absolute;bottom:0;left:0;width:100%;height:4rpx;background:#f70044;content: "";display: block;}
        }
	}
	.container{
		.container-list{margin-bottom:20rpx;
			.item{background:#fff;
				.item-header{height:88rpx;display:flex;align-items:center;border-bottom:1px solid #e5e5e5;
					.time{flex:1;margin-left:28rpx;font-size:28rpx;color:#999;}
					.state{font-size:30rpx;color:#ff5657;margin-right:28rpx;}
				}
			}
			.box{padding:0 28rpx;
				.box-item{height:144rpx;display:flex;align-items:center;padding: 0 28rpx;border-bottom:1px solid #e5e5e5;
					.goods-img{width:80rpx;height:80rpx;margin-right:20rpx;
						img{width:80rpx;height:80rpx;}
					}
					.info{
						.goods-name{font-size:28rpx;color:#333;}
						.num{display: flex;
							.text{font-size:24rpx;color:#666;margin-right:20rpx;}
						}
					}
				}
			}
			.amount{font-size:30rpx;color:#333;text-align:right;height:84rpx;line-height:84rpx;padding:0 28rpx;
				.text{font-size:26rpx;}
			}
		}
		.weui-loadmore{margin-top:40rpx;}
	}

}
</style>
