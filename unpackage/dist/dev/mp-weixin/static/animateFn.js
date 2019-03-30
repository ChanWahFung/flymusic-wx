export default {
	methods:{
		showSongDetail(){
			if(this.$store.state.currSongIndex != -1){
				this.showSongDetailAnimate()
			}
		},
		hideSongDetail(){
			this.hideSongDetailAnimate()
		},
		showSongPoster(){
			this.showSongPosterAnimate()
		},
		hideSongPoster(){
			this.hideSongPosterAnimate()
		},
		showLrc(){
			this.showLrcAnimate()
		},
		hideLrc(){
			this.hideLrcAnimate()
		},
		//显示动画
		showSongDetailAnimate(){
			let animation = uni.createAnimation({
				duration: 500,
				transformOrigin:'0 100%',
				timingFunction: 'ease-out',
			})
			animation.scale(1).opacity(1).step()
			this.animationData = animation.export()
		},
		//隐藏动画
		hideSongDetailAnimate(){
			let animation = uni.createAnimation({
				duration: 500,
				transformOrigin:'0 100%',
				timingFunction: 'ease-out',
			})
			animation.scale(0).opacity(0).step()
			this.animationData = animation.export()
		},
		
		showSongPosterAnimate(){
			let animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease-out',
			})
			animation.opacity(1).step()
			this.spAnimationData = animation.export()
		},
		hideSongPosterAnimate(){
			let animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease-out',
			})
			animation.opacity(0).step()
			this.spAnimationData = animation.export()
		},
		showLrcAnimate(){
			let animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease-out',
			})
			animation.opacity(1).step()
			this.lrcAnimationData = animation.export()
		},
		hideLrcAnimate(){
			let animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease-out',
			})
			animation.opacity(0).step()
			this.lrcAnimationData = animation.export()
		}
	}
}