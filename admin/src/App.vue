<template>
  <div id="app">admin</div>
</template>

<script>
export default {
  created() {
    this.jieshou();
  },
  methods: {
    lianjie() {
      // 建立连接
      this.goEasy.connect({
        onSuccess: function () {
          //连接成功
          console.log("连接成功"); //连接成功
        },
        onFailed: function (error) {
          //连接失败
          console.log("连接失败:" + error.code + ",error:" + error.content);
        },
      });
    },
    async jieshou() {
      // 先建立连接
      await this.lianjie()
      var pubsub = this.goEasy.pubsub;
      pubsub.subscribe({
        channel: "my_channel", //替换为您自己的channel
        onMessage: function (message) {
          //收到消息
          console.log(
            "Channel:" + message.channel + " content:" + message.content
          );
        },
        onSuccess: function () {
          console.log("Channel订阅成功。");
        },
        onFailed: function (error) {
          console.log(
            "Channel订阅失败, 错误编码：" +
              error.code +
              " 错误信息：" +
              error.content
          );
        },
      });
    },
  },
};
</script>
