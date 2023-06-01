import Vue from 'vue'
import App from './App.vue'
import GoEasy from 'goeasy'

Vue.config.productionTip = false

// 建议在main.js里初始化全局的GoEasy对象
Vue.prototype.goEasy = GoEasy.getInstance({
  host:'hangzhou.goeasy.io', //新加坡host：singapore.goeasy.io
  appkey: "BC-3e7431623cb844e6a48c81540e0d8cf0", //替换为您的应用appkey
  modules: ['pubsub']
});

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
