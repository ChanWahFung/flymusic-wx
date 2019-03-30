<template>
	<view class="search-page">
		<view class="search">
			<input class="search-input iconfont icon-search-1-copy" type="text" placeholder="搜索" placeholder-style="color:#999" v-model="searchVal" @input="searchFn"/>
		</view>
		<song-list :songs="songs" :playListId="-1"></song-list>
		<view v-if="!songs" class="tip">QAQ 空空如也</view>
	</view>
</template>

<script>
	import SongList from './SongList';
	export default {
		data() {
			return {
				timer:null,
				dataLen:0,
				searchVal:'',
				songs:null
			};
		},
		methods:{
			getSearchData({s,limit,offset}){
				uni.showLoading({
					title: '加载中',
				});
				// #ifdef MP
				return uni.request({
					url: 'https://api.bzqll.com/music/netease/search',
					data: {
						key:this.key,
						s,
						limit:20,
						offset
					}
				});
				// #endif
				// #ifdef H5
				return uni.request({
					url: '/api/music/netease/search',
					data: {
						key:this.key,
						s,
						limit:20,
						offset
					}
				});
				// #endif
			},
			searchFn(){
				clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					this.dataLen = 0
					this.getSearchData({
						s:this.searchVal,
						offset:this.dataLen
					}).then(res=>{
						if(res[1].data.code == 200){
							this.songs = res[1].data.data;
							uni.hideLoading ()
						}else{
							this.songs = null
							throw  new URIError('请求error,搜索不到内容');
						}
					})
				},1000)
			}
		},
		onPullDownRefresh(){
			this.dataLen = 0
			this.getSearchData({
				s:this.searchVal,
				offset:this.dataLen
			}).then(res=>{
				if(res[1].data.code == 200){
					this.songs = res[1].data.data;
					uni.hideLoading ()
					uni.stopPullDownRefresh()
				}else{
					this.songs = null
					throw  new URIError('请求error,搜索不到内容');
				}
			})
		},
		onReachBottom(){
			this.dataLen+=20
			this.getSearchData({
				s:this.searchVal,
				offset:this.dataLen
			}).then(res=>{
				if(res[1].data.code == 200){
					this.songs.push(...res[1].data.data);
					uni.hideLoading ()
				}else{
					uni.showToast({
						title: '已无更多内容',
						icon:'none',
						duration: 2000
					});
				}
			})
		},
		components:{
			'song-list':SongList
		}
	}
</script>

<style lang="less" scoped>
.search-page{
	position: relative;
	padding-bottom: 70px;
}
.search{
	z-index: 5;
	position: sticky;
	top: 46px;
	background: #fff;
	padding: 20px 12px;
	box-sizing: border-box;
	border-bottom: 1px solid #f5f5f5;
			
		.search-input{
			position: relative;
			padding: 3px 30px;
			border-radius: 20px;
			border:1px solid #ccc;
			font-size: 15px;
			color:#424242;
			background: #f9f9f9;
			
			&::before{
				position: absolute;
				top: 25%;
				left: 8px;
				content: "\e609";
				font-size: 16px;
				color:#999;
			}
		}
}
.tip{
	padding-top: 150px;
	text-align: center;
	color:#999;
}
</style>
