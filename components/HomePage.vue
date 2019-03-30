<template>
	<view class="home">
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :circular="true">
			<swiper-item v-for="(item,index) in homeBanner" :key="index">
				<image class="auto-img" :src="item" mode="widthFix"></image>
			</swiper-item>
		</swiper>
		<view v-if="hotLists" class="hot-song-section">
			<view class="flex section">
				<section-title>热门歌单</section-title>
				<uni-icon type="arrowright" size="20"></uni-icon>
			</view>
			<play-lists :songlist="hotLists" />
		</view>
		<view v-if="newLists" class="new-song-section">
			<view class="flex section">
				<section-title>最新歌单</section-title>
				<uni-icon type="arrowright" size="20"></uni-icon>
			</view>
			<play-lists :songlist="newLists" />
		</view>
		<view v-if="goodLists" class="good-song-section">
			<view class="flex section">
				<section-title>精品歌单</section-title>
				<uni-icon type="arrowright" size="20"></uni-icon>
			</view>
			<play-lists :songlist="goodLists" />
		</view>
		<view class="songs">
			<view class="flex section">
				<section-title>热歌榜</section-title>
			</view>
			<song-list :hot="true" :songs="songs" :playListId="3778678"></song-list>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {uniIcon,uniLoadMore } from "@dcloudio/uni-ui"
	import PlayLists from './PlayLists'
	import SectionTitle from './SectionTitle'
	import SongList from './SongList';
	
	export default {
		name:'home-page',
		data() {
			return {
				hotLists:null,
				goodLists:null,
				newLists:null,
				songlist:null,
				songlen:20,
			}
		},
		inject:['app'],
		computed:{
			songs(){
				if(!this.songlist)return
				return this.songlist.songs.slice(0,this.songlen)
			},
			...mapState(['homeBanner'])
		},
		methods: {
			//热门  最新 歌单
			getSong({limit=6,offset=0,order='hot'}){
				// #ifdef MP
				return uni.request({
					url:'https://api.bzqll.com/music/netease/hotSongList',
					data:{
						key:this.key,
						limit,
						offset,
						order
					}
				})
				// #endif
				// #ifdef H5
				return uni.request({
					url:'/api/music/netease/hotSongList',
					data:{
						key:this.key,
						limit,
						offset,
						order
					}
				})
				// #endif
				
			},
			//精品歌单
			getGoodSong({limit=6}){
				// #ifdef MP
				return uni.request({
					url:'https://api.bzqll.com/music/netease/highQualitySongList',
					data:{
						key:this.key,
						limit,
					}
				})
				// #endif
				// #ifdef H5
				return uni.request({
					url:'/api/netease/highQualitySongList',
					data:{
						key:this.key,
						limit,
					}
				})
				// #endif
			},
			//热门歌曲
			getHotSong(){
				// #ifdef MP
				return uni.request({
					url: 'https://api.bzqll.com/music/netease/songList',
					data: {
						key:this.key,
						id:3778678,
					},
				});
				// #endif
				// #ifdef H5
				return uni.request({
					url: '/api/music/netease/songList',
					data: {
						key:this.key,
						id:3778678,
					},
				});
				// #endif
			},
			dealDataPlayCount(arr){
				let temp = arr
				temp.forEach((item)=>{
					if((item.playCount/10000) >= 1){
						let res = (item.playCount / 10000).toFixed(1) + '万'
						item.playCount = res
					}
				})
				return temp;
			},
			allData(){
				uni.showLoading({
					title:'加载中...'
				})
				const promises = [this.getSong({limit:6}),this.getGoodSong({limit:6}),this.getSong({limit:6,order:'new'}),this.getHotSong()]
				Promise.all(promises).then((posts)=> {
					this.hotLists = this.dealDataPlayCount(posts[0][1].data.data)
					this.newLists = this.dealDataPlayCount(posts[2][1].data.data)
					this.goodLists = posts[1][1].data.data.playlists
					this.songlist = posts[3][1].data.data
					uni.hideLoading ()
					uni.stopPullDownRefresh()
				}).catch((reason)=>{});
			},
		},
		onLoad(){
			this.allData()
		},
		onPullDownRefresh(){
			this.allData()
		},
		onReachBottom(){
			if(this.songlen>=200){
				uni.showToast({
					title: '已无更多歌曲',
					icon:'none',
					duration: 2000
				});
				return
			}
			this.songlen+=20
		},
		components:{
			'section-title':SectionTitle,
			'play-lists':PlayLists,
			'song-list':SongList,
			uniIcon,
			uniLoadMore 
		}
	}
</script>

<style lang="less" scoped>
.home{
	padding-bottom: 70px;
}
.swiper{
	width: 100%;
	height: 170px;
}
.section{
	justify-content: flex-start;
}
</style>
