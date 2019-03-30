import {mapState,mapMutations} from 'vuex'

export default {
	computed:{
		...mapState(['currPlayList','currSongIndex'])
	},
	methods:{
		...mapMutations([
			'nextSongIndex',
			'prevSongIndex',
			'randomSongIndex',
			'changeCurrSong'
		]),
		//下一曲
		nextSong(){
			this.nextSongIndex()
			this.changeCurrSong(this.currPlayList[this.currSongIndex])
		},
		//上一曲
		prevSong(){
			this.prevSongIndex()
			this.changeCurrSong(this.currPlayList[this.currSongIndex])
		},
		//列表播放
		loopPlay(){
			this.nextSong()
		},
		//随机播放
		randomPlay(){
			this.randomSongIndex()
			this.changeCurrSong(this.currPlayList[this.currSongIndex])
		},
		//单曲播放
		singlePlay(){
			this.audioContext.play()
			// this.paused = false
		}
	}
}


