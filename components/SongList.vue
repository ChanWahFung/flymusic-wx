<template>
	<view class="song-list">
		<view class="song-item flex" @tap="play(item,index)"  v-for="(item,index) in songs" :key="index">
			<view v-if="hot" class="num" :class="{hot: index < 3}">
				{{index+1}}
			</view>
			<view v-else class="num">
				{{index+1}}
			</view>
			<view class="info flex-1 ellipsis">
				<view class="name ellipsis">{{item.name}}</view>
				<view class="singer ellipsis">{{item.singer}}</view>
			</view>
			<view v-if="currSongIndex == index && playListId == currPlayListId" class="currPlay iconfont icon-erji"></view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		props:{
			hot:{
				type:Boolean,
				default:false
			},
			songs:Array,
			playListId:Number
		},
		inject:['app'],
		data() {
			return {
				
			};
		},
		computed:{
			...mapState(['currSongIndex','currPlayListId'])
		},
		methods:{
			play(item,index){
				if(this.app.showTabBar == false){
					this.app.showTabBar = true
				}
				this.$store.commit('changeCurrPlayListId',this.playListId)
				this.$store.commit('changeCurrSong',item)
				this.$store.commit('changeCurrPlayList',this.songs)
				this.$store.commit('changeCurrSongIndex',index)
			}
		}
	}
</script>

<style lang="less" scoped>
.song-list{
	padding: 0 10px;
}
.song-item{
	justify-content: flex-start;
	
	&:last-child{
		.info{
			border-bottom:0;
		}
	}
	
	.num{
		margin-right: 8px;
		color:#999;
		
		&.hot{
			color:#DB5C5C
		}
	}
	
	.info{
		position: relative;
		padding: 8px 10px;
		
		&::after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1px;
			background: #f1f1f1;
			transform: scaleY(0.7);
		}
	}
	
	.name{
		width: 100%;
		margin-bottom: 3px;
		color:#424242;
	}
	
	.singer{
		width: 100%;
		font-size: 14px;
		color:#999
	}
	
	.currPlay{
		flex: 0 0 30px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 28px;
		font-weight: 600;
		color:#DB5C5C;
	}
}
</style>
