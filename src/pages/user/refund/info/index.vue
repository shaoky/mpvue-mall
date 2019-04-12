<template>
    <div class="refund-info">
		<div class="state">
			<div class="title">
				<i class="iconfont icon-dingdan1"></i>
				退款状态：
			</div>
			<div class="text">{{info.state}}</div>
		</div>
        <div class="container-details">
			<div class="public">
				<div class="title">订单号：</div>
				<div class="text">{{info.backsn}}</div>
			</div>
			<div class="public">
				<div class="title">申请退货时间：</div>
				<div class="text">{{info.backtime}}</div>
			</div>
			<div class="reason">
				<div class="title">退款原因：</div>
				<div class="text font-limit-3">{{info.remark}}</div>
			</div>
			<div class="receiving-information">
				<i class="iconfont icon-dizhi"></i>
				<div class="container">
					<div class="contact">
						<span>收货人：{{info.manager}}</span>
						<span>{{info.managertel}}</span>
					</div>
					<div class="address font-limit-2">
						收货地址：{{info.address}}
					</div>
				</div>
			</div>
        </div>
		<div class="container-goods mt20">
			<div class="title">退款商品</div>
			<div class="item" v-for="(item,index) in goodsList" :key="index">
				<div class="goods-img">
					<img :src="item.goodsthumb">
				</div>
				<div class="item-box">
					<div class="goods-name">{{item.goodsname}}</div>
					<div class="num">
						<div class="text">单价：￥{{item.goodsprice}}</div>
						<div class="text">数量：{{item.account}}</div>
					</div>
				</div>
			</div>
			<div class="amount">
				<div class="text">商品金额</div>
				<div class="price">￥{{info.total}}</div>
			</div>
			<div class="freight">
				<div class="text">运费</div>
				<div class="price">￥{{info.distributionfee}}</div>
			</div>
			<div class="pay">
				<div class="text">实际支付</div>
				<div class="price">￥{{info.arrivemoney}}</div>
			</div>
		</div>
		<!-- <div class="bottom">
			<div class="btn">订单操作</div>
		</div> -->
    </div>
</template>

<script>
import { getBackOrderInfo } from '@/api/getData'
import { getTimeStr } from '@/utils/date.js'
export default {
    data() {
        return {
			backsn:null,
			ordersn:'',
			info:{},
			goodsList:[]
        }
    },
    mounted() {
		if (this.$root.$mp.query.isOrder) {
			this.ordersn = this.$root.$mp.query.ordersn
		} else {
			this.backsn = this.$root.$mp.query.backsn
		}
		this.getBackOrderInfo()
    },
    methods: {
		//获取退货订单详情
		async getBackOrderInfo () {
			let res
			if(this.ordersn){
				res = await getBackOrderInfo({ordersn:this.ordersn})
			} 
			if (!!this.backsn) {
				res = await getBackOrderInfo({backsn:this.backsn})
			}
			console.log(res)
			if (res.data.item[0].backstatus == 5) {
				this.$set(res.data.item[0], 'state', '申请中')
			}else if (res.data.item[0].backstatus == 6) {
				this.$set(res.data.item[0], 'state', '已通过')
			}else if (res.data.item[0].backstatus == 9) {
				this.$set(res.data.item[0], 'state', '已拒绝')
			}
			res.data.item[0].backtime = getTimeStr(res.data.item[0].backtime*1000)
			this.info = res.data.item[0]
			console.log(this.info)
			this.goodsList = res.data.goodslist
		}
    }
}
</script>

<style scoped lang="less">
.refund-info{
	.state{background:#fff;padding:0 24rpx;border-bottom:1px solid #e5e5e5;height:88rpx;display:flex;align-items:center;
		.title{display:flex;font-size:30rpx;color:#666;align-items:center;
			.icon-dingdan1{font-size:30rpx;margin-right:20rpx;}
		}
		.text{font-size:30rpx;color:#f70044;}
	}
	.container-details{background:#fff;padding:0 24rpx;
		.public{height:80rpx;display:flex;align-items:center;border-bottom:1px solid #e5e5e5;
			.title{font-size:28rpx;color:#666;}
			.text{font-size:28rpx;color:#333;}
		}
		.reason{min-height:80rpx;padding:20rpx 0rpx;display:flex;border-bottom:1px solid #e5e5e5;
			.title{font-size:28rpx;color:#666;}
			.text{flex:1;font-size:28rpx;color:#333;}
		}
		//height多加了30
		.receiving-information{height:152rpx;padding:20rpx 50rpx 20rpx 0rpx;display: flex;background:#fff;align-items:center;
			.iconfont{margin-right:20rpx;}
			.container{flex:1;height:100%;position:relative;
				.contact{display:flex;justify-content: space-between;font-size:28rpx;color:#333;
					span:first-child{flex:1;}
				}
				.address{font-size:28rpx;color:#333;position:absolute;bottom:0;}
			}
		}
	}
	.container-goods{padding:0rpx 24rpx 20rpx;;background:#fff;border-bottom:1px solid #e5e5e5;
		.title{height:80rpx;line-height:80rpx;font-size:30rpx;color:#333;}
		.item{height:176rpx;padding:28rpx 40rpx;background:#eee;display:flex;align-items:center;margin-bottom:20rpx;
			.goods-img{width:120rpx;height:120rpx;
				img{width:120rpx;height:120rpx;}
			}
			.item-box{margin-left:20rpx;
				.goods-name{font-size:30rpx;}
				.num{margin-top:10rpx;display:flex;
					.text{margin-right:20rpx;font-size:26rpx;color:#666;}
				}
			}
		}
		.amount,.freight{display:flex;justify-content: space-between;margin-bottom:10rpx;
			.text{font-size:24rpx;color:#333;}
			.price{font-size:24rpx;color:#333;}
		}
		.pay{display:flex;justify-content: space-between;
			.text{font-size:28rpx;color:#333;}
			.price{font-size:28rpx;color:#f70044;}
		}
	}
	.bottom{height:130rpx;display:flex;justify-content: flex-end;padding:0 24rpx;background:#fff;align-items:center;
		.btn{width:180rpx;height:58rpx;line-height:58rpx;text-align:center;border:1px solid #e5e5e5;font-size:28rpx;color:#666;border-radius:4px;}
	}
}
</style>
