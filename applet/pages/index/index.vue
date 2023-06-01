<template>
	<view class="content">
		123
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

		}
	}
</script>
