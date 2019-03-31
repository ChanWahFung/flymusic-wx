<template>
	<view :animation="animation" class="song-detail">
		<view class="bg">
			<image class="auto-img" :src="currInfo.pic"></image>
		</view>
		<view class="header flex">
			<text @tap="hideSongDetailEmit" class="back iconfont icon-left"></text>
			<view class="title flex-1 ellipsis">
				<view class="name ellipsis">{{currInfo.name}}</view>
				<view class="singer ellipsis">{{currInfo.singer}}</view>
			</view>
		</view>
		<view class="rotate-poster" :class="show?'show':''" :animation="spAnimationData">
			<image @tap="tapPoster" class="auto-img" :src="currInfo.pic"></image>
		</view>
		<scroll-view @tap="tapLrc" class="lrc-box" :scroll-into-view="'lrc'+highLightFlag" :animation="lrcAnimationData" scroll-y="true" scroll-with-animation="true">
			<view class="lrc-part" :id="'lrc'+index" :class="highLightFlag == index?'highLight':''" v-for="(item,index) in lrcArr" :key="index">
				{{item.l}}
			</view>
		</scroll-view>
		<view class="progress flex">
			<text class="start-time">{{currTimeStr}}</text>
			<slider class="flex-1" @change="seekTime" :value="currTime" :max="currInfo.time" block-size="14" activeColor="#f25a4a"/>
			<text class="finish-time">{{finishTimeStr}}</text>
		</view>
		<view class="control flex">
			<text @tap="togglePlayType" class="iconfont flex-1" :class="playTypeIcon.icon"></text>
			<text @tap="prevSong" class="prev iconfont icon-prev flex-1"></text>
			<text @tap="play" class="iconfont flex-1" :class="paused?'icon-play':'icon-pause'"></text>
			<text @tap="nextSong" class="next iconfont icon-next flex-1"></text>
			<text @tap="showList" class="iconfont icon-liebiao flex-1"></text>
		</view>
	</view>
</template>

<script>
	const LOOP = 0    //列表播放标识
	const RANDOM = 1  //随机播放标识
	const SINGLE = 2  //单曲播放标识
	
	import {mapState} from 'vuex'
	import controlFn from '../static/controlFn'
	import animateFn from '../static/animateFn'
	
	export default {
		props:['animation','paused'],
		inject:['app'],
		mixins:[controlFn,animateFn],
		data() {
			return {
				playType:LOOP,//播放模式
				show:true,//cd 显示
				lrcArr:null,//歌词数组
				highLightFlag:-1,//歌词高亮 索引
				spAnimationData:'',
				lrcAnimationData:'',
				currTime:0,
			};
		},
		computed:{
			...mapState(['currInfo']),
			playTypeIcon(){
				if(this.playType == LOOP){
					return {icon:'icon-loop',desc:'列表播放'}
				}else if(this.playType == RANDOM){
					return {icon:'icon-random',desc:'随机播放'}
				}else if(this.playType == SINGLE){
					return {icon:'icon-single',desc:'单曲播放'}
				}
			},
			currTimeStr(){
				return this.formatProgressTime(this.currTime)
			},
			finishTimeStr(){
				return this.formatProgressTime(Math.round(this.currInfo.time))
			}
		},
		watch:{
			currInfo(newVal){
				this.highLightFlag = -1
				uni.request({
					url: newVal.lrc,
				}).then(res=>{
					if(res[1].statusCode == 200){
						this.dealLrcData(res[1].data)
					}
				})
			}
		},
		methods:{
			play(){
				this.$emit('myplay')
			},
			tapPoster(){
				this.show= false
				this.hideSongPosterAnimate();
				this.showLrcAnimate();
			},
			tapLrc(){
				this.show= true
				this.hideLrcAnimate();
				this.showSongPosterAnimate();
			},
			seekTime(event){
				this.currTime = event.detail.value
				this.app.audioContext.seek(this.currTime)
				this.lrcArr.forEach((item,index,arr)=>{
					if(index+1 >= arr.length-1){
						return
					}
					if(item.t <= this.currTime && arr[index+1].t >= this.currTime){
						this.highLightFlag = index
						return
					}
				})
			},
			formatProgressTime(time){
				let min = Math.floor(time / 60)
				let sec = time % 60
				if(sec < 10)sec = '0' + sec
				return min + ':' + sec
			},
			formatTime(t){
				let arr = t.match(/\d+/g)
				let result = arr[0]*60 + arr[1]*1 + Number('0.'+arr[2])
				return result
			},
			dealLrcData(data){
				let lrcArr = data.split(/\n/);
				let result = []
				lrcArr.forEach((item,i)=>{
					let temp = item.split(']')
					//有些是两个时间合并一起的
					if(temp.length == 3){
						let t1 = this.formatTime(temp[0].substr(1))
						let t2 = this.formatTime(temp[1].substr(1))
						let l = temp[2]
						result.push({t: t1, l})
						result.push({t: t2, l})
						//有些是空字符串  有些开头不是时间  需要过滤
					}else if(temp!='' && !isNaN(temp[0].substr(1,1))){
						let t = this.formatTime(temp[0].substr(1))
						let l = temp[1]
						result.push({t,l})
					}
				})
				result.sort((itema,itemb)=>{
					return itema.t - itemb.t
				})
				this.lrcArr = result
			},
			hideSongDetailEmit(){
				this.$emit('hide-song-detail')
			},
			togglePlayType(){
				if(this.playType == SINGLE){
					this.playType = LOOP
				}else{
					this.playType++
				}
				uni.showToast({
					title: this.playTypeIcon.desc,
					icon:'none',
					duration: 1000
				});
			},
			showList(){
				
			}
		},
		onLoad(){
			var audioCtx =  this.app.audioContext
			audioCtx.onTimeUpdate(()=>{
				this.currTime = Math.round(audioCtx.currentTime)
				if((this.highLightFlag+1) >= this.lrcArr.length-1){
					this.highLightFlag = this.lrcArr.length-1
					return
				}
				if(this.lrcArr[this.highLightFlag+1].t <= audioCtx.currentTime &&
					this.lrcArr[this.highLightFlag+2].t >= audioCtx.currentTime){
					this.highLightFlag++
					return
				}
			})
			audioCtx.onEnded(()=>{
				// this.app.paused = true
				// var type = this.$refs.songDetail.playType
				//判断播放模式  执行
				this.highLightFlag = -1
				this.currTime = 0
				switch(this.playType){
					case LOOP:
						this.loopPlay();
						break;
					case RANDOM:
						this.randomPlay();
						break;
					case SINGLE:
						this.singlePlay();
						break;
				}
			})
		}
	}
</script>

<style lang="less" scoped>
.song-detail{
	z-index: 20;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	transform-origin: 0 100%;
	transform: scale(0);
	opacity: 0;
	background: rgb(0,0,0);
	overflow: hidden;
	
	.bg{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		
		>image{
			filter:blur(45px) brightness(70%);
			transform: scale(1.3);
		}
	}
}
.header{
	position: relative;
	justify-content: flex-start;
	padding: 10px 8px; 
	
	&::after{
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background: radial-gradient(#ccc 10%,transparent);
		transform: scaleY(0.7);
	}
	
	.back{
		padding: 5px;
		font-size: 24px;
		color:#fff;
	}
	
	.title{
		padding: 0 15px;
	}
	
	.name{
		font-size: 16px;
		color:#fff
	}
	
	.singer{
		font-size: 14px;
		color:#ccc;
	}
}
@keyframes rotate{
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
}
.rotate-poster{
	position: absolute;
	top: 20%;
	left: 50%;
	margin-left: -125px;
	width: 250px;
	height: 250px;
	border: 40px solid #222;
	border-radius: 50%;
	box-sizing: border-box;
	overflow: hidden;
	animation: rotate 18s linear infinite;
	
	&.show{
		z-index: 3;
	}
}
.lrc-box{
// 	position: absolute;
// 	top: 15%;
// 	left: 50%;
	width: 100%;
	height: 66%;
	padding: 0 15px;
	margin-top:10px; 
	// transform: translateX(-50%);
	opacity: 0;
		
	.lrc-part{
		// height: 40px;
		color:#ccc;
		font-size: 15px;
		line-height: 40px;
		text-align: center;
		transition: all .1s;
		
		&.highLight{
			font-size: 16px;
			color:#f25a4a;
		}
		
	}
}
.progress{
// 	position: absolute;
// 	top: 80%;
// 	left: 0;
	margin-top: 20px;
	padding: 0 10px;
	font-size: 12px;
	color:#fff;
	opacity: .9;
}
.control{
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 15px 0;
	opacity: .85;

	>text{
		text-align:center;
		font-size: 26px;
		color:#fdfdfd;
	}
	
	.icon-play,
	.icon-pause{
		font-size: 42px;
	}
	
	.icon-prev,
	.icon-next{
		font-size: 32px;
	}
}
</style>
