<template>
	<view class="home">
		<view class="navbar flex">
			<view class="flex-1 link" :class="{active:currColumnIndex==index}" @tap="column(index,item.page)" v-for="(item,index) in homeColumn" :key="index">
				{{item.name}}
			</view>
		</view>
		<home-page v-if="page == 'home-page'"></home-page>
		<list-detail-page v-if="page == 'list-detail-page'"></list-detail-page>
		<mv-detail-page v-if="page == 'mv-detail-page'"></mv-detail-page>
		<search-page v-if="page == 'search-page'"></search-page>
		<song-detail ref="songDetail" :animation="animationData" :paused="paused" @myplay="play" @hide-song-detail="hideSongDetail"></song-detail>
		<view v-show="showTabBar" class="tab-bar flex">
			<view class="post" @tap="showSongDetail">
				<image class="auto-img" :src="currInfo.pic" mode="widthFix"></image>
			</view>
			<view class="flex-1 info ellipsis">
				<view class="name ellipsis">{{currInfo.name}}</view>
				<view class="singer ellipsis">{{currInfo.singer}}</view>
			</view>
			<text @tap="play" class="icon iconfont" :class="paused?'icon-play':'icon-pause'"></text>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import HomePage from '../../components/HomePage'
	import ListDetailPage from '../../components/ListDetailPage'
	import MvDetailPage from '../../components/MvDetailPage'
	import SearchPage from '../../components/SearchPage'
	import SongDetail from '../../components/SongDetail'
	import animateFn from '../../static/animateFn'
	import controlFn from '../../static/controlFn'
	
	const LOOP = 0    //列表播放标识
	const RANDOM = 1  //随机播放标识
	const SINGLE = 2  //单曲播放标识

	export default {
		mixins:[animateFn,controlFn],
		data() {
			return {
				showTabBar:false,
				animationData:'',
				currColumnIndex:0,//column index
				audioContext:null,//音频实例
				paused:true,
			}
		},
		provide(){
			return {
				'app':this
			}
		},
		computed:{
			...mapState(['page','homeColumn','currInfo'])
		},
		watch:{
			// core: control.js通过改变state.currInfo 修改实例src 播放音乐
			currInfo(newVal,oldVal){
				// console.log(this.audioContext.paused);
				this.audioContext.src = newVal.url
				this.audioContext.play()
				this.paused = !this.audioContext.paused
			},
		},
		methods: {
			column(i,page){
				this.currColumnIndex = i;
				this.$store.commit('changePage',page)
			},
			play(){
				if(this.audioContext.paused){
					this.audioContext.play()
				}else{
					this.audioContext.pause()
				}
				this.paused = !this.audioContext.paused
			},
		},
		onLoad(){
			this.audioContext = uni.createInnerAudioContext();
			
			this.audioContext.onPlay(()=>{
				
			})
			
			this.audioContext.onPause(()=>{
				
			})
			
			this.audioContext.onError(()=>{
				console.log('onError');
				uni.showToast({
					title: '可能由于网络或版权原因无法播放',
					icon:'none',
					duration: 3500
				});
				//错误时暂停音乐
				this.audioContext.pause()
				this.paused = true
				//音乐高亮取消
				this.$store.commit('changeCurrSongIndex',-1)
			})
		},
		onHide(){
			this.audioContext.pause()
			this.paused = true
		},
		onUnload(){
			this.audioContext.destroy()
		},
		components:{
			'home-page':HomePage,
			'list-detail-page':ListDetailPage,
			'mv-detail-page':MvDetailPage,
			'search-page':SearchPage,
			'song-detail':SongDetail
		}
	}
</script>

<style lang="less" scoped>
.home{
	position: relative;
	min-height: 100vh;
	background: #f8f8f8;
}
.navbar{
	z-index: 10;
	position: sticky;
	top: 0;
	left: 0;
	height: 46px;
	padding: 0 15px;
	text-align: center;
	font-size: 15px;
	color:#424242;
	box-sizing: border-box;
	background: #fff;
	
	.link{
		height:100%;
		padding: 10px 0;
		box-sizing:border-box;
	}
	
	.active{
		color:#db5c5c;
		border-bottom: 2px solid #DB5C5C;
	}
}
.tab-bar{
	z-index: 10;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	justify-content: flex-start;
	padding: 5px;
	border-top: 1px solid #f3f3f3;
	background: #fff;
	
	.post{
		flex:0 0 50px;
		height: 50px;
		margin-right: 8px;
		border-radius: 3px;
		border:1px solid #f5f5f5;
		overflow: hidden;
	}
	
	.info{
		margin-right: 10px;
		
		.name{
			width: 100%;
			font-size: 15px;
			margin-bottom: 5px;
		}
		
		.singer{
			width: 100%;
			font-size: 13px;
			color:#999;
		}
	}
	
	.icon{
		flex:0 0 30px;
		height: 30px;
		margin-right: 20px;
		font-size: 28px;
	}
}
</style>
