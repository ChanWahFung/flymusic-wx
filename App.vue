<script>
	export default {
		data() {
			return
		},
		onLaunch() {
			uni.getStorage({
				key: 'key',
				fail: function() {
					uni.setStorageSync('key', new Date().getTime());
					uni.showModal({
						title: 'Hello',
						content: '欢迎进入Fly音乐o(*￣︶￣*)o',
						showCancel: false,
						confirmText: '关闭',
						confirmColor: '#F25A4A',
					});
				}
			});
		},
	}
</script>

<style>
	@import url("./static/iconfont.css");

	.flex {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.flex-1 {
		flex: 1;
	}

	.flex-2 {
		flex: 2;
	}

	.flex-3 {
		flex: 3;
	}

	.auto-img {
		width: 100%;
		height: 100%;
	}

	.ellipsis {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
