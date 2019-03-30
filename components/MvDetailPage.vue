<template>
	<view class="mv-detail-page">
		<section-title>MV排行榜</section-title>
		<view class="mv-list">
			<view class="mv-item" v-for="(item,index) in mvDetail" :key="index">
				<video class="mv-video" :poster="item.pic" :src="item.url" :direction="90" controls @waiting="waitFn" @error="errorFn"></video>
				<view class="info">
					<text class="singer">【{{item.singer}}】</text>
					<text class="name">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import SectionTitle from './SectionTitle';
	
	export default {
		data() {
			return {
				mvDetail:null,
				mvLen:0,
			};
		},
		methods:{
			getMvDetail({offset}){
				uni.showLoading({
					title: '加载中',
				});
				// #ifdef MP
				return uni.request({
					url: 'https://api.bzqll.com/music/netease/topMvList',
					data: {
						key:this.key,
						limit:10,
						offset
					}
				})
				// #endif
				// #ifdef H5
				return uni.request({
					url: '/api/music/netease/topMvList',
					data: {
						key:this.key,
						limit:10,
						offset
					}
				})
				// #endif
			},
			waitFn(){
				console.log('wait');
			},
			errorFn(){
				console.log('error');
			}
		},
		onLoad(){
			this.getMvDetail({offset:this.mvLen}).then(res=>{
				if(res[1].data.code == 200){
					this.mvDetail = res[1].data.data
					uni.hideLoading ()
				}
			})
		},
		onPullDownRefresh(){
			this.mvLen = 0
			this.getMvDetail({offset:this.mvLen}).then(res=>{
				if(res[1].data.code == 200){
					this.mvDetail = res[1].data.data
					uni.hideLoading ()
					uni.stopPullDownRefresh()
				}
			})
		},
		onReachBottom(){
			this.mvLen+=10
			if(this.mvLen >= 100){
				uni.showToast({
					title: '已无更多内容',
					icon:'none',
					duration: 2000
				})
				return
			}
			this.getMvDetail({offset:this.mvLen}).then(res=>{
				if(res[1].data.code == 200){
					this.mvDetail.push(...res[1].data.data)
					uni.hideLoading ()
				}
			})
		},
		components:{
			'section-title':SectionTitle
		}
	}
</script>

<style lang="less" scoped>
.mv-detail-page{
	padding-bottom: 70px;
}
.mv-list{
	padding: 0 10px;
}
.mv-item{
	padding: 15px 5px;
	border-bottom: 1px solid #f5f5f5;
	
	.mv-video{
		width: 100%;
	}
	
	.info{
		margin-top: 5px;
		font-size: 15px;
		color:#555;
		
		.singer{
			margin-right: 3px;
		}
	}
}
</style>
