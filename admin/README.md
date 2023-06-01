# admin 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

建立与前端的实时通讯

1 安装GoEasy插件
npm install goeasy@2.6.6 --save

2 main.js 
导入:import GoEasy from 'goeasy'
建立全局main.js对象: 
Vue.prototype.goEasy = GoEasy.getInstance({
  host:'hangzhou.goeasy.io', //新加坡host：singapore.goeasy.io
  appkey: "您的appkey", //替换为您的应用appkey
  modules: ['pubsub']
});

3 App.vue
建立连接: 
goEasy.connect({
  onSuccess: function () { //连接成功
    console.log("GoEasy connect successfully.") //连接成功
  },
  onFailed: function (error) { //连接失败
   console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
  }
});

接收方法，当前端使用发送事件时 会自动调用响应