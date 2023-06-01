import App from './App';
import Vue from 'vue';
// 导入GoEasy
import GoEasy from 'goeasy';

Vue.config.productionTip = false
App.mpType = 'app'

// 建议在main.js里初始化全局的GoEasy对象
Vue.prototype.goEasy = GoEasy.getInstance({
  host:'hangzhou.goeasy.io', //新加坡host：singapore.goeasy.io
  appkey: "BC-3e7431623cb844e6a48c81540e0d8cf0", //替换为您的应用appkey
  modules: ['pubsub']
});



// #ifndef VUE3
try {
	function isPromise(obj) {
		return (
			!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function"
		);
	}

	// 统一 vue2 API Promise 化返回格式与 vue3 保持一致
	uni.addInterceptor({
		returnValue(res) {
			if (!isPromise(res)) {
				return res;
			}
			return new Promise((resolve, reject) => {
				res.then((res) => {
					if (res[0]) {
						reject(res[0]);
					} else {
						resolve(res[1]);
					}
				});
			});
		},
	});
} catch (error) {}

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
