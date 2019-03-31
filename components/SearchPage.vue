<template>
	<view class="search-page">
		<view class="search">
			<view class="icon iconfont icon-search-1-copy" @tap="showInputFn"></view>
			<input :class="inputClass" class="search-input flex-1" type="text" placeholder="搜索" placeholder-style="color:#999" v-model="searchVal" @input="searchFn"/>
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
				showInput:false,
				songs:null
			};
		},
		computed:{
			inputClass(){
				if(this.showInput){
					return 'active'
				}else{
					return ''
				}
			}
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
				if(this.searchVal.trim() == '')return
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
							uni.hideLoading ()
							uni.showToast({
								title: '搜索不到相关歌曲',
								icon:'none',
								duration: 2000
							});
							throw  new URIError('请求error,搜索不到内容');
						}
					})
				},1000)
			},
			showInputFn(){
				this.showInput = this.showInput ? false : true
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
	padding: 20px 12px 20px 29px;
	box-sizing: border-box;
	
	.icon{
		position: absolute;
		top: 20px;
		left: 12px;
		z-index: 10;
		width: 35px;
		height: 35px;
		line-height: 35px;
		text-align: center;
		font-size: 18px;
		color: #fff;
		background: #f25a4a;
		border: 1px solid #f5f5f5;
		border-radius: 50px;
		box-sizing: border-box;
	}
			
	.search-input{
		width: 0;
		height: 35px;
		padding: 0;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
		border:1px solid #f25a4a;
		box-sizing: border-box;
		font-size: 0px;
		color:#424242;
		background: #fff;
		transition: all .5s;
		
		&.active{
			width: 100%;
			padding: 2px 10px 2px 25px;
			font-size: 15px;
		}
	}
}
.tip{
	padding-top: 150px;
	text-align: center;
	color:#999;
}
</style>
