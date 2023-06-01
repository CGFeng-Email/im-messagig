<template>
	<view class="content">
		<button @click="fasong">发送消息数据</button>
	</view>
</template>

<script>
	const db = wx.cloud.database()
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			const watcher = db.collection('cuisineCategory').doc('8f4e14e96421b9bf0021a04d089031cf').watch({
				onChange: function(snapshot) {
					console.log('snapshot', snapshot)
				},
				onError: function(err) {
					console.error('the watch closed because of error', err)
				}
			})
		},
		methods: {
			fasong() {
				var pubsub = this.goEasy.pubsub;
				pubsub.publish({
					channel: "my_channel", //替换为您自己的channel
					message: "前端的消息发送过来了", //替换为您想要发送的消息内容
					onSuccess: function() {
						console.log("消息发布成功。");
					},
					onFailed: function(error) {
						console.log("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content);
					}
				});
			}
		}
	}
</script>
