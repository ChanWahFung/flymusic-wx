<template>
	<view v-if="detail" class="list-detail-page">
		<view class="list-header flex">
			<image class="bg" :src="detail.songListPic" mode="widthFix"></image>
			<view class="post">
				<image class="post" :src="detail.songListPic" mode="widthFix"></image>
			</view>
			<view class="content">
				<view class="title">
					{{detail.songListName}}
				</view>
				<view class="play-count">
					<text class="iconfont icon-erji"></text>
					<text>{{detail.songListPlayCount}}</text>
				</view>
			</view>
		</view>
		<view class="desc-warp">
			<view :class="'desc ' + showDesc">简介 : {{detail.songListDescription}}</view>
			<text class="iconfont arrow" :class="showIcon" @click="showDescFn"></text>
		</view>
		<view class="song-list-title">歌曲列表 (共{{detail.songs.length}}首)</view>
		<song-list :songs="detail.songs" :playListId="listId"></song-list>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {uniIcon} from "@dcloudio/uni-ui"
	import SongList from './SongList.vue';
	
	export default {
		data() {
			return {
				showDesc:'',
				showIcon:'icon-down',
				detail:null
			};
		},
		computed:{
			...mapState(['listId'])
		},
		methods:{
			showDescFn(){			
				if(this.showDesc == ''){
					this.showDesc = 'active'
					this.showIcon = 'icon-top'
				}else if(this.showDesc == 'active'){
					this.showDesc = ''
					this.showIcon = 'icon-down'
				}
			},
			getListData(){
				uni.showLoading({
					title:'加载中...'
				})
				// #ifdef MP
				uni.request({
					url: 'https://api.bzqll.com/music/netease/songList',
					data: {
						key:this.key,
						id:this.listId
					},
				}).then(res=>{
					if(res[1].data.code == 200){
						this.detail = res[1].data.data
						uni.hideLoading ()
						uni.stopPullDownRefresh()
					}
				})
				// #endif
				// #ifdef H5
				uni.request({
					url: '/api/music/netease/songList',
					data: {
						key:this.key,
						id:this.listId
					},
				}).then(res=>{
					if(res[1].data.code == 200){
						this.detail = res[1].data.data
						uni.hideLoading ()
						uni.stopPullDownRefresh()
					}
				})
				// #endif
			}
		},
		onLoad() {
			this.getListData()
		},
		onPullDownRefresh(){
			this.getListData()
		},
		components:{
			'song-list':SongList,
			uniIcon
		}
	}
</script>

<style lang="less" scoped>
.list-detail-page{
	background: #f8f8f8;
	
	.song-list-title{
		padding: 3px 6px;
		font-size: 14px;
		color:#666;
		background: #f3f3f3;
	}
	
	.desc-warp{
		position: relative;
		padding: 15px 10px 25px 10px;
		font-size: 15px;
		color:#666;
		
		.desc{
			height: 22px;
			word-break:break-all;
			overflow: hidden;
			
			&.active{
				height: auto;
			}
		}
		
		.arrow{
			position: absolute;
			bottom: 3px;
			left: 50%;
			padding: 5px;
			transform: translateX(-50%);
		}
	}
}
.list-header{
	position: relative;
	justify-content: flex-start;
	padding: 0 15px;
	height: 186px;
	overflow: hidden;
	
	.bg{
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 2px;
		filter: blur(60px) brightness(70%);
		transform: scale(1.3);
	}
	
	.post{
		z-index: 5;
		position: relative;
		width: 126px;
		height: 126px;
	}
	
	.content{
		align-self: flex-start;
		z-index: 5;
		position: relative;
		margin-top: 40px;
		margin-left: 20px;
		color:#fff;
		
		.play-count{
			margin-top: 20px;
			font-size: 14px;
			color:#fff;
			
			.icon-erji{
				margin-right: 3px;
			}
		}
	}
}
</style>
