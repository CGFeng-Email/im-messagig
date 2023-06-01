<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 当数据库环境id同时存在多个的情况下、需要调用初始化方法来调用指定的环境id
			wx.cloud.init({
				env: 'diancan-1gbnagvw311f423e',
				traceUser: true,
			})
			
			// 建立连接
			this.goEasy.connect({
			  onSuccess: function () { //连接成功
			    console.log("连接成功") //连接成功
			  },
			  onFailed: function (error) { //连接失败
			   console.log("连接失败:"+error.code+ ",error:"+error.content);
			  }
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
