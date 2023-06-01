applet: 小程序版即时通讯
运用云数据库功能实现监听云数据库的数据变化，从而触发修改后的回调

先初始化
npm install

<!-- 1 安装GoEasy-sdk -->
npm install goeasy@2.6.6 --save
安装不了
cnpm install goeasy@2.6.6 --save

<!-- 2 小程序使用端需要配置域名 -->
微信小程序特别提醒： 如果需要在小程序里使用GoEasy，需要登录微信公众平台->微信小程序开发设置->服务器域名, 添加socket合法域名：wss://wx-hangzhou.goeasy.io
GoEasy文档：Websocket消息推送 -> 客户端集成 -> 初始化与建立连接

<!-- 3 建立连接 -->
App.vue中建立连接

<!-- 4 在需要的事件中定义，发送消息 -->
pubsub.publish({
    channel: "my_channel",//替换为您自己的channel
    message: "Hello GoEasy!",//替换为您想要发送的消息内容
    onSuccess:function(){
        console.log("消息发布成功。");
    },
    onFailed: function (error) {
        console.log("消息发送失败，错误编码："+error.code+" 错误信息："+error.content);
    }
});