import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		homeColumn: [{
				name: 'Fly音乐',
				page: 'home-page'
			},
			{
				name: 'MV',
				page: 'mv-detail-page'
			},
			{
				name: '搜索',
				page:'search-page'
			},
		],
		homeBanner: [
			'http://p1.music.126.net/LtLnX_gVhQH_BthwZl963Q==/109951163951596638.jpg',
			'http://p1.music.126.net/n7Es-GJSlQV4wXo7z9yS9Q==/109951163952721100.jpg',
			'http://p1.music.126.net/xIvTEjoGyKFxqmoLNUQ-iw==/109951163952380949.jpg',
			'http://p1.music.126.net/DUC8LVwCQC-uzwnOs39OVg==/109951163952495521.jpg',
			'http://p1.music.126.net/c7UHVwKlkmrgx7Xtk7xM-A==/109951163942005218.jpg',
		],
		currInfo: {
			id: "403012527",
			lrc: "https://api.bzqll.com/music/netease/lrc?id=403012527&key=579621905",
			name: "Escape",
			pic: "http://p1.music.126.net/eWmwnFDIj3iC1sk50iiFHQ==/109951163766522542.jpg?param=400y400",
			singer: "Dripice",
			time: 182,
			url: "https://api.bzqll.com/music/netease/url?id=403012527&key=579621905"
		},
		page: 'home-page',
		listId: '' ,//歌单请求数据的参数
		currPlayListId:0,//当前播放列表的id  该标识用于判断歌单的歌曲高亮
		currPlayList:[],//当前播放列表
		currSongIndex:-1//当前歌曲索引
	},
	mutations: {
		changeListId(state, payload) {
			state.listId = payload
		},
		changePage(state, payload) {
			state.page = payload
		},
		changeCurrPlayList(state,payload){
			state.currPlayList = payload
		},
		changeCurrPlayListId(state,payload){
			state.currPlayListId = payload
		},
		changeCurrSongIndex(state,payload){
			state.currSongIndex = payload
		},
		changeCurrSong(state, payload) {
			state.currInfo = payload
		},
		nextSongIndex(state){
			state.currSongIndex++
		},
		prevSongIndex(state){
			state.currSongIndex--
		},
		randomSongIndex(state){
			let len = state.currPlayList.length
			let num = Math.floor(Math.random()*20)
			state.currSongIndex = num
		}
	}
});
export default store
