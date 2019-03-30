<template>
	<view class="hot-song-list flex">
		<view class="song-item" @tap="goPlayList(item.id)" v-for="(item,index) in songlist" :key="index">
			<view class="post">
				<view v-if="item.playCount" class="play-count">
					<text class="iconfont icon-erji"></text>
					<text>{{item.playCount}}</text>
				</view>
				<image class="img auto-img" :src="item.coverImgUrl" mode="widthFix"></image>
			</view>
			<text class="title">{{item.title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			songlist:Array
		},
		inject:['app'],
		data() {
			return {
				
			};
		},
		methods:{
			goPlayList(id){
				this.$store.commit('changeListId',id)
				this.$store.commit('changePage','list-detail-page')
			}
		}
	}
</script>

<style lang="less" scoped>
.hot-song-list{
	padding: 0 5px;
	align-items:stretch;
	justify-content: space-between;
	flex-wrap: wrap;
	
	.song-item{
		width: 32%;
		margin-bottom: 10px;
		overflow: hidden;
		
		.post{
			position: relative;
			width: 100%;
			min-height:129px ;
		}
		
		.img{
			position: absolute;
			top: 0;
			left: 0;
			border: 1px solid #f5f5f5;
			border-radius: 3px;
		}
		
		.play-count{
			z-index: 3;
			position: absolute;
			top: 3px;
			right: 3px;
			font-size: 14px;
			color:#fff;
		}
		
		.title{
			font-size: 14px;
			color:#424242;
		}
	}
}
</style>
