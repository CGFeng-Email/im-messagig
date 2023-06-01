(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!*********************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var objectKeys = ['qy', 'env', 'error', 'version', 'lanDebug', 'cloud', 'serviceMarket', 'router', 'worklet'];
var singlePageDisableKey = ['lanDebug', 'router', 'worklet'];
var target = typeof globalThis !== 'undefined' ? globalThis : function () {
  return this;
}();
var key = ['w', 'x'].join('');
var oldWx = target[key];
var launchOption = oldWx.getLaunchOptionsSync ? oldWx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof oldWx[key] === 'function';
}
function initWx() {
  var newWx = {};
  for (var _key in oldWx) {
    if (isWxKey(_key)) {
      // TODO wrapper function
      newWx[_key] = oldWx[_key];
    }
  }
  return newWx;
}
target[key] = initWx();
var _default = target[key];
exports.default = _default;

/***/ }),
/* 2 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;
exports.createComponent = createComponent;
exports.createPage = createPage;
exports.createPlugin = createPlugin;
exports.createSubpackageApp = createSubpackageApp;
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _construct2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/construct */ 15));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _uniI18n = __webpack_require__(/*! @dcloudio/uni-i18n */ 22);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var realAtob;
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== 'function') {
  realAtob = function realAtob(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, '');
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }

    // Adding the padding if missing, for semplicity
    str += '=='.slice(2 - (str.length & 3));
    var bitmap;
    var result = '';
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length;) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  // 注意atob只能在全局对象上调用，例如：`const Base64 = {atob};Base64.atob('xxxx')`是错误的用法
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
function getCurrentUserInfo() {
  var token = wx.getStorageSync('uni_id_token') || '';
  var tokenArr = token.split('.');
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  var userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error('获取当前用户信息出错，详细错误信息为：' + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1000;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(Vue) {
  Vue.prototype.uniIDHasRole = function (roleId) {
    var _getCurrentUserInfo = getCurrentUserInfo(),
      role = _getCurrentUserInfo.role;
    return role.indexOf(roleId) > -1;
  };
  Vue.prototype.uniIDHasPermission = function (permissionId) {
    var _getCurrentUserInfo2 = getCurrentUserInfo(),
      permission = _getCurrentUserInfo2.permission;
    return this.uniIDHasRole('admin') || permission.indexOf(permissionId) > -1;
  };
  Vue.prototype.uniIDTokenValid = function () {
    var _getCurrentUserInfo3 = getCurrentUserInfo(),
      tokenExpired = _getCurrentUserInfo3.tokenExpired;
    return tokenExpired > Date.now();
  };
}
var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isFn(fn) {
  return typeof fn === 'function';
}
function isStr(str) {
  return typeof str === 'string';
}
function isObject(obj) {
  return obj !== null && (0, _typeof2.default)(obj) === 'object';
}
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function noop() {}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
function sortObject(obj) {
  var sortObj = {};
  if (isPlainObject(obj)) {
    Object.keys(obj).sort().forEach(function (key) {
      sortObj[key] = obj[key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
var HOOKS = ['invoke', 'success', 'fail', 'complete', 'returnValue'];
var globalInterceptors = {};
var scopedInterceptors = {};
function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}
function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}
function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}
function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}
function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}
function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}
function isPromise(obj) {
  return !!obj && ((0, _typeof2.default)(obj) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {}
        };
      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    }
  };
}
function wrapperOptions(interceptor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options) {
  for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    params[_key - 3] = arguments[_key];
  }
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}
var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise(function (resolve, reject) {
      res.then(function (res) {
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  }
};
var SYNC_API_RE = /^\$|Window$|WindowStyle$|sendHostEvent|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getLocale|setLocale|invokePushCallback|getWindowInfo|getDeviceInfo|getAppBaseInfo|getSystemSetting|getAppAuthorizeSetting|initUTS|requireUTS|registerUTS/;
var CONTEXT_API_RE = /^create|Manager$/;

// Context例外情况
var CONTEXT_API_RE_EXC = ['createBLEConnection'];

// 同步例外情况
var ASYNC_API = ['createBLEConnection', 'createPushMessage'];
var CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}
function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).catch(function (err) {
    return [err];
  });
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}

/* eslint-disable no-extend-native */
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    var promise = this.constructor;
    return this.then(function (value) {
      return promise.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return promise.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
}
function promisify(name, api) {
  if (!shouldPromise(name) || !isFn(api)) {
    return api;
  }
  return function promiseApi() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject
      })].concat(params));
    })));
  };
}
var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;
function checkDeviceWidth() {
  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
    platform = _wx$getSystemInfoSync.platform,
    pixelRatio = _wx$getSystemInfoSync.pixelRatio,
    windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}
function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}
var LOCALE_ZH_HANS = 'zh-Hans';
var LOCALE_ZH_HANT = 'zh-Hant';
var LOCALE_EN = 'en';
var LOCALE_FR = 'fr';
var LOCALE_ES = 'es';
var messages = {};
var locale;
{
  locale = normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN;
}
function initI18nMessages() {
  if (!isEnableLocale()) {
    return;
  }
  var localeKeys = Object.keys(__uniConfig.locales);
  if (localeKeys.length) {
    localeKeys.forEach(function (locale) {
      var curMessages = messages[locale];
      var userMessages = __uniConfig.locales[locale];
      if (curMessages) {
        Object.assign(curMessages, userMessages);
      } else {
        messages[locale] = userMessages;
      }
    });
  }
}
initI18nMessages();
var i18n = (0, _uniI18n.initVueI18n)(locale, {});
var t = i18n.t;
var i18nMixin = i18n.mixin = {
  beforeCreate: function beforeCreate() {
    var _this = this;
    var unwatch = i18n.i18n.watchLocale(function () {
      _this.$forceUpdate();
    });
    this.$once('hook:beforeDestroy', function () {
      unwatch();
    });
  },
  methods: {
    $$t: function $$t(key, values) {
      return t(key, values);
    }
  }
};
var setLocale = i18n.setLocale;
var getLocale = i18n.getLocale;
function initAppLocale(Vue, appVm, locale) {
  var state = Vue.observable({
    locale: locale || i18n.getLocale()
  });
  var localeWatchers = [];
  appVm.$watchLocale = function (fn) {
    localeWatchers.push(fn);
  };
  Object.defineProperty(appVm, '$locale', {
    get: function get() {
      return state.locale;
    },
    set: function set(v) {
      state.locale = v;
      localeWatchers.forEach(function (watch) {
        return watch(v);
      });
    }
  });
}
function isEnableLocale() {
  return typeof __uniConfig !== 'undefined' && __uniConfig.locales && !!Object.keys(__uniConfig.locales).length;
}
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
// export function initI18n() {
//   const localeKeys = Object.keys(__uniConfig.locales || {})
//   if (localeKeys.length) {
//     localeKeys.forEach((locale) =>
//       i18n.add(locale, __uniConfig.locales[locale])
//     )
//   }
// }

function getLocale$1() {
  // 优先使用 $locale
  if (isFn(getApp)) {
    var app = getApp({
      allowDefault: true
    });
    if (app && app.$vm) {
      return app.$vm.$locale;
    }
  }
  return normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN;
}
function setLocale$1(locale) {
  var app = isFn(getApp) ? getApp() : false;
  if (!app) {
    return false;
  }
  var oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach(function (fn) {
      return fn({
        locale: locale
      });
    });
    return true;
  }
  return false;
}
var onLocaleChangeCallbacks = [];
function onLocaleChange(fn) {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
}
if (typeof global !== 'undefined') {
  global.getLocale = getLocale$1;
}
var interceptors = {
  promiseInterceptor: promiseInterceptor
};
var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  getLocale: getLocale$1,
  setLocale: setLocale$1,
  onLocaleChange: onLocaleChange,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor,
  interceptors: interceptors
});
function findExistsPageIndex(url) {
  var pages = getCurrentPages();
  var len = pages.length;
  while (len--) {
    var page = pages[len];
    if (page.$page && page.$page.fullPath === url) {
      return len;
    }
  }
  return -1;
}
var redirectTo = {
  name: function name(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.delta) {
      return 'navigateBack';
    }
    return 'redirectTo';
  },
  args: function args(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.url) {
      var existsPageIndex = findExistsPageIndex(fromArgs.url);
      if (existsPageIndex !== -1) {
        var delta = getCurrentPages().length - 1 - existsPageIndex;
        if (delta > 0) {
          fromArgs.delta = delta;
        }
      }
    }
  }
};
var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(function (item, index) {
        return index < currentIndex ? item !== urls[currentIndex] : true;
      });
    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
var UUID_KEY = '__DC_STAT_UUID';
var deviceId;
function useDeviceId(result) {
  deviceId = deviceId || wx.getStorageSync(UUID_KEY);
  if (!deviceId) {
    deviceId = Date.now() + '' + Math.floor(Math.random() * 1e7);
    wx.setStorage({
      key: UUID_KEY,
      data: deviceId
    });
  }
  result.deviceId = deviceId;
}
function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.screenHeight - safeArea.bottom
    };
  }
}
function populateParameters(result) {
  var _result$brand = result.brand,
    brand = _result$brand === void 0 ? '' : _result$brand,
    _result$model = result.model,
    model = _result$model === void 0 ? '' : _result$model,
    _result$system = result.system,
    system = _result$system === void 0 ? '' : _result$system,
    _result$language = result.language,
    language = _result$language === void 0 ? '' : _result$language,
    theme = result.theme,
    version = result.version,
    platform = result.platform,
    fontSizeSetting = result.fontSizeSetting,
    SDKVersion = result.SDKVersion,
    pixelRatio = result.pixelRatio,
    deviceOrientation = result.deviceOrientation;
  // const isQuickApp = "mp-weixin".indexOf('quickapp-webview') !== -1

  var extraParam = {};

  // osName osVersion
  var osName = '';
  var osVersion = '';
  {
    osName = system.split(' ')[0] || '';
    osVersion = system.split(' ')[1] || '';
  }
  var hostVersion = version;

  // deviceType
  var deviceType = getGetDeviceType(result, model);

  // deviceModel
  var deviceBrand = getDeviceBrand(brand);

  // hostName
  var _hostName = getHostName(result);

  // deviceOrientation
  var _deviceOrientation = deviceOrientation; // 仅 微信 百度 支持

  // devicePixelRatio
  var _devicePixelRatio = pixelRatio;

  // SDKVersion
  var _SDKVersion = SDKVersion;

  // hostLanguage
  var hostLanguage = language.replace(/_/g, '-');

  // wx.getAccountInfoSync

  var parameters = {
    appId: "__UNI__900008A",
    appName: "applet",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "3.7.3",
    uniRuntimeVersion: "3.7.3",
    uniPlatform: undefined || "mp-weixin",
    deviceBrand: deviceBrand,
    deviceModel: model,
    deviceType: deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName: osName.toLocaleLowerCase(),
    osVersion: osVersion,
    hostTheme: theme,
    hostVersion: hostVersion,
    hostLanguage: hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: undefined,
    osTheme: undefined,
    ua: undefined,
    hostPackageName: undefined,
    browserName: undefined,
    browserVersion: undefined
  };
  Object.assign(result, parameters, extraParam);
}
function getGetDeviceType(result, model) {
  var deviceType = result.deviceType || 'phone';
  {
    var deviceTypeMaps = {
      ipad: 'pad',
      windows: 'pc',
      mac: 'pc'
    };
    var deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    var _model = model.toLocaleLowerCase();
    for (var index = 0; index < deviceTypeMapsKeys.length; index++) {
      var _m = deviceTypeMapsKeys[index];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  var deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = brand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale$1 ? getLocale$1() : defaultLanguage;
}
function getHostName(result) {
  var _platform = 'WeChat';
  var _hostName = result.hostName || _platform; // mp-jd
  {
    if (result.environment) {
      _hostName = result.environment;
    } else if (result.host && result.host.env) {
      _hostName = result.host.env;
    }
  }
  return _hostName;
}
var getSystemInfo = {
  returnValue: function returnValue(result) {
    useDeviceId(result);
    addSafeAreaInsets(result);
    populateParameters(result);
  }
};
var showActionSheet = {
  args: function args(fromArgs) {
    if ((0, _typeof2.default)(fromArgs) === 'object') {
      fromArgs.alertText = fromArgs.title;
    }
  }
};
var getAppBaseInfo = {
  returnValue: function returnValue(result) {
    var _result = result,
      version = _result.version,
      language = _result.language,
      SDKVersion = _result.SDKVersion,
      theme = _result.theme;
    var _hostName = getHostName(result);
    var hostLanguage = language.replace('_', '-');
    result = sortObject(Object.assign(result, {
      appId: "__UNI__900008A",
      appName: "applet",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version,
      hostLanguage: hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme
    }));
  }
};
var getDeviceInfo = {
  returnValue: function returnValue(result) {
    var _result2 = result,
      brand = _result2.brand,
      model = _result2.model;
    var deviceType = getGetDeviceType(result, model);
    var deviceBrand = getDeviceBrand(brand);
    useDeviceId(result);
    result = sortObject(Object.assign(result, {
      deviceType: deviceType,
      deviceBrand: deviceBrand,
      deviceModel: model
    }));
  }
};
var getWindowInfo = {
  returnValue: function returnValue(result) {
    addSafeAreaInsets(result);
    result = sortObject(Object.assign(result, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
var getAppAuthorizeSetting = {
  returnValue: function returnValue(result) {
    var locationReducedAccuracy = result.locationReducedAccuracy;
    result.locationAccuracy = 'unsupported';
    if (locationReducedAccuracy === true) {
      result.locationAccuracy = 'reduced';
    } else if (locationReducedAccuracy === false) {
      result.locationAccuracy = 'full';
    }
  }
};

// import navigateTo from 'uni-helpers/navigate-to'

var compressImage = {
  args: function args(fromArgs) {
    // https://developers.weixin.qq.com/community/develop/doc/000c08940c865011298e0a43256800?highLine=compressHeight
    if (fromArgs.compressedHeight && !fromArgs.compressHeight) {
      fromArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !fromArgs.compressWidth) {
      fromArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = {
  redirectTo: redirectTo,
  // navigateTo,  // 由于在微信开发者工具的页面参数，会显示__id__参数，因此暂时关闭mp-weixin对于navigateTo的AOP
  previewImage: previewImage,
  getSystemInfo: getSystemInfo,
  getSystemInfoSync: getSystemInfo,
  showActionSheet: showActionSheet,
  getAppBaseInfo: getAppBaseInfo,
  getDeviceInfo: getDeviceInfo,
  getWindowInfo: getWindowInfo,
  getAppAuthorizeSetting: getAppAuthorizeSetting,
  compressImage: compressImage
};
var todos = ['vibrate', 'preloadPage', 'unPreloadPage', 'loadSubPackage'];
var canIUses = [];
var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];
function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}
function processArgs(methodName, fromArgs) {
  var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {
    // 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {
          // 不支持的参数
          console.warn("The '".concat(methodName, "' method of platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support option '").concat(key, "'"));
        } else if (isStr(keyOption)) {
          // 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {
          // {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        if (isFn(fromArgs[key])) {
          toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
        }
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}
function processReturnValue(methodName, res, returnValue) {
  var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {
    // 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}
function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {
      // 暂不支持的 api
      return function () {
        console.error("Platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support '".concat(methodName, "'."));
      };
    }
    return function (arg1, arg2) {
      // 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      if (isFn(options.name)) {
        methodName = options.name(arg1);
      } else if (isStr(options.name)) {
        methodName = options.name;
      }
      var returnValue = wx[methodName].apply(wx, args);
      if (isSyncApi(methodName)) {
        // 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}
var todoApis = Object.create(null);
var TODOS = ['onTabBarMidButtonTap', 'subscribePush', 'unsubscribePush', 'onPush', 'offPush', 'share'];
function createTodoApi(name) {
  return function todoApi(_ref) {
    var fail = _ref.fail,
      complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail method '").concat(name, "' not supported")
    };
    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}
TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});
var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin']
};
function getProvider(_ref2) {
  var service = _ref2.service,
    success = _ref2.success,
    fail = _ref2.fail,
    complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service]
    };
    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail service not found'
    };
    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}
var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider
});
var getEmitter = function () {
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();
function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}
function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}
var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit
});

/**
 * 框架内 try-catch
 */
/**
 * 开发者 try-catch
 */
function tryCatch(fn) {
  return function () {
    try {
      return fn.apply(fn, arguments);
    } catch (e) {
      // TODO
      console.error(e);
    }
  };
}
function getApiCallbacks(params) {
  var apiCallbacks = {};
  for (var name in params) {
    var param = params[name];
    if (isFn(param)) {
      apiCallbacks[name] = tryCatch(param);
      delete params[name];
    }
  }
  return apiCallbacks;
}
var cid;
var cidErrMsg;
var enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e) {}
  return message;
}
function invokePushCallback(args) {
  if (args.type === 'enabled') {
    enabled = true;
  } else if (args.type === 'clientId') {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === 'pushMsg') {
    var message = {
      type: 'receive',
      data: normalizePushMessage(args.message)
    };
    for (var i = 0; i < onPushMessageCallbacks.length; i++) {
      var callback = onPushMessageCallbacks[i];
      callback(message);
      // 该消息已被阻止
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === 'click') {
    onPushMessageCallbacks.forEach(function (callback) {
      callback({
        type: 'click',
        data: normalizePushMessage(args.message)
      });
    });
  }
}
var getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid, errMsg) {
  getPushCidCallbacks.forEach(function (callback) {
    callback(cid, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
function getPushClientId(args) {
  if (!isPlainObject(args)) {
    args = {};
  }
  var _getApiCallbacks = getApiCallbacks(args),
    success = _getApiCallbacks.success,
    fail = _getApiCallbacks.fail,
    complete = _getApiCallbacks.complete;
  var hasSuccess = isFn(success);
  var hasFail = isFn(fail);
  var hasComplete = isFn(complete);
  Promise.resolve().then(function () {
    if (typeof enabled === 'undefined') {
      enabled = false;
      cid = '';
      cidErrMsg = 'uniPush is not enabled';
    }
    getPushCidCallbacks.push(function (cid, errMsg) {
      var res;
      if (cid) {
        res = {
          errMsg: 'getPushClientId:ok',
          cid: cid
        };
        hasSuccess && success(res);
      } else {
        res = {
          errMsg: 'getPushClientId:fail' + (errMsg ? ' ' + errMsg : '')
        };
        hasFail && fail(res);
      }
      hasComplete && complete(res);
    });
    if (typeof cid !== 'undefined') {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
}
var onPushMessageCallbacks = [];
// 不使用 defineOnApi 实现，是因为 defineOnApi 依赖 UniServiceJSBridge ，该对象目前在小程序上未提供，故简单实现
var onPushMessage = function onPushMessage(fn) {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
var offPushMessage = function offPushMessage(fn) {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    var index = onPushMessageCallbacks.indexOf(fn);
    if (index > -1) {
      onPushMessageCallbacks.splice(index, 1);
    }
  }
};
var baseInfo = wx.getAppBaseInfo && wx.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx.getSystemInfoSync();
}
var host = baseInfo ? baseInfo.host : null;
var shareVideoMessage = host && host.env === 'SAAASDK' ? wx.miniapp.shareVideoMessage : wx.shareVideoMessage;
var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shareVideoMessage: shareVideoMessage,
  getPushClientId: getPushClientId,
  onPushMessage: onPushMessage,
  offPushMessage: offPushMessage,
  invokePushCallback: invokePushCallback
});
var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];
function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function initBehavior(options) {
  return Behavior(options);
}
function isPage() {
  return !!this.route;
}
function initRelation(detail) {
  this.triggerEvent('__l', detail);
}
function selectAllComponents(mpInstance, selector, $refs) {
  var components = mpInstance.selectAllComponents(selector) || [];
  components.forEach(function (component) {
    var ref = component.dataset.ref;
    $refs[ref] = component.$vm || toSkip(component);
    {
      if (component.dataset.vueGeneric === 'scoped') {
        component.selectAllComponents('.scoped-ref').forEach(function (scopedComponent) {
          selectAllComponents(scopedComponent, selector, $refs);
        });
      }
    }
  });
}
function syncRefs(refs, newRefs) {
  var oldKeys = (0, _construct2.default)(Set, (0, _toConsumableArray2.default)(Object.keys(refs)));
  var newKeys = Object.keys(newRefs);
  newKeys.forEach(function (key) {
    var oldValue = refs[key];
    var newValue = newRefs[key];
    if (Array.isArray(oldValue) && Array.isArray(newValue) && oldValue.length === newValue.length && newValue.every(function (value) {
      return oldValue.includes(value);
    })) {
      return;
    }
    refs[key] = newValue;
    oldKeys.delete(key);
  });
  oldKeys.forEach(function (key) {
    delete refs[key];
  });
  return refs;
}
function initRefs(vm) {
  var mpInstance = vm.$scope;
  var refs = {};
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      selectAllComponents(mpInstance, '.vue-ref', $refs);
      // TODO 暂不考虑 for 中的 scoped
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for') || [];
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || toSkip(component));
      });
      return syncRefs(refs, $refs);
    }
  });
}
function handleLink(event) {
  var _ref3 = event.detail || event.value,
    vuePid = _ref3.vuePid,
    vueOptions = _ref3.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  vueOptions.parent = parentVm;
}
function markMPComponent(component) {
  // 在 Vue 中标记为小程序组件
  var IS_MP = '__v_isMPComponent';
  Object.defineProperty(component, IS_MP, {
    configurable: true,
    enumerable: false,
    value: true
  });
  return component;
}
function toSkip(obj) {
  var OB = '__ob__';
  var SKIP = '__v_skip';
  if (isObject(obj) && Object.isExtensible(obj)) {
    // 避免被 @vue/composition-api 观测
    Object.defineProperty(obj, OB, {
      configurable: true,
      enumerable: false,
      value: (0, _defineProperty2.default)({}, SKIP, true)
    });
  }
  return obj;
}
var MPPage = Page;
var MPComponent = Component;
var customizeRE = /:/g;
var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});
function initTriggerEvent(mpInstance) {
  var oldTriggerEvent = mpInstance.triggerEvent;
  var newTriggerEvent = function newTriggerEvent(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    // 事件名统一转驼峰格式，仅处理：当前组件为 vue 组件、当前组件为 vue 组件子组件
    if (this.$vm || this.dataset && this.dataset.comType) {
      event = customize(event);
    } else {
      // 针对微信/QQ小程序单独补充驼峰格式事件，以兼容历史项目
      var newEvent = customize(event);
      if (newEvent !== event) {
        oldTriggerEvent.apply(this, [newEvent].concat(args));
      }
    }
    return oldTriggerEvent.apply(this, [event].concat(args));
  };
  try {
    // 京东小程序 triggerEvent 为只读
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initHook(name, options, isComponent) {
  var oldHook = options[name];
  options[name] = function () {
    markMPComponent(this);
    initTriggerEvent(this);
    if (oldHook) {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return oldHook.apply(this, args);
    }
  };
}
if (!MPPage.__$wrappered) {
  MPPage.__$wrappered = true;
  Page = function Page() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('onLoad', options);
    return MPPage(options);
  };
  Page.after = MPPage.after;
  Component = function Component() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('created', options);
    return MPComponent(options);
  };
}
var PAGE_EVENT_HOOKS = ['onPullDownRefresh', 'onReachBottom', 'onAddToFavorites', 'onShareTimeline', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap'];
function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}
function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }
  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }
  vueOptions = vueOptions.default || vueOptions;
  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super && vueOptions.super.options && Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }
  if (isFn(vueOptions[hook]) || Array.isArray(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {
      return hasHook(hook, mixin);
    });
  }
}
function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}
function initUnknownHooks(mpOptions, vueOptions) {
  var excludes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  findHooks(vueOptions).forEach(function (hook) {
    return initHook$1(mpOptions, hook, excludes);
  });
}
function findHooks(vueOptions) {
  var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (vueOptions) {
    Object.keys(vueOptions).forEach(function (name) {
      if (name.indexOf('on') === 0 && isFn(vueOptions[name])) {
        hooks.push(name);
      }
    });
  }
  return hooks;
}
function initHook$1(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function (args) {
      return this.$vm && this.$vm.__call_hook(hook, args);
    };
  }
}
function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  vueOptions = VueComponent.options;
  return [VueComponent, vueOptions];
}
function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}
function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;
  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}
function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};
  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }
  if (!isPlainObject(data)) {
    data = {};
  }
  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });
  return data;
}
var PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions.behaviors;
  var vueExtends = vueOptions.extends;
  var vueMixins = vueOptions.mixins;
  var vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps.name = {
            type: String,
            default: ''
          };
          vueProps.value = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ''
          };
        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(initBehavior({
      properties: initProperties(vueExtends.props, true)
    }));
  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(initBehavior({
          properties: initProperties(vueMixin.props, true)
        }));
      }
    });
  }
  return behaviors;
}
function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function initProperties(props) {
  var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var options = arguments.length > 3 ? arguments[3] : undefined;
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: ''
    };
    {
      if (options.virtualHost) {
        properties.virtualHostStyle = {
          type: null,
          value: ''
        };
        properties.virtualHostClass = {
          type: null,
          value: ''
        };
      }
    }
    // scopedSlotsCompiler auto
    properties.scopedSlotsCompiler = {
      type: String,
      value: ''
    };
    properties.vueSlots = {
      // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots
        });
      }
    };
  }
  if (Array.isArray(props)) {
    // ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key)
      };
    });
  } else if (isPlainObject(props)) {
    // {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {
        // title:{type:String,default:''}
        var value = opts.default;
        if (isFn(value)) {
          value = value();
        }
        opts.type = parsePropType(key, opts.type);
        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key)
        };
      } else {
        // content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key)
        };
      }
    });
  }
  return properties;
}
function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}
  event.stopPropagation = noop;
  event.preventDefault = noop;
  event.target = event.target || {};
  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }
  if (hasOwn(event, 'markerId')) {
    event.detail = (0, _typeof2.default)(event.detail) === 'object' ? event.detail : {};
    event.detail.markerId = event.markerId;
  }
  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }
  return event;
}
function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {
      // ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];
      var vFor;
      if (Number.isInteger(dataPath)) {
        vFor = dataPath;
      } else if (!dataPath) {
        vFor = context;
      } else if (typeof dataPath === 'string' && dataPath) {
        if (dataPath.indexOf('#s#') === 0) {
          vFor = dataPath.substr(3);
        } else {
          vFor = vm.__get_value(dataPath, context);
        }
      }
      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }
      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}
function processEventExtra(vm, extra, event, __args__) {
  var extraObj = {};
  if (Array.isArray(extra) && extra.length) {
    /**
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *'test'
     */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {
          // model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {
            // $event
            extraObj['$' + index] = event;
          } else if (dataPath === 'arguments') {
            extraObj['$' + index] = event.detail ? event.detail.__args__ || __args__ : __args__;
          } else if (dataPath.indexOf('$event.') === 0) {
            // $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }
  return extraObj;
}
function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}
function processEventArgs(vm, event) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var isCustom = arguments.length > 4 ? arguments[4] : undefined;
  var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象

  // fixed 用户直接触发 mpInstance.triggerEvent
  var __args__ = isPlainObject(event.detail) ? event.detail.__args__ || [event.detail] : [event.detail];
  if (isCustom) {
    // 自定义事件
    isCustomMPEvent = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {
      // 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return __args__;
    }
  }
  var extraObj = processEventExtra(vm, extra, event, __args__);
  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {
        // input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(__args__[0]);
        } else {
          // wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });
  return ret;
}
var ONCE = '~';
var CUSTOM = '^';
function isMatchEventType(eventType, optType) {
  return eventType === optType || optType === 'regionchange' && (eventType === 'begin' || eventType === 'end');
}
function getContextVm(vm) {
  var $parent = vm.$parent;
  // 父组件是 scoped slots 或者其他自定义组件时继续查找
  while ($parent && $parent.$parent && ($parent.$options.generic || $parent.$parent.$options.generic || $parent.$scope._$vuePid)) {
    $parent = $parent.$parent;
  }
  return $parent && $parent.$parent;
}
function handleEvent(event) {
  var _this2 = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn('事件信息不存在');
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn('事件信息不存在');
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;
  var ret = [];
  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];
    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;
    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this2.$vm;
          if (handlerCtx.$options.generic) {
            // mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = getContextVm(handlerCtx) || handlerCtx;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx, processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName));
            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            var _type = _this2.$vm.mpType === 'page' ? 'Page' : 'Component';
            var path = _this2.route || _this2.is;
            throw new Error("".concat(_type, " \"").concat(path, "\" does not have a method \"").concat(methodName, "\""));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          var params = processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName);
          params = Array.isArray(params) ? params : [];
          // 参数尾部增加原始事件对象用于复杂表达式内获取额外数据
          if (/=\s*\S+\.eventParams\s*\|\|\s*\S+\[['"]event-params['"]\]/.test(handler.toString())) {
            // eslint-disable-next-line no-sparse-arrays
            params = params.concat([,,,,,,,,,, event]);
          }
          ret.push(handler.apply(handlerCtx, params));
        }
      });
    }
  });
  if (eventType === 'input' && ret.length === 1 && typeof ret[0] !== 'undefined') {
    return ret[0];
  }
}
var eventChannels = {};
var eventChannelStack = [];
function getEventChannel(id) {
  if (id) {
    var eventChannel = eventChannels[id];
    delete eventChannels[id];
    return eventChannel;
  }
  return eventChannelStack.shift();
}
var hooks = ['onShow', 'onHide', 'onError', 'onPageNotFound', 'onThemeChange', 'onUnhandledRejection'];
function initEventChannel() {
  _vue.default.prototype.getOpenerEventChannel = function () {
    // 微信小程序使用自身getOpenerEventChannel
    {
      return this.$scope.getOpenerEventChannel();
    }
  };
  var callHook = _vue.default.prototype.__call_hook;
  _vue.default.prototype.__call_hook = function (hook, args) {
    if (hook === 'onLoad' && args && args.__id__) {
      this.__eventChannel__ = getEventChannel(args.__id__);
      delete args.__id__;
    }
    return callHook.call(this, hook, args);
  };
}
function initScopedSlotsParams() {
  var center = {};
  var parents = {};
  _vue.default.prototype.$hasScopedSlotsParams = function (vueId) {
    var has = center[vueId];
    if (!has) {
      parents[vueId] = this;
      this.$on('hook:destroyed', function () {
        delete parents[vueId];
      });
    }
    return has;
  };
  _vue.default.prototype.$getScopedSlotsParams = function (vueId, name, key) {
    var data = center[vueId];
    if (data) {
      var object = data[name] || {};
      return key ? object[key] : object;
    } else {
      parents[vueId] = this;
      this.$on('hook:destroyed', function () {
        delete parents[vueId];
      });
    }
  };
  _vue.default.prototype.$setScopedSlotsParams = function (name, value) {
    var vueIds = this.$options.propsData.vueId;
    if (vueIds) {
      var vueId = vueIds.split(',')[0];
      var object = center[vueId] = center[vueId] || {};
      object[name] = value;
      if (parents[vueId]) {
        parents[vueId].$forceUpdate();
      }
    }
  };
  _vue.default.mixin({
    destroyed: function destroyed() {
      var propsData = this.$options.propsData;
      var vueId = propsData && propsData.vueId;
      if (vueId) {
        delete center[vueId];
        delete parents[vueId];
      }
    }
  });
}
function parseBaseApp(vm, _ref4) {
  var mocks = _ref4.mocks,
    initRefs = _ref4.initRefs;
  initEventChannel();
  {
    initScopedSlotsParams();
  }
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }
  uniIdMixin(_vue.default);
  _vue.default.prototype.mpHost = "mp-weixin";
  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }
      this.mpType = this.$options.mpType;
      this.$mp = (0, _defineProperty2.default)({
        data: {}
      }, this.mpType, this.$options.mpInstance);
      this.$scope = this.$options.mpInstance;
      delete this.$options.mpType;
      delete this.$options.mpInstance;
      if (this.mpType === 'page' && typeof getApp === 'function') {
        // hack vue-i18n
        var app = getApp();
        if (app.$vm && app.$vm.$i18n) {
          this._i18n = app.$vm.$i18n;
        }
      }
      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    }
  });
  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {
        // 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (wx.canIUse && !wx.canIUse('nextTick')) {
          // 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }
      this.$vm = vm;
      this.$vm.$mp = {
        app: this
      };
      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;
      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);
      this.$vm.__call_hook('onLaunch', args);
    }
  };

  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }
  initAppLocale(_vue.default, vm, normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN);
  initHooks(appOptions, hooks);
  initUnknownHooks(appOptions, vm.$options);
  return appOptions;
}
function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs
  });
}
function createApp(vm) {
  App(parseApp(vm));
  return vm;
}
var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function encodeReserveReplacer(c) {
  return '%' + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function encode(str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};
function stringifyQuery(obj) {
  var encodeStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : encode;
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];
    if (val === undefined) {
      return '';
    }
    if (val === null) {
      return encodeStr(key);
    }
    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encodeStr(key));
        } else {
          result.push(encodeStr(key) + '=' + encodeStr(val2));
        }
      });
      return result.join('&');
    }
    return encodeStr(key) + '=' + encodeStr(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?".concat(res) : '';
}
function parseBaseComponent(vueComponentOptions) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    isPage = _ref5.isPage,
    initRelation = _ref5.initRelation;
  var needVueOptions = arguments.length > 2 ? arguments[2] : undefined;
  var _initVueComponent = initVueComponent(_vue.default, vueComponentOptions),
    _initVueComponent2 = (0, _slicedToArray2.default)(_initVueComponent, 2),
    VueComponent = _initVueComponent2[0],
    vueOptions = _initVueComponent2[1];
  var options = _objectSpread({
    multipleSlots: true,
    addGlobalClass: true
  }, vueOptions.options || {});
  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin'].options) {
      Object.assign(options, vueOptions['mp-weixin'].options);
    }
  }
  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file, options),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;
        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties
        };
        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options
        });

        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      }
    },
    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      }
    },
    methods: {
      __l: handleLink,
      __e: handleEvent
    }
  };
  // externalClasses
  if (vueOptions.externalClasses) {
    componentOptions.externalClasses = vueOptions.externalClasses;
  }
  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }
  if (needVueOptions) {
    return [componentOptions, vueOptions, VueComponent];
  }
  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}
function parseComponent(vueComponentOptions, needVueOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation
  }, needVueOptions);
}
var hooks$1 = ['onShow', 'onHide', 'onUnload'];
hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);
function parseBasePage(vuePageOptions) {
  var _parseComponent = parseComponent(vuePageOptions, true),
    _parseComponent2 = (0, _slicedToArray2.default)(_parseComponent, 2),
    pageOptions = _parseComponent2[0],
    vueOptions = _parseComponent2[1];
  initHooks(pageOptions.methods, hooks$1, vueOptions);
  pageOptions.methods.onLoad = function (query) {
    this.options = query;
    var copyQuery = Object.assign({}, query);
    delete copyQuery.__id__;
    this.$page = {
      fullPath: '/' + (this.route || this.is) + stringifyQuery(copyQuery)
    };
    this.$vm.$mp.query = query; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', query);
  };
  {
    initUnknownHooks(pageOptions.methods, vuePageOptions, ['onReady']);
  }
  return pageOptions;
}
function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions);
}
function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}
function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}
function createSubpackageApp(vm) {
  var appOptions = parseApp(vm);
  var app = getApp({
    allowDefault: true
  });
  vm.$scope = app;
  var globalData = app.globalData;
  if (globalData) {
    Object.keys(appOptions.globalData).forEach(function (name) {
      if (!hasOwn(globalData, name)) {
        globalData[name] = appOptions.globalData[name];
      }
    });
  }
  Object.keys(appOptions).forEach(function (name) {
    if (!hasOwn(app, name)) {
      app[name] = appOptions[name];
    }
  });
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
function createPlugin(vm) {
  var appOptions = parseApp(vm);
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});
canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name : canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});
var uni = {};
if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (hasOwn(target, name)) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    }
  });
} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });
  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }
  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });
  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });
  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}
wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;
wx.createSubpackageApp = createSubpackageApp;
wx.createPlugin = createPlugin;
var uni$1 = uni;
var _default = uni$1;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 5 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ 6);
var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ 7);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ 10);
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 6 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) {
        ;
      }
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 12 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ 14);
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/construct.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
var isNativeReflectConstruct = __webpack_require__(/*! ./isNativeReflectConstruct.js */ 17);
function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _construct.apply(null, arguments);
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 16 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 17 */
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 18 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ 19);
var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ 20);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ 21);
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 19 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 20 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 21 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 22 */
/*!*************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-i18n/dist/uni-i18n.es.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCALE_ZH_HANT = exports.LOCALE_ZH_HANS = exports.LOCALE_FR = exports.LOCALE_ES = exports.LOCALE_EN = exports.I18n = exports.Formatter = void 0;
exports.compileI18nJsonStr = compileI18nJsonStr;
exports.hasI18nJson = hasI18nJson;
exports.initVueI18n = initVueI18n;
exports.isI18nStr = isI18nStr;
exports.isString = void 0;
exports.normalizeLocale = normalizeLocale;
exports.parseI18nJson = parseI18nJson;
exports.resolveLocale = resolveLocale;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var isArray = Array.isArray;
var isObject = function isObject(val) {
  return val !== null && (0, _typeof2.default)(val) === 'object';
};
var defaultDelimiters = ['{', '}'];
var BaseFormatter = /*#__PURE__*/function () {
  function BaseFormatter() {
    (0, _classCallCheck2.default)(this, BaseFormatter);
    this._caches = Object.create(null);
  }
  (0, _createClass2.default)(BaseFormatter, [{
    key: "interpolate",
    value: function interpolate(message, values) {
      var delimiters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDelimiters;
      if (!values) {
        return [message];
      }
      var tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }]);
  return BaseFormatter;
}();
exports.Formatter = BaseFormatter;
var RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
var RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, _ref) {
  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
    startDelimiter = _ref2[0],
    endDelimiter = _ref2[1];
  var tokens = [];
  var position = 0;
  var text = '';
  while (position < format.length) {
    var char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({
          type: 'text',
          value: text
        });
      }
      text = '';
      var sub = '';
      char = format[position++];
      while (char !== undefined && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      var isClosed = char === endDelimiter;
      var type = RE_TOKEN_LIST_VALUE.test(sub) ? 'list' : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? 'named' : 'unknown';
      tokens.push({
        value: sub,
        type: type
      });
    }
    //  else if (char === '%') {
    //   // when found rails i18n syntax, skip text capture
    //   if (format[position] !== '{') {
    //     text += char
    //   }
    // }
    else {
      text += char;
    }
  }
  text && tokens.push({
    type: 'text',
    value: text
  });
  return tokens;
}
function compile(tokens, values) {
  var compiled = [];
  var index = 0;
  var mode = isArray(values) ? 'list' : isObject(values) ? 'named' : 'unknown';
  if (mode === 'unknown') {
    return compiled;
  }
  while (index < tokens.length) {
    var token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break;
      case 'list':
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case 'named':
        if (mode === 'named') {
          compiled.push(values[token.value]);
        } else {
          if (true) {
            console.warn("Type of token '".concat(token.type, "' and format of value '").concat(mode, "' don't match!"));
          }
        }
        break;
      case 'unknown':
        if (true) {
          console.warn("Detect 'unknown' type of token!");
        }
        break;
    }
    index++;
  }
  return compiled;
}
var LOCALE_ZH_HANS = 'zh-Hans';
exports.LOCALE_ZH_HANS = LOCALE_ZH_HANS;
var LOCALE_ZH_HANT = 'zh-Hant';
exports.LOCALE_ZH_HANT = LOCALE_ZH_HANT;
var LOCALE_EN = 'en';
exports.LOCALE_EN = LOCALE_EN;
var LOCALE_FR = 'fr';
exports.LOCALE_FR = LOCALE_FR;
var LOCALE_ES = 'es';
exports.LOCALE_ES = LOCALE_ES;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key);
};
var defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
var I18n = /*#__PURE__*/function () {
  function I18n(_ref3) {
    var locale = _ref3.locale,
      fallbackLocale = _ref3.fallbackLocale,
      messages = _ref3.messages,
      watcher = _ref3.watcher,
      formater = _ref3.formater;
    (0, _classCallCheck2.default)(this, I18n);
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  (0, _createClass2.default)(I18n, [{
    key: "setLocale",
    value: function setLocale(locale) {
      var _this = this;
      var oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        // 可能初始化时不存在
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      // 仅发生变化时，通知
      if (oldLocale !== this.locale) {
        this.watchers.forEach(function (watcher) {
          watcher(_this.locale, oldLocale);
        });
      }
    }
  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.locale;
    }
  }, {
    key: "watchLocale",
    value: function watchLocale(fn) {
      var _this2 = this;
      var index = this.watchers.push(fn) - 1;
      return function () {
        _this2.watchers.splice(index, 1);
      };
    }
  }, {
    key: "add",
    value: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach(function (key) {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
  }, {
    key: "f",
    value: function f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join('');
    }
  }, {
    key: "t",
    value: function t(key, locale, values) {
      var message = this.message;
      if (typeof locale === 'string') {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn("Cannot translate the value of keypath ".concat(key, ". Use the value of keypath as default."));
        return key;
      }
      return this.formater.interpolate(message[key], values).join('');
    }
  }]);
  return I18n;
}();
exports.I18n = I18n;
function watchAppLocale(appVm, i18n) {
  // 需要保证 watch 的触发在组件渲染之前
  if (appVm.$watchLocale) {
    // vue2
    appVm.$watchLocale(function (newLocale) {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(function () {
      return appVm.$locale;
    }, function (newLocale) {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof uni !== 'undefined' && uni.getLocale) {
    return uni.getLocale();
  }
  // 小程序平台，uni 和 uni-i18n 互相引用，导致访问不到 uni，故在 global 上挂了 getLocale
  if (typeof global !== 'undefined' && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale) {
  var messages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallbackLocale = arguments.length > 2 ? arguments[2] : undefined;
  var watcher = arguments.length > 3 ? arguments[3] : undefined;
  // 兼容旧版本入参
  if (typeof locale !== 'string') {
    var _ref4 = [messages, locale];
    locale = _ref4[0];
    messages = _ref4[1];
  }
  if (typeof locale !== 'string') {
    // 因为小程序平台，uni-i18n 和 uni 互相引用，导致此时访问 uni 时，为 undefined
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== 'string') {
    fallbackLocale = typeof __uniConfig !== 'undefined' && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  var i18n = new I18n({
    locale: locale,
    fallbackLocale: fallbackLocale,
    messages: messages,
    watcher: watcher
  });
  var _t = function t(key, values) {
    if (typeof getApp !== 'function') {
      // app view
      /* eslint-disable no-func-assign */
      _t = function t(key, values) {
        return i18n.t(key, values);
      };
    } else {
      var isWatchedAppLocale = false;
      _t = function t(key, values) {
        var appVm = getApp().$vm;
        // 可能$vm还不存在，比如在支付宝小程序中，组件定义较早，在props的default里使用了t()函数（如uni-goods-nav），此时app还未初始化
        // options: {
        // 	type: Array,
        // 	default () {
        // 		return [{
        // 			icon: 'shop',
        // 			text: t("uni-goods-nav.options.shop"),
        // 		}, {
        // 			icon: 'cart',
        // 			text: t("uni-goods-nav.options.cart")
        // 		}]
        // 	}
        // },
        if (appVm) {
          // 触发响应式
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key, values);
      };
    }
    return _t(key, values);
  };
  return {
    i18n: i18n,
    f: function f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t: function t(key, values) {
      return _t(key, values);
    },
    add: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return i18n.add(locale, message, override);
    },
    watch: function watch(fn) {
      return i18n.watchLocale(fn);
    },
    getLocale: function getLocale() {
      return i18n.getLocale();
    },
    setLocale: function setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
var isString = function isString(val) {
  return typeof val === 'string';
};
exports.isString = isString;
var formater;
function hasI18nJson(jsonObj, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  return walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        return true;
      }
    } else {
      return hasI18nJson(value, delimiters);
    }
  });
}
function parseI18nJson(jsonObj, values, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        jsonObj[key] = compileStr(value, values, delimiters);
      }
    } else {
      parseI18nJson(value, values, delimiters);
    }
  });
  return jsonObj;
}
function compileI18nJsonStr(jsonStr, _ref5) {
  var locale = _ref5.locale,
    locales = _ref5.locales,
    delimiters = _ref5.delimiters;
  if (!isI18nStr(jsonStr, delimiters)) {
    return jsonStr;
  }
  if (!formater) {
    formater = new BaseFormatter();
  }
  var localeValues = [];
  Object.keys(locales).forEach(function (name) {
    if (name !== locale) {
      localeValues.push({
        locale: name,
        values: locales[name]
      });
    }
  });
  localeValues.unshift({
    locale: locale,
    values: locales[locale]
  });
  try {
    return JSON.stringify(compileJsonObj(JSON.parse(jsonStr), localeValues, delimiters), null, 2);
  } catch (e) {}
  return jsonStr;
}
function isI18nStr(value, delimiters) {
  return value.indexOf(delimiters[0]) > -1;
}
function compileStr(value, values, delimiters) {
  return formater.interpolate(value, values, delimiters).join('');
}
function compileValue(jsonObj, key, localeValues, delimiters) {
  var value = jsonObj[key];
  if (isString(value)) {
    // 存在国际化
    if (isI18nStr(value, delimiters)) {
      jsonObj[key] = compileStr(value, localeValues[0].values, delimiters);
      if (localeValues.length > 1) {
        // 格式化国际化语言
        var valueLocales = jsonObj[key + 'Locales'] = {};
        localeValues.forEach(function (localValue) {
          valueLocales[localValue.locale] = compileStr(value, localValue.values, delimiters);
        });
      }
    }
  } else {
    compileJsonObj(value, localeValues, delimiters);
  }
}
function compileJsonObj(jsonObj, localeValues, delimiters) {
  walkJsonObj(jsonObj, function (jsonObj, key) {
    compileValue(jsonObj, key, localeValues, delimiters);
  });
  return jsonObj;
}
function walkJsonObj(jsonObj, walk) {
  if (isArray(jsonObj)) {
    for (var i = 0; i < jsonObj.length; i++) {
      if (walk(jsonObj, i)) {
        return true;
      }
    }
  } else if (isObject(jsonObj)) {
    for (var key in jsonObj) {
      if (walk(jsonObj, key)) {
        return true;
      }
    }
  }
  return false;
}
function resolveLocale(locales) {
  return function (locale) {
    if (!locale) {
      return locale;
    }
    locale = normalizeLocale(locale) || locale;
    return resolveLocaleChain(locale).find(function (locale) {
      return locales.indexOf(locale) > -1;
    });
  };
}
function resolveLocaleChain(locale) {
  var chain = [];
  var tokens = locale.split('-');
  while (tokens.length) {
    chain.push(tokens.join('-'));
    tokens.pop();
  }
  return chain;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 23 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 24 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 25 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      if (vm.$options && vm.$options.__file) { // fixed by xxxxxx
        return ('') + vm.$options.__file
      }
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm && vm.$options.name !== 'PageBody') {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        !vm.$options.isReserved && tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
  Dep.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
  Dep.target = Dep.SharedObject.target;
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue &&
    !value.__v_isMPComponent
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i, i++)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu' || vm.mpHost === 'mp-kuaishou' || vm.mpHost === 'mp-xhs'){//百度、快手、小红书 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    !vm._$fallback && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    !vm._$fallback && initProvide(vm); // resolve provide after data/props
    !vm._$fallback && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
var NULLTYPE = '[object Null]';
var UNDEFINEDTYPE = '[object Undefined]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function nullOrUndefined(currentType, preType) {
    if(
        (currentType === NULLTYPE || currentType === UNDEFINEDTYPE) && 
        (preType === NULLTYPE || preType === UNDEFINEDTYPE)
    ) {
        return false
    }
    return true
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue !== pre[key] && nullOrUndefined(currentType, preType)) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function clearInstance(key, value) {
  // 简易去除 Vue 和小程序组件实例
  if (value) {
    if (value._isVue || value.__v_isMPComponent) {
      return {}
    }
  }
  return value
}

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);

  // vue-composition-api
  var compositionApiState = vm.__composition_api_state__ || vm.__secret_vfa_state__;
  var rawBindings = compositionApiState && compositionApiState.rawBindings;
  if (rawBindings) {
    Object.keys(rawBindings).forEach(function (key) {
      ret[key] = vm[key];
    });
  }

  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret, clearInstance))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  !vm._$fallback && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err, vm, info) {
    Vue.util.warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    console.error(err);
    /* eslint-disable no-undef */
    var app = typeof getApp === 'function' && getApp();
    if (app && app.onError) {
      app.onError(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      var triggerEvent = this.$scope['_triggerEvent'] || this.$scope['triggerEvent'];
      if (triggerEvent) {
        try {
          triggerEvent.call(this.$scope, event, {
            __args__: toArray(arguments, 1)
          });
        } catch (error) {

        }
      }
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0, l = val; i < l; i++) {
        // 第一个参数暂时仍和小程序一致
        ret[i] = iteratee(i, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onPageNotFound',
    'onThemeChange',
    'onError',
    'onUnhandledRejection',
    //Page
    'onInit',
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onAddToFavorites',
    'onShareTimeline',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize',
    'onUploadDouyinVideo'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 26 */
/*!***************************************************!*\
  !*** G:/web前端-即时通讯/im-messagig/applet/pages.json ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    if (!options.components) {
      options.components = {}
    }
    var hasOwn = Object.prototype.hasOwnProperty
    for (var name in components) {
      if (hasOwn.call(components, name) && !hasOwn.call(options.components, name)) {
        options.components[name] = components[name]
      }
    }
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    if(typeof renderjs.beforeCreate === 'function'){
			renderjs.beforeCreate = [renderjs.beforeCreate]
		}
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/*!********************************************************************************************!*\
  !*** G:/web前端-即时通讯/im-messagig/applet/node_modules/_goeasy@2.6.6@goeasy/goeasy.esm.min.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process, Buffer, uni, wx) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.User = exports.Scene = exports.MessageStatus = exports.GoEasyPubSub = exports.GoEasyIM = exports.CustomerStatusOptions = exports.ConversationDTO = exports.CallBackOptions = exports.CSTeam = exports.AgentOnlineOptions = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 47));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ 49));
var _get2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/get */ 50));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ 53));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ 54));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ 52));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e25) { throw _e25; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e26) { didErr = true; err = _e26; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var e;
function t(e, t, s, n) {
  return new (s || (s = Promise))(function (i, o) {
    function r(e) {
      try {
        c(n.next(e));
      } catch (e) {
        o(e);
      }
    }
    function a(e) {
      try {
        c(n.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function c(e) {
      var t;
      e.done ? i(e.value) : (t = e.value, t instanceof s ? t : new s(function (e) {
        e(t);
      })).then(r, a);
    }
    c((n = n.apply(e, t || [])).next());
  });
}
!function (e) {
  e.DISCONNECTED = "disconnected", e.DISCONNECTING = "disconnecting", e.CONNECTING = "connecting", e.CONNECTED = "connected", e.RECONNECTING = "reconnecting", e.RECONNECTED = "reconnected", e.EXPIRED_RECONNECTED = "reconnected", e.CONNECT_FAILED = "connect_failed";
}(e || (e = {}));
var s = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
function n(e) {
  if (e.__esModule) return e;
  var t = Object.defineProperty({}, "__esModule", {
    value: !0
  });
  return Object.keys(e).forEach(function (s) {
    var n = Object.getOwnPropertyDescriptor(e, s);
    Object.defineProperty(t, s, n.get ? n : {
      enumerable: !0,
      get: function get() {
        return e[s];
      }
    });
  }), t;
}
var i = {
    exports: {}
  },
  o = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  r = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
  a = function a(e) {
    var t = e,
      s = e.indexOf("["),
      n = e.indexOf("]");
    -1 != s && -1 != n && (e = e.substring(0, s) + e.substring(s, n).replace(/:/g, ";") + e.substring(n, e.length));
    for (var i = o.exec(e || ""), a = {}, c = 14; c--;) {
      a[r[c]] = i[c] || "";
    }
    return -1 != s && -1 != n && (a.source = t, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a;
  },
  c = {
    exports: {}
  },
  u = {
    exports: {}
  },
  l = 1e3,
  d = 60 * l,
  h = 60 * d,
  p = 24 * h,
  m = 365.25 * p,
  f = function f(e, t) {
    t = t || {};
    var s = (0, _typeof2.default)(e);
    if ("string" === s && e.length > 0) return function (e) {
      if (e = String(e), e.length > 100) return;
      var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);
      if (!t) return;
      var s = parseFloat(t[1]);
      switch ((t[2] || "ms").toLowerCase()) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return s * m;
        case "days":
        case "day":
        case "d":
          return s * p;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return s * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return s * d;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return s * l;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return s;
        default:
          return;
      }
    }(e);
    if ("number" === s && !1 === isNaN(e)) return t.long ? function (e) {
      return g(e, p, "day") || g(e, h, "hour") || g(e, d, "minute") || g(e, l, "second") || e + " ms";
    }(e) : function (e) {
      if (e >= p) return Math.round(e / p) + "d";
      if (e >= h) return Math.round(e / h) + "h";
      if (e >= d) return Math.round(e / d) + "m";
      if (e >= l) return Math.round(e / l) + "s";
      return e + "ms";
    }(e);
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
  };
function g(e, t, s) {
  if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + s : Math.ceil(e / t) + " " + s + "s";
}
!function (e, t) {
  function s(e) {
    var s;
    function i() {
      if (i.enabled) {
        var e = i,
          n = +new Date(),
          o = n - (s || n);
        e.diff = o, e.prev = s, e.curr = n, s = n;
        for (var r = new Array(arguments.length), a = 0; a < r.length; a++) {
          r[a] = arguments[a];
        }
        r[0] = t.coerce(r[0]), "string" != typeof r[0] && r.unshift("%O");
        var c = 0;
        r[0] = r[0].replace(/%([a-zA-Z%])/g, function (s, n) {
          if ("%%" === s) return s;
          c++;
          var i = t.formatters[n];
          if ("function" == typeof i) {
            var o = r[c];
            s = i.call(e, o), r.splice(c, 1), c--;
          }
          return s;
        }), t.formatArgs.call(e, r), (i.log || t.log || console.log.bind(console)).apply(e, r);
      }
    }
    return i.namespace = e, i.enabled = t.enabled(e), i.useColors = t.useColors(), i.color = function (e) {
      var s,
        n = 0;
      for (s in e) {
        n = (n << 5) - n + e.charCodeAt(s), n |= 0;
      }
      return t.colors[Math.abs(n) % t.colors.length];
    }(e), i.destroy = n, "function" == typeof t.init && t.init(i), t.instances.push(i), i;
  }
  function n() {
    var e = t.instances.indexOf(this);
    return -1 !== e && (t.instances.splice(e, 1), !0);
  }
  (t = u.exports = s.debug = s.default = s).coerce = function (e) {
    return e instanceof Error ? e.stack || e.message : e;
  }, t.disable = function () {
    t.enable("");
  }, t.enable = function (e) {
    var s;
    t.save(e), t.names = [], t.skips = [];
    var n = ("string" == typeof e ? e : "").split(/[\s,]+/),
      i = n.length;
    for (s = 0; s < i; s++) {
      n[s] && ("-" === (e = n[s].replace(/\*/g, ".*?"))[0] ? t.skips.push(new RegExp("^" + e.substr(1) + "$")) : t.names.push(new RegExp("^" + e + "$")));
    }
    for (s = 0; s < t.instances.length; s++) {
      var o = t.instances[s];
      o.enabled = t.enabled(o.namespace);
    }
  }, t.enabled = function (e) {
    if ("*" === e[e.length - 1]) return !0;
    var s, n;
    for (s = 0, n = t.skips.length; s < n; s++) {
      if (t.skips[s].test(e)) return !1;
    }
    for (s = 0, n = t.names.length; s < n; s++) {
      if (t.names[s].test(e)) return !0;
    }
    return !1;
  }, t.humanize = f, t.instances = [], t.names = [], t.skips = [], t.formatters = {};
}(0, u.exports), function (e, t) {
  function s() {
    var e;
    try {
      e = t.storage.debug;
    } catch (e) {}
    return !e && "undefined" != typeof process && "env" in process && (e = Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).DEBUG), e;
  }
  (t = e.exports = u.exports).log = function () {
    return "object" == (typeof console === "undefined" ? "undefined" : (0, _typeof2.default)(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }, t.formatArgs = function (e) {
    var s = this.useColors;
    if (e[0] = (s ? "%c" : "") + this.namespace + (s ? " %c" : " ") + e[0] + (s ? "%c " : " ") + "+" + t.humanize(this.diff), !s) return;
    var n = "color: " + this.color;
    e.splice(1, 0, n, "color: inherit");
    var i = 0,
      o = 0;
    e[0].replace(/%[a-zA-Z%]/g, function (e) {
      "%%" !== e && (i++, "%c" === e && (o = i));
    }), e.splice(o, 0, n);
  }, t.save = function (e) {
    try {
      null == e ? t.storage.removeItem("debug") : t.storage.debug = e;
    } catch (e) {}
  }, t.load = s, t.useColors = function () {
    if ("undefined" != typeof window && window.process && "renderer" === window.process.type) return !0;
    if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
    return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }, t.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function () {
    try {
      return window.localStorage;
    } catch (e) {}
  }(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], t.formatters.j = function (e) {
    try {
      return JSON.stringify(e);
    } catch (e) {
      return "[UnexpectedJSONParseError]: " + e.message;
    }
  }, t.enable(s());
}(c, c.exports);
var y = a,
  v = c.exports("socket.io-client:url"),
  E = function E(e, t) {
    var s = e;
    t = t || "undefined" != typeof location && location, null == e && (e = t.protocol + "//" + t.host);
    "string" == typeof e && ("/" === e.charAt(0) && (e = "/" === e.charAt(1) ? t.protocol + e : t.host + e), /^(https?|wss?):\/\//.test(e) || (v("protocol-less url %s", e), e = void 0 !== t ? t.protocol + "//" + e : "https://" + e), v("parse %s", e), s = y(e));
    s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443"));
    s.path = s.path || "/";
    var n = -1 !== s.host.indexOf(":") ? "[" + s.host + "]" : s.host;
    return s.id = s.protocol + "://" + n + ":" + s.port, s.href = s.protocol + "://" + n + (t && t.port === s.port ? "" : ":" + s.port), s;
  };
var C = {},
  S = {
    exports: {}
  };
!function (e) {
  function t(e) {
    if (e) return function (e) {
      for (var s in t.prototype) {
        e[s] = t.prototype[s];
      }
      return e;
    }(e);
  }
  S.exports = t, t.prototype.on = t.prototype.addEventListener = function (e, t) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this;
  }, t.prototype.once = function (e, t) {
    function s() {
      this.off(e, s), t.apply(this, arguments);
    }
    return s.fn = t, this.on(e, s), this;
  }, t.prototype.off = t.prototype.removeListener = t.prototype.removeAllListeners = t.prototype.removeEventListener = function (e, t) {
    if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
    var s,
      n = this._callbacks["$" + e];
    if (!n) return this;
    if (1 == arguments.length) return delete this._callbacks["$" + e], this;
    for (var i = 0; i < n.length; i++) {
      if ((s = n[i]) === t || s.fn === t) {
        n.splice(i, 1);
        break;
      }
    }
    return this;
  }, t.prototype.emit = function (e) {
    this._callbacks = this._callbacks || {};
    var t = [].slice.call(arguments, 1),
      s = this._callbacks["$" + e];
    if (s) for (var n = 0, i = (s = s.slice(0)).length; n < i; ++n) {
      s[n].apply(this, t);
    }
    return this;
  }, t.prototype.listeners = function (e) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || [];
  }, t.prototype.hasListeners = function (e) {
    return !!this.listeners(e).length;
  };
}();
var b = {}.toString,
  w = Array.isArray || function (e) {
    return "[object Array]" == b.call(e);
  };
!function (e) {
  c.exports("socket.io-parser");
  var t = S.exports,
    s = w;
  function n() {}
  e.protocol = 4, e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"], e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, e.BINARY_ACK = 6, e.Encoder = n, e.Decoder = o;
  var i = e.ERROR + '"encode error"';
  function o() {
    this.reconstructor = null;
  }
  function r(t) {
    return {
      type: e.ERROR,
      data: "parser error: " + t
    };
  }
  n.prototype.encode = function (t, s) {
    var n = function (t) {
      var s = "" + t.type;
      e.BINARY_EVENT !== t.type && e.BINARY_ACK !== t.type || (s += t.attachments + "-");
      t.nsp && "/" !== t.nsp && (s += t.nsp + ",");
      null != t.id && (s += t.id);
      if (null != t.data) {
        var n = function (e) {
          try {
            return JSON.stringify(e);
          } catch (e) {
            return !1;
          }
        }(t.data);
        if (!1 === n) return i;
        s += n;
      }
      return s;
    }(t);
    s([n]);
  }, t(o.prototype), o.prototype.add = function (t) {
    var n;
    if ("string" != typeof t) throw new Error("Unknown type: " + t);
    n = function (t) {
      var n = 0,
        i = {
          type: Number(t.charAt(0))
        };
      if (null == e.types[i.type]) return r("unknown packet type " + i.type);
      if (e.BINARY_EVENT === i.type || e.BINARY_ACK === i.type) {
        for (var o = ""; "-" !== t.charAt(++n) && (o += t.charAt(n), n != t.length);) {
          ;
        }
        if (o != Number(o) || "-" !== t.charAt(n)) throw new Error("Illegal attachments");
        i.attachments = Number(o);
      }
      if ("/" === t.charAt(n + 1)) for (i.nsp = ""; ++n;) {
        if ("," === (c = t.charAt(n))) break;
        if (i.nsp += c, n === t.length) break;
      } else i.nsp = "/";
      var a = t.charAt(n + 1);
      if ("" !== a && Number(a) == a) {
        for (i.id = ""; ++n;) {
          var c;
          if (null == (c = t.charAt(n)) || Number(c) != c) {
            --n;
            break;
          }
          if (i.id += t.charAt(n), n === t.length) break;
        }
        i.id = Number(i.id);
      }
      if (t.charAt(++n)) {
        var u = function (e) {
          try {
            return JSON.parse(e);
          } catch (e) {
            return !1;
          }
        }(t.substr(n));
        if (!(!1 !== u && (i.type === e.ERROR || s(u)))) return r("invalid payload");
        i.data = u;
      }
      return i;
    }(t), this.emit("decoded", n);
  }, o.prototype.destroy = function () {
    this.reconstructor && this.reconstructor.finishedReconstruction();
  };
}(C);
var I = {
    exports: {}
  },
  M = {},
  A = {},
  T = Object.keys || function (e) {
    var t = [],
      s = Object.prototype.hasOwnProperty;
    for (var n in e) {
      s.call(e, n) && t.push(n);
    }
    return t;
  },
  N = w,
  R = Object.prototype.toString,
  O = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === R.call(Blob),
  _ = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === R.call(File),
  P = function e(t) {
    if (!t || "object" != (0, _typeof2.default)(t)) return !1;
    if (N(t)) {
      for (var s = 0, n = t.length; s < n; s++) {
        if (e(t[s])) return !0;
      }
      return !1;
    }
    if ("function" == typeof Buffer && Buffer.isBuffer && Buffer.isBuffer(t) || "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || O && t instanceof Blob || _ && t instanceof File) return !0;
    if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length) return e(t.toJSON(), !0);
    for (var i in t) {
      if (Object.prototype.hasOwnProperty.call(t, i) && e(t[i])) return !0;
    }
    return !1;
  };
var k = function k(e, t, s) {
  var n = !1;
  return s = s || D, i.count = e, 0 === e ? t() : i;
  function i(e, o) {
    if (i.count <= 0) throw new Error("after called too many times");
    --i.count, e ? (n = !0, t(e), t = s) : 0 !== i.count || n || t(null, o);
  }
};
function D() {}
var x,
  F,
  U,
  L = String.fromCharCode;
function G(e) {
  for (var t, s, n = [], i = 0, o = e.length; i < o;) {
    (t = e.charCodeAt(i++)) >= 55296 && t <= 56319 && i < o ? 56320 == (64512 & (s = e.charCodeAt(i++))) ? n.push(((1023 & t) << 10) + (1023 & s) + 65536) : (n.push(t), i--) : n.push(t);
  }
  return n;
}
function q(e, t) {
  if (e >= 55296 && e <= 57343) {
    if (t) throw Error("Lone surrogate U+" + e.toString(16).toUpperCase() + " is not a scalar value");
    return !1;
  }
  return !0;
}
function B(e, t) {
  return L(e >> t & 63 | 128);
}
function j(e, t) {
  if (0 == (4294967168 & e)) return L(e);
  var s = "";
  return 0 == (4294965248 & e) ? s = L(e >> 6 & 31 | 192) : 0 == (4294901760 & e) ? (q(e, t) || (e = 65533), s = L(e >> 12 & 15 | 224), s += B(e, 6)) : 0 == (4292870144 & e) && (s = L(e >> 18 & 7 | 240), s += B(e, 12), s += B(e, 6)), s += L(63 & e | 128);
}
function V() {
  if (U >= F) throw Error("Invalid byte index");
  var e = 255 & x[U];
  if (U++, 128 == (192 & e)) return 63 & e;
  throw Error("Invalid continuation byte");
}
function H(e) {
  var t, s;
  if (U > F) throw Error("Invalid byte index");
  if (U == F) return !1;
  if (t = 255 & x[U], U++, 0 == (128 & t)) return t;
  if (192 == (224 & t)) {
    if ((s = (31 & t) << 6 | V()) >= 128) return s;
    throw Error("Invalid continuation byte");
  }
  if (224 == (240 & t)) {
    if ((s = (15 & t) << 12 | V() << 6 | V()) >= 2048) return q(s, e) ? s : 65533;
    throw Error("Invalid continuation byte");
  }
  if (240 == (248 & t) && (s = (7 & t) << 18 | V() << 12 | V() << 6 | V()) >= 65536 && s <= 1114111) return s;
  throw Error("Invalid UTF-8 detected");
}
var W = {
    version: "2.1.2",
    encode: function encode(e, t) {
      for (var s = !1 !== (t = t || {}).strict, n = G(e), i = n.length, o = -1, r = ""; ++o < i;) {
        r += j(n[o], s);
      }
      return r;
    },
    decode: function decode(e, t) {
      var s = !1 !== (t = t || {}).strict;
      x = G(e), F = x.length, U = 0;
      for (var n, i = []; !1 !== (n = H(s));) {
        i.push(n);
      }
      return function (e) {
        for (var t, s = e.length, n = -1, i = ""; ++n < s;) {
          (t = e[n]) > 65535 && (i += L((t -= 65536) >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), i += L(t);
        }
        return i;
      }(i);
    }
  },
  z = void 0 !== z ? z : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder && MozBlobBuilder,
  X = function () {
    try {
      return 2 === new Blob(["hi"]).size;
    } catch (e) {
      return !1;
    }
  }(),
  J = X && function () {
    try {
      return 2 === new Blob([new Uint8Array([1, 2])]).size;
    } catch (e) {
      return !1;
    }
  }(),
  K = z && z.prototype.append && z.prototype.getBlob;
function Q(e) {
  return e.map(function (e) {
    if (e.buffer instanceof ArrayBuffer) {
      var t = e.buffer;
      if (e.byteLength !== t.byteLength) {
        var s = new Uint8Array(e.byteLength);
        s.set(new Uint8Array(t, e.byteOffset, e.byteLength)), t = s.buffer;
      }
      return t;
    }
    return e;
  });
}
function Y(e, t) {
  t = t || {};
  var s = new z();
  return Q(e).forEach(function (e) {
    s.append(e);
  }), t.type ? s.getBlob(t.type) : s.getBlob();
}
function $(e, t) {
  return new Blob(Q(e), t || {});
}
"undefined" != typeof Blob && (Y.prototype = Blob.prototype, $.prototype = Blob.prototype);
var Z = X ? J ? Blob : $ : K ? Y : void 0;
!function (e) {
  var t = T,
    s = P,
    n = k,
    i = W;
  "undefined" != typeof navigator && /Android/i.test(navigator.userAgent), "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent), e.protocol = 3;
  var o = e.packets = {
      open: 0,
      close: 1,
      ping: 2,
      pong: 3,
      message: 4,
      upgrade: 5,
      noop: 6
    },
    r = t(o),
    a = {
      type: "error",
      data: "parser error"
    },
    c = Z;
  e.encodePacket = function (e, t, s, n) {
    "function" == typeof t && (n = t, t = !1), "function" == typeof s && (n = s, s = null), void 0 === e.data || e.data.buffer || e.data;
    var r = o[e.type];
    return void 0 !== e.data && (r += s ? i.encode(String(e.data), {
      strict: !1
    }) : String(e.data)), n("" + r);
  }, e.decodePacket = function (e, t, s) {
    if (void 0 === e) return a;
    if ("string" == typeof e) {
      if (s && !1 === (e = function (e) {
        try {
          e = i.decode(e, {
            strict: !1
          });
        } catch (e) {
          return !1;
        }
        return e;
      }(e))) return a;
      var n = e.charAt(0);
      return Number(n) == n && r[n] ? e.length > 1 ? {
        type: r[n],
        data: e.substring(1)
      } : {
        type: r[n]
      } : a;
    }
    n = new Uint8Array(e)[0];
    var o = sliceBuffer(e, 1);
    return c && "blob" === t && (o = new c([o])), {
      type: r[n],
      data: o
    };
  }, e.encodePayload = function (t, i, o) {
    "function" == typeof i && (o = i, i = null);
    var r = s(t);
    if (!t.length) return o("0:");
    !function (e, t, s) {
      for (var i = new Array(e.length), o = n(e.length, s), r = function r(e, s, n) {
          t(s, function (t, s) {
            i[e] = s, n(t, i);
          });
        }, a = 0; a < e.length; a++) {
        r(a, e[a], o);
      }
    }(t, function (t, s) {
      e.encodePacket(t, !!r && i, !0, function (e) {
        s(null, function (e) {
          return e.length + ":" + e;
        }(e));
      });
    }, function (e, t) {
      return o(t.join(""));
    });
  }, e.decodePayload = function (t, s, n) {
    var i;
    if ("function" == typeof s && (n = s, s = null), "" === t) return n(a, 0, 1);
    for (var o, r, c = "", u = 0, l = t.length; u < l; u++) {
      var d = t.charAt(u);
      if (":" === d) {
        if ("" === c || c != (o = Number(c))) return n(a, 0, 1);
        if (c != (r = t.substr(u + 1, o)).length) return n(a, 0, 1);
        if (r.length) {
          if (i = e.decodePacket(r, s, !0), a.type === i.type && a.data === i.data) return n(a, 0, 1);
          if (!1 === n(i, u + o, l)) return;
        }
        u += o, c = "";
      } else c += d;
    }
    return "" !== c ? n(a, 0, 1) : void 0;
  };
}(A);
var ee = A,
  te = se;
function se(e) {
  this.path = e.path, this.hostname = e.hostname, this.port = e.port, this.secure = e.secure, this.query = e.query, this.timestampParam = e.timestampParam, this.timestampRequests = e.timestampRequests, this.readyState = "", this.agent = e.agent || !1, this.socket = e.socket, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized, this.forceNode = e.forceNode, this.isReactNative = e.isReactNative, this.extraHeaders = e.extraHeaders, this.localAddress = e.localAddress;
}
(0, S.exports)(se.prototype), se.prototype.onError = function (e, t) {
  var s = new Error(e);
  return s.type = "TransportError", s.description = t, this.emit("error", s), this;
}, se.prototype.open = function () {
  return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this;
}, se.prototype.close = function () {
  return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this;
}, se.prototype.send = function (e) {
  if ("open" !== this.readyState) throw new Error("Transport not open");
  this.write(e);
}, se.prototype.onOpen = function () {
  this.readyState = "open", this.writable = !0, this.emit("open");
}, se.prototype.onData = function (e) {
  var t = ee.decodePacket(e, this.socket.binaryType);
  this.onPacket(t);
}, se.prototype.onPacket = function (e) {
  this.emit("packet", e);
}, se.prototype.onClose = function () {
  this.readyState = "closed", this.emit("close");
};
var ne,
  ie = {
    encode: function encode(e) {
      var t = "";
      for (var s in e) {
        e.hasOwnProperty(s) && (t.length && (t += "&"), t += encodeURIComponent(s) + "=" + encodeURIComponent(e[s]));
      }
      return t;
    },
    decode: function decode(e) {
      for (var t = {}, s = e.split("&"), n = 0, i = s.length; n < i; n++) {
        var o = s[n].split("=");
        t[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
      }
      return t;
    }
  },
  oe = function oe(e, t) {
    var s = function s() {};
    s.prototype = t.prototype, e.prototype = new s(), e.prototype.constructor = e;
  },
  re = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
  ae = 64,
  ce = {},
  ue = 0,
  le = 0;
function de(e) {
  var t = "";
  do {
    t = re[e % ae] + t, e = Math.floor(e / ae);
  } while (e > 0);
  return t;
}
function he() {
  var e = de(+new Date());
  return e !== ne ? (ue = 0, ne = e) : e + "." + de(ue++);
}
for (; le < ae; le++) {
  ce[re[le]] = le;
}
he.encode = de, he.decode = function (e) {
  var t = 0;
  for (le = 0; le < e.length; le++) {
    t = t * ae + ce[e.charAt(le)];
  }
  return t;
};
var pe = he,
  me = {
    exports: {}
  },
  fe = {
    exports: {}
  },
  ge = 1e3,
  ye = 60 * ge,
  ve = 60 * ye,
  Ee = 24 * ve,
  Ce = 365.25 * Ee,
  Se = function Se(e, t) {
    t = t || {};
    var s = (0, _typeof2.default)(e);
    if ("string" === s && e.length > 0) return function (e) {
      if (e = String(e), e.length > 100) return;
      var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);
      if (!t) return;
      var s = parseFloat(t[1]);
      switch ((t[2] || "ms").toLowerCase()) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return s * Ce;
        case "days":
        case "day":
        case "d":
          return s * Ee;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return s * ve;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return s * ye;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return s * ge;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return s;
        default:
          return;
      }
    }(e);
    if ("number" === s && !1 === isNaN(e)) return t.long ? function (e) {
      return be(e, Ee, "day") || be(e, ve, "hour") || be(e, ye, "minute") || be(e, ge, "second") || e + " ms";
    }(e) : function (e) {
      if (e >= Ee) return Math.round(e / Ee) + "d";
      if (e >= ve) return Math.round(e / ve) + "h";
      if (e >= ye) return Math.round(e / ye) + "m";
      if (e >= ge) return Math.round(e / ge) + "s";
      return e + "ms";
    }(e);
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
  };
function be(e, t, s) {
  if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + s : Math.ceil(e / t) + " " + s + "s";
}
!function (e, t) {
  function s(e) {
    var s;
    function i() {
      if (i.enabled) {
        var e = i,
          n = +new Date(),
          o = n - (s || n);
        e.diff = o, e.prev = s, e.curr = n, s = n;
        for (var r = new Array(arguments.length), a = 0; a < r.length; a++) {
          r[a] = arguments[a];
        }
        r[0] = t.coerce(r[0]), "string" != typeof r[0] && r.unshift("%O");
        var c = 0;
        r[0] = r[0].replace(/%([a-zA-Z%])/g, function (s, n) {
          if ("%%" === s) return s;
          c++;
          var i = t.formatters[n];
          if ("function" == typeof i) {
            var o = r[c];
            s = i.call(e, o), r.splice(c, 1), c--;
          }
          return s;
        }), t.formatArgs.call(e, r), (i.log || t.log || console.log.bind(console)).apply(e, r);
      }
    }
    return i.namespace = e, i.enabled = t.enabled(e), i.useColors = t.useColors(), i.color = function (e) {
      var s,
        n = 0;
      for (s in e) {
        n = (n << 5) - n + e.charCodeAt(s), n |= 0;
      }
      return t.colors[Math.abs(n) % t.colors.length];
    }(e), i.destroy = n, "function" == typeof t.init && t.init(i), t.instances.push(i), i;
  }
  function n() {
    var e = t.instances.indexOf(this);
    return -1 !== e && (t.instances.splice(e, 1), !0);
  }
  (t = fe.exports = s.debug = s.default = s).coerce = function (e) {
    return e instanceof Error ? e.stack || e.message : e;
  }, t.disable = function () {
    t.enable("");
  }, t.enable = function (e) {
    var s;
    t.save(e), t.names = [], t.skips = [];
    var n = ("string" == typeof e ? e : "").split(/[\s,]+/),
      i = n.length;
    for (s = 0; s < i; s++) {
      n[s] && ("-" === (e = n[s].replace(/\*/g, ".*?"))[0] ? t.skips.push(new RegExp("^" + e.substr(1) + "$")) : t.names.push(new RegExp("^" + e + "$")));
    }
    for (s = 0; s < t.instances.length; s++) {
      var o = t.instances[s];
      o.enabled = t.enabled(o.namespace);
    }
  }, t.enabled = function (e) {
    if ("*" === e[e.length - 1]) return !0;
    var s, n;
    for (s = 0, n = t.skips.length; s < n; s++) {
      if (t.skips[s].test(e)) return !1;
    }
    for (s = 0, n = t.names.length; s < n; s++) {
      if (t.names[s].test(e)) return !0;
    }
    return !1;
  }, t.humanize = Se, t.instances = [], t.names = [], t.skips = [], t.formatters = {};
}(0, fe.exports), function (e, t) {
  function s() {
    var e;
    try {
      e = t.storage.debug;
    } catch (e) {}
    return !e && "undefined" != typeof process && "env" in process && (e = Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).DEBUG), e;
  }
  (t = e.exports = fe.exports).log = function () {
    return "object" == (typeof console === "undefined" ? "undefined" : (0, _typeof2.default)(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }, t.formatArgs = function (e) {
    var s = this.useColors;
    if (e[0] = (s ? "%c" : "") + this.namespace + (s ? " %c" : " ") + e[0] + (s ? "%c " : " ") + "+" + t.humanize(this.diff), !s) return;
    var n = "color: " + this.color;
    e.splice(1, 0, n, "color: inherit");
    var i = 0,
      o = 0;
    e[0].replace(/%[a-zA-Z%]/g, function (e) {
      "%%" !== e && (i++, "%c" === e && (o = i));
    }), e.splice(o, 0, n);
  }, t.save = function (e) {
    try {
      null == e ? t.storage.removeItem("debug") : t.storage.debug = e;
    } catch (e) {}
  }, t.load = s, t.useColors = function () {
    if ("undefined" != typeof window && window.process && "renderer" === window.process.type) return !0;
    if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
    return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }, t.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function () {
    try {
      return window.localStorage;
    } catch (e) {}
  }(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], t.formatters.j = function (e) {
    try {
      return JSON.stringify(e);
    } catch (e) {
      return "[UnexpectedJSONParseError]: " + e.message;
    }
  }, t.enable(s());
}(me, me.exports);
var we = {
  exports: {}
};
try {
  we.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
} catch (e) {
  we.exports = !1;
}
var Ie = we.exports,
  Me = function Me(e) {
    var t = e.xdomain,
      s = e.xscheme,
      n = e.enablesXDR;
    try {
      if ("undefined" != typeof XMLHttpRequest && (!t || Ie)) return new XMLHttpRequest();
    } catch (e) {}
    try {
      if ("undefined" != typeof XDomainRequest && !s && n) return new XDomainRequest();
    } catch (e) {}
    if (!t) try {
      return new self[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e) {}
  },
  Ae = te,
  Te = ie,
  Ne = A,
  Re = oe,
  Oe = pe,
  _e = me.exports("engine.io-client:polling"),
  Pe = De,
  ke = null != new Me({
    xdomain: !1
  }).responseType;
function De(e) {
  var t = e && e.forceBase64;
  ke && !t || (this.supportsBinary = !1), Ae.call(this, e);
}
Re(De, Ae), De.prototype.name = "polling", De.prototype.doOpen = function () {
  this.poll();
}, De.prototype.pause = function (e) {
  var t = this;
  function s() {
    _e("paused"), t.readyState = "paused", e();
  }
  if (this.readyState = "pausing", this.polling || !this.writable) {
    var n = 0;
    this.polling && (_e("we are currently polling - waiting to pause"), n++, this.once("pollComplete", function () {
      _e("pre-pause polling complete"), --n || s();
    })), this.writable || (_e("we are currently writing - waiting to pause"), n++, this.once("drain", function () {
      _e("pre-pause writing complete"), --n || s();
    }));
  } else s();
}, De.prototype.poll = function () {
  _e("polling"), this.polling = !0, this.doPoll(), this.emit("poll");
}, De.prototype.onData = function (e) {
  var t = this;
  _e("polling got data %s", e);
  Ne.decodePayload(e, this.socket.binaryType, function (e, s, n) {
    if ("opening" === t.readyState && t.onOpen(), "close" === e.type) return t.onClose(), !1;
    t.onPacket(e);
  }), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : _e('ignoring poll - transport state "%s"', this.readyState));
}, De.prototype.doClose = function () {
  var e = this;
  function t() {
    _e("writing close packet"), e.write([{
      type: "close"
    }]);
  }
  "open" === this.readyState ? (_e("transport open - closing"), t()) : (_e("transport not open - deferring close"), this.once("open", t));
}, De.prototype.write = function (e) {
  var t = this;
  this.writable = !1;
  var s = function s() {
    t.writable = !0, t.emit("drain");
  };
  Ne.encodePayload(e, this.supportsBinary, function (e) {
    t.doWrite(e, s);
  });
}, De.prototype.uri = function () {
  var e = this.query || {},
    t = this.secure ? "https" : "http",
    s = "";
  return !1 !== this.timestampRequests && (e[this.timestampParam] = Oe()), this.supportsBinary || e.sid || (e.b64 = 1), e = Te.encode(e), this.port && ("https" === t && 443 !== Number(this.port) || "http" === t && 80 !== Number(this.port)) && (s = ":" + this.port), e.length && (e = "?" + e), t + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + s + this.path + e;
};
var xe,
  Fe = Pe,
  Ue = je,
  Le = /\n/g,
  Ge = /\\n/g;
function qe() {}
function Be() {
  return "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== s ? s : {};
}
function je(e) {
  if (Fe.call(this, e), this.query = this.query || {}, !xe) {
    var t = Be();
    xe = t.___eio = t.___eio || [];
  }
  this.index = xe.length;
  var s = this;
  xe.push(function (e) {
    s.onData(e);
  }), this.query.j = this.index, "function" == typeof addEventListener && addEventListener("beforeunload", function () {
    s.script && (s.script.onerror = qe);
  }, !1);
}
oe(je, Fe), je.prototype.supportsBinary = !1, je.prototype.doClose = function () {
  this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), Fe.prototype.doClose.call(this);
}, je.prototype.doPoll = function () {
  var e = this,
    t = document.createElement("script");
  this.script && (this.script.parentNode.removeChild(this.script), this.script = null), t.async = !0, t.src = this.uri(), t.onerror = function (t) {
    e.onError("jsonp poll error", t);
  };
  var s = document.getElementsByTagName("script")[0];
  s ? s.parentNode.insertBefore(t, s) : (document.head || document.body).appendChild(t), this.script = t, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function () {
    var e = document.createElement("iframe");
    document.body.appendChild(e), document.body.removeChild(e);
  }, 100);
}, je.prototype.doWrite = function (e, t) {
  var s = this;
  if (!this.form) {
    var n,
      i = document.createElement("form"),
      o = document.createElement("textarea"),
      r = this.iframeId = "eio_iframe_" + this.index;
    i.className = "socketio", i.style.position = "absolute", i.style.top = "-1000px", i.style.left = "-1000px", i.target = r, i.method = "POST", i.setAttribute("accept-charset", "utf-8"), o.name = "d", i.appendChild(o), document.body.appendChild(i), this.form = i, this.area = o;
  }
  function a() {
    c(), t();
  }
  function c() {
    if (s.iframe) try {
      s.form.removeChild(s.iframe);
    } catch (e) {
      s.onError("jsonp polling iframe removal error", e);
    }
    try {
      var e = '<iframe src="javascript:0" name="' + s.iframeId + '">';
      n = document.createElement(e);
    } catch (e) {
      (n = document.createElement("iframe")).name = s.iframeId, n.src = "javascript:0";
    }
    n.id = s.iframeId, s.form.appendChild(n), s.iframe = n;
  }
  this.form.action = this.uri(), c(), e = e.replace(Ge, "\\\n"), this.area.value = e.replace(Le, "\\n");
  try {
    this.form.submit();
  } catch (e) {}
  this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
    "complete" === s.iframe.readyState && a();
  } : this.iframe.onload = a;
};
var Ve,
  He,
  We = te,
  ze = A,
  Xe = ie,
  Je = oe,
  Ke = pe,
  Qe = me.exports("engine.io-client:websocket");
("undefined" == typeof uni && "undefined" == typeof wx || "undefined" != typeof WebSocket) && ("undefined" != typeof WebSocket ? Ve = WebSocket : "undefined" != typeof self && (Ve = self.WebSocket || self.MozWebSocket));
var Ye = Ve || He;
("undefined" == typeof uni && "undefined" == typeof wx || "undefined" != typeof WebSocket) && "undefined" == typeof GameGlobal || (Ye = function Ye(e) {
  var t = this;
  if (t.onopen = function () {}, t.onclose = function () {}, t.onmessage = function (e) {}, t.onerror = function (e) {}, "object" == (typeof tt === "undefined" ? "undefined" : (0, _typeof2.default)(tt)) && tt.getSystemInfo) {
    var _s2 = tt.connectSocket({
      url: e
    });
    t.send = function (e) {
      _s2.send({
        data: e
      });
    }, t.close = function () {
      _s2.close();
    }, _s2.onOpen(function () {
      t.onopen();
    }), _s2.onError(function (e) {
      t.onerror(e);
    }), _s2.onMessage(function (e) {
      t.onmessage(e);
    }), _s2.onClose(function () {
      t.onclose();
    });
  } else if ("undefined" != typeof uni) {
    if ("undefined" != typeof my) my.connectSocket({
      url: e
    }), t.send = function (e) {
      my.sendSocketMessage({
        data: e
      });
    }, t.close = function (e) {
      my.closeSocket();
    }, my.onSocketOpen(function (e) {
      t.onopen();
    }), my.onSocketError(function (e) {
      t.onerror(e);
    }), my.onSocketMessage(function (e) {
      t.onmessage(e);
    }), my.onSocketClose(function (e) {
      t.onclose(e);
    });else {
      var s = uni.connectSocket({
        url: e,
        complete: function complete() {}
      });
      t.send = function (e) {
        s.send({
          data: e
        });
      }, t.close = function () {
        s.close();
      }, s.onOpen(function (e) {
        t.onopen();
      }), s.onError(function (e) {
        t.onerror(e);
      }), s.onMessage(function (e) {
        t.onmessage(e);
      }), s.onClose(function (e) {
        t.onclose();
      });
    }
  } else {
    var n = wx.connectSocket({
      url: e
    });
    t.send = function (e) {
      n.send({
        data: e
      });
    }, t.close = function (e) {
      n.close({
        code: 1e3
      });
    }, n.onOpen(function () {
      t.onopen();
    }), n.onError(function (e) {
      t.onerror(e);
    }), n.onMessage(function (e) {
      t.onmessage(e);
    }), n.onClose(function (e) {
      t.onclose(e);
    });
  }
});
var $e = Ze;
function Ze(e) {
  e && e.forceBase64 && (this.supportsBinary = !1), ("undefined" == typeof uni && "undefined" == typeof wx || "undefined" != typeof WebSocket) && (this.perMessageDeflate = e.perMessageDeflate, this.usingBrowserWebSocket = Ve && !e.forceNode, this.protocols = e.protocols, this.usingBrowserWebSocket || (Ye = He)), We.call(this, e);
}
Je(Ze, We), Ze.prototype.name = "websocket", Ze.prototype.supportsBinary = !1, Ze.prototype.doOpen = function () {
  if (this.check()) {
    var e,
      t,
      s = this.uri();
    ("undefined" == typeof uni && "undefined" == typeof wx || "undefined" != typeof WebSocket) && (e = this.protocols), (t = "undefined" == typeof uni && "undefined" == typeof wx || "undefined" != typeof WebSocket ? {
      agent: this.agent,
      perMessageDeflate: this.perMessageDeflate
    } : {
      agent: this.agent
    }).pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (t.headers = this.extraHeaders), this.localAddress && (t.localAddress = this.localAddress);
    try {
      "undefined" == typeof uni && "undefined" == typeof wx || "undefined" != typeof WebSocket ? this.ws = this.usingBrowserWebSocket && !this.isReactNative ? e ? new Ye(s, e) : new Ye(s) : new Ye(s, e, t) : this.ws = new Ye(s);
    } catch (e) {
      return this.emit("error", e);
    }
    void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners();
  }
}, Ze.prototype.addEventListeners = function () {
  var e = this;
  this.ws.onopen = function () {
    e.onOpen();
  }, this.ws.onclose = function () {
    e.onClose();
  }, this.ws.onmessage = function (t) {
    e.onData(t.data);
  }, this.ws.onerror = function (t) {
    e.onError("websocket error", t);
  };
}, Ze.prototype.write = function (e) {
  var t = this;
  this.writable = !1;
  for (var s = e.length, n = 0, i = s; n < i; n++) {
    !function (e) {
      ze.encodePacket(e, t.supportsBinary, function (n) {
        if ("undefined" == typeof uni && "undefined" == typeof wx || "undefined" != typeof WebSocket) {
          if (!t.usingBrowserWebSocket) {
            var i = {};
            if (e.options && (i.compress = e.options.compress), t.perMessageDeflate) ("string" == typeof n ? Buffer.byteLength(n) : n.length) < t.perMessageDeflate.threshold && (i.compress = !1);
          }
          try {
            t.usingBrowserWebSocket ? t.ws.send(n) : t.ws.send(n, i);
          } catch (e) {
            Qe("websocket closed before onclose event");
          }
        } else try {
          t.ws.send(n);
        } catch (e) {
          Qe("websocket closed before onclose event");
        }
        --s || o();
      });
    }(e[n]);
  }
  function o() {
    t.emit("flush"), setTimeout(function () {
      t.writable = !0, t.emit("drain");
    }, 0);
  }
}, Ze.prototype.onClose = function () {
  We.prototype.onClose.call(this);
}, Ze.prototype.doClose = function () {
  void 0 !== this.ws && this.ws.close();
}, Ze.prototype.uri = function () {
  var e = this.query || {},
    t = this.secure ? "wss" : "ws",
    s = "";
  return this.port && ("wss" === t && 443 !== Number(this.port) || "ws" === t && 80 !== Number(this.port)) && (s = ":" + this.port), this.timestampRequests && (e[this.timestampParam] = Ke()), this.supportsBinary || (e.b64 = 1), (e = Xe.encode(e)).length && (e = "?" + e), t + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + s + this.path + e;
}, Ze.prototype.check = function () {
  return !(!Ye || "__initialize" in Ye && this.name === Ze.prototype.name);
};
var et = Ue,
  st = $e;
M.polling = function (e) {
  var t = !1,
    s = !1;
  if (e.jsonp, "undefined" != typeof location) {
    var n = "https:" === location.protocol,
      i = location.port;
    i || (i = n ? 443 : 80), t = e.hostname !== location.hostname || i !== e.port, s = e.secure !== n;
  }
  return e.xdomain = t, e.xscheme = s, new et(e);
}, M.websocket = st;
var nt = [].indexOf,
  it = function it(e, t) {
    if (nt) return e.indexOf(t);
    for (var s = 0; s < e.length; ++s) {
      if (e[s] === t) return s;
    }
    return -1;
  },
  ot = M,
  rt = S.exports,
  at = me.exports("engine.io-client:socket"),
  ct = it,
  ut = A,
  lt = a,
  dt = ie,
  ht = pt;
function pt(e, t) {
  if (!(this instanceof pt)) return new pt(e, t);
  t = t || {}, e && "object" == (0, _typeof2.default)(e) && (t = e, e = null), e ? (e = lt(e), t.hostname = e.host, t.secure = "https" === e.protocol || "wss" === e.protocol, t.port = e.port, e.query && (t.query = e.query)) : t.host && (t.hostname = lt(t.host).host), this.secure = null != t.secure ? t.secure : "undefined" != typeof location && "https:" === location.protocol, t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.agent = t.agent || !1, this.hostname = t.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), this.port = t.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? 443 : 80), this.query = t.query || {}, "string" == typeof this.query && (this.query = dt.decode(this.query)), this.upgrade = !1 !== t.upgrade, this.path = (t.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!t.forceJSONP, this.jsonp = !1 !== t.jsonp, this.forceBase64 = !!t.forceBase64, this.enablesXDR = !!t.enablesXDR, this.timestampParam = t.timestampParam || "t", this.timestampRequests = t.timestampRequests, this.transports = t.transports || ["polling", "websocket"], this.transportOptions = t.transportOptions || {}, this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = t.policyPort || 843, this.rememberUpgrade = t.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = t.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== t.perMessageDeflate && (t.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = t.pfx || null, this.key = t.key || null, this.passphrase = t.passphrase || null, this.cert = t.cert || null, this.ca = t.ca || null, this.ciphers = t.ciphers || null, this.rejectUnauthorized = void 0 === t.rejectUnauthorized || t.rejectUnauthorized, this.forceNode = !!t.forceNode, this.isReactNative = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(), ("undefined" == typeof self || this.isReactNative) && (t.extraHeaders && Object.keys(t.extraHeaders).length > 0 && (this.extraHeaders = t.extraHeaders), t.localAddress && (this.localAddress = t.localAddress)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, this.pingTimeoutTimer = null, this.open();
}
pt.priorWebsocketSuccess = !1, rt(pt.prototype), pt.protocol = ut.protocol, pt.Socket = pt, pt.Transport = te, pt.transports = M, pt.parser = A, pt.prototype.createTransport = function (e) {
  at('creating transport "%s"', e);
  var t = function (e) {
    var t = {};
    for (var s in e) {
      e.hasOwnProperty(s) && (t[s] = e[s]);
    }
    return t;
  }(this.query);
  t.EIO = ut.protocol, t.transport = e;
  var s = this.transportOptions[e] || {};
  return this.id && (t.sid = this.id), new ot[e]({
    query: t,
    socket: this,
    agent: s.agent || this.agent,
    hostname: s.hostname || this.hostname,
    port: s.port || this.port,
    secure: s.secure || this.secure,
    path: s.path || this.path,
    forceJSONP: s.forceJSONP || this.forceJSONP,
    jsonp: s.jsonp || this.jsonp,
    forceBase64: s.forceBase64 || this.forceBase64,
    enablesXDR: s.enablesXDR || this.enablesXDR,
    timestampRequests: s.timestampRequests || this.timestampRequests,
    timestampParam: s.timestampParam || this.timestampParam,
    policyPort: s.policyPort || this.policyPort,
    pfx: s.pfx || this.pfx,
    key: s.key || this.key,
    passphrase: s.passphrase || this.passphrase,
    cert: s.cert || this.cert,
    ca: s.ca || this.ca,
    ciphers: s.ciphers || this.ciphers,
    rejectUnauthorized: s.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: s.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: s.extraHeaders || this.extraHeaders,
    forceNode: s.forceNode || this.forceNode,
    localAddress: s.localAddress || this.localAddress,
    requestTimeout: s.requestTimeout || this.requestTimeout,
    protocols: s.protocols || void 0,
    isReactNative: this.isReactNative
  });
}, pt.prototype.open = function () {
  var e;
  if (this.rememberUpgrade && pt.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) e = "websocket";else {
    if (0 === this.transports.length) {
      var t = this;
      return void setTimeout(function () {
        t.emit("error", "No transports available");
      }, 0);
    }
    e = this.transports[0];
  }
  this.readyState = "opening";
  try {
    e = this.createTransport(e);
  } catch (e) {
    return this.transports.shift(), void this.open();
  }
  e.open(), this.setTransport(e);
}, pt.prototype.setTransport = function (e) {
  at("setting transport %s", e.name);
  var t = this;
  this.transport && (at("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = e, e.on("drain", function () {
    t.onDrain();
  }).on("packet", function (e) {
    t.onPacket(e);
  }).on("error", function (e) {
    t.onError(e);
  }).on("close", function () {
    t.onClose("transport close");
  });
}, pt.prototype.probe = function (e) {
  at('probing transport "%s"', e);
  var t = this.createTransport(e, {
      probe: 1
    }),
    s = !1,
    n = this;
  function i() {
    if (n.onlyBinaryUpgrades) {
      var i = !this.supportsBinary && n.transport.supportsBinary;
      s = s || i;
    }
    s || (at('probe transport "%s" opened', e), t.send([{
      type: "ping",
      data: "probe"
    }]), t.once("packet", function (i) {
      if (!s) if ("pong" === i.type && "probe" === i.data) {
        if (at('probe transport "%s" pong', e), n.upgrading = !0, n.emit("upgrading", t), !t) return;
        pt.priorWebsocketSuccess = "websocket" === t.name, at('pausing current transport "%s"', n.transport.name), n.transport.pause(function () {
          s || "closed" !== n.readyState && (at("changing transport and sending upgrade packet"), l(), n.setTransport(t), t.send([{
            type: "upgrade"
          }]), n.emit("upgrade", t), t = null, n.upgrading = !1, n.flush());
        });
      } else {
        at('probe transport "%s" failed', e);
        var o = new Error("probe error");
        o.transport = t.name, n.emit("upgradeError", o);
      }
    }));
  }
  function o() {
    s || (s = !0, l(), t.close(), t = null);
  }
  function r(s) {
    var i = new Error("probe error: " + s);
    i.transport = t.name, o(), at('probe transport "%s" failed because of error: %s', e, s), n.emit("upgradeError", i);
  }
  function a() {
    r("transport closed");
  }
  function c() {
    r("socket closed");
  }
  function u(e) {
    t && e.name !== t.name && (at('"%s" works - aborting "%s"', e.name, t.name), o());
  }
  function l() {
    t.removeListener("open", i), t.removeListener("error", r), t.removeListener("close", a), n.removeListener("close", c), n.removeListener("upgrading", u);
  }
  pt.priorWebsocketSuccess = !1, t.once("open", i), t.once("error", r), t.once("close", a), this.once("close", c), this.once("upgrading", u), t.open();
}, pt.prototype.onOpen = function () {
  if (at("socket open"), this.readyState = "open", pt.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
    at("starting upgrade probes");
    for (var e = 0, t = this.upgrades.length; e < t; e++) {
      this.probe(this.upgrades[e]);
    }
  }
}, pt.prototype.onPacket = function (e) {
  if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (at('socket receive: type "%s", data "%s"', e.type, e.data), this.emit("packet", e), this.emit("heartbeat"), e.type) {
    case "open":
      this.onHandshake(JSON.parse(e.data));
      break;
    case "pong":
      this.setPing(), this.emit("pong");
      break;
    case "error":
      var t = new Error("server error");
      t.code = e.data, this.onError(t);
      break;
    case "message":
      this.emit("data", e.data), this.emit("message", e.data);
  } else at('packet received with socket readyState "%s"', this.readyState);
}, pt.prototype.onHandshake = function (e) {
  this.emit("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat));
}, pt.prototype.onHeartbeat = function (e) {
  clearTimeout(this.pingTimeoutTimer);
  var t = this;
  t.pingTimeoutTimer = setTimeout(function () {
    "closed" !== t.readyState && t.onClose("ping timeout");
  }, e || t.pingInterval + t.pingTimeout);
}, pt.prototype.setPing = function () {
  var e = this;
  clearTimeout(e.pingIntervalTimer), e.pingIntervalTimer = setTimeout(function () {
    at("writing ping packet - expecting pong within %sms", e.pingTimeout), e.ping(), e.onHeartbeat(e.pingTimeout);
  }, e.pingInterval);
}, pt.prototype.ping = function () {
  var e = this;
  this.sendPacket("ping", function () {
    e.emit("ping");
  });
}, pt.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush();
}, pt.prototype.flush = function () {
  "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (at("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"));
}, pt.prototype.write = pt.prototype.send = function (e, t, s) {
  return this.sendPacket("message", e, t, s), this;
}, pt.prototype.sendPacket = function (e, t, s, n) {
  if ("function" == typeof t && (n = t, t = void 0), "function" == typeof s && (n = s, s = null), "closing" !== this.readyState && "closed" !== this.readyState) {
    (s = s || {}).compress = !1 !== s.compress;
    var i = {
      type: e,
      data: t,
      options: s
    };
    this.emit("packetCreate", i), this.writeBuffer.push(i), n && this.once("flush", n), this.flush();
  }
}, pt.prototype.close = function () {
  if ("opening" === this.readyState || "open" === this.readyState) {
    this.readyState = "closing";
    var e = this;
    this.writeBuffer.length ? this.once("drain", function () {
      this.upgrading ? n() : t();
    }) : this.upgrading ? n() : t();
  }
  function t() {
    e.onClose("forced close"), at("socket closing - telling transport to close"), e.transport.close();
  }
  function s() {
    e.removeListener("upgrade", s), e.removeListener("upgradeError", s), t();
  }
  function n() {
    e.once("upgrade", s), e.once("upgradeError", s);
  }
  return this;
}, pt.prototype.onError = function (e) {
  at("socket error %j", e), pt.priorWebsocketSuccess = !1, this.emit("error", e), this.onClose("transport error", e);
}, pt.prototype.onClose = function (e, t) {
  if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
    at('socket close with reason: "%s"', e);
    clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", e, t), this.writeBuffer = [], this.prevBufferLen = 0;
  }
}, pt.prototype.filterUpgrades = function (e) {
  for (var t = [], s = 0, n = e.length; s < n; s++) {
    ~ct(this.transports, e[s]) && t.push(e[s]);
  }
  return t;
}, I.exports = ht, I.exports.parser = A;
var mt = {
    exports: {}
  },
  ft = function ft(e, t) {
    for (var s = [], n = (t = t || 0) || 0; n < e.length; n++) {
      s[n - t] = e[n];
    }
    return s;
  };
var gt = function gt(e, t, s) {
  return e.on(t, s), {
    destroy: function destroy() {
      e.removeListener(t, s);
    }
  };
};
var yt = [].slice,
  vt = function vt(e, t) {
    if ("string" == typeof t && (t = e[t]), "function" != typeof t) throw new Error("bind() requires a function");
    var s = yt.call(arguments, 2);
    return function () {
      return t.apply(e, s.concat(yt.call(arguments)));
    };
  };
!function (e, t) {
  var s = C,
    n = S.exports,
    i = ft,
    o = gt,
    r = vt,
    a = (c.exports("socket.io-client:socket"), ie),
    u = P;
  e.exports = h;
  var l = {
      connect: 1,
      connect_error: 1,
      connect_timeout: 1,
      connecting: 1,
      disconnect: 1,
      error: 1,
      reconnect: 1,
      reconnect_attempt: 1,
      reconnect_failed: 1,
      reconnect_error: 1,
      reconnecting: 1,
      ping: 1,
      pong: 1
    },
    d = n.prototype.emit;
  function h(e, t, s) {
    this.io = e, this.nsp = t, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, this.flags = {}, s && s.query && (this.query = s.query), this.io.autoConnect && this.open();
  }
  n(h.prototype), h.prototype.subEvents = function () {
    if (!this.subs) {
      var e = this.io;
      this.subs = [o(e, "open", r(this, "onopen")), o(e, "packet", r(this, "onpacket")), o(e, "close", r(this, "onclose"))];
    }
  }, h.prototype.open = h.prototype.connect = function () {
    return this.connected || (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting")), this;
  }, h.prototype.send = function () {
    var e = i(arguments);
    return e.unshift("message"), this.emit.apply(this, e), this;
  }, h.prototype.emit = function (e) {
    if (l.hasOwnProperty(e)) return d.apply(this, arguments), this;
    var t = i(arguments),
      n = {
        type: (void 0 !== this.flags.binary ? this.flags.binary : u(t)) ? s.BINARY_EVENT : s.EVENT,
        data: t,
        options: {}
      };
    return n.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof t[t.length - 1] && (this.ids, this.acks[this.ids] = t.pop(), n.id = this.ids++), this.connected ? this.packet(n) : this.sendBuffer.push(n), this.flags = {}, this;
  }, h.prototype.packet = function (e) {
    e.nsp = this.nsp, this.io.packet(e);
  }, h.prototype.onopen = function () {
    if ("/" !== this.nsp) if (this.query) {
      var e = "object" == (0, _typeof2.default)(this.query) ? a.encode(this.query) : this.query;
      this.packet({
        type: s.CONNECT,
        query: e
      });
    } else this.packet({
      type: s.CONNECT
    });
  }, h.prototype.onclose = function (e) {
    this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", e);
  }, h.prototype.onpacket = function (e) {
    var t = e.nsp === this.nsp,
      n = e.type === s.ERROR && "/" === e.nsp;
    if (t || n) switch (e.type) {
      case s.CONNECT:
        this.onconnect();
        break;
      case s.EVENT:
      case s.BINARY_EVENT:
        this.onevent(e);
        break;
      case s.ACK:
      case s.BINARY_ACK:
        this.onack(e);
        break;
      case s.DISCONNECT:
        this.ondisconnect();
        break;
      case s.ERROR:
        this.emit("error", e.data);
    }
  }, h.prototype.onevent = function (e) {
    var t = e.data || [];
    null != e.id && t.push(this.ack(e.id)), this.connected ? d.apply(this, t) : this.receiveBuffer.push(t);
  }, h.prototype.ack = function (e) {
    var t = this,
      n = !1;
    return function () {
      if (!n) {
        n = !0;
        var o = i(arguments);
        t.packet({
          type: u(o) ? s.BINARY_ACK : s.ACK,
          id: e,
          data: o
        });
      }
    };
  }, h.prototype.onack = function (e) {
    var t = this.acks[e.id];
    "function" == typeof t ? (e.id, e.data, t.apply(this, e.data), delete this.acks[e.id]) : e.id;
  }, h.prototype.onconnect = function () {
    this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered();
  }, h.prototype.emitBuffered = function () {
    var e;
    for (e = 0; e < this.receiveBuffer.length; e++) {
      d.apply(this, this.receiveBuffer[e]);
    }
    for (this.receiveBuffer = [], e = 0; e < this.sendBuffer.length; e++) {
      this.packet(this.sendBuffer[e]);
    }
    this.sendBuffer = [];
  }, h.prototype.ondisconnect = function () {
    this.nsp, this.destroy(), this.onclose("io server disconnect");
  }, h.prototype.destroy = function () {
    if (this.subs) {
      for (var e = 0; e < this.subs.length; e++) {
        this.subs[e].destroy();
      }
      this.subs = null;
    }
    this.io.destroy(this);
  }, h.prototype.close = h.prototype.disconnect = function () {
    return this.connected && (this.nsp, this.packet({
      type: s.DISCONNECT
    })), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }, h.prototype.compress = function (e) {
    return this.flags.compress = e, this;
  }, h.prototype.binary = function (e) {
    return this.flags.binary = e, this;
  };
}(mt);
var Et,
  Ct,
  St = bt;
function bt(e) {
  e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0;
}
bt.prototype.duration = function () {
  var e = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(),
      s = Math.floor(t * this.jitter * e);
    e = 0 == (1 & Math.floor(10 * t)) ? e - s : e + s;
  }
  return 0 | Math.min(e, this.max);
}, bt.prototype.reset = function () {
  this.attempts = 0;
}, bt.prototype.setMin = function (e) {
  this.ms = e;
}, bt.prototype.setMax = function (e) {
  this.max = e;
}, bt.prototype.setJitter = function (e) {
  this.jitter = e;
};
var wt = /*#__PURE__*/function () {
  function wt() {
    (0, _classCallCheck2.default)(this, wt);
  }
  (0, _createClass2.default)(wt, null, [{
    key: "get",
    value: function get(e) {
      var t = encodeURIComponent(e) + "=",
        s = document.cookie.split("; ");
      var _iterator = _createForOfIteratorHelper(s),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _e2 = _step.value;
          if (_e2.startsWith(t)) return decodeURIComponent(_e2.substring(t.length));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return null;
    }
  }, {
    key: "set",
    value: function set(e, t, s, n) {
      var i = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "/";
      var o = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : !1;
      var r = encodeURIComponent(e) + "=" + encodeURIComponent(t);
      s instanceof Date && (r += "; expires=" + s.toGMTString()), i && (r += "; path=" + i), n && (r += "; domain=" + n), o && (r += "; secure"), document.cookie = r;
    }
  }, {
    key: "remove",
    value: function remove(e, t) {
      var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "/";
      var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !1;
      wt.set(e, "", new Date(0), t, s, n);
    }
  }]);
  return wt;
}();
!function (e) {
  e.BROWSER = "BROWSER", e.UNKNOWN = "UNKNOWN", e.APP_IOS = "APP_IOS", e.APP_ANDROID = "APP_ANDROID", e.APPLET_WX = "APPLET_WX", e.APPLET_WX_GAME = "APPLET_WX_GAME", e.APPLET_ALIPAY = "APPLET_ALIPAY", e.APPLET_BYTEDANCE = "APPLET_BYTEDANCE";
}(Et || (Et = {}));
var It = /*#__PURE__*/function () {
  function It() {
    var _this$methods;
    (0, _classCallCheck2.default)(this, It);
    this.platform = null, this.methods = (_this$methods = {}, (0, _defineProperty2.default)(_this$methods, Et.BROWSER, this.isBrowser), (0, _defineProperty2.default)(_this$methods, Et.APP_IOS, this.isAppiOS), (0, _defineProperty2.default)(_this$methods, Et.APP_ANDROID, this.isAppAndroid), (0, _defineProperty2.default)(_this$methods, Et.APPLET_WX, this.isWXApplet), (0, _defineProperty2.default)(_this$methods, Et.APPLET_WX_GAME, this.isWXGameApplet), _this$methods);
    var e = this.methods,
      t = Object.keys(e);
    for (var _i2 = 0, _t2 = t; _i2 < _t2.length; _i2++) {
      var _s3 = _t2[_i2];
      if ((0, e[_s3])()) {
        this.platform = _s3;
        break;
      }
    }
    this.platform = this.platform || Et.UNKNOWN, this.platform;
  }
  (0, _createClass2.default)(It, [{
    key: "isBrowser",
    value: function isBrowser() {
      return "undefined" != typeof navigator && "Taro" !== navigator.product && "ReactNative" !== navigator.product && "undefined" == typeof GameGlobal && ("undefined" == typeof cc || null !== cc.sys.browserType);
    }
  }, {
    key: "isAppiOS",
    value: function isAppiOS() {
      return "undefined" != typeof cc && cc.sys.isNative && cc.sys.isMobile && "iOS" === cc.sys.os || "object" == (typeof uni === "undefined" ? "undefined" : (0, _typeof2.default)(uni)) && !!uni.getSystemInfoSync && "ios" === uni.getSystemInfoSync().platform && "object" == (typeof plus === "undefined" ? "undefined" : (0, _typeof2.default)(plus));
    }
  }, {
    key: "isAppAndroid",
    value: function isAppAndroid() {
      return "undefined" != typeof cc && cc.sys.isNative && cc.sys.isMobile && "Android" === cc.sys.os || "object" == (typeof uni === "undefined" ? "undefined" : (0, _typeof2.default)(uni)) && !!uni.getSystemInfoSync && "android" === uni.getSystemInfoSync().platform && "object" == (typeof plus === "undefined" ? "undefined" : (0, _typeof2.default)(plus));
    }
  }, {
    key: "isWXApplet",
    value: function isWXApplet() {
      return "object" == (typeof wx === "undefined" ? "undefined" : (0, _typeof2.default)(wx)) && !!wx.getSystemInfoSync && "undefined" == typeof WebSocket && "undefined" == typeof XMLHttpRequest && "undefined" == typeof plus;
    }
  }, {
    key: "isWXGameApplet",
    value: function isWXGameApplet() {
      return "object" == (typeof GameGlobal === "undefined" ? "undefined" : (0, _typeof2.default)(GameGlobal));
    }
  }, {
    key: "isAlipayApplet",
    value: function isAlipayApplet() {
      return !1;
    }
  }, {
    key: "isBytedanceApplet",
    value: function isBytedanceApplet() {
      return !1;
    }
  }, {
    key: "isQQApplet",
    value: function isQQApplet() {
      return !1;
    }
  }, {
    key: "isBaiduApplet",
    value: function isBaiduApplet() {
      return !1;
    }
  }], [{
    key: "currentPlatform",
    value: function currentPlatform() {
      return It.instance.platform;
    }
  }]);
  return It;
}();
It.instance = new It(), function (e) {
  e.UNIAPP = "UNIAPP", e.REACT_NATIVE = "REACT_NATIVE", e.COCOS = "COCOS", e.TARO = "TARO", e.IONIC = "IONIC", e.NATIVE_APPLET_WX = "NATIVE_APPLET_WX", e.NATIVE_APPLET_ALIPAY = "NATIVE_APPLET_ALIPAY", e.UNKNOWN = "UNKNOWN";
}(Ct || (Ct = {}));
var Mt = /*#__PURE__*/function () {
  function Mt() {
    var _this$methods2;
    (0, _classCallCheck2.default)(this, Mt);
    this.framework = null, this.methods = (_this$methods2 = {}, (0, _defineProperty2.default)(_this$methods2, Ct.UNIAPP, this.isUniApp), (0, _defineProperty2.default)(_this$methods2, Ct.REACT_NATIVE, this.isReactNative), (0, _defineProperty2.default)(_this$methods2, Ct.TARO, this.isTaro), (0, _defineProperty2.default)(_this$methods2, Ct.NATIVE_APPLET_WX, this.isWXApplet), (0, _defineProperty2.default)(_this$methods2, Ct.COCOS, this.isCocos), _this$methods2);
    var e = this.methods,
      t = Object.keys(e);
    for (var _i3 = 0, _t3 = t; _i3 < _t3.length; _i3++) {
      var _s4 = _t3[_i3];
      if ((0, e[_s4])()) {
        this.framework = _s4;
        break;
      }
    }
    this.framework = this.framework || Ct.UNKNOWN, this.framework;
  }
  (0, _createClass2.default)(Mt, [{
    key: "isUniApp",
    value: function isUniApp() {
      return "object" == (typeof uni === "undefined" ? "undefined" : (0, _typeof2.default)(uni)) && !!uni.getSystemInfoSync;
    }
  }, {
    key: "isReactNative",
    value: function isReactNative() {
      return "undefined" != typeof global && global.__fbGenNativeModule;
    }
  }, {
    key: "isTaro",
    value: function isTaro() {
      return "undefined" != typeof process && void 0 !== Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}) && void 0 !== Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"applet","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).TARO_ENV;
    }
  }, {
    key: "isWXApplet",
    value: function isWXApplet() {
      return It.currentPlatform() === Et.APPLET_WX && "undefined" == typeof uni;
    }
  }, {
    key: "isCocos",
    value: function isCocos() {
      try {
        return void 0 !== cc.sys.localStorage;
      } catch (e) {
        return !1;
      }
    }
  }], [{
    key: "currentFramework",
    value: function currentFramework() {
      return this.instance.framework;
    }
  }]);
  return Mt;
}();
Mt.instance = new Mt();
var At = /*#__PURE__*/function () {
  function At() {
    (0, _classCallCheck2.default)(this, At);
  }
  (0, _createClass2.default)(At, null, [{
    key: "init",
    value: function init(e) {
      Mt.currentFramework() === Ct.REACT_NATIVE && (this.validate(e), this.platform = e.platform, this.asyncStorage = e.asyncStorage);
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!e) throw new Error("'reactNativeOptions' is missing when calling GoEasy.getInstance()");
      if (!e.platform) throw new Error("'platform' is missing in GoEasy 'reactNativeOptions'");
      if (!e.asyncStorage) throw new Error("'asyncStorage' is missing in GoEasy 'reactNativeOptions'");
    }
  }]);
  return At;
}();
var Tt = /*#__PURE__*/function () {
  function Tt() {
    (0, _classCallCheck2.default)(this, Tt);
  }
  (0, _createClass2.default)(Tt, [{
    key: "asyncGet",
    value: function asyncGet(e) {
      var t = this.get(e);
      return Promise.resolve(t);
    }
  }, {
    key: "asyncPut",
    value: function asyncPut(e, t) {
      return this.put(e, t), Promise.resolve();
    }
  }, {
    key: "get",
    value: function get(e) {
      var t = this.doGet(e);
      return t = JSON.parse(t), t;
    }
  }, {
    key: "put",
    value: function put(e, t) {
      this.doPut(e, JSON.stringify(t));
    }
  }]);
  return Tt;
}();
var Nt = /*#__PURE__*/function (_Tt) {
  (0, _inherits2.default)(Nt, _Tt);
  var _super = _createSuper(Nt);
  function Nt() {
    var _this;
    (0, _classCallCheck2.default)(this, Nt);
    _this = _super.call(this), _this.domain = null;
    _this.domain = "undefined" != typeof location && /^(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?$/.test(location.host) ? location.host.split(".").slice(-2).join(".") : null;
    return _this;
  }
  (0, _createClass2.default)(Nt, [{
    key: "doGet",
    value: function doGet(e) {
      return wt.get(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      var s = new Date(2030, 12, 31, 0, 0, 0, 0),
        n = this.domain;
      wt.set(e, t, s, n);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      var t = this.domain;
      wt.remove(e, t);
    }
  }, {
    key: "support",
    value: function support() {
      return "undefined" != typeof navigator && !0 === navigator.cookieEnabled;
    }
  }]);
  return Nt;
}(Tt);
var Rt = /*#__PURE__*/function (_Tt2) {
  (0, _inherits2.default)(Rt, _Tt2);
  var _super2 = _createSuper(Rt);
  function Rt() {
    (0, _classCallCheck2.default)(this, Rt);
    return _super2.apply(this, arguments);
  }
  (0, _createClass2.default)(Rt, [{
    key: "doGet",
    value: function doGet(e) {
      return localStorage.getItem(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      localStorage.setItem(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      localStorage.removeItem(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("undefined" != typeof GameGlobal || "undefined" == typeof localStorage || !localStorage.setItem);
    }
  }]);
  return Rt;
}(Tt);
var Ot = /*#__PURE__*/function (_Tt3) {
  (0, _inherits2.default)(Ot, _Tt3);
  var _super3 = _createSuper(Ot);
  function Ot() {
    (0, _classCallCheck2.default)(this, Ot);
    return _super3.apply(this, arguments);
  }
  (0, _createClass2.default)(Ot, [{
    key: "doGet",
    value: function doGet(e) {
      return uni.getStorageSync(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      uni.setStorageSync(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      uni.removeStorageSync(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("object" != (typeof uni === "undefined" ? "undefined" : (0, _typeof2.default)(uni)) || !uni.getStorageSync);
    }
  }]);
  return Ot;
}(Tt);
var _t = /*#__PURE__*/function (_Tt4) {
  (0, _inherits2.default)(_t, _Tt4);
  var _super4 = _createSuper(_t);
  function _t() {
    (0, _classCallCheck2.default)(this, _t);
    return _super4.apply(this, arguments);
  }
  (0, _createClass2.default)(_t, [{
    key: "doGet",
    value: function doGet(e) {
      return cc.sys.localStorage.getItem(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      cc.sys.localStorage.setItem(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      cc.sys.localStorage.removeItem(e);
    }
  }, {
    key: "support",
    value: function support() {
      return "undefined" != typeof cc && void 0 !== cc.sys.localStorage;
    }
  }]);
  return _t;
}(Tt);
var Pt = /*#__PURE__*/function (_Tt5) {
  (0, _inherits2.default)(Pt, _Tt5);
  var _super5 = _createSuper(Pt);
  function Pt() {
    (0, _classCallCheck2.default)(this, Pt);
    return _super5.apply(this, arguments);
  }
  (0, _createClass2.default)(Pt, [{
    key: "doGet",
    value: function doGet(e) {
      return wx.getStorageSync(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      wx.setStorageSync(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      wx.removeStorageSync(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("object" != (typeof wx === "undefined" ? "undefined" : (0, _typeof2.default)(wx)) || !wx.getStorageSync);
    }
  }]);
  return Pt;
}(Tt);
var kt = /*#__PURE__*/function (_Tt6) {
  (0, _inherits2.default)(kt, _Tt6);
  var _super6 = _createSuper(kt);
  function kt() {
    (0, _classCallCheck2.default)(this, kt);
    return _super6.apply(this, arguments);
  }
  (0, _createClass2.default)(kt, [{
    key: "asyncGet",
    value: function asyncGet(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var t;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return At.asyncStorage.getItem(e);
              case 2:
                t = _context.sent;
                return _context.abrupt("return", JSON.parse(t));
              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    }
  }, {
    key: "asyncPut",
    value: function asyncPut(e, t) {
      return At.asyncStorage.setItem(e, JSON.stringify(t));
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "remove",
    value: function remove(e) {
      At.asyncStorage.removeItem(e);
    }
  }, {
    key: "support",
    value: function support() {
      return Mt.currentFramework() === Ct.REACT_NATIVE;
    }
  }, {
    key: "doGet",
    value: function doGet(e) {
      throw new Error("Method not implemented.");
    }
  }]);
  return kt;
}(Tt);
var Dt = /*#__PURE__*/function () {
  function Dt() {
    (0, _classCallCheck2.default)(this, Dt);
    this.supportedStorage = null;
    var e = Dt.storages;
    e.push(new Ot()), e.push(new _t()), e.push(new Rt()), e.push(new Pt()), e.push(new kt()), e.push(new Nt()), this.dispatch(), this.supportedStorage;
  }
  (0, _createClass2.default)(Dt, [{
    key: "dispatch",
    value: function dispatch() {
      var _iterator2 = _createForOfIteratorHelper(Dt.storages),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _e3 = _step2.value;
          if (_e3.support()) {
            this.supportedStorage = _e3;
            break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }], [{
    key: "localStorage",
    value: function localStorage() {
      return this.instance.supportedStorage;
    }
  }]);
  return Dt;
}();
Dt.storages = new Array(), Dt.instance = new Dt();
var xt = new ( /*#__PURE__*/function () {
  function _class() {
    (0, _classCallCheck2.default)(this, _class);
    this.INDEX_KEY = "DOMAIN_INDEX", this.MAX = 5, this.storage = Dt.localStorage(), this.init();
  }
  (0, _createClass2.default)(_class, [{
    key: "init",
    value: function init() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = this.support();
                if (!_context2.t0) {
                  _context2.next = 13;
                  break;
                }
                this.index = Math.floor(Math.random() * (this.MAX - 1) + 1);
                _context2.t1 = null !== this.storage;
                if (!_context2.t1) {
                  _context2.next = 13;
                  break;
                }
                _context2.t3 = parseInt;
                _context2.next = 8;
                return this.storage.asyncGet(this.INDEX_KEY);
              case 8:
                _context2.t4 = _context2.sent;
                _context2.t2 = (0, _context2.t3)(_context2.t4);
                if (_context2.t2) {
                  _context2.next = 12;
                  break;
                }
                _context2.t2 = this.index;
              case 12:
                this.index = _context2.t2;
              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var e = this.index;
      e > 0 && e < this.MAX ? e += 1 : e === this.MAX && (e = 1), null !== this.storage && (this.index = e, this.storage.asyncPut(this.INDEX_KEY, e));
    }
  }, {
    key: "i",
    value: function i() {
      var e = this.index;
      return this.refresh(), e;
    }
  }, {
    key: "support",
    value: function support() {
      return [Et.BROWSER].includes(It.currentPlatform());
    }
  }]);
  return _class;
}())();
var Ft = n(Object.freeze({
  __proto__: null,
  domainIndex: xt
}));
var Ut = new ( /*#__PURE__*/function () {
  function _class2() {
    (0, _classCallCheck2.default)(this, _class2);
    this.uniAppRunningBackend = !1, this.listenAppRunning();
  }
  (0, _createClass2.default)(_class2, [{
    key: "listenAppRunning",
    value: function listenAppRunning() {
      var _this2 = this;
      Mt.currentFramework() === Ct.UNIAPP && "object" == (typeof plus === "undefined" ? "undefined" : (0, _typeof2.default)(plus)) && (plus.globalEvent.addEventListener("resume", function () {
        _this2.uniAppRunningBackend = !1, _this2.uniAppRunningBackend;
      }, !1), plus.globalEvent.addEventListener("pause", function () {
        _this2.uniAppRunningBackend = !0, _this2.uniAppRunningBackend;
      }, !1));
    }
  }, {
    key: "runningBackend",
    value: function runningBackend() {
      return this.uniAppRunningBackend;
    }
  }]);
  return _class2;
}())();
var Lt = n(Object.freeze({
    __proto__: null,
    uniApp: Ut
  })),
  Gt = I.exports,
  qt = mt.exports,
  Bt = S.exports,
  jt = C,
  Vt = gt,
  Ht = vt,
  Wt = (c.exports("socket.io-client:manager"), it),
  zt = St;
var Xt = Ft.domainIndex;
var Jt,
  Kt = Lt.uniApp,
  Qt = Object.prototype.hasOwnProperty,
  Yt = $t;
function $t(e, t) {
  if (!(this instanceof $t)) return new $t(e, t);
  e && "object" == (0, _typeof2.default)(e) && (t = e, e = void 0), (t = t || {}).path = t.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = t, this.reconnection(!1 !== t.reconnection), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor(t.randomizationFactor || .5), this.backoff = new zt({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  }), this.timeout(null == t.timeout ? 2e4 : t.timeout), this.readyState = "closed", this.uri = e, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [];
  var s = t.parser || jt;
  this.encoder = new s.Encoder(), this.decoder = new s.Decoder(), this.autoConnect = !1 !== t.autoConnect, this.autoConnect && this.open();
}
function Zt() {
  var e = !1;
  return "object" == (typeof uni === "undefined" ? "undefined" : (0, _typeof2.default)(uni)) && uni.getSystemInfo && (e = !0), e && Kt.runningBackend();
}
$t.prototype.emitAll = function () {
  for (var e in this.emit.apply(this, arguments), this.nsps) {
    Qt.call(this.nsps, e) && this.nsps[e].emit.apply(this.nsps[e], arguments);
  }
}, $t.prototype.updateSocketIds = function () {
  for (var e in this.nsps) {
    Qt.call(this.nsps, e) && (this.nsps[e].id = this.generateId(e));
  }
}, $t.prototype.generateId = function (e) {
  return ("/" === e ? "" : e + "#") + this.engine.id;
}, Bt($t.prototype), $t.prototype.reconnection = function (e) {
  return arguments.length ? (this._reconnection = !!e, this) : this._reconnection;
}, $t.prototype.reconnectionAttempts = function (e) {
  return arguments.length ? (this._reconnectionAttempts = e, this) : this._reconnectionAttempts;
}, $t.prototype.reconnectionDelay = function (e) {
  return arguments.length ? (this._reconnectionDelay = e, this.backoff && this.backoff.setMin(e), this) : this._reconnectionDelay;
}, $t.prototype.randomizationFactor = function (e) {
  return arguments.length ? (this._randomizationFactor = e, this.backoff && this.backoff.setJitter(e), this) : this._randomizationFactor;
}, $t.prototype.reconnectionDelayMax = function (e) {
  return arguments.length ? (this._reconnectionDelayMax = e, this.backoff && this.backoff.setMax(e), this) : this._reconnectionDelayMax;
}, $t.prototype.timeout = function (e) {
  return arguments.length ? (this._timeout = e, this) : this._timeout;
}, $t.prototype.maybeReconnectOnOpen = function () {
  !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
}, $t.prototype.open = $t.prototype.connect = function (e, t) {
  if (this.readyState, ~this.readyState.indexOf("open")) return this;
  this.uri, this.engine = Gt(this.uri, this.opts);
  var s = this.engine,
    n = this;
  this.readyState = "opening", this.skipReconnect = !1;
  var i = Vt(s, "open", function () {
      n.onopen(), e && e();
    }),
    o = Vt(s, "error", function (t) {
      if (Xt.support()) {
        var s = parseInt(n.uri.match(/[1-9][0-9]*/g)[0]),
          i = Xt.i();
        n.uri = n.uri.replace(s, i);
      }
      if (n.cleanup(), n.readyState = "closed", n.emitAll("connect_error", t), e) {
        var o = new Error("Connection error");
        o.data = t, e(o);
      } else n.maybeReconnectOnOpen();
    });
  if (!1 !== this._timeout) {
    var r = this._timeout,
      a = setTimeout(function () {
        i.destroy(), s.close(), s.emit("error", "timeout"), n.emitAll("connect_timeout", r);
      }, r);
    this.subs.push({
      destroy: function destroy() {
        clearTimeout(a);
      }
    });
  }
  return this.subs.push(i), this.subs.push(o), this;
}, $t.prototype.onopen = function () {
  this.cleanup(), this.readyState = "open", this.emit("open");
  var e = this.engine;
  this.subs.push(Vt(e, "data", Ht(this, "ondata"))), this.subs.push(Vt(e, "ping", Ht(this, "onping"))), this.subs.push(Vt(e, "pong", Ht(this, "onpong"))), this.subs.push(Vt(e, "error", Ht(this, "onerror"))), this.subs.push(Vt(e, "close", Ht(this, "onclose"))), this.subs.push(Vt(this.decoder, "decoded", Ht(this, "ondecoded")));
}, $t.prototype.onping = function () {
  this.lastPing = new Date(), this.emitAll("ping");
}, $t.prototype.onpong = function () {
  this.emitAll("pong", new Date() - this.lastPing);
}, $t.prototype.ondata = function (e) {
  this.decoder.add(e);
}, $t.prototype.ondecoded = function (e) {
  this.emit("packet", e);
}, $t.prototype.onerror = function (e) {
  this.emitAll("error", e);
}, $t.prototype.socket = function (e, t) {
  var s = this.nsps[e];
  if (!s) {
    s = new qt(this, e, t), this.nsps[e] = s;
    var n = this;
    s.on("connecting", i), s.on("connect", function () {
      s.id = n.generateId(e);
    }), this.autoConnect && i();
  }
  function i() {
    ~Wt(n.connecting, s) || n.connecting.push(s);
  }
  return s;
}, $t.prototype.destroy = function (e) {
  var t = Wt(this.connecting, e);
  ~t && this.connecting.splice(t, 1), this.connecting.length || this.close();
}, $t.prototype.packet = function (e) {
  var t = this;
  e.query && 0 === e.type && (e.nsp += "?" + e.query), t.encoding ? t.packetBuffer.push(e) : (t.encoding = !0, this.encoder.encode(e, function (s) {
    for (var n = 0; n < s.length; n++) {
      t.engine.write(s[n], e.options);
    }
    t.encoding = !1, t.processPacketQueue();
  }));
}, $t.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var e = this.packetBuffer.shift();
    this.packet(e);
  }
}, $t.prototype.cleanup = function () {
  for (var e = this.subs.length, t = 0; t < e; t++) {
    this.subs.shift().destroy();
  }
  this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy();
}, $t.prototype.close = $t.prototype.disconnect = function () {
  this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close();
}, $t.prototype.onclose = function (e) {
  this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", e), this._reconnection && !this.skipReconnect && this.reconnect();
}, $t.prototype.reconnect = function () {
  if (Zt(), this.reconnecting || this.skipReconnect) return this;
  var e = this;
  if (this.backoff.attempts >= this._reconnectionAttempts) this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;else {
    var t = this.backoff.duration();
    this.reconnecting = !0;
    var s = setTimeout(function () {
      e.skipReconnect || (e.emitAll("reconnect_attempt", e.backoff.attempts), e.emitAll("reconnecting", e.backoff.attempts), e.skipReconnect || (Zt() ? (e.reconnecting = !1, e.reconnect(), e.emitAll("reconnect_error", "Uniapp running backend, skipped reconnect...")) : e.open(function (t) {
        t ? (e.reconnecting = !1, e.reconnect(), e.emitAll("reconnect_error", t.data)) : e.onreconnect();
      })));
    }, t);
    this.subs.push({
      destroy: function destroy() {
        clearTimeout(s);
      }
    });
  }
}, $t.prototype.onreconnect = function () {
  var e = this.backoff.attempts;
  this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", e);
}, function (e, t) {
  var s = E,
    n = C,
    i = Yt;
  c.exports("socket.io-client");
  e.exports = t = r;
  var o = t.managers = {};
  function r(e, t) {
    "object" == (0, _typeof2.default)(e) && (t = e, e = void 0), t = t || {};
    var n,
      r = s(e),
      a = r.source,
      c = r.id,
      u = r.path,
      l = o[c] && u in o[c].nsps;
    return t.forceNew || t["force new connection"] || !1 === t.multiplex || l ? n = i(a, t) : (o[c] || (o[c] = i(a, t)), n = o[c]), r.query && !t.query && (t.query = r.query), n.socket(r.path, t);
  }
  t.protocol = n.protocol, t.connect = r, t.Manager = Yt, t.Socket = mt.exports;
}(i, i.exports), function (e) {
  e.WRITE = "WRITE", e.READ = "READ", e.NONE = "NONE";
}(Jt || (Jt = {}));
var es = new ( /*#__PURE__*/function () {
  function _class3() {
    (0, _classCallCheck2.default)(this, _class3);
  }
  (0, _createClass2.default)(_class3, [{
    key: "isDef",
    value: function isDef(e) {
      return !this.isUndef(e);
    }
  }, {
    key: "isUndef",
    value: function isUndef(e) {
      return null == e;
    }
  }, {
    key: "isPrimitive",
    value: function isPrimitive(e) {
      return "string" == typeof e || "number" == typeof e || "symbol" == (0, _typeof2.default)(e) || "boolean" == typeof e;
    }
  }, {
    key: "isObject",
    value: function isObject(e) {
      return null !== e && "object" == (0, _typeof2.default)(e);
    }
  }, {
    key: "isPlainObject",
    value: function isPlainObject(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isRegExp",
    value: function isRegExp(e) {
      return "[object RegExp]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isValidArrayIndex",
    value: function isValidArrayIndex(e) {
      var t = parseFloat(String(e));
      return t >= 0 && Math.floor(t) === t && isFinite(e);
    }
  }, {
    key: "isString",
    value: function isString(e) {
      return "string" == typeof e;
    }
  }, {
    key: "isNumber",
    value: function isNumber(e) {
      return "number" == typeof e;
    }
  }, {
    key: "isStringOrNumber",
    value: function isStringOrNumber(e) {
      return this.isString(e) || this.isNumber(e);
    }
  }, {
    key: "isArray",
    value: function isArray(e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(e) {
      return this.isArray(e) ? 0 === e.length : this.isObject(e) ? !this.isDef(e) : !this.isNumber(e) && (this.isString(e) ? "" === e.trim() : !this.isDef(e));
    }
  }, {
    key: "isNative",
    value: function isNative(e) {
      return "function" == typeof e && /native code/.test(e.toString());
    }
  }, {
    key: "isFunction",
    value: function isFunction(e) {
      return "function" == typeof e;
    }
  }, {
    key: "isBoolean",
    value: function isBoolean(e) {
      return "boolean" == typeof e;
    }
  }, {
    key: "isTrue",
    value: function isTrue(e) {
      return !0 === e;
    }
  }, {
    key: "isFalse",
    value: function isFalse(e) {
      return !1 === e;
    }
  }]);
  return _class3;
}())();
var ts = i.exports;
var ss = /*#__PURE__*/function () {
  function ss() {
    (0, _classCallCheck2.default)(this, ss);
    this.io = ts, this.status = e.DISCONNECTED, this.permissions = [Jt.NONE], this.connectedObservers = [], this.disconnectedObservers = [];
  }
  (0, _createClass2.default)(ss, [{
    key: "connect",
    value: function connect() {
      this.status = e.CONNECTING;
    }
  }, {
    key: "socketio",
    value: function socketio() {
      return this.io;
    }
  }, {
    key: "on",
    value: function on(e, t) {
      this.io.on(e, t);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.io.disconnect();
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "addConnectedObserver",
    value: function addConnectedObserver(e) {
      es.isFunction(e) && this.connectedObservers.push(e);
    }
  }, {
    key: "addDisconnectedObserver",
    value: function addDisconnectedObserver(e) {
      es.isFunction(e) && this.disconnectedObservers.push(e);
    }
  }, {
    key: "notify",
    value: function notify(e, t) {
      for (var _s5 = 0; _s5 < e.length; _s5++) {
        e[_s5](t);
      }
    }
  }]);
  return ss;
}();
var ns = /*#__PURE__*/function (_ss) {
  (0, _inherits2.default)(ns, _ss);
  var _super7 = _createSuper(ns);
  function ns(e) {
    var _this3;
    (0, _classCallCheck2.default)(this, ns);
    _this3 = _super7.call(this), _this3.reconnectingObservers = [], _this3.addReconnectingObserver(e.onReconnecting), _this3.addDisconnectedObserver(e.onDisconnected);
    return _this3;
  }
  (0, _createClass2.default)(ns, [{
    key: "connect",
    value: function connect(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(ns.prototype), "connect", this).call(this), this.io = this.io.connect(e.uri, e.opts), this.initListener();
    }
  }, {
    key: "initListener",
    value: function initListener() {
      var _this4 = this;
      this.io.on("connect", function () {
        _this4.status = e.CONNECTED, _this4.notify(_this4.connectedObservers);
      }), this.io.on("reconnecting", function (t) {
        _this4.status = e.CONNECTING, _this4.notify(_this4.reconnectingObservers, t);
      }), this.io.on("disconnect", function () {
        _this4.status = e.DISCONNECTED, _this4.notify(_this4.disconnectedObservers);
      }), this.io.on("connect_error", function (e) {});
    }
  }, {
    key: "addReconnectingObserver",
    value: function addReconnectingObserver(e) {
      this.reconnectingObservers.push(e);
    }
  }]);
  return ns;
}(ss);
var is = {
    exports: {}
  },
  os = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
if (os) {
  var rs = new Uint8Array(16);
  is.exports = function () {
    return os(rs), rs;
  };
} else {
  var as = new Array(16);
  is.exports = function () {
    for (var e, t = 0; t < 16; t++) {
      0 == (3 & t) && (e = 4294967296 * Math.random()), as[t] = e >>> ((3 & t) << 3) & 255;
    }
    return as;
  };
}
for (var cs = [], us = 0; us < 256; ++us) {
  cs[us] = (us + 256).toString(16).substr(1);
}
var ls,
  ds,
  hs = function hs(e, t) {
    var s = t || 0,
      n = cs;
    return [n[e[s++]], n[e[s++]], n[e[s++]], n[e[s++]], "-", n[e[s++]], n[e[s++]], "-", n[e[s++]], n[e[s++]], "-", n[e[s++]], n[e[s++]], "-", n[e[s++]], n[e[s++]], n[e[s++]], n[e[s++]], n[e[s++]], n[e[s++]]].join("");
  },
  ps = is.exports,
  ms = hs,
  fs = 0,
  gs = 0;
var ys = function ys(e, t, s) {
    var n = t && s || 0,
      i = t || [],
      o = (e = e || {}).node || ls,
      r = void 0 !== e.clockseq ? e.clockseq : ds;
    if (null == o || null == r) {
      var a = ps();
      null == o && (o = ls = [1 | a[0], a[1], a[2], a[3], a[4], a[5]]), null == r && (r = ds = 16383 & (a[6] << 8 | a[7]));
    }
    var c = void 0 !== e.msecs ? e.msecs : new Date().getTime(),
      u = void 0 !== e.nsecs ? e.nsecs : gs + 1,
      l = c - fs + (u - gs) / 1e4;
    if (l < 0 && void 0 === e.clockseq && (r = r + 1 & 16383), (l < 0 || c > fs) && void 0 === e.nsecs && (u = 0), u >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    fs = c, gs = u, ds = r;
    var d = (1e4 * (268435455 & (c += 122192928e5)) + u) % 4294967296;
    i[n++] = d >>> 24 & 255, i[n++] = d >>> 16 & 255, i[n++] = d >>> 8 & 255, i[n++] = 255 & d;
    var h = c / 4294967296 * 1e4 & 268435455;
    i[n++] = h >>> 8 & 255, i[n++] = 255 & h, i[n++] = h >>> 24 & 15 | 16, i[n++] = h >>> 16 & 255, i[n++] = r >>> 8 | 128, i[n++] = 255 & r;
    for (var p = 0; p < 6; ++p) {
      i[n + p] = o[p];
    }
    return t || ms(i);
  },
  vs = is.exports,
  Es = hs;
var Cs = function Cs(e, t, s) {
    var n = t && s || 0;
    "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null);
    var i = (e = e || {}).random || (e.rng || vs)();
    if (i[6] = 15 & i[6] | 64, i[8] = 63 & i[8] | 128, t) for (var o = 0; o < 16; ++o) {
      t[n + o] = i[o];
    }
    return t || Es(i);
  },
  Ss = ys,
  bs = Cs,
  ws = bs;
ws.v1 = Ss, ws.v4 = bs;
var Is = ws;
var Ms = /*#__PURE__*/function () {
  function Ms() {
    (0, _classCallCheck2.default)(this, Ms);
  }
  (0, _createClass2.default)(Ms, null, [{
    key: "get",
    value: function get() {
      return Is.v1().replace(/-/g, "");
    }
  }]);
  return Ms;
}();
var As = /*#__PURE__*/function () {
  function As(e) {
    var _this5 = this;
    (0, _classCallCheck2.default)(this, As);
    this.permission = Jt.NONE, this.singleTimeout = 0, this.totalTimeout = 0, this.startTime = 0, this.complete = !1, this.retried = 0, this.unique = !1, this.uuid = Ms.get(), this.name = e.name, this.params = e.params, this.permission = e.permission, this.totalTimeout = e.totalTimeout, this.singleTimeout = e.singleTimeout, e.unique && (this.unique = e.unique), this.success = function (t) {
      _this5.complete || (_this5.end(), e.success(t));
    }, this.fail = function (t) {
      _this5.complete || (_this5.end(), e.fail(t));
    };
  }
  (0, _createClass2.default)(As, [{
    key: "start",
    value: function start() {
      this.startTime = Date.now(), this.initAutoTimeout();
    }
  }, {
    key: "end",
    value: function end() {
      this.complete = !0, clearTimeout(this.timeoutHandler);
    }
  }, {
    key: "initAutoTimeout",
    value: function initAutoTimeout() {
      var _this6 = this;
      this.timeoutHandler = setTimeout(function () {
        _this6.complete || _this6.fail({
          resultCode: 408,
          content: "Host unreachable or timeout"
        });
      }, this.totalTimeout);
    }
  }]);
  return As;
}();
function Ts() {}
var Ns = /*#__PURE__*/function () {
  function Ns(e) {
    (0, _classCallCheck2.default)(this, Ns);
    this.callback = Ts, this.guidList = [], this.callback = e;
  }
  (0, _createClass2.default)(Ns, [{
    key: "onMessage",
    value: function onMessage(e, t) {
      if ("string" == typeof t && (t = JSON.parse(t)), t.i) {
        if (this.guidList.findIndex(function (e) {
          return e === t.i;
        }) > -1) return;
        this.guidList.unshift(t.i), this.guidList.length > 300 && this.guidList.pop();
      }
      this.callback(t);
    }
  }]);
  return Ns;
}();
var Rs, Os;
!function (e) {
  e[e.connect = 1500] = "connect", e[e.reconnectionDelayMax = 3e3] = "reconnectionDelayMax", e[e.commonQuerySingle = 2500] = "commonQuerySingle", e[e.commonQueryTotal = 12e3] = "commonQueryTotal", e[e.commonRequestSingle = 1700] = "commonRequestSingle", e[e.commonRequestTotal = 12e3] = "commonRequestTotal", e[e.commonInfiniteSingle = 1700] = "commonInfiniteSingle", e[e.commonInfiniteTotal = 864e5] = "commonInfiniteTotal";
}(Rs || (Rs = {})), function (e) {
  e.authorize = "authorize", e.manualDisconnect = "manualDisconnect", e.subscribe = "subscribe", e.unsubscribe = "unsubscribe", e.publish = "publish", e.ack = "ack", e.historyMessages = "historyMessages", e.hereNow = "hereNow", e.hereNowByUserIds = "hereNowByUserIds", e.imLastConversations = "imLastConversations", e.markPrivateMessageAsRead = "markPrivateMessageAsRead", e.markGroupMessageAsRead = "markGroupMessageAsRead", e.imGroupOnlineCount = "imGroupOnlineCount", e.imHereNow = "imHereNow", e.imGroupHereNow = "imGroupHereNow", e.publishIM = "publishIM", e.subscribeUserPresence = "subscribeUserPresence", e.unsubscribeUserPresence = "unsubscribeUserPresence", e.subscribeGroupPresence = "subscribeGroupPresence", e.unsubscribeGroupPresence = "unsubscribeGroupPresence", e.removeConversation = "removeConversation", e.topConversation = "topConversation", e.imData = "imData", e.subscribeGroups = "subscribeGroups", e.unsubscribeGroup = "unsubscribeGroup", e.IM_DELETE_MESSAGE = "IM_DELETE_MESSAGE", e.IM_HISTORY = "IM_HISTORY", e.IM_HISTORY_CHANGE = "IM_HISTORY_CHANGE", e.IM_RECALL_MESSAGE = "IM_RECALL_MESSAGE", e.IM_MARK_AS_READ = "IM_MARK_AS_READ", e.RTC_ASK_NEW_TOKEN = "RTC_ASK_NEW_TOKEN", e.RTC_DIAL = "RTC_DIAL", e.RTC_ACCEPT = "RTC_ACCEPT", e.RTC_ACCEPT_FAILED = "RTC_ACCEPT_FAILED", e.RTC_MANUAL_END = "RTC_MANUAL_END", e.RTC_CLIENT_BUSY = "RTC_CLIENT_BUSY", e.RTC_TIMEOUT = "RTC_TIMEOUT", e.RTC_CALL_DATA = "RTC_CALL_DATA", e.CS_PENDING_CONVERSATION = "CS_PENDING_CONVERSATION", e.CS_ACCEPT = "CS_ACCEPT", e.CS_END = "CS_END", e.CS_TRANSFER = "CS_TRANSFER", e.CS_AGENTS = "CS_AGENTS", e.CS_CUSTOMER_STATUS = "CS_CUSTOMER_STATUS", e.CS_MY_TEAMS = "CS_MY_TEAMS", e.CS_ONLINE = "CS_ONLINE", e.CS_OFFLINE = "CS_OFFLINE", e.CS_LIVE_SESSION = "CS_LIVE_SESSION", e.CS_QUIT_LIVE = "CS_QUIT_LIVE";
}(Os || (Os = {}));
var _s = /*#__PURE__*/function () {
  function _s(e) {
    (0, _classCallCheck2.default)(this, _s);
    this.uniappPlugin = null, this.regIdPromise = null, this.onClickNotificationCallback = null, this.payloadAssemblers = new Array(), this.allowNotification = e, this.supportNotification() && (this.uniappPlugin = uni.requireNativePlugin("GoEasy-Uniapp"), this.uniappPlugin ? this.regIdPromise = this.askRegId() : console.warn("No GoEasy-Uniapp Native Plugin."));
  }
  (0, _createClass2.default)(_s, [{
    key: "addAssembler",
    value: function addAssembler(e) {
      this.payloadAssemblers.push(e);
    }
  }, {
    key: "assemblePayload",
    value: function assemblePayload(e) {
      var t = this.payloadAssemblers.find(function (t) {
        return t.support(e);
      });
      return t ? t.assemble(e) : e;
    }
  }, {
    key: "createLocalNotification",
    value: function createLocalNotification(e, t, s) {
      Ut.runningBackend() && (s.g = 1, "undefined" != typeof plus && plus.push.createMessage(t, JSON.stringify(s), {
        title: e
      }));
    }
  }, {
    key: "askRegId",
    value: function askRegId() {
      var _this7 = this;
      var e = null,
        t = 0;
      var s = function s() {
        return new Promise(function (n, i) {
          _this7.uniappPlugin.regId(function (e) {
            n(e);
          }, function (n) {
            if (!(1e6 === n.data.code && t <= 10)) return clearTimeout(e), i(n);
            e = setTimeout(function () {
              t++, _this7.regIdPromise = s();
            }, 3500);
          });
        });
      };
      return s();
    }
  }, {
    key: "getRegIdPromise",
    value: function getRegIdPromise() {
      return this.regIdPromise;
    }
  }, {
    key: "supportNotification",
    value: function supportNotification() {
      var e = It.currentPlatform(),
        t = Mt.currentFramework();
      return this.allowNotification && t === Ct.UNIAPP && (e === Et.APP_ANDROID || e === Et.APP_IOS);
    }
  }, {
    key: "listenPlusClickNotification",
    value: function listenPlusClickNotification() {
      var _this8 = this;
      plus.push.addEventListener("click", function (e) {
        try {
          if (e) {
            var _t4 = "string" == typeof e.payload ? JSON.parse(e.payload) : e.payload;
            if (_this8.availableIntent(_t4)) {
              var _e4 = _this8.assemblePayload(_t4);
              plus.push.clear(), _this8.onClickNotificationCallback(_e4);
            }
          }
        } catch (e) {}
      });
    }
  }, {
    key: "availableIntent",
    value: function availableIntent(e) {
      return e && Object.keys(e).length && e.g && 1 === parseInt(e.g);
    }
  }, {
    key: "getIntentData",
    value: function getIntentData() {
      var _this9 = this;
      this.uniappPlugin.getIntentData(function (e) {
        if (!_this9.availableIntent(e)) return;
        var t = _this9.assemblePayload(e);
        var s = It.currentPlatform();
        plus.push.clear(), s === Et.APP_ANDROID && _this9.uniappPlugin.clearAll(), _this9.onClickNotificationCallback(t);
      });
    }
  }, {
    key: "listenClick",
    value: function listenClick() {
      this.listenPlusClickNotification();
      var e = It.currentPlatform();
      this.uniappPlugin && e === Et.APP_ANDROID && this.getIntentData();
    }
  }, {
    key: "onClickNotification",
    value: function onClickNotification(e) {
      if (this.supportNotification()) {
        if (!es.isFunction(e)) throw new Error("The arguments must be a function.");
        null === this.onClickNotificationCallback ? (this.onClickNotificationCallback = e, this.listenClick()) : console.warn("The onClickNotification event has been listened on. Please do not listen to it more than once.");
      } else console.warn("The current environment doesn't support or allowNotification is false.");
    }
  }], [{
    key: "init",
    value: function init(e) {
      this.instance = new _s(e);
    }
  }]);
  return _s;
}();
var Ps = S.exports;
var ks = /*#__PURE__*/function () {
  function ks() {
    (0, _classCallCheck2.default)(this, ks);
    this.emitter = new Ps();
  }
  (0, _createClass2.default)(ks, [{
    key: "on",
    value: function on(e, t) {
      return this.emitter.on(e, t), this;
    }
  }, {
    key: "once",
    value: function once(e, t) {
      return this.emitter.once(e, t), this;
    }
  }, {
    key: "off",
    value: function off(e, t) {
      return this.emitter.off(e, t), this;
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      return this.emitter.emit(e, t), this;
    }
  }]);
  return ks;
}();
var Ds = /*#__PURE__*/function () {
  function Ds() {
    (0, _classCallCheck2.default)(this, Ds);
  }
  (0, _createClass2.default)(Ds, null, [{
    key: "initial",
    value: function initial() {
      this.eventDriver = new ks();
    }
  }, {
    key: "on",
    value: function on(e, t) {
      this.eventDriver.on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      this.eventDriver.off(e, t);
    }
  }, {
    key: "once",
    value: function once(e, t) {
      this.eventDriver.once(e, t);
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      this.eventDriver.fire(e, t);
    }
  }]);
  return Ds;
}();
var xs;
!function (e) {
  e.MANUAL_DISCONNECTED = "MANUAL_DISCONNECTED";
}(xs || (xs = {}));
var Fs = /*#__PURE__*/function () {
  function Fs() {
    (0, _classCallCheck2.default)(this, Fs);
  }
  (0, _createClass2.default)(Fs, null, [{
    key: "get",
    value: function get() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var e, t;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                t = Dt.localStorage();
                _context3.t0 = null !== t;
                if (!_context3.t0) {
                  _context3.next = 6;
                  break;
                }
                _context3.next = 5;
                return t.asyncGet(Fs.SM_KEY);
              case 5:
                e = _context3.sent;
              case 6:
                return _context3.abrupt("return", e);
              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
    }
  }, {
    key: "put",
    value: function put(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var t, s;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                t = Dt.localStorage();
                s = e.sm;
                null !== t && s && t.asyncPut(Fs.SM_KEY, s);
              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
    }
  }]);
  return Fs;
}();
Fs.SM_KEY = "GE-SM";
var Us = /*#__PURE__*/function () {
  function Us() {
    (0, _classCallCheck2.default)(this, Us);
  }
  (0, _createClass2.default)(Us, null, [{
    key: "e",
    value: function e(_e5, t) {
      function s(e) {
        return function (e) {
          return e >= 32 && e <= 126;
        }(e) ? String.fromCharCode(function (e) {
          var s = e + t;
          return s > 126 ? s - 126 + 32 : s;
        }(e)) : String.fromCharCode(e);
      }
      var n = "";
      for (var _t5 = 0; _t5 < _e5.length; _t5++) {
        n += s(_e5.charCodeAt(_t5));
      }
      return n;
    }
  }]);
  return Us;
}();
var Ls = /*#__PURE__*/function () {
  function Ls() {
    (0, _classCallCheck2.default)(this, Ls);
  }
  (0, _createClass2.default)(Ls, null, [{
    key: "initRNUniqueId",
    value: function initRNUniqueId() {
      if (Mt.currentFramework() === Ct.REACT_NATIVE) {
        var _e6 = At.platform,
          _t6 = _e6.constants,
          _s6 = {
            os: _e6.OS
          };
        return "android" === _s6.os ? _s6.f = _t6.Fingerprint : _s6.v = _e6.Version, JSON.stringify(_s6);
      }
      return null;
    }
  }, {
    key: "initPlusDeviceId",
    value: function initPlusDeviceId() {
      return new Promise(function (e, t) {
        "undefined" != typeof plus ? plus.device.getInfo({
          success: function success(t) {
            e(t.uuid);
          },
          fail: function fail(e) {
            t(e);
          }
        }) : e(null);
      });
    }
  }, {
    key: "getVideoCard",
    value: function getVideoCard() {
      var e;
      if (It.currentPlatform() === Et.BROWSER && "undefined" != typeof document) {
        var _t7 = document.createElement("canvas"),
          _s7 = null !== (e = _t7.getContext("webgl")) && void 0 !== e ? e : _t7.getContext("experimental-webgl");
        if (_s7 && "getExtension" in _s7) {
          var _e7 = 0,
            _t8 = 0;
          if (navigator.userAgent.indexOf("Firefox") > -1) _t8 = _s7.VENDOR, _e7 = _s7.RENDERER;else {
            var _n3 = _s7.getExtension("WEBGL_debug_renderer_info");
            if (!_n3) return null;
            _t8 = _n3.UNMASKED_VENDOR_WEBGL, _e7 = _n3.UNMASKED_RENDERER_WEBGL;
          }
          var _n2 = {
            vendor: (_s7.getParameter(_t8) || "").toString(),
            renderer: (_s7.getParameter(_e7) || "").toString()
          };
          return JSON.stringify(_n2);
        }
      }
      return null;
    }
  }, {
    key: "z",
    value: function z() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var e;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.t0 = It.currentPlatform();
                _context5.t1 = Mt.currentFramework();
                _context5.next = 4;
                return this.initPlusDeviceId();
              case 4:
                _context5.t2 = _context5.sent;
                _context5.t3 = this.getVideoCard();
                _context5.t4 = this.initRNUniqueId();
                e = {
                  p: _context5.t0,
                  f: _context5.t1,
                  pdi: _context5.t2,
                  vc: _context5.t3,
                  rfp: _context5.t4
                };
                return _context5.abrupt("return", Us.e(JSON.stringify(e), 5));
              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
    }
  }]);
  return Ls;
}();
var Gs = /*#__PURE__*/function () {
  function Gs(e) {
    (0, _classCallCheck2.default)(this, Gs);
    this.rocketsBuffer = new Set(), this.socket = e, this.socket.addConnectedObserver(this.onSocketConnected.bind(this));
  }
  (0, _createClass2.default)(Gs, [{
    key: "emit",
    value: function emit(t) {
      JSON.stringify(t), this.socket.status !== e.DISCONNECTED ? (t.start(), this.doEmit(t)) : t.fail({
        resultCode: "409",
        content: "Please connect first"
      });
    }
  }, {
    key: "doEmit",
    value: function doEmit(t) {
      var _this10 = this;
      if (!t.complete) if (this.socket.status !== e.CONNECT_FAILED) {
        if (this.socket.status, this.isConnected()) {
          if (this.hasPermission(t)) {
            var _e8 = setTimeout(function () {
              _this10.doEmit(t);
            }, t.singleTimeout);
            t.unique && (t.params.retried = t.retried), this.socket.socketio().emit(t.name, t.params, function (s) {
              clearTimeout(_e8), 200 === s.resultCode || 200 == s.code ? t.success(s) : t.fail(s);
            }), t.retried++;
          } else t.fail({
            resultCode: 401,
            content: "No permission"
          });
        } else this.isConnecting() && (this.rocketsBuffer.add(t), JSON.stringify(t));
      } else t.fail({
        resultCode: 408,
        content: "Failed to connect GoEasy."
      });
    }
  }, {
    key: "hasPermission",
    value: function hasPermission(e) {
      return !!this.socket.permissions.find(function (t) {
        return t === e.permission;
      });
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return [e.CONNECTED, e.RECONNECTED, e.EXPIRED_RECONNECTED].includes(this.socket.status);
    }
  }, {
    key: "isConnecting",
    value: function isConnecting() {
      return [e.CONNECTING, e.RECONNECTING].includes(this.socket.status);
    }
  }, {
    key: "onSocketConnected",
    value: function onSocketConnected() {
      this.emitBuffer();
    }
  }, {
    key: "emitBuffer",
    value: function emitBuffer() {
      var _this11 = this;
      this.rocketsBuffer.size, Array.from(this.rocketsBuffer).forEach(function (e) {
        _this11.rocketsBuffer.delete(e), _this11.doEmit(e);
      }), this.rocketsBuffer.size;
    }
  }]);
  return Gs;
}();
var qs = "IM",
  Bs = "PUBSUB";
var js = /*#__PURE__*/function () {
  function js() {
    (0, _classCallCheck2.default)(this, js);
  }
  (0, _createClass2.default)(js, null, [{
    key: "i",
    value: function i(e) {
      this.socket = e, this.emitter = new Gs(e);
    }
  }, {
    key: "s",
    value: function s() {
      if (this.socket) return this.socket;
      throw new Error("Please connect first.");
    }
  }, {
    key: "e",
    value: function e(_e9) {
      this.emitter.emit(_e9);
    }
  }, {
    key: "u",
    value: function u() {
      return this.s().userId;
    }
  }, {
    key: "ud",
    value: function ud() {
      return this.s().connectOptions.data;
    }
  }, {
    key: "supportIM",
    value: function supportIM() {
      return this.s().options.modules.includes(qs);
    }
  }]);
  return js;
}();
var Vs = /*#__PURE__*/function (_ss2) {
  (0, _inherits2.default)(Vs, _ss2);
  var _super8 = _createSuper(Vs);
  function Vs(e, t) {
    var _this12;
    (0, _classCallCheck2.default)(this, Vs);
    _this12 = _super8.call(this), _this12.ioSocket = null, _this12.sid = null, _this12.anonymous = !1, _this12.userId = null, _this12.artifactVersion = yo.version, _this12.uri = null, _this12.ioOpts = null, _this12.reconnectingTimes = 0, _this12.messageObservers = {}, _this12.connectFailedObservers = [], _this12.connectingObservers = [], _this12.expiredReconnectedObservers = [], _this12.options = e, _this12.connectOptions = t, _this12.ioSocket = new ns({
      onDisconnected: _this12.onIoDisconnected.bind((0, _assertThisInitialized2.default)(_this12)),
      onReconnecting: _this12.onIoReconnecting.bind((0, _assertThisInitialized2.default)(_this12))
    }), _this12.ioSocketEmitter = new Gs(_this12.ioSocket), _this12.ioSocket.addConnectedObserver(_this12.onIoReconnected.bind((0, _assertThisInitialized2.default)(_this12))), _this12.initUserId(), _this12.addConnectedObserver(t.onSuccess), _this12.addConnectFailedObserver(t.onFailed), _this12.addConnectingObserver(t.onProgress);
    return _this12;
  }
  (0, _createClass2.default)(Vs, [{
    key: "initUserId",
    value: function initUserId() {
      var e = this.connectOptions.id;
      es.isEmpty(e) ? this.anonymous = !0 : this.userId = e.toString();
    }
  }, {
    key: "socketio",
    value: function socketio() {
      return this.ioSocket.socketio();
    }
  }, {
    key: "extendOptions",
    value: function extendOptions() {
      var e = this.connectOptions;
      if (es.isDef(e.data) && !es.isObject(e.data)) throw {
        code: 400,
        content: "TypeError: data requires an object."
      };
      if ((es.isDef(e.data) ? String(e.data).length : 0) > 300 && es.isObject(e) && es.isFunction(e.onFailed)) throw {
        code: 400,
        content: "user.data-length limit 300 byte."
      };
      if (es.isObject(e.wxmpId)) {
        if (es.isEmpty(e.wxmpId.appid)) throw {
          code: 400,
          content: "wxmpId.appid is required."
        };
        if (es.isEmpty(e.wxmpId.openid)) throw {
          code: 400,
          content: "wxmpId.openid is required. requires string."
        };
      } else if (es.isPrimitive(e.wxmpId)) throw {
        code: 400,
        content: "TypeError: wxmpId requires an object."
      };
    }
  }, {
    key: "initUriAndOpts",
    value: function initUriAndOpts() {
      var e = this.options,
        t = !0;
      if (xt.support()) {
        var _s8,
          _n4 = "://" + xt.i() + e.host;
        !0 === e.supportOldBrowser ? (_s8 = ["polling", "websocket"], t = !1) : _s8 = ["websocket"], !1 !== e.forceTLS && t ? this.uri = "https" + _n4 + ":443" : this.uri = "http" + _n4 + ":80", this.ioOpts = {
          transports: _s8,
          timeout: Rs.connect
        };
      } else this.uri = "https://wx-" + e.host + ":443", this.ioOpts = {
        transports: ["websocket"],
        reconnectionDelayMax: Rs.reconnectionDelayMax
      };
    }
  }, {
    key: "onIoReconnected",
    value: function onIoReconnected() {
      this.status === e.RECONNECTING && this.authorize();
    }
  }, {
    key: "emit",
    value: function emit(e) {
      js.e(e);
    }
  }, {
    key: "sendAck",
    value: function sendAck(e, t) {
      this.ioSocket.io.emit(e, t);
    }
  }, {
    key: "connect",
    value: function connect() {
      this.initUriAndOpts(), this.extendOptions(), (0, _get2.default)((0, _getPrototypeOf2.default)(Vs.prototype), "connect", this).call(this), this.onConnecting(), this.ioSocket.connect({
        uri: this.uri,
        opts: this.ioOpts
      }), this.authorize();
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this13 = this;
      return new Promise(function (t, s) {
        var n = function n() {
          _this13.status = e.DISCONNECTED, _this13.ioSocket.disconnect(), Ds.fire(xs.MANUAL_DISCONNECTED), t();
        };
        if (_this13.options.allowNotification) {
          var _e10 = function _e10(e) {
              s(e);
            },
            _t9 = new As({
              name: Os.manualDisconnect,
              params: {},
              permission: Jt.READ,
              singleTimeout: Rs.commonRequestSingle,
              totalTimeout: Rs.commonRequestTotal,
              fail: _e10,
              success: n
            });
          js.e(_t9);
        } else n();
      });
    }
  }, {
    key: "initRegId",
    value: function initRegId() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var e;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                e = _s.instance;
                if (!(e && e.supportNotification() && e.getRegIdPromise())) {
                  _context6.next = 12;
                  break;
                }
                _context6.prev = 2;
                _context6.next = 5;
                return e.getRegIdPromise();
              case 5:
                this.regId = _context6.sent;
                this.regId;
                _context6.next = 12;
                break;
              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6["catch"](2);
                console.warn("Failed to register the Manufacturers Push service:" + JSON.stringify(_context6.t0));
              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 9]]);
      }));
    }
  }, {
    key: "authorize",
    value: function authorize() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var _this14 = this;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.initRegId().then(function () {
                  return t(_this14, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee7() {
                    var _this15 = this;
                    var e, t, s;
                    return _regenerator.default.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            e = this.connectOptions;
                            _context7.t0 = this.options.appkey;
                            _context7.t1 = this.userId;
                            _context7.t2 = JSON.stringify(e.data);
                            _context7.t3 = e.otp;
                            _context7.t4 = this.artifactVersion;
                            _context7.t5 = this.sid;
                            _context7.t6 = this.options.allowNotification;
                            _context7.t7 = this.regId;
                            _context7.t8 = e.wxmpId;
                            _context7.t9 = this.options.modules;
                            _context7.t10 = this.anonymous;
                            _context7.next = 14;
                            return Ls.z();
                          case 14:
                            _context7.t11 = _context7.sent;
                            _context7.next = 17;
                            return Fs.get();
                          case 17:
                            _context7.t12 = _context7.sent;
                            t = {
                              appkey: _context7.t0,
                              userId: _context7.t1,
                              userData: _context7.t2,
                              otp: _context7.t3,
                              artifactVersion: _context7.t4,
                              sid: _context7.t5,
                              allowNT: _context7.t6,
                              regId: _context7.t7,
                              wxmpId: _context7.t8,
                              modules: _context7.t9,
                              a: _context7.t10,
                              z: _context7.t11,
                              sm: _context7.t12
                            };
                            JSON.stringify(t);
                            s = new As({
                              name: Os.authorize,
                              params: t,
                              permission: Jt.NONE,
                              singleTimeout: Rs.commonInfiniteSingle,
                              totalTimeout: Rs.commonInfiniteTotal,
                              success: function success(e) {
                                _this15.onAuthorizeSuccess(e);
                              },
                              fail: function fail(e) {
                                _this15.onAuthorizeFailed(e);
                              }
                            });
                            this.ioSocketEmitter.emit(s);
                          case 22:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7, this);
                  }));
                });
              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));
    }
  }, {
    key: "onConnecting",
    value: function onConnecting() {
      this.notify(this.connectingObservers, this.reconnectingTimes);
    }
  }, {
    key: "onIoReconnecting",
    value: function onIoReconnecting() {
      this.reconnectingTimes++, this.status == e.CONNECTED || this.status == e.EXPIRED_RECONNECTED || this.status == e.RECONNECTING ? this.status = e.RECONNECTING : this.status = e.CONNECTING, this.onConnecting();
    }
  }, {
    key: "onIoDisconnected",
    value: function onIoDisconnected() {
      this.status == e.DISCONNECTING && (this.status = e.DISCONNECTED), this.notify(this.disconnectedObservers);
    }
  }, {
    key: "onAuthorizeSuccess",
    value: function onAuthorizeSuccess(t) {
      if (Fs.put(t), this.status === e.RECONNECTING) {
        this.sid !== t.sid ? (this.status = e.EXPIRED_RECONNECTED, this.notify(this.expiredReconnectedObservers)) : this.status = e.RECONNECTED;
      } else this.status = e.CONNECTED, this.sid = t.sid;
      t.enablePublish && (this.permissions.find(function (e) {
        return e == Jt.WRITE;
      }) || this.permissions.push(Jt.WRITE)), t.enableSubscribe && (this.permissions.find(function (e) {
        return e == Jt.READ;
      }) || this.permissions.push(Jt.READ)), this.reconnectingTimes = 0, this.notify(this.connectedObservers);
    }
  }, {
    key: "onAuthorizeFailed",
    value: function onAuthorizeFailed(t) {
      this.ioSocket.disconnect(), this.status = e.CONNECT_FAILED;
      var s = {
        code: t.resultCode || 408,
        content: t.content || "Host unreachable or timeout"
      };
      this.notify(this.connectFailedObservers, s);
    }
  }, {
    key: "addConnectingObserver",
    value: function addConnectingObserver(e) {
      es.isFunction(e) && this.connectingObservers.push(e);
    }
  }, {
    key: "addConnectFailedObserver",
    value: function addConnectFailedObserver(e) {
      es.isFunction(e) && this.connectFailedObservers.push(e);
    }
  }, {
    key: "addExpiredReconnectedObserver",
    value: function addExpiredReconnectedObserver(e) {
      es.isFunction(e) && this.expiredReconnectedObservers.push(e);
    }
  }, {
    key: "addMessageObserver",
    value: function addMessageObserver(e, t) {
      var _this16 = this;
      this.messageObservers[e] || (this.messageObservers[e] = [], this.ioSocket.io.on(e, function (t) {
        _this16.notifyMessageObservers(e, t);
      })), this.messageObservers[e].push(new Ns(t));
    }
  }, {
    key: "notifyMessageObservers",
    value: function notifyMessageObservers(e, t) {
      var s = this.messageObservers[e];
      for (var _n5 = 0; _n5 < s.length; _n5++) {
        s[_n5].onMessage(e, t);
      }
    }
  }]);
  return Vs;
}(ss);
var Hs = new ( /*#__PURE__*/function () {
  function _class4() {
    (0, _classCallCheck2.default)(this, _class4);
  }
  (0, _createClass2.default)(_class4, [{
    key: "validateId",
    value: function validateId(e, t) {
      if (es.isEmpty(e)) throw {
        code: 400,
        content: " ".concat(t, " is required.")
      };
      if (!es.isStringOrNumber(e)) throw {
        code: 400,
        content: "TypeError: ".concat(t, " require string or number.")
      };
    }
  }, {
    key: "validateIdArray",
    value: function validateIdArray(e, t) {
      if (!Array.isArray(e) || 0 === e.length) throw {
        code: 400,
        content: "TypeError: ".concat(t, " require array.")
      };
      if (e.length > 300) throw {
        code: 400,
        content: "".concat(t, " is over max length 500.")
      };
      for (var _s9 = 0; _s9 < e.length; _s9++) {
        if (!es.isStringOrNumber(e[_s9])) throw {
          code: 400,
          content: "TypeError: ".concat(t, " item require string or number.")
        };
        if (es.isNumber(e[_s9]) && (e[_s9] = e[_s9].toString()), 0 == e[_s9].length) throw {
          code: 400,
          content: "".concat(t, " has empty item.")
        };
      }
      if (Array.from(new Set(e)).length < e.length) throw {
        code: 400,
        content: "Duplicate element in ".concat(t)
      };
    }
  }, {
    key: "validateChannel",
    value: function validateChannel(e, t) {
      this.validateId(e, t);
    }
  }, {
    key: "validateChannelArray",
    value: function validateChannelArray(e, t) {
      this.validateIdArray(e, t);
    }
  }, {
    key: "validateChannelAndChannels",
    value: function validateChannelAndChannels(e, t) {
      var s = !es.isEmpty(e),
        n = !es.isEmpty(t);
      if (!s && !n) throw {
        code: 400,
        content: "channel is required."
      };
      if (s && n) throw {
        code: 400,
        content: "subscribe to either channel or channels, not both."
      };
      s && this.validateId(e, "channel"), n && this.validateIdArray(t, "channels");
    }
  }, {
    key: "validateCallbackOptions",
    value: function validateCallbackOptions(e) {
      if (!es.isObject(e)) throw {
        code: 400,
        content: "bad parameters"
      };
    }
  }, {
    key: "validateNotification",
    value: function validateNotification(e) {
      function t(e, t, s) {
        if (!(es.isString(e[t]) && e[t].length <= s)) throw {
          code: 400,
          content: "notification.".concat(t, " must be a string of no more than ").concat(s, " characters")
        };
      }
      function s(e, t, s) {
        var n = e[t];
        if (es.isObject(n) && es.isDef(n[s])) {
          var _e11 = {
              code: 400,
              content: "notification.vendorOptions.".concat(t, ".").concat(s, " require a ")
            },
            _i4 = n[s];
          if ("vivo" === t && !es.isNumber(_i4)) throw _e11.content += "number.", _e11;
          if ("vivo" !== t && !es.isString(_i4)) throw _e11.content += "string.", _e11;
        }
      }
      if (!es.isObject(e)) throw {
        code: 400,
        content: "TypeError: notification requires an object."
      };
      {
        t(e, "title", 32), t(e, "body", 50);
        var _n6 = e.vendorOptions;
        es.isObject(_n6) && (s(_n6, "huawei", "category"), s(_n6, "xiaomi", "channel_id"), s(_n6, "oppo", "channel_id"), s(_n6, "vivo", "classification"));
      }
    }
  }, {
    key: "validateValIsEmpty",
    value: function validateValIsEmpty(e, t) {
      if (es.isUndef(e) || es.isEmpty(e)) throw {
        code: 400,
        content: "".concat(t, " is empty")
      };
    }
  }, {
    key: "validateWXMPTemplateMsg",
    value: function validateWXMPTemplateMsg(e) {
      if (es.isObject(e)) {
        if (!es.isString(e.template_id)) throw {
          code: 400,
          content: "template_id must be string."
        };
        if (!es.isEmpty(e.url) && !es.isString(e.url)) throw {
          code: 400,
          content: "url must be string"
        };
        if (!(es.isEmpty(e.miniprogram) || es.isString(e.miniprogram.appid) && es.isString(e.miniprogram.pagepath))) throw {
          code: 400,
          content: "miniprogram.appid and miniprogram.pagepath must be strings."
        };
        if (!es.isObject(e.data)) throw {
          code: 400,
          content: "data requires an object."
        };
      } else if (es.isPrimitive(e)) throw {
        code: 400,
        content: "wxmpTemplateMsg must be an object."
      };
    }
  }]);
  return _class4;
}())();
function Ws(e) {
  if (null === e || "object" != (0, _typeof2.default)(e) || "isActiveClone" in e) return e;
  var t = e instanceof Array ? [] : {};
  for (var _s10 in e) {
    "object" == (0, _typeof2.default)(e[_s10]) ? t[_s10] = Ws(e[_s10]) : t[_s10] = e[_s10];
  }
  return t;
}
var zs = /*#__PURE__*/function () {
  function zs() {
    (0, _classCallCheck2.default)(this, zs);
  }
  (0, _createClass2.default)(zs, [{
    key: "publish",
    value: function publish(e) {
      es.isFunction(e.onFailed) || (e.onFailed = Ts), es.isFunction(e.onSuccess) || (e.onSuccess = Ts), this.validate(e), e.channel = e.channel.toString();
      var t = {
        channel: e.channel,
        content: e.message,
        nt: e.notification,
        at: e.accessToken,
        guid: Ms.get(),
        q: e.qos
      };
      e.wxmpTemplateMsg && (t.wxmpTemplateMsg = Ws(e.wxmpTemplateMsg), t.wxmpTemplateMsg.data = JSON.stringify(t.wxmpTemplateMsg.data));
      var s = new As({
        name: Os.publish,
        params: t,
        unique: !0,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        permission: Jt.WRITE,
        success: function success(t) {
          e.onSuccess({
            code: 200,
            content: "ok"
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode,
            content: t.content
          });
        }
      });
      js.s().emit(s);
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (Hs.validateChannel(e.channel, "channel"), es.isEmpty(e.message)) throw {
        code: 400,
        content: "message is required."
      };
      if (!es.isString(e.message)) throw {
        code: 400,
        content: "TypeError: message requires string."
      };
      if (e.message.length > 1e4) throw {
        code: 400,
        content: "Message over max length 10000."
      };
      if (e.qos && !(e.qos in [0, 1])) throw {
        code: 400,
        content: "Qos must be 0 or 1."
      };
      e.wxmpTemplateMsg && Hs.validateWXMPTemplateMsg(e.wxmpTemplateMsg), es.isDef(e.notification) && Hs.validateNotification(e.notification);
    }
  }]);
  return zs;
}();
var Xs = /*#__PURE__*/function () {
  function Xs(e) {
    (0, _classCallCheck2.default)(this, Xs);
    this.channels = e.channels, this.accessToken = e.accessToken, this.onSuccess = e.onSuccess, this.onFailed = e.onFailed, this.onMessage = e.onMessage;
  }
  (0, _createClass2.default)(Xs, [{
    key: "empty",
    value: function empty() {}
  }]);
  return Xs;
}();
var Js, Ks, Qs;
!function (e) {
  e.message = "message", e.imMessage = "imMessage", e.userPresence = "userPresence", e.groupPresence = "groupPresence", e.IM_MSG_READ = "IM_MSG_READ", e.IM_MSG_DELETED = "IM_MSG_DELETED", e.IM_MSG_RECALLED = "IM_MSG_RECALLED", e.RTC_RING_EVENT = "RTC_RING_EVENT", e.RTC_CANCEL_RING = "RTC_CANCEL_RING", e.RTC_REMOTE_USER_LEFT = "RTC_REMOTE_USER_LEFT", e.RTC_CALL_END = "RTC_CALL_END", e.CS_ONLINE_CHANGED = "CS_ONLINE_CHANGED";
}(Js || (Js = {}));
var Ys = /*#__PURE__*/function () {
  function Ys() {
    (0, _classCallCheck2.default)(this, Ys);
    this.subscriptions = [], _s.instance.addAssembler(new ( /*#__PURE__*/function () {
      function _class5() {
        (0, _classCallCheck2.default)(this, _class5);
      }
      (0, _createClass2.default)(_class5, [{
        key: "assemble",
        value: function assemble(e) {
          return {
            channel: e.ch,
            content: e.ctt
          };
        }
      }, {
        key: "support",
        value: function support(e) {
          return !!e.ch;
        }
      }]);
      return _class5;
    }())());
  }
  (0, _createClass2.default)(Ys, [{
    key: "initialGoEasySocket",
    value: function initialGoEasySocket() {
      js.s().addMessageObserver(Js.message, this.onNewMessage.bind(this)), js.s().addExpiredReconnectedObserver(this.onExpiredReconnected.bind(this));
    }
  }, {
    key: "resubscribe",
    value: function resubscribe() {
      var e = this.subscriptions.slice(0);
      this.subscriptions = [];
      for (var _t10 = 0; _t10 < e.length; _t10++) {
        0 != e[_t10].channels.length && this.subscribe(e[_t10]);
      }
    }
  }, {
    key: "clearSubscriptions",
    value: function clearSubscriptions() {
      this.subscriptions = [];
    }
  }, {
    key: "onExpiredReconnected",
    value: function onExpiredReconnected() {
      this.resubscribe();
    }
  }, {
    key: "onNewMessage",
    value: function onNewMessage(e) {
      if (e.n.indexOf("_presence") > -1) return;
      e.a && js.s().sendAck("ack", {
        publishGuid: e.i
      });
      var t = {
        time: e.t,
        channel: e.n,
        content: e.c
      };
      this.createNotification(e), this.findSubscriptionByChannel(t.channel).onMessage(t);
    }
  }, {
    key: "createNotification",
    value: function createNotification(e) {
      var t = _s.instance.supportNotification();
      if (!es.isObject(e.nt) || !t) return;
      var s = {
        ch: e.n,
        ctt: e.c
      };
      _s.instance.createLocalNotification(e.nt.t, e.nt.c, s);
    }
  }, {
    key: "formatOptions",
    value: function formatOptions(e) {
      this.formatCallback(e), es.isFunction(e.onMessage) || (e.onMessage = Ts), e.channel && (e.channel = e.channel.toString(), e.channels = [e.channel]), e.channels && (e.channels = e.channels.toString().split(","));
    }
  }, {
    key: "formatCallback",
    value: function formatCallback(e) {
      es.isFunction(e.onSuccess) || (e.onSuccess = Ts), es.isFunction(e.onFailed) || (e.onFailed = Ts);
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      var _this17 = this;
      Hs.validateChannelAndChannels(e.channel, e.channels), this.formatOptions(e);
      var t = new As({
        name: Os.subscribe,
        permission: Jt.READ,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        params: {
          channels: e.channels,
          accessToken: e.accessToken
        },
        success: function success() {
          var t = new Xs({
            channels: e.channels,
            accessToken: e.accessToken,
            onSuccess: e.onSuccess,
            onFailed: e.onFailed,
            onMessage: e.onMessage
          });
          _this17.subscriptions.push(t), e.onSuccess({
            code: 200,
            content: "ok"
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode,
            content: t.content
          });
        }
      });
      js.s().emit(t);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      var _this18 = this;
      if (Hs.validateChannel(e.channel, "channel"), e.channel = e.channel.toString(), !this.findSubscriptionByChannel(e.channel)) return void e.onFailed({
        code: 400,
        content: "channel[" + e.channel + "] is not subscribed"
      });
      var t = new As({
        name: Os.unsubscribe,
        params: {
          channel: e.channel
        },
        permission: Jt.READ,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        success: function success() {
          e.onSuccess({
            code: 200,
            content: "ok"
          }), _this18.removeChannel(e.channel);
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode,
            content: t.content
          });
        }
      });
      js.s().emit(t);
    }
  }, {
    key: "removeChannel",
    value: function removeChannel(e) {
      for (var _t11 = 0; _t11 < this.subscriptions.length; _t11++) {
        var _s11 = this.subscriptions[_t11].channels;
        for (var _n7 = 0; _n7 < _s11.length; _n7++) {
          if (_s11[_n7] == e) {
            this.subscriptions[_t11].channels.splice(_n7, 1);
            break;
          }
        }
      }
    }
  }, {
    key: "findSubscriptionByChannel",
    value: function findSubscriptionByChannel(e) {
      var t = !1,
        s = null;
      for (var _n8 = this.subscriptions.length - 1; _n8 >= 0; _n8--) {
        var _i5 = this.subscriptions[_n8].channels;
        for (var _o = 0; _o < _i5.length; _o++) {
          if (_i5[_o] == e) {
            t = !0, s = this.subscriptions[_n8];
            break;
          }
        }
        if (t) break;
      }
      return s;
    }
  }]);
  return Ys;
}();
var $s = /*#__PURE__*/function () {
  function $s() {
    (0, _classCallCheck2.default)(this, $s);
  }
  (0, _createClass2.default)($s, [{
    key: "get",
    value: function get(e) {
      es.isFunction(e.onSuccess) || (e.onSuccess = Ts), es.isFunction(e.onFailed) || (e.onFailed = Ts), Hs.validateChannel(e.channel, "channel"), e.channel = e.channel.toString();
      var t = new As({
        name: Os.historyMessages,
        permission: Jt.READ,
        params: e,
        singleTimeout: Rs.commonQuerySingle,
        totalTimeout: Rs.commonQueryTotal,
        success: function success(t) {
          e.onSuccess({
            code: t.resultCode || t.code || 200,
            content: t.content
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode || t.code,
            content: t.content
          });
        }
      });
      js.s().emit(t);
    }
  }]);
  return $s;
}();
var Zs = /*#__PURE__*/(0, _createClass2.default)(function Zs(e) {
  (0, _classCallCheck2.default)(this, Zs);
  this.channels = e.channels, this.onSuccess = e.onSuccess, this.onFailed = e.onFailed, this.onPresence = e.onPresence;
});
var en = /*#__PURE__*/function () {
  function en() {
    (0, _classCallCheck2.default)(this, en);
    this.presenters = [];
  }
  (0, _createClass2.default)(en, [{
    key: "initialGoEasySocket",
    value: function initialGoEasySocket() {
      js.s().addMessageObserver(Js.message, this.onNewMessage.bind(this)), js.s().addExpiredReconnectedObserver(this.onExpiredReconnected.bind(this));
    }
  }, {
    key: "resubscribe",
    value: function resubscribe() {
      var e = this.presenters.slice(0);
      this.presenters = [];
      for (var _t12 = 0; _t12 < e.length; _t12++) {
        for (var _s12 = 0; _s12 < e[_t12].channels.length; _s12++) {
          var _n9 = e[_t12].channels[_s12].split("_presence");
          e[_t12].channels[_s12] = _n9[0];
        }
        0 != e[_t12].channels.length && this.subscribePresence(e[_t12]);
      }
    }
  }, {
    key: "onExpiredReconnected",
    value: function onExpiredReconnected() {
      this.resubscribe();
    }
  }, {
    key: "onNewMessage",
    value: function onNewMessage(e) {
      if (-1 == e.n.indexOf("_presence")) return;
      var t = this.findPresenceByChannel(e.n);
      if (t) {
        var _s13 = JSON.parse(e.c);
        _s13.events = _s13.events.map(function (e) {
          var t = e.userData ? JSON.parse(e.userData) : {};
          return {
            time: e.time,
            action: e.action,
            id: e.userId,
            data: t
          };
        }), t.onPresence(_s13);
      }
    }
  }, {
    key: "formatOptions",
    value: function formatOptions(e) {
      this.formatCallback(e), es.isFunction(e.onPresence) || (e.onPresence = Ts), e.channel && (e.channel = e.channel.toString(), e.channels = [e.channel]), e.channels && (e.channels = e.channels.toString().split(","));
    }
  }, {
    key: "formatCallback",
    value: function formatCallback(e) {
      es.isFunction(e.onSuccess) || (e.onSuccess = Ts), es.isFunction(e.onFailed) || (e.onFailed = Ts);
    }
  }, {
    key: "subscribePresence",
    value: function subscribePresence(e) {
      var _this19 = this;
      Hs.validateChannelAndChannels(e.channel, e.channels), this.formatOptions(e), Array.isArray(e.channels) && (e.channels = e.channels.map(function (e) {
        return e += "_presence";
      }));
      var t = new As({
        name: Os.subscribe,
        permission: Jt.READ,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        params: {
          channels: e.channels
        },
        success: function success() {
          var t = new Zs({
            channels: e.channels,
            onSuccess: e.onSuccess,
            onFailed: e.onFailed,
            onPresence: e.onPresence
          });
          _this19.presenters.push(t), e.onSuccess({
            code: 200,
            content: "ok"
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode,
            content: t.content
          });
        }
      });
      js.s().emit(t);
    }
  }, {
    key: "unsubscribePresence",
    value: function unsubscribePresence(e) {
      var _this20 = this;
      if (this.formatCallback(e), !es.isDef(e.channel)) return void e.onFailed({
        code: 400,
        content: "channel is required"
      });
      if (e.channel += "_presence", !this.findPresenceByChannel(e.channel)) return void e.onFailed({
        code: 400,
        content: "channel[" + e.channel + "] is not subscribed"
      });
      var t = new As({
        name: Os.unsubscribe,
        params: {
          channel: e.channel
        },
        permission: Jt.READ,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        success: function success() {
          e.onSuccess({
            code: 200,
            content: "ok"
          }), _this20.removeChannel(e.channel);
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode,
            content: t.content
          });
        }
      });
      js.s().emit(t);
    }
  }, {
    key: "removeChannel",
    value: function removeChannel(e) {
      for (var _t13 = 0; _t13 < this.presenters.length; _t13++) {
        var _s14 = this.presenters[_t13].channels;
        for (var _n10 = 0; _n10 < _s14.length; _n10++) {
          if (_s14[_n10] == e) {
            this.presenters[_t13].channels.splice(_n10, 1);
            break;
          }
        }
      }
    }
  }, {
    key: "findPresenceByChannel",
    value: function findPresenceByChannel(e) {
      var t = !1,
        s = null;
      for (var _n11 = this.presenters.length - 1; _n11 >= 0; _n11--) {
        var _i6 = this.presenters[_n11].channels;
        for (var _o2 = 0; _o2 < _i6.length; _o2++) {
          if (_i6[_o2] == e) {
            t = !0, s = this.presenters[_n11];
            break;
          }
        }
        if (t) break;
      }
      return s;
    }
  }]);
  return en;
}();
var tn = /*#__PURE__*/function () {
  function tn() {
    (0, _classCallCheck2.default)(this, tn);
  }
  (0, _createClass2.default)(tn, [{
    key: "byChannel",
    value: function byChannel(e) {
      var t = {
        channels: [],
        includeUsers: !1,
        distinct: !1
      };
      es.isFunction(e.onSuccess) || (e.onSuccess = Ts), es.isFunction(e.onFailed) || (e.onFailed = Ts), Hs.validateChannelArray(e.channels, "channels"), t.channels = e.channels.toString().split(","), t.includeUsers = e.includeUsers || !1, t.distinct = e.distinct || !1;
      var s = new As({
        name: Os.hereNow,
        permission: Jt.READ,
        params: t,
        singleTimeout: Rs.commonQuerySingle,
        totalTimeout: Rs.commonQueryTotal,
        success: function success(t) {
          var s = t.content,
            n = s.channels;
          for (var _e12 in n) {
            if (n.hasOwnProperty(_e12)) {
              var _t14 = n[_e12];
              _t14.users && (_t14.users = _t14.users.map(function (e) {
                return e.data = e.data ? JSON.parse(e.data) : {}, e;
              }));
            }
          }
          e.onSuccess({
            code: t.resultCode || t.code || 200,
            content: s
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode || t.code || 200,
            content: t.content
          });
        }
      });
      js.s().emit(s);
    }
  }, {
    key: "byUserId",
    value: function byUserId(e) {
      var t = {
        userIds: [],
        distinct: !0
      };
      es.isFunction(e.onSuccess) || (e.onSuccess = Ts), es.isFunction(e.onFailed) || (e.onFailed = Ts), Hs.validateIdArray(e.userIds, "userIds"), t.userIds = e.userIds.toString().split(","), 0 == e.distinct && (t.distinct = !1);
      var s = new As({
        name: Os.hereNowByUserIds,
        permission: Jt.READ,
        params: t,
        singleTimeout: Rs.commonQuerySingle,
        totalTimeout: Rs.commonQueryTotal,
        success: function success(t) {
          var s = t.content;
          s = s.map(function (e) {
            return {
              id: e.userId,
              data: e.userData ? JSON.parse(e.userData) : {}
            };
          }), e.onSuccess({
            code: t.resultCode || t.code || 200,
            content: s
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode || t.code || 200,
            content: t.content
          });
        }
      });
      js.s().emit(s);
    }
  }]);
  return tn;
}();
var sn = /*#__PURE__*/function () {
  function sn() {
    (0, _classCallCheck2.default)(this, sn);
  }
  (0, _createClass2.default)(sn, null, [{
    key: "onSuccess",
    value: function onSuccess(e, t) {
      es.isFunction(e.onSuccess) && e.onSuccess(t);
    }
  }, {
    key: "onFailed",
    value: function onFailed(e, t) {
      if (!es.isObject(e) || !es.isFunction(e.onFailed)) throw t;
      e.onFailed(t);
    }
  }]);
  return sn;
}();
var nn = /*#__PURE__*/function () {
  function nn(e) {
    (0, _classCallCheck2.default)(this, nn);
    this.subscriber = new Ys(), this.options = e;
  }
  (0, _createClass2.default)(nn, [{
    key: "initialGoEasySocket",
    value: function initialGoEasySocket() {
      this.publisher = new zs(), this.histories = new $s(), this.presence = new en(), this.hereNows = new tn(), this.subscriber.initialGoEasySocket(), this.presence.initialGoEasySocket();
    }
  }, {
    key: "initialBeforeConnect",
    value: function initialBeforeConnect() {
      this.subscriber.clearSubscriptions();
    }
  }, {
    key: "catch",
    value: function _catch(e, t) {
      try {
        this.validateOptions(), e();
      } catch (e) {
        sn.onFailed(t, e);
      }
    }
  }, {
    key: "validateOptions",
    value: function validateOptions() {
      if (!js.s() || js.s().getStatus() !== e.CONNECTED) throw Error("Please call connect() first.");
      if (!this.options.modules || !this.options.modules.includes(Bs)) throw {
        code: 400,
        content: "Invalid options: module '".concat(Bs, "' is not enabled")
      };
    }
  }, {
    key: "publish",
    value: function publish(e) {
      var _this21 = this;
      this.catch(function () {
        _this21.publisher.publish(e);
      }, e);
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      var _this22 = this;
      this.catch(function () {
        _this22.subscriber.subscribe(e);
      }, e);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      var _this23 = this;
      this.catch(function () {
        _this23.subscriber.unsubscribe(e);
      }, e);
    }
  }, {
    key: "subscribePresence",
    value: function subscribePresence(e) {
      var _this24 = this;
      this.catch(function () {
        _this24.presence.subscribePresence(e);
      }, e);
    }
  }, {
    key: "unsubscribePresence",
    value: function unsubscribePresence(e) {
      var _this25 = this;
      this.catch(function () {
        _this25.presence.unsubscribePresence(e);
      }, e);
    }
  }, {
    key: "history",
    value: function history(e) {
      var _this26 = this;
      this.catch(function () {
        _this26.histories.get(e);
      }, e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      var _this27 = this;
      this.catch(function () {
        _this27.hereNows.byChannel(e);
      }, e);
    }
  }, {
    key: "hereNowByUserIds",
    value: function hereNowByUserIds(e) {
      var _this28 = this;
      this.catch(function () {
        _this28.hereNows.byUserId(e);
      }, e);
    }
  }], [{
    key: "init",
    value: function init(e) {
      nn.instance = new nn(e);
    }
  }]);
  return nn;
}();
!function (e) {
  e.PRIVATE_MESSAGE_RECEIVED = "PRIVATE_MESSAGE_RECEIVED", e.GROUP_MESSAGE_RECEIVED = "GROUP_MESSAGE_RECEIVED", e.SYSTEM_MESSAGE_RECEIVED = "SYSTEM_MESSAGE_RECEIVED", e.CONVERSATIONS_UPDATED = "CONVERSATIONS_UPDATED", e.USER_PRESENCE = "USER_PRESENCE", e.GROUP_PRESENCE = "GROUP_PRESENCE", e.MESSAGE_DELETED = "MESSAGE_DELETED", e.MESSAGE_READ = "MESSAGE_READ", e.MESSAGE_RECALLED = "MESSAGE_RECALLED", e.CS_MESSAGE_RECEIVED = "CS_MESSAGE_RECEIVED", e.PENDING_CONVERSATIONS_UPDATED = "PENDING_CONVERSATIONS_UPDATED";
}(Ks || (Ks = {})), function (e) {
  e.RING = "RING", e.USER_ACCEPTED = "USER_ACCEPTED", e.CALL_ENDED = "CALL_ENDED", e.USER_QUITED = "USER_QUITED";
}(Qs || (Qs = {}));
var on = S.exports;
var rn = /*#__PURE__*/function () {
  function rn() {
    (0, _classCallCheck2.default)(this, rn);
    this.emitter = new on();
  }
  (0, _createClass2.default)(rn, [{
    key: "on",
    value: function on(e, t) {
      if (!es.isString(e)) throw Error("event require a string.");
      if (!es.isDef(Ks[e]) && !es.isDef(Qs[e])) throw Error("An event that is not defined");
      if (!es.isFunction(t)) throw Error("callback must be a function");
      this.emitter.on(e, t);
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      this.emitter.emit(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      this.emitter.off(e, t);
    }
  }]);
  return rn;
}();
var an = /*#__PURE__*/function () {
  function an() {
    (0, _classCallCheck2.default)(this, an);
  }
  (0, _createClass2.default)(an, [{
    key: "upload",
    value: function upload(e, t) {
      throw Error("Not implementation yet.");
    }
  }]);
  return an;
}();
var cn = new ( /*#__PURE__*/function (_an) {
  (0, _inherits2.default)(_class6, _an);
  var _super9 = _createSuper(_class6);
  function _class6() {
    (0, _classCallCheck2.default)(this, _class6);
    return _super9.call(this);
  }
  (0, _createClass2.default)(_class6, [{
    key: "upload",
    value: function upload(e, t) {
      var _this29 = this;
      try {
        return delete e.parameters.fileRes, new Promise(function (s, n) {
          uni.uploadFile({
            url: e.host,
            filePath: _this29.getTempFilePath(e),
            name: "file",
            formData: e.parameters,
            success: function success(t) {
              if (200 === t.statusCode) {
                var _n12 = e.payload;
                _n12.message = t.errMsg, s({
                  code: 200,
                  content: _n12
                });
              } else n({
                code: t.statusCode,
                content: t.errMsg
              });
            },
            fail: function fail(e) {
              n({
                code: 500,
                content: e.errMsg
              });
            }
          }).onProgressUpdate(function (e) {
            t && t(e);
          });
        });
      } catch (e) {
        return new Promise(function (t, s) {
          s({
            code: 500,
            content: e
          });
        });
      }
    }
  }, {
    key: "getTempFilePath",
    value: function getTempFilePath(e) {
      var t = e.file;
      return t.tempFilePath || t.fullPath || t.path;
    }
  }]);
  return _class6;
}(an))();
var un = new ( /*#__PURE__*/function (_an2) {
  (0, _inherits2.default)(_class7, _an2);
  var _super10 = _createSuper(_class7);
  function _class7() {
    (0, _classCallCheck2.default)(this, _class7);
    return _super10.apply(this, arguments);
  }
  (0, _createClass2.default)(_class7, [{
    key: "upload",
    value: function upload(e, t) {
      var _this30 = this;
      try {
        return new Promise(function (s, n) {
          wx.uploadFile({
            url: e.host,
            filePath: _this30.getTempFilePath(e),
            name: "file",
            formData: e.parameters,
            success: function success(t) {
              if (200 === t.statusCode) {
                var _n13 = e.payload;
                _n13.message = t.errMsg, s({
                  code: 200,
                  content: _n13
                });
              } else n({
                code: t.statusCode,
                content: t.errMsg
              });
            },
            fail: function fail(e) {
              n({
                code: 500,
                content: e.errMsg
              });
            }
          }).onProgressUpdate(function (e) {
            t && t(e);
          });
        });
      } catch (e) {
        return new Promise(function (t, s) {
          s({
            code: 500,
            content: e
          });
        });
      }
    }
  }, {
    key: "getTempFilePath",
    value: function getTempFilePath(e) {
      var t = e.file || e.fileRes;
      return t.path || t.tempFilePath;
    }
  }]);
  return _class7;
}(an))();
var ln = new ( /*#__PURE__*/function (_an3) {
  (0, _inherits2.default)(_class8, _an3);
  var _super11 = _createSuper(_class8);
  function _class8() {
    (0, _classCallCheck2.default)(this, _class8);
    return _super11.call(this);
  }
  (0, _createClass2.default)(_class8, [{
    key: "upload",
    value: function upload(e, t) {
      try {
        return new Promise(function (s, n) {
          var i = new XMLHttpRequest();
          i.open("post", e.host, !0);
          for (var _t15 in e.headers) {
            i.setRequestHeader(_t15, e.headers[_t15]);
          }
          i.upload.onprogress = function (e) {
            t && t(e);
          }, i.upload.onloadstart = function (e) {
            t && t(e);
          }, i.upload.onloadend = function (e) {
            t && t(e);
          };
          var o = new FormData();
          for (var _t16 in e.parameters) {
            "fileRes" == _t16 ? o.append("file", e.parameters[_t16]) : o.append(_t16, e.parameters[_t16]);
          }
          i.send(o), i.onreadystatechange = function () {
            if (4 == i.readyState) if (i.status >= 200 && i.status < 300 || 304 == i.status) {
              var _t17 = e.payload;
              _t17.message = i.responseText, s({
                code: 200,
                content: _t17
              });
            } else n({
              code: i.status,
              content: i.responseText
            });
          };
        });
      } catch (e) {
        return new Promise(function (t, s) {
          s({
            code: 500,
            content: e
          });
        });
      }
    }
  }]);
  return _class8;
}(an))();
var dn = new ( /*#__PURE__*/function () {
  function _class9() {
    var _this$uploader;
    (0, _classCallCheck2.default)(this, _class9);
    this.uploader = (_this$uploader = {}, (0, _defineProperty2.default)(_this$uploader, Ct.UNIAPP, cn), (0, _defineProperty2.default)(_this$uploader, Ct.NATIVE_APPLET_WX, un), (0, _defineProperty2.default)(_this$uploader, Ct.TARO, It.currentPlatform() === Et.APPLET_WX ? un : ln), (0, _defineProperty2.default)(_this$uploader, Ct.UNKNOWN, ln), _this$uploader);
  }
  (0, _createClass2.default)(_class9, [{
    key: "upload",
    value: function upload(e, t) {
      var s = Mt.currentFramework();
      return this.uploader[s].upload(e, t);
    }
  }]);
  return _class9;
}())();
var hn, pn;
!function (e) {
  e.aliYun = "ALI", e.qiNiu = "QN", e.tencent = "TX";
}(hn || (hn = {}));
var mn = /*#__PURE__*/(0, _createClass2.default)(function mn(e, t, s, n, i) {
  (0, _classCallCheck2.default)(this, mn);
  this.host = e, this.headers = t, this.parameters = s, this.file = n, this.payload = i;
});
var fn = /*#__PURE__*/function () {
  function fn() {
    (0, _classCallCheck2.default)(this, fn);
  }
  (0, _createClass2.default)(fn, [{
    key: "build",
    value: function build(e, t, s) {}
  }, {
    key: "newFileName",
    value: function newFileName(e) {
      return e && e.newFilename || "";
    }
  }]);
  return fn;
}();
!function (e) {
  e.TEXT = "text", e.IMAGE = "image", e.FILE = "file", e.VIDEO = "video", e.AUDIO = "audio";
}(pn || (pn = {}));
var gn = new ( /*#__PURE__*/function (_fn) {
  (0, _inherits2.default)(_class10, _fn);
  var _super12 = _createSuper(_class10);
  function _class10() {
    (0, _classCallCheck2.default)(this, _class10);
    return _super12.call(this);
  }
  (0, _createClass2.default)(_class10, [{
    key: "url",
    value: function url(e) {
      return e.host + "/" + e.dir + "/" + this.newFileName(e);
    }
  }, {
    key: "build",
    value: function build(e, t, s) {
      var n;
      n = {
        key: e.dir + "/" + this.newFileName(e),
        OSSAccessKeyId: e.accessKeyId,
        policy: e.policy,
        signature: e.signature,
        success_action_status: "200",
        fileRes: t
      }, pn.FILE === s && (n = {
        key: e.dir + "/" + this.newFileName(e),
        OSSAccessKeyId: e.accessKeyId,
        policy: e.policy,
        signature: e.signature,
        success_action_status: "200",
        "Content-Disposition": "attachment;filename=" + t.name,
        fileRes: t
      });
      var i = {
        newFileName: this.newFileName(e),
        url: this.url(e)
      };
      return new mn(e.host, null, n, t, i);
    }
  }]);
  return _class10;
}(fn))();
var yn = new ( /*#__PURE__*/function (_fn2) {
  (0, _inherits2.default)(_class11, _fn2);
  var _super13 = _createSuper(_class11);
  function _class11() {
    (0, _classCallCheck2.default)(this, _class11);
    return _super13.call(this);
  }
  (0, _createClass2.default)(_class11, [{
    key: "url",
    value: function url(e) {
      return e.downloadUrl;
    }
  }, {
    key: "build",
    value: function build(e, t) {
      var s = {
          key: this.newFileName(e),
          token: e.token,
          file: t
        },
        n = {
          newFileName: this.newFileName(e),
          url: this.url(e)
        };
      return new mn(e.host, null, s, t, n);
    }
  }]);
  return _class11;
}(fn))();
var vn = new ( /*#__PURE__*/function (_fn3) {
  (0, _inherits2.default)(_class12, _fn3);
  var _super14 = _createSuper(_class12);
  function _class12() {
    (0, _classCallCheck2.default)(this, _class12);
    return _super14.call(this);
  }
  (0, _createClass2.default)(_class12, [{
    key: "url",
    value: function url(e) {
      return e.host + "/" + e.key;
    }
  }, {
    key: "build",
    value: function build(e, t, s) {
      var n = {
        "q-sign-algorithm": e.qSignAlgorithm,
        "q-ak": e.qAk,
        "q-key-time": e.qKeyTime,
        "q-signature": e.qSignature,
        policy: e.policy,
        "x-cos-security-token": e.xCosSecurityToken,
        success_action_status: "200",
        key: e.key,
        fileRes: t
      };
      pn.FILE === s && (n = {
        "q-sign-algorithm": e.qSignAlgorithm,
        "q-ak": e.qAk,
        "q-key-time": e.qKeyTime,
        "q-signature": e.qSignature,
        policy: e.policy,
        "x-cos-security-token": e.xCosSecurityToken,
        success_action_status: "200",
        key: e.key,
        "Content-Disposition": "attachment;filename=".concat(t.name),
        fileRes: t
      });
      var i = {
        newFileName: e.key,
        url: this.url(e)
      };
      return new mn(e.host, null, n, t, i);
    }
  }]);
  return _class12;
}(fn))();
var En = /*#__PURE__*/function () {
  function En(e) {
    (0, _classCallCheck2.default)(this, En);
    return e === hn.aliYun ? gn : e === hn.tencent ? vn : yn;
  }
  (0, _createClass2.default)(En, [{
    key: "build",
    value: function build(e, t, s) {}
  }]);
  return En;
}();
var Cn = /*#__PURE__*/function () {
  function Cn() {
    (0, _classCallCheck2.default)(this, Cn);
  }
  (0, _createClass2.default)(Cn, [{
    key: "resolve",
    value: function resolve(e) {
      return new Promise(function (t, s) {
        var n = new As({
          name: "uploadToken",
          params: {
            filename: e
          },
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          fail: function fail(e) {
            s(e);
          },
          success: function success(e) {
            200 === e.code ? t(e) : s(e);
          }
        });
        js.s().emit(n);
      });
    }
  }]);
  return Cn;
}();
var Sn = /*#__PURE__*/function () {
  function Sn() {
    (0, _classCallCheck2.default)(this, Sn);
    this.uploadTokenResolver = new Cn();
  }
  (0, _createClass2.default)(Sn, [{
    key: "build",
    value: function build(e, t, s) {
      var _this31 = this;
      return new Promise(function (n, i) {
        _this31.uploadTokenResolver.resolve(t).then(function (t) {
          var i = t.content;
          n(new En(i.vendor).build(i, e, s));
        }).catch(function (e) {
          i(e);
        });
      });
    }
  }]);
  return Sn;
}();
var bn = /*#__PURE__*/function () {
  function bn() {
    (0, _classCallCheck2.default)(this, bn);
    this.requestBuilder = new Sn(), this.fileUploader = dn;
  }
  (0, _createClass2.default)(bn, [{
    key: "upload",
    value: function upload(e, t, s, n) {
      var _this32 = this;
      return new Promise(function (i, o) {
        _this32.requestBuilder.build(e, t, n).then(function (e) {
          i(_this32.doUpload(e, s));
        }).catch(function (e) {
          o(e);
        });
      });
    }
  }, {
    key: "customizeUpload",
    value: function customizeUpload(e, t) {
      this.doUpload(e, t);
    }
  }, {
    key: "doUpload",
    value: function doUpload(e, t) {
      return this.fileUploader.upload(e, t);
    }
  }]);
  return bn;
}();
var wn = /*#__PURE__*/(0, _createClass2.default)(function wn() {
  (0, _classCallCheck2.default)(this, wn);
});
var In = /*#__PURE__*/function (_wn) {
  (0, _inherits2.default)(In, _wn);
  var _super15 = _createSuper(In);
  function In() {
    var _this33;
    (0, _classCallCheck2.default)(this, In);
    _this33 = _super15.apply(this, arguments), _this33.goEasyUploader = new bn();
    return _this33;
  }
  (0, _createClass2.default)(In, [{
    key: "improve",
    value: function improve(e) {
      var _this34 = this;
      var t = e.message;
      return new Promise(function (e, s) {
        var n,
          i,
          o = t.buildOptions.createOptions;
        t.type === pn.VIDEO ? (i = t.payload, n = i.video.name) : (i = t.payload, n = i.name), _this34.goEasyUploader.upload(o.file, n, o.onProgress, t.type).then(function (s) {
          _this34.setPayload(s, t), e();
        }).catch(function (e) {
          s(e);
        });
      });
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var _e$content = e.content,
        s = _e$content === void 0 ? {} : _e$content;
      t.payload.url = s.url;
    }
  }]);
  return In;
}(wn);
var Mn = /*#__PURE__*/function (_In) {
  (0, _inherits2.default)(Mn, _In);
  var _super16 = _createSuper(Mn);
  function Mn() {
    (0, _classCallCheck2.default)(this, Mn);
    return _super16.apply(this, arguments);
  }
  (0, _createClass2.default)(Mn, [{
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t.payload,
        n = "?x-oss-process=video/snapshot,t_0000,f_jpg,h_" + s.thumbnail.height + ",m_fast,ar_auto";
      s.video.url = e.content.url, s.thumbnail.url = e.content.url + n, s.video.name = e.content.newFileName;
    }
  }]);
  return Mn;
}(In);
var An = /*#__PURE__*/function () {
  function An() {
    var _this$improvers;
    (0, _classCallCheck2.default)(this, An);
    this.improvers = (_this$improvers = {}, (0, _defineProperty2.default)(_this$improvers, pn.FILE, new In()), (0, _defineProperty2.default)(_this$improvers, pn.AUDIO, new In()), (0, _defineProperty2.default)(_this$improvers, pn.IMAGE, new In()), (0, _defineProperty2.default)(_this$improvers, pn.VIDEO, new Mn()), _this$improvers);
  }
  (0, _createClass2.default)(An, [{
    key: "improve",
    value: function improve(e) {
      var t = this.improvers[e.message.type];
      return t ? t.improve(e) : Promise.resolve();
    }
  }]);
  return An;
}();
var Tn = /*#__PURE__*/function () {
  function Tn(e, t, s, n, i) {
    (0, _classCallCheck2.default)(this, Tn);
    this.validate(e), this.mt = e.type, this.to = t.id.toString(), this.d = JSON.stringify(t.data), this.p = JSON.stringify(e.payload), s && (this.nt = s), i && (this.at = i), n && (this.wxmpTemplateMsg = Ws(n), this.wxmpTemplateMsg.data = JSON.stringify(this.wxmpTemplateMsg.data));
    var o = t.type;
    if (this.t = o, o === co.CS) {
      var _t18 = e;
      this.tid = _t18.teamId;
    }
    this.guid = e.messageId;
  }
  (0, _createClass2.default)(Tn, [{
    key: "validate",
    value: function validate(e) {
      if (e.type === pn.TEXT) {
        if (JSON.stringify(e.payload).length > 3072) throw Error("message-length limit 3kb");
      }
    }
  }]);
  return Tn;
}();
var Nn, Rn;
!function (e) {
  e.MESSAGE_SENDING = "IM_INTERNAL_MESSAGE_SENDING", e.MESSAGE_SEND_SUCCESS = "IM_INTERNAL_MESSAGE_SEND_SUCCESS", e.MESSAGE_SEND_FAILED = "IM_INTERNAL_MESSAGE_SEND_FAILED", e.MESSAGE_RECEIVED = "IM_INTERNAL_MESSAGE_RECEIVED", e.MAX_MESSAGE_CHANGED = "IM_INTERNAL_MAX_MESSAGE_CHANGED", e.MAX_MESSAGE_DELETED = "IM_INTERNAL_MAX_MESSAGE_DELETED", e.UNREAD_AMOUNT_CHANGED = "IM_INTERNAL_UNREAD_MESSAGE_CHANGED", e.CS_ONLINE_SUCCESS = "CS_ONLINE_SUCCESS", e.CS_OFFLINE_SUCCESS = "CS_OFFLINE_SUCCESS", e.CS_ACCEPTED = "CS_ACCEPTED", e.CS_ENDED = "CS_ENDED", e.CS_TRANSFER = "CS_TRANSFER", e.CS_AGENT_MESSAGE_RECEIVED = "CS_AGENT_MESSAGE_RECEIVED";
}(Nn || (Nn = {}));
var On = /*#__PURE__*/function () {
  function On() {
    (0, _classCallCheck2.default)(this, On);
  }
  (0, _createClass2.default)(On, [{
    key: "clearUseLessAttribute",
    value: function clearUseLessAttribute() {
      delete this.buildOptions;
    }
  }, {
    key: "isOtherSent",
    value: function isOtherSent() {
      return this.senderId !== js.u();
    }
  }, {
    key: "getToData",
    value: function getToData() {
      return this.buildOptions.createOptions.to.data;
    }
  }]);
  return On;
}();
var _n = /*#__PURE__*/function () {
  function _n() {
    (0, _classCallCheck2.default)(this, _n);
    this.payloadImprover = new An();
  }
  (0, _createClass2.default)(_n, [{
    key: "send",
    value: function send(e) {
      var _this35 = this;
      this.validate(e);
      var t = e.message,
        s = e.accessToken,
        n = t.buildOptions,
        i = n.createOptions,
        o = i.notification,
        r = i.wxmpTemplateMsg,
        a = i.to;
      a.data || (a.data = {}), t.status = uo.SENDING;
      var c = n.complete,
        u = this.payloadImprover.improve(e);
      Promise.all([c, u]).then(function () {
        _this35.doSend(t, a, o, r, s, e);
      }).catch(function (s) {
        t.status = uo.FAIL, sn.onFailed(e, {
          code: s.code || 400,
          content: s.content || s
        });
      });
    }
  }, {
    key: "doSend",
    value: function doSend(e, t, s, n, i, o) {
      var r = new Tn(e, t, s, n, i);
      Ds.fire(Nn.MESSAGE_SENDING, e);
      var a = new As({
        name: Os.publishIM,
        params: r,
        unique: !0,
        permission: Jt.WRITE,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        fail: function fail(t) {
          e.status = uo.FAIL, Ds.fire(Nn.MESSAGE_SEND_FAILED, e), sn.onFailed(o, {
            code: t.resultCode,
            content: t.content
          });
        },
        success: function success(t) {
          if (e.status = uo.SUCCESS, e.timestamp = t.content.timestamp, e.scene() === co.CS) {
            var _s15 = e;
            _s15.customerId() !== js.u() && (_s15.sessionId = t.content.sessionId);
          }
          e.clearUseLessAttribute(), Ds.fire(Nn.MESSAGE_SEND_SUCCESS, e), sn.onSuccess(o, e);
        }
      });
      js.s().emit(a);
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.message;
      if (!(t instanceof On)) throw new Error("it is invalid message");
      if (t.status !== uo.NEW) throw new Error("Please create a new message, a message can only be sent once");
    }
  }]);
  return _n;
}();
var Pn = /*#__PURE__*/function () {
  function Pn() {
    (0, _classCallCheck2.default)(this, Pn);
  }
  (0, _createClass2.default)(Pn, [{
    key: "insert",
    value: function insert(e, t) {
      var s = this.binarySearch(e, t);
      if (s >= 0) e.splice(s, 1, t);else {
        var _n14 = -s - 1;
        e.splice(_n14, 0, t);
      }
    }
  }, {
    key: "binarySearch",
    value: function binarySearch(e, t) {
      var s = 0,
        n = e.length - 1;
      for (; s <= n;) {
        var _i7 = n + s >> 1,
          _o3 = this.compare(t, e[_i7]);
        if (_o3 > 0) s = _i7 + 1;else {
          if (!(_o3 < 0)) return _i7;
          n = _i7 - 1;
        }
      }
      return -s - 1;
    }
  }]);
  return Pn;
}();
var kn = /*#__PURE__*/function () {
  function kn(e) {
    (0, _classCallCheck2.default)(this, kn);
    this.messages = new Array(), this.allLoaded = !1, this.target = e;
  }
  (0, _createClass2.default)(kn, [{
    key: "all",
    value: function all() {
      return this.messages;
    }
  }, {
    key: "sliceOverLengthMessages",
    value: function sliceOverLengthMessages() {
      this.messages.length > kn.CACHE_MAX_LENGTH && (this.messages = this.messages.slice(-kn.CACHE_MAX_LENGTH), !0 === this.allLoaded && (this.allLoaded = !1));
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage() {
      return this.messages[this.messages.length - 1];
    }
  }, {
    key: "loadLocalMessages",
    value: function loadLocalMessages(e, t) {
      var s = [],
        n = this.messages.length;
      if (t) {
        if (n > 0) {
          var _i8 = this.messages[0].timestamp,
            _o4 = this.messages[n - 1].timestamp;
          if (t >= _i8 && t <= _o4) for (var _i9 = n - 1; _i9 >= 0; _i9--) {
            var _n15 = this.messages[_i9];
            if (_n15.timestamp < t) {
              if (!(s.length < e)) break;
              s.unshift(_n15);
            }
          }
        }
      } else s = this.messages.slice(-e);
      return s;
    }
  }, {
    key: "cacheServerMessages",
    value: function cacheServerMessages(e, t) {
      var _this36 = this;
      var s = this.messages[0];
      this.messages.length < kn.CACHE_MAX_LENGTH && (!e.lastTimestamp || this.messages.length > 0 && s.timestamp === e.lastTimestamp) && (t.forEach(function (e) {
        kn.sortedInserter.insert(_this36.messages, e);
      }), t.length < e.limit && (this.allLoaded = !0));
    }
  }, {
    key: "findMessageByTime",
    value: function findMessageByTime(e) {
      return this.messages.find(function (t) {
        return e === t.timestamp;
      });
    }
  }, {
    key: "findMessagesByTimes",
    value: function findMessagesByTimes(e) {
      var _this37 = this;
      var t = [];
      return e.forEach(function (e) {
        var s = _this37.findMessageByTime(e);
        es.isDef(s) && t.push(s);
      }), t;
    }
  }, {
    key: "existsMessage",
    value: function existsMessage(e) {
      return this.findMessageIndexById(e) > -1;
    }
  }, {
    key: "findMessageIndexById",
    value: function findMessageIndexById(e) {
      return this.messages.findIndex(function (t) {
        return e === t.messageId;
      });
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      var t = this.findMessageIndexById(e);
      t >= 0 && this.messages.splice(t, 1);
    }
  }, {
    key: "recallMessages",
    value: function recallMessages(e) {
      var _this38 = this;
      e.forEach(function (e) {
        var t = _this38.findMessageByTime(e.timestamp);
        es.isDef(t) && (t.recalled = !0), e.recalled = !0;
      });
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return 0 === this.messages.length;
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(e) {
      var _this39 = this;
      e.forEach(function (e) {
        _this39.deleteMessage(e.messageId);
      });
    }
  }, {
    key: "saveMessage",
    value: function saveMessage(e) {
      kn.sortedInserter.insert(this.messages, e), this.sliceOverLengthMessages();
    }
  }, {
    key: "maxSuccessMessageTime",
    value: function maxSuccessMessageTime() {
      for (var _e13 = this.messages.length - 1; _e13 >= 0; _e13--) {
        if (this.messages[_e13].status === uo.SUCCESS) return this.messages[_e13].timestamp;
      }
      return 0;
    }
  }, {
    key: "minTime",
    value: function minTime() {
      return this.isEmpty() ? 0 : this.messages[0].timestamp;
    }
  }, {
    key: "correctPosition",
    value: function correctPosition(e) {
      this.deleteMessage(e.messageId), this.saveMessage(e);
    }
  }]);
  return kn;
}();
kn.CACHE_MAX_LENGTH = 200, kn.sortedInserter = new ( /*#__PURE__*/function (_Pn) {
  (0, _inherits2.default)(_class13, _Pn);
  var _super17 = _createSuper(_class13);
  function _class13() {
    (0, _classCallCheck2.default)(this, _class13);
    return _super17.apply(this, arguments);
  }
  (0, _createClass2.default)(_class13, [{
    key: "compare",
    value: function compare(e, t) {
      var s = e.timestamp - t.timestamp;
      return s > 0 ? 1 : 0 === s ? 0 : -1;
    }
  }]);
  return _class13;
}(Pn))();
var Dn = /*#__PURE__*/function () {
  function Dn(e, t, s) {
    (0, _classCallCheck2.default)(this, Dn);
    this.scene = e, this.id = t, es.isDef(s) && (this.teamId = s);
  }
  (0, _createClass2.default)(Dn, [{
    key: "toString",
    value: function toString() {
      return co.PRIVATE === this.scene || co.GROUP === this.scene ? this.scene + "#" + this.id : this.scene + "#" + this.id + "#" + this.teamId;
    }
  }, {
    key: "customerId",
    value: function customerId() {
      if (co.CS === this.scene) return this.id === this.teamId ? js.u() : this.id;
    }
  }], [{
    key: "byScene",
    value: function byScene(e, t, s) {
      return new Dn(e, t, s);
    }
  }, {
    key: "byIMMessage",
    value: function byIMMessage(e) {
      var t,
        s,
        n = e.scene();
      if (n === co.PRIVATE) {
        var _t19 = e.senderId,
          _n16 = e.targetId();
        s = js.u() === _t19 ? _n16 : _t19;
      } else if (n === co.GROUP) s = e.targetId();else {
        if (n !== co.CS) throw {
          code: 400,
          content: "scene ".concat(n, " not exists")
        };
        s = e.targetId(), t = e.teamId;
      }
      return new Dn(n, s, t);
    }
  }, {
    key: "byMessageReadRemoteEvent",
    value: function byMessageReadRemoteEvent(e) {
      var t,
        s = e.scene,
        n = e.targetId,
        i = e.markerId,
        o = e.teamId;
      return s === co.PRIVATE ? t = js.u() === i ? n : i : s === co.GROUP ? t = n : s === co.CS && (t = n === o ? i === js.u() ? o : i : i === js.u() ? n : o), new Dn(s, t, o);
    }
  }, {
    key: "byIMMessageDeletedEvent",
    value: function byIMMessageDeletedEvent(e) {
      var t = e.scene,
        s = e.deleterId;
      if (t === co.PRIVATE) {
        var _n17 = js.u() === s ? e.targetId : s;
        return new Dn(t, _n17);
      }
      if (t === co.GROUP) return new Dn(t, e.targetId);
    }
  }, {
    key: "byConversationDTO",
    value: function byConversationDTO(e) {
      var t = e.lastMessage;
      return this.byIMMessage(t);
    }
  }, {
    key: "byRemoteRecallEvent",
    value: function byRemoteRecallEvent(e) {
      var t;
      if (e.scene === co.PRIVATE) {
        var _s16 = e.conversationId.split(":", 2);
        t = _s16[0] === js.u() ? _s16[1] : _s16[0];
      } else t = e.conversationId;
      return new Dn(e.scene, t);
    }
  }]);
  return Dn;
}();
var xn = /*#__PURE__*/(0, _createClass2.default)(function xn(e) {
  var _this40 = this;
  (0, _classCallCheck2.default)(this, xn);
  this.times = new Array();
  var t = e[0],
    s = Dn.byIMMessage(t);
  this.scene = s.scene, this.targetId = s.id, e.forEach(function (e) {
    e.status === uo.SUCCESS && _this40.times.push(e.timestamp);
  }), this.times.sort(function (e, t) {
    return e < t ? -1 : e == t ? 0 : 1;
  });
});
var Fn = /*#__PURE__*/function () {
  function Fn() {
    (0, _classCallCheck2.default)(this, Fn);
  }
  (0, _createClass2.default)(Fn, null, [{
    key: "deleteServerMessages",
    value: function deleteServerMessages(e) {
      var t = new xn(e);
      return t.times.length < 0 ? Promise.resolve() : new Promise(function (e, s) {
        var n = new As({
          name: Os.IM_DELETE_MESSAGE,
          params: t,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          success: function success(t) {
            200 === t.code ? e(t) : s(t);
          },
          fail: function fail(e) {
            s(e);
          }
        });
        js.s().emit(n);
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.messages;
      for (var _e14 = 0; _e14 < t.length; _e14++) {
        var _s17 = t[_e14];
        if (_s17.status === uo.SENDING) throw {
          code: 400,
          content: "message[" + _e14 + "] is '" + _s17.status + "' and cannot be deleted"
        };
      }
    }
  }]);
  return Fn;
}();
var Un = /*#__PURE__*/(0, _createClass2.default)(function Un(e) {
  var _this41 = this;
  (0, _classCallCheck2.default)(this, Un);
  this.times = new Array();
  var t = e[0],
    s = Dn.byIMMessage(t);
  this.scene = s.scene, this.targetId = s.id, e.forEach(function (e) {
    _this41.times.push(e.timestamp);
  }), this.times.sort(function (e, t) {
    return e < t ? -1 : e == t ? 0 : 1;
  });
});
var Ln = /*#__PURE__*/function () {
  function Ln() {
    (0, _classCallCheck2.default)(this, Ln);
  }
  (0, _createClass2.default)(Ln, null, [{
    key: "recallServerMessages",
    value: function recallServerMessages(e) {
      var t = new Un(e);
      return 0 === t.times.length ? Promise.resolve() : new Promise(function (e, s) {
        var n = new As({
          name: Os.IM_RECALL_MESSAGE,
          params: t,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          fail: function fail(e) {
            s(e);
          },
          success: function success(t) {
            200 === t.code ? e(t) : s(t);
          }
        });
        js.s().emit(n);
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.messages;
      for (var _e15 = 0; _e15 < t.length; _e15++) {
        var _s18 = t[_e15];
        if (_s18.status !== uo.SUCCESS) throw {
          code: 400,
          content: "message[" + _e15 + "] is '" + _s18.status + "' and cannot be recalled"
        };
        if (_s18.recalled) throw {
          code: 400,
          content: "message[" + _e15 + "] has been recalled"
        };
        if (_s18.senderId !== js.u()) throw {
          code: 400,
          content: "it is not allowed to recall messages sent by others"
        };
      }
    }
  }]);
  return Ln;
}();
var Gn = /*#__PURE__*/(0, _createClass2.default)(function Gn(e, t, s, n, i) {
  (0, _classCallCheck2.default)(this, Gn);
  this.scene = e, this.id = t, this.after = s, this.min = n, this.teamId = i;
});
var qn = /*#__PURE__*/(0, _createClass2.default)(function qn(e, t, s, n) {
  (0, _classCallCheck2.default)(this, qn);
  this.id = e, this.scene = t, this.lastTimestamp = s, this.teamId = n;
});
var Bn = /*#__PURE__*/function (_On) {
  (0, _inherits2.default)(Bn, _On);
  var _super18 = _createSuper(Bn);
  function Bn() {
    var _this42;
    (0, _classCallCheck2.default)(this, Bn);
    _this42 = _super18.apply(this, arguments), _this42.read = !1;
    return _this42;
  }
  (0, _createClass2.default)(Bn, [{
    key: "scene",
    value: function scene() {
      return co.PRIVATE;
    }
  }, {
    key: "targetId",
    value: function targetId() {
      return this.receiverId;
    }
  }]);
  return Bn;
}(On);
var jn = /*#__PURE__*/function (_On2) {
  (0, _inherits2.default)(jn, _On2);
  var _super19 = _createSuper(jn);
  function jn() {
    (0, _classCallCheck2.default)(this, jn);
    return _super19.apply(this, arguments);
  }
  (0, _createClass2.default)(jn, [{
    key: "scene",
    value: function scene() {
      return co.GROUP;
    }
  }, {
    key: "targetId",
    value: function targetId() {
      return this.groupId;
    }
  }]);
  return jn;
}(On);
var Vn = /*#__PURE__*/function (_On3) {
  (0, _inherits2.default)(Vn, _On3);
  var _super20 = _createSuper(Vn);
  function Vn() {
    var _this43;
    (0, _classCallCheck2.default)(this, Vn);
    _this43 = _super20.apply(this, arguments), _this43.accepted = !1;
    return _this43;
  }
  (0, _createClass2.default)(Vn, [{
    key: "scene",
    value: function scene() {
      return co.CS;
    }
  }, {
    key: "targetId",
    value: function targetId() {
      return js.u() === this.customerId() ? this.teamId : this.customerId();
    }
  }, {
    key: "sendByCustomer",
    value: function sendByCustomer() {
      return this.to === this.teamId;
    }
  }, {
    key: "customerId",
    value: function customerId() {
      return this.sendByCustomer() ? this.senderId : this.to;
    }
  }, {
    key: "isOtherSent",
    value: function isOtherSent() {
      return js.u() === this.customerId() ? this.senderId !== js.u() : this.senderId === this.customerId();
    }
  }]);
  return Vn;
}(On);
!function (e) {
  e.ACCEPT = "CS_ACCEPT", e.END = "CS_END", e.TRANSFER = "CS_TRANSFER";
}(Rn || (Rn = {}));
var Hn = /*#__PURE__*/function () {
  function Hn() {
    (0, _classCallCheck2.default)(this, Hn);
  }
  (0, _createClass2.default)(Hn, [{
    key: "build",
    value: function build(e) {
      var t,
        s = e.t;
      s === co.PRIVATE ? (t = new Bn(), t.read = !1, t.receiverId = e.r) : s === co.GROUP ? (t = new jn(), t.groupId = e.r, t.senderData = e.d ? JSON.parse(e.d) : {}) : s === co.CS && (t = new Vn(), t.to = e.r, t.teamId = e.tid, t.senderData = e.d ? JSON.parse(e.d) : {}, t.accepted = e.accepted, t.customerId() !== js.u() && (t.sessionId = e.sessionId)), t.senderId = e.s, t.messageId = e.i, t.timestamp = e.ts, t.type = e.mt;
      var n = e.p;
      if (es.isDef(n)) if (s === co.CS && t.type === Rn.TRANSFER) {
        var _e16 = JSON.parse(n);
        _e16.transferTo.data = JSON.parse(_e16.transferTo.data), t.payload = _e16;
      } else t.payload = JSON.parse(n);
      return t.recalled = e.rc, t.status = uo.SUCCESS, t;
    }
  }]);
  return Hn;
}();
var Wn = /*#__PURE__*/function () {
  function Wn() {
    (0, _classCallCheck2.default)(this, Wn);
    this.builder = new Hn();
  }
  (0, _createClass2.default)(Wn, [{
    key: "sync",
    value: function sync(e, t, s, n, i) {
      var o = new Gn(e, t, s, n, i);
      return new Promise(function (e, t) {
        var s = new As({
          name: Os.IM_HISTORY_CHANGE,
          params: o,
          permission: Jt.READ,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          fail: function fail(e) {
            t(e);
          },
          success: function success(t) {
            var s = t.content;
            e(s);
          }
        });
        js.s().emit(s);
      });
    }
  }, {
    key: "loadServerMessages",
    value: function loadServerMessages(e, t) {
      var _this44 = this;
      return new Promise(function (s, n) {
        var i = new As({
          name: Os.IM_HISTORY,
          params: t,
          permission: Jt.READ,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          fail: function fail(e) {
            n(e);
          },
          success: function success(t) {
            var n = t.content;
            n.messages = _this44.convertServerMessages(e, n.messages), s(n);
          }
        });
        js.s().emit(i);
      });
    }
  }, {
    key: "convertServerMessages",
    value: function convertServerMessages(e, t) {
      var _this45 = this;
      var s = [],
        n = e.scene,
        i = e.id;
      return t.forEach(function (t) {
        if (t.t = n, co.PRIVATE === n) t.r = t.s === js.u() ? i : js.u();else if (co.GROUP === n) t.r = i;else if (co.CS === n) {
          var _s19 = e.customerId(),
            _n18 = e.teamId;
          _s19 === js.u() ? t.r = _n18 : t.r = _s19;
        }
        var o = _this45.builder.build(t);
        s.push(o);
      }), s;
    }
  }, {
    key: "updateServerOffsets",
    value: function updateServerOffsets(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var t;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                t = new qn(s.id, s.scene, e, s.teamId);
                return _context9.abrupt("return", new Promise(function (e, s) {
                  var n = new As({
                    name: Os.IM_MARK_AS_READ,
                    params: t,
                    permission: Jt.WRITE,
                    singleTimeout: Rs.commonRequestSingle,
                    totalTimeout: Rs.commonRequestTotal,
                    success: function success(t) {
                      e(t);
                    },
                    fail: function fail(e) {
                      s(e);
                    }
                  });
                  js.s().emit(n);
                }));
              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));
    }
  }]);
  return Wn;
}();
Wn.instance = new Wn();
var zn = /*#__PURE__*/function () {
  function zn() {
    (0, _classCallCheck2.default)(this, zn);
    this.offsetMap = new Map(), this.markingTime = 0, this.userId = js.u();
  }
  (0, _createClass2.default)(zn, [{
    key: "updateOffset",
    value: function updateOffset(e, t) {
      var s = this.offsetMap.get(e);
      return es.isDef(s) ? t > s && (this.offsetMap.set(e, t), !0) : (this.offsetMap.set(e, t), !0);
    }
  }, {
    key: "updateUserOffsets",
    value: function updateUserOffsets(e) {
      var _this46 = this;
      e.forEach(function (e) {
        var t = e.userId,
          s = e.offset;
        _this46.updateOffset(t, s);
      });
    }
  }, {
    key: "updateMyOffset",
    value: function updateMyOffset(e) {
      return this.updateOffset(this.userId, e);
    }
  }, {
    key: "myOffset",
    value: function myOffset() {
      return this.getOffset(this.userId);
    }
  }, {
    key: "getOffset",
    value: function getOffset(e) {
      var t = this.offsetMap.get(e);
      return t || 0;
    }
  }]);
  return zn;
}();
var Xn = /*#__PURE__*/(0, _createClass2.default)(function Xn(e, t, s, n, i) {
  (0, _classCallCheck2.default)(this, Xn);
  this.id = e, this.scene = t, this.lastTimestamp = s, this.limit = n, this.teamId = i;
});
var Jn = /*#__PURE__*/function () {
  function Jn(e) {
    (0, _classCallCheck2.default)(this, Jn);
    this.history = e;
  }
  (0, _createClass2.default)(Jn, [{
    key: "pre",
    value: function pre() {
      this.oldLastMessage = this.history.getMaxMessage(), this.oldUnreadAmount = this.history.unreadAmount(), this.oldLastMessage && (this.oldLastMessageRecalled = this.oldLastMessage.recalled, this.oldLastMessageRead = this.oldLastMessage.read, this.oldLastMessageStatus = this.oldLastMessage.status);
    }
  }, {
    key: "post",
    value: function post() {
      var e,
        t,
        s,
        n = this.history.unreadAmount(),
        i = this.history.getMaxMessage();
      i && (s = i.status, e = i.read, t = i.recalled);
      var o = this.history.target;
      this.oldLastMessage !== i || this.oldLastMessageRead !== e || this.oldLastMessageRecalled !== t || this.oldLastMessageStatus !== s ? i ? Ds.fire(Nn.MAX_MESSAGE_CHANGED, i) : Ds.fire(Nn.MAX_MESSAGE_DELETED, o) : this.oldUnreadAmount !== n && Ds.fire(Nn.UNREAD_AMOUNT_CHANGED, o);
    }
  }]);
  return Jn;
}();
var Kn = /*#__PURE__*/function () {
  function Kn(e) {
    (0, _classCallCheck2.default)(this, Kn);
    this.expiredTime = 0, this.remoteHistory = Wn.instance, this.target = e, this.userOffsets = new zn(), this.messageCache = new kn(e);
  }
  (0, _createClass2.default)(Kn, [{
    key: "initMaxMessageAndOffsets",
    value: function initMaxMessageAndOffsets(e, t) {
      var _this47 = this;
      this.existsMessage(e) || (this.messageCache.saveMessage(e), t.forEach(function (e) {
        _this47.markLocalMessagesRead(_this47.messageCache.all(), e.userId, e.offset, !1);
      }));
    }
  }, {
    key: "existsMessage",
    value: function existsMessage(e) {
      return this.messageCache.existsMessage(e.messageId);
    }
  }, {
    key: "loadHistory",
    value: function loadHistory(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee10() {
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.t0 = this.expiredTime > 0 && !this.messageCache.isEmpty();
                if (!_context10.t0) {
                  _context10.next = 4;
                  break;
                }
                _context10.next = 4;
                return this.updateByServerChange();
              case 4:
                es.isUndef(s) ? s = 10 : s > 30 && (s = 30);
                _context10.next = 7;
                return this.loadServerMessages(e, s);
              case 7:
                return _context10.abrupt("return", _context10.sent);
              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));
    }
  }, {
    key: "loadServerMessages",
    value: function loadServerMessages(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee11() {
        var _this48 = this;
        var t, _n19, _i10, _o5, _r, _a;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                t = this.messageCache.loadLocalMessages(s, e);
                if (!(!1 === this.messageCache.allLoaded && t.length !== s)) {
                  _context11.next = 10;
                  break;
                }
                _n19 = s - t.length;
                _i10 = t[0] ? t[0].timestamp : e;
                _o5 = new Xn(this.target.id.toString(), this.target.scene, _i10, _n19, this.target.teamId);
                _context11.next = 7;
                return this.remoteHistory.loadServerMessages(this.target, _o5);
              case 7:
                _r = _context11.sent;
                _a = _r.messages;
                t = _a.concat(t), this.messageCache.cacheServerMessages(_o5, _a), _r.userOffsets.forEach(function (e) {
                  _this48.userOffsets.updateOffset(e.userId, e.offset);
                }), this.userOffsets.offsetMap.forEach(function (e, t) {
                  _this48.markLocalMessagesRead(_a, t, e, !1);
                });
              case 10:
                return _context11.abrupt("return", t);
              case 11:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee13() {
        var _this49 = this;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return t(_this49, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee12() {
                    var t;
                    return _regenerator.default.wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            t = e.messages;
                            _context12.next = 3;
                            return Fn.deleteServerMessages(t);
                          case 3:
                            this.messageCache.deleteMessages(t);
                            sn.onSuccess(e);
                          case 5:
                          case "end":
                            return _context12.stop();
                        }
                      }
                    }, _callee12, this);
                  }));
                });
              case 2:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));
    }
  }, {
    key: "syncDeletedMessage",
    value: function syncDeletedMessage(e, t) {
      var _this50 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this50.doSyncDeletedMessage(e, t);
      });
    }
  }, {
    key: "doSyncDeletedMessage",
    value: function doSyncDeletedMessage(e, t) {
      if (e === js.u()) {
        var _e17 = this.messageCache.findMessagesByTimes(t);
        this.messageCache.deleteMessages(_e17), _e17.length > 0 && Yi.aec.fire(Ks.MESSAGE_DELETED, _e17);
      }
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee15() {
        var _this51 = this;
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return t(_this51, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee14() {
                    var t;
                    return _regenerator.default.wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            t = e.messages;
                            _context14.next = 3;
                            return Ln.recallServerMessages(t);
                          case 3:
                            this.messageCache.recallMessages(t);
                            sn.onSuccess(e);
                          case 5:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14, this);
                  }));
                });
              case 2:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));
    }
  }, {
    key: "syncRecalledMessage",
    value: function syncRecalledMessage(e) {
      var _this52 = this;
      this.aopUnreadAmountMaxMessage(function () {
        return t(_this52, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee16() {
          return _regenerator.default.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  this.doSyncRecalledMessage(e);
                case 1:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        }));
      });
    }
  }, {
    key: "doSyncRecalledMessage",
    value: function doSyncRecalledMessage(e) {
      var t = this.messageCache.findMessagesByTimes(e);
      t.length > 0 && (this.messageCache.recallMessages(t), Yi.aec.fire(Ks.MESSAGE_RECALLED, t));
    }
  }, {
    key: "expire",
    value: function expire() {
      this.messageCache.isEmpty() || (this.expiredTime = this.messageCache.maxSuccessMessageTime());
    }
  }, {
    key: "updateByServerChange",
    value: function updateByServerChange() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee18() {
        var _this53 = this;
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return t(_this53, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee17() {
                    var _this54 = this;
                    var e, t, s;
                    return _regenerator.default.wrap(function _callee17$(_context17) {
                      while (1) {
                        switch (_context17.prev = _context17.next) {
                          case 0:
                            _context17.next = 2;
                            return this.remoteHistory.sync(this.target.scene, this.target.id, this.expiredTime, this.messageCache.minTime(), this.target.teamId);
                          case 2:
                            e = _context17.sent;
                            e.userOffsets.forEach(function (e) {
                              _this54.markLocalMessagesRead(_this54.messageCache.all(), e.userId, e.offset, !0);
                            });
                            t = e.deletedMessageTimes;
                            t.length > 0 && this.doSyncDeletedMessage(js.u(), t);
                            s = e.recalled;
                            s.length > 0 && this.doSyncRecalledMessage(s), this.expiredTime = 0;
                          case 8:
                          case "end":
                            return _context17.stop();
                        }
                      }
                    }, _callee17, this);
                  }));
                });
              case 2:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));
    }
  }, {
    key: "markRead",
    value: function markRead() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee20() {
        var _this55 = this;
        return _regenerator.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return t(_this55, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee19() {
                    var e;
                    return _regenerator.default.wrap(function _callee19$(_context19) {
                      while (1) {
                        switch (_context19.prev = _context19.next) {
                          case 0:
                            e = this.messageCache.maxSuccessMessageTime();
                            _context19.t0 = e > this.userOffsets.myOffset();
                            if (!_context19.t0) {
                              _context19.next = 7;
                              break;
                            }
                            this.userOffsets.markingTime = e;
                            _context19.next = 6;
                            return this.remoteHistory.updateServerOffsets(e, this.target);
                          case 6:
                            e === this.userOffsets.markingTime && this.markLocalMessagesRead(this.messageCache.all(), js.u(), e, !0);
                          case 7:
                          case "end":
                            return _context19.stop();
                        }
                      }
                    }, _callee19, this);
                  }));
                });
              case 2:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));
    }
  }, {
    key: "syncMarkedMessage",
    value: function syncMarkedMessage(e) {
      var _this56 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this56.markLocalMessagesRead(_this56.messageCache.all(), e.markerId, e.time, !0);
      });
    }
  }, {
    key: "onMessageSending",
    value: function onMessageSending(e) {
      var _this57 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this57.messageCache.saveMessage(e);
      });
    }
  }, {
    key: "onMessageSendSuccess",
    value: function onMessageSendSuccess(e) {
      var _this58 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this58.messageCache.correctPosition(e), _this58.markLocalMessagesRead(_this58.messageCache.all(), js.u(), e.timestamp, !0);
      });
    }
  }, {
    key: "onMessageSendFailed",
    value: function onMessageSendFailed(e) {
      this.getMaxMessage() === e && Ds.fire(Nn.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      var _this59 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this59.messageCache.saveMessage(e), _this59.markLocalMessagesRead(_this59.messageCache.all(), e.senderId, e.timestamp, !0);
      });
    }
  }, {
    key: "aopUnreadAmountMaxMessage",
    value: function aopUnreadAmountMaxMessage(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee21() {
        var _t20;
        return _regenerator.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.prev = 0;
                _t20 = new Jn(this);
                _t20.pre();
                _context21.next = 5;
                return e();
              case 5:
                _t20.post();
                _context21.next = 11;
                break;
              case 8:
                _context21.prev = 8;
                _context21.t0 = _context21["catch"](0);
                sn.onFailed(s, _context21.t0);
              case 11:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this, [[0, 8]]);
      }));
    }
  }, {
    key: "markLocalMessagesRead",
    value: function markLocalMessagesRead(e, t, s, n) {
      if (this.userOffsets.updateOffset(t, s), this.isOtherUserId(t)) {
        var _t21 = this.markMySentRead(e, s);
        n && _t21.length > 0 && Yi.aec.fire(Ks.MESSAGE_READ, _t21);
      } else t === js.u() && this.markOthersSentRead(e, s);
    }
  }, {
    key: "markOthersSentRead",
    value: function markOthersSentRead(e, t) {
      if (this.target.scene === co.PRIVATE) for (var _s20 = e.length - 1; _s20 >= 0; _s20--) {
        var _n20 = e[_s20];
        if (_n20.isOtherSent() && _n20.timestamp <= t) {
          if (_n20.read) break;
          _n20.read = !0;
        }
      }
    }
  }, {
    key: "markMySentRead",
    value: function markMySentRead(e, t) {
      var s = new Array();
      if (this.target.scene === co.PRIVATE) for (var _n21 = e.length - 1; _n21 >= 0; _n21--) {
        var _i11 = e[_n21];
        if (!_i11.isOtherSent() && _i11.timestamp <= t && _i11.status === uo.SUCCESS) {
          if (_i11.read) break;
          _i11.read = !0, s.push(_i11);
        }
      }
      return s;
    }
  }, {
    key: "isOtherUserId",
    value: function isOtherUserId(e) {
      if (this.target.scene === co.CS) {
        var _t22 = this.target.customerId();
        return js.u() === _t22 ? e !== js.u() : e === _t22;
      }
      return e !== js.u();
    }
  }, {
    key: "unreadAmount",
    value: function unreadAmount(e) {
      var t = 0,
        s = this.userOffsets.myOffset(),
        n = this.messageCache.all();
      var _iterator3 = _createForOfIteratorHelper(n),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _e18 = _step3.value;
          _e18.isOtherSent() && !1 === _e18.recalled && _e18.timestamp > s && (t += 1);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return t;
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage(e) {
      return this.messageCache.getMaxMessage();
    }
  }, {
    key: "maxTime",
    value: function maxTime(e) {
      var t = this.getMaxMessage();
      return es.isDef(t) ? t.timestamp : 0;
    }
  }]);
  return Kn;
}();
var Qn = /*#__PURE__*/(0, _createClass2.default)(function Qn(e, t) {
  (0, _classCallCheck2.default)(this, Qn);
  this.teamId = e, this.customerId = t;
});
var Yn = /*#__PURE__*/(0, _createClass2.default)(function Yn() {
  (0, _classCallCheck2.default)(this, Yn);
});
var $n = /*#__PURE__*/(0, _createClass2.default)(function $n(e, t, s) {
  (0, _classCallCheck2.default)(this, $n);
  this.teamId = e, this.teamData = JSON.stringify(t), this.agentData = JSON.stringify(s);
});
var Zn = /*#__PURE__*/(0, _createClass2.default)(function Zn(e) {
  (0, _classCallCheck2.default)(this, Zn);
  this.teamId = e;
});
var ei = /*#__PURE__*/(0, _createClass2.default)(function ei(e) {
  (0, _classCallCheck2.default)(this, ei);
  this.teamId = e;
});
var ti = /*#__PURE__*/function () {
  function ti() {
    (0, _classCallCheck2.default)(this, ti);
    this.synchronized = !0, js.s().addDisconnectedObserver(this.onDisconnected.bind(this)), js.s().addConnectedObserver(this.onConnected.bind(this)), js.s().addMessageObserver(Js.CS_ONLINE_CHANGED, this.onlineChanged.bind(this));
  }
  (0, _createClass2.default)(ti, [{
    key: "queryTeams",
    value: function queryTeams() {
      var _this60 = this;
      return this.queryMyTeamPromise || (this.queryMyTeamPromise = new Promise(function (e, t) {
        var s = new As({
          name: Os.CS_MY_TEAMS,
          params: {},
          permission: Jt.READ,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          fail: function fail(e) {
            t(e);
          },
          success: function success(t) {
            _this60.teamIds = new Set(t.content), _this60.synchronized = !0, e(_this60.teamIds);
          }
        });
        js.s().emit(s);
      })), this.queryMyTeamPromise;
    }
  }, {
    key: "myTeams",
    value: function myTeams() {
      if (this.synchronized && this.queryMyTeamPromise) return this.teamIds;
      throw "please query team first.";
    }
  }, {
    key: "isOnline",
    value: function isOnline(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee22() {
        return _regenerator.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this.queryTeams();
              case 2:
                sn.onSuccess(s, this.teamIds.has(e));
              case 3:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));
    }
  }, {
    key: "online",
    value: function online(e, t) {
      var _this61 = this;
      if (!es.isObject(t.agentData) || !es.isObject(t.teamData)) throw {
        code: 400,
        content: "agentData and teamData require an object"
      };
      var s = new $n(e, t.teamData, t.agentData),
        n = new As({
          name: Os.CS_ONLINE,
          params: s,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          fail: function fail(e) {
            sn.onFailed(t, e);
          },
          success: function success(s) {
            _this61.teamIds.add(e), sn.onSuccess(t), Ds.fire(Nn.CS_ONLINE_SUCCESS);
          }
        });
      js.s().emit(n);
    }
  }, {
    key: "offline",
    value: function offline(e, t) {
      var _this62 = this;
      var s = new Zn(e),
        n = new As({
          name: Os.CS_OFFLINE,
          params: s,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          fail: function fail(e) {
            sn.onFailed(t, e);
          },
          success: function success(s) {
            _this62.teamIds.delete(e), sn.onSuccess(t), Ds.fire(Nn.CS_OFFLINE_SUCCESS);
          }
        });
      js.s().emit(n);
    }
  }, {
    key: "agents",
    value: function agents(e, t) {
      var s = new ei(e),
        n = new As({
          name: Os.CS_AGENTS,
          params: s,
          permission: Jt.READ,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          fail: function fail(e) {
            sn.onFailed(t, e);
          },
          success: function success(e) {
            e.content.forEach(function (e) {
              e.data = JSON.parse(e.data);
            }), sn.onSuccess(t, e);
          }
        });
      js.s().emit(n);
    }
  }, {
    key: "onlineChanged",
    value: function onlineChanged(e) {
      e.online ? this.teamIds.add(e.teamId) : this.teamIds.delete(e.teamId);
    }
  }, {
    key: "onDisconnected",
    value: function onDisconnected() {
      this.queryMyTeamPromise = null, this.teamIds = null;
    }
  }, {
    key: "onConnected",
    value: function onConnected() {
      this.synchronized && (this.queryMyTeamPromise = this.queryTeams());
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return ti.instance || (ti.instance = new ti()), ti.instance;
    }
  }]);
  return ti;
}();
var si = /*#__PURE__*/function () {
  function si(e) {
    (0, _classCallCheck2.default)(this, si);
    this.teamId = e, Ds.on(Nn.CS_AGENT_MESSAGE_RECEIVED, this.onMessageReceived), Ds.on(Nn.CS_ACCEPTED, this.onMessageReceived), Ds.on(Nn.CS_ENDED, this.onMessageReceived), Ds.on(Nn.CS_TRANSFER, this.onMessageReceived), Ds.on(xs.MANUAL_DISCONNECTED, si.destroy);
  }
  (0, _createClass2.default)(si, [{
    key: "customerId",
    value: function customerId() {
      return this.liveOptions.customerId;
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      var t = si.session;
      if (e.scene() === co.CS && t.liveOptions) {
        var _s21 = e,
          _n22 = t.liveOptions.customerId;
        t.teamId === _s21.teamId && _s21.customerId() === _n22 && (t.tryUpdateStatus(_s21), t.liveOptions.onNewMessage(_s21));
      }
    }
  }, {
    key: "tryUpdateStatus",
    value: function tryUpdateStatus(e) {
      if ("FREE" !== this.status.status && this.status.sessionId > e.sessionId) return;
      var t;
      switch (e.type) {
        case Rn.ACCEPT:
          t = new Yn(), t.status = "ACCEPTED", t.start = e.payload.sessionStart, t.sessionId = e.sessionId, t.agent = new po(e.senderId, e.senderData);
          break;
        case Rn.END:
          t = new Yn(), t.status = "FREE";
          break;
        case Rn.TRANSFER:
          t = new Yn(), t.status = "ACCEPTED", t.start = e.payload.sessionStart, t.sessionId = e.sessionId, t.agent = e.payload.transferTo;
          break;
        default:
          "FREE" === this.status.status && (t = new Yn(), t.status = "PENDING", t.start = e.timestamp, t.sessionId = e.sessionId);
      }
      t && (this.status = t, this.liveOptions.onStatusUpdated(t));
    }
  }], [{
    key: "live",
    value: function live(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee23() {
        var _this63 = this;
        var t, n, i;
        return _regenerator.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                t = s.customerId;
                Hs.validateId(t, "customerId");
                n = new Qn(e, t);
                _context23.next = 5;
                return ti.getInstance().queryTeams();
              case 5:
                i = new As({
                  name: Os.CS_LIVE_SESSION,
                  params: n,
                  permission: Jt.WRITE,
                  singleTimeout: Rs.commonRequestSingle,
                  totalTimeout: Rs.commonRequestTotal,
                  fail: function fail(e) {
                    sn.onFailed(s, e);
                  },
                  success: function success(t) {
                    si.destroy(), _this63.session = new si(e), _this63.session.liveOptions = s;
                    var n = t.content.customerStatus;
                    "ACCEPTED" === n.status && (n.agent.data = JSON.parse(n.agent.data)), _this63.session.status = n, _this63.session.liveOptions.onStatusUpdated(_this63.session.status), sn.onSuccess(s);
                  }
                });
                js.s().emit(i);
              case 7:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23);
      }));
    }
  }, {
    key: "isMyCustomer",
    value: function isMyCustomer(e) {
      var t = si.session;
      if (t && t.teamId === e.teamId && t.customerId() === e.customerId()) {
        var _s22 = ti.getInstance().myTeams(),
          _n23 = t.status.agent;
        return _s22.has(e.teamId) && (!_n23 || _n23.id === js.u());
      }
      return !0;
    }
  }, {
    key: "isMyMessage",
    value: function isMyMessage(e) {
      var t = Dn.byIMMessage(e);
      return e.type === Rn.TRANSFER && e.payload.transferTo.id === js.u() || this.isMyCustomer(t);
    }
  }, {
    key: "quit",
    value: function quit(e) {
      var t = si.session;
      if (t) {
        var _s23 = t.liveOptions.customerId;
        Hs.validateId(_s23, "customerId");
        var _n24 = new Qn(t.teamId, _s23),
          _i12 = new As({
            name: Os.CS_QUIT_LIVE,
            params: _n24,
            permission: Jt.WRITE,
            singleTimeout: Rs.commonRequestSingle,
            totalTimeout: Rs.commonRequestTotal,
            fail: function fail(t) {
              sn.onFailed(e, t);
            },
            success: function success(t) {
              si.destroy(), sn.onSuccess(e);
            }
          });
        js.s().emit(_i12);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var e = si.session;
      e && (Ds.off(Nn.CS_AGENT_MESSAGE_RECEIVED, e.onMessageReceived), Ds.off(Nn.CS_ACCEPTED, e.onMessageReceived), Ds.off(Nn.CS_ENDED, e.onMessageReceived), Ds.off(Nn.CS_TRANSFER, e.onMessageReceived), Ds.off(xs.MANUAL_DISCONNECTED, si.destroy), si.session = null);
    }
  }]);
  return si;
}();
var ni = /*#__PURE__*/function (_Kn) {
  (0, _inherits2.default)(ni, _Kn);
  var _super21 = _createSuper(ni);
  function ni(e) {
    var _this64;
    (0, _classCallCheck2.default)(this, ni);
    _this64 = _super21.call(this, e), _this64.unread = 0, _this64.markingAmount = 0;
    return _this64;
  }
  (0, _createClass2.default)(ni, [{
    key: "loadHistory",
    value: function loadHistory(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee24() {
        return _regenerator.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                es.isUndef(s) ? s = 10 : s > 30 && (s = 30);
                _context24.next = 3;
                return this.loadServerMessages(e, s);
              case 3:
                return _context24.abrupt("return", _context24.sent);
              case 4:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));
    }
  }, {
    key: "loadServerMessages",
    value: function loadServerMessages(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee25() {
        var _this65 = this;
        var t, n;
        return _regenerator.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                t = new Xn(this.target.id.toString(), this.target.scene, e, s, this.target.teamId);
                _context25.next = 3;
                return this.remoteHistory.loadServerMessages(this.target, t);
              case 3:
                n = _context25.sent;
                return _context25.abrupt("return", (n.userOffsets.forEach(function (e) {
                  _this65.userOffsets.updateOffset(e.userId, e.offset);
                }), n.messages));
              case 5:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee26() {
        return _regenerator.default.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                sn.onFailed(e, "Delete CS message is not supported yet");
              case 1:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26);
      }));
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee27() {
        return _regenerator.default.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                sn.onFailed(e, "Recall CS message is not supported yet");
              case 1:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27);
      }));
    }
  }, {
    key: "initMaxMessageAndOffsets",
    value: function initMaxMessageAndOffsets(e, t) {
      var _this66 = this;
      t.forEach(function (e) {
        _this66.userOffsets.updateOffset(e.userId, e.offset);
      }), (es.isUndef(this.acceptedMaxMessage) || this.acceptedMaxMessage.timestamp < e.timestamp) && this.increaseUnreadAmount(e), this.saveAcceptedMessage(e);
    }
  }, {
    key: "initPendingMaxMessageAndOffsets",
    value: function initPendingMaxMessageAndOffsets(e, t) {
      var _this67 = this;
      t.forEach(function (e) {
        _this67.userOffsets.updateOffset(e.userId, e.offset);
      }), this.savePendingMessage(e);
    }
  }, {
    key: "savePendingMessage",
    value: function savePendingMessage(e) {
      this.pendingMaxMessage ? this.pendingMaxMessage.timestamp < e.timestamp && (this.pendingMaxMessage = e) : this.pendingMaxMessage = e;
    }
  }, {
    key: "saveAcceptedMessage",
    value: function saveAcceptedMessage(e) {
      this.acceptedMaxMessage ? this.acceptedMaxMessage.timestamp < e.timestamp && (this.acceptedMaxMessage = e) : this.acceptedMaxMessage = e;
    }
  }, {
    key: "onMessageSending",
    value: function onMessageSending(e) {
      this.saveAcceptedMessage(e), Ds.fire(Nn.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageSendSuccess",
    value: function onMessageSendSuccess(e) {
      this.saveAcceptedMessage(e), this.userOffsets.updateOffset(e.senderId, e.timestamp), this.acceptedMaxMessage === e && Ds.fire(Nn.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageSendFailed",
    value: function onMessageSendFailed(e) {
      this.acceptedMaxMessage === e && Ds.fire(Nn.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      si.isMyMessage(e) && (!e.accepted || e.senderId !== js.u() && e.type === Rn.ACCEPT ? this.savePendingMessage(e) : this.saveAcceptedMessage(e), this.userOffsets.updateOffset(e.senderId, e.timestamp), this.increaseUnreadAmount(e), Ds.fire(Nn.MAX_MESSAGE_CHANGED, e));
    }
  }, {
    key: "increaseUnreadAmount",
    value: function increaseUnreadAmount(e) {
      if (e.sendByCustomer() || e.type === Rn.TRANSFER && e.senderId !== js.u()) {
        this.userOffsets.myOffset() < e.timestamp && e.accepted && (this.unread += 1);
      }
    }
  }, {
    key: "markRead",
    value: function markRead() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee28() {
        var e;
        return _regenerator.default.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                e = this.maxAcceptedMessageTime();
                _context28.t0 = si.isMyCustomer(this.target) && this.preMark(e);
                if (!_context28.t0) {
                  _context28.next = 6;
                  break;
                }
                _context28.next = 5;
                return this.remoteHistory.updateServerOffsets(e, this.target);
              case 5:
                this.postMark(e);
              case 6:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));
    }
  }, {
    key: "preMark",
    value: function preMark(e) {
      var t = this.userOffsets.myOffset();
      return e > this.userOffsets.markingTime && e > t && (this.userOffsets.markingTime = e, this.markingAmount = this.unread, !0);
    }
  }, {
    key: "postMark",
    value: function postMark(e) {
      e === this.userOffsets.markingTime && (this.unread -= this.markingAmount, this.markingAmount = 0, this.userOffsets.updateOffset(js.u(), e), Ds.fire(Nn.UNREAD_AMOUNT_CHANGED, this.target));
    }
  }, {
    key: "syncMarkedMessage",
    value: function syncMarkedMessage(e) {}
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage(e) {
      return e ? this.acceptedMaxMessage : this.pendingMaxMessage;
    }
  }, {
    key: "unreadAmount",
    value: function unreadAmount(e) {
      return e ? this.unread : 0;
    }
  }, {
    key: "existsMessage",
    value: function existsMessage(e) {
      return this.acceptedMaxMessage && this.acceptedMaxMessage.messageId === e.messageId || this.pendingMaxMessage && this.pendingMaxMessage.messageId === e.messageId;
    }
  }, {
    key: "maxAcceptedMessageTime",
    value: function maxAcceptedMessageTime() {
      return this.acceptedMaxMessage ? this.acceptedMaxMessage.timestamp : 0;
    }
  }, {
    key: "maxTime",
    value: function maxTime(e) {
      var t = this.getMaxMessage(e);
      return t ? t.timestamp : 0;
    }
  }]);
  return ni;
}(Kn);
var ii = /*#__PURE__*/function (_Kn2) {
  (0, _inherits2.default)(ii, _Kn2);
  var _super22 = _createSuper(ii);
  function ii(e) {
    (0, _classCallCheck2.default)(this, ii);
    return _super22.call(this, e);
  }
  (0, _createClass2.default)(ii, [{
    key: "deleteMessages",
    value: function deleteMessages(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee29() {
        return _regenerator.default.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                sn.onFailed(e, "Delete CS message is not supported yet");
              case 1:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29);
      }));
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee30() {
        return _regenerator.default.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                sn.onFailed(e, "Recall CS message is not supported yet");
              case 1:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30);
      }));
    }
  }]);
  return ii;
}(Kn);
var oi = /*#__PURE__*/function () {
  function oi() {
    (0, _classCallCheck2.default)(this, oi);
  }
  (0, _createClass2.default)(oi, [{
    key: "initialListeners",
    value: function initialListeners() {
      var _this68 = this;
      Ds.on(Nn.MESSAGE_SENDING, function (e) {
        return _this68.onMessageSending(e);
      }), Ds.on(Nn.MESSAGE_SEND_SUCCESS, function (e) {
        return _this68.onMessageSendSuccess(e);
      }), Ds.on(Nn.MESSAGE_SEND_FAILED, function (e) {
        return _this68.onMessageSendFailed(e);
      }), Ds.on(Nn.MESSAGE_RECEIVED, function (e) {
        return _this68.onMessageReceived(e);
      }), Ds.on(Nn.CS_AGENT_MESSAGE_RECEIVED, function (e) {
        return _this68.onMessageReceived(e);
      }), Ds.on(Nn.CS_ACCEPTED, function (e) {
        return _this68.onMessageReceived(e);
      }), Ds.on(Nn.CS_ENDED, function (e) {
        return _this68.onMessageReceived(e);
      }), Ds.on(Nn.CS_TRANSFER, function (e) {
        return _this68.onMessageReceived(e);
      }), js.s().addMessageObserver(Js.IM_MSG_READ, this.onRemoteMarkRead.bind(this)), js.s().addMessageObserver(Js.IM_MSG_DELETED, this.onRemoteMessageDeleted.bind(this)), js.s().addMessageObserver(Js.IM_MSG_RECALLED, this.onRemoteMessageRecalled.bind(this)), js.s().addDisconnectedObserver(this.onDisconnected.bind(this));
    }
  }, {
    key: "loadHistory",
    value: function loadHistory(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee31() {
        var t, n, i;
        return _regenerator.default.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                t = this.queryToTarget(e, s);
                n = this.findOrCreateHistory(t);
                _context31.next = 4;
                return n.loadHistory(e.lastTimestamp, e.limit);
              case 4:
                i = _context31.sent;
                sn.onSuccess(e, {
                  code: 200,
                  content: i
                });
              case 6:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));
    }
  }, {
    key: "queryToTarget",
    value: function queryToTarget(e, t) {
      if (es.isDef(e.userId)) return new Dn(co.PRIVATE, e.userId);
      if (es.isDef(e.groupId)) return new Dn(co.GROUP, e.groupId);
      if (es.isDef(e.type)) {
        if (!Object.values(co).includes(e.type)) throw new Error("incorrect type, must be: " + Object.values(co));
        if (es.isUndef(e.id)) throw new Error("If type is not empty, id is required.");
        return co.CS == e.type && es.isUndef(t) && (t = e.id), new Dn(e.type, e.id, t);
      }
      throw new Error("incorrect query options.");
    }
  }, {
    key: "onMessageSending",
    value: function onMessageSending(e) {
      var t = Dn.byIMMessage(e);
      this.findOrCreateHistory(t).onMessageSending(e);
    }
  }, {
    key: "onMessageSendSuccess",
    value: function onMessageSendSuccess(e) {
      var t = Dn.byIMMessage(e);
      this.findHistory(t).onMessageSendSuccess(e);
    }
  }, {
    key: "onMessageSendFailed",
    value: function onMessageSendFailed(e) {
      var t = Dn.byIMMessage(e);
      this.findHistory(t).onMessageSendFailed(e);
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      var t = Dn.byIMMessage(e);
      this.findOrCreateHistory(t).onMessageReceived(e);
    }
  }, {
    key: "privateMarkAsRead",
    value: function privateMarkAsRead(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee32() {
        var t;
        return _regenerator.default.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                if (!es.isUndef(e.userId)) {
                  _context32.next = 2;
                  break;
                }
                throw new Error("userId could not be empty.");
              case 2:
                t = Dn.byScene(co.PRIVATE, e.userId);
                _context32.next = 5;
                return this.markAsRead(t, e);
              case 5:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));
    }
  }, {
    key: "groupMarkAsRead",
    value: function groupMarkAsRead(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee33() {
        var t;
        return _regenerator.default.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                if (!es.isUndef(e.groupId)) {
                  _context33.next = 2;
                  break;
                }
                throw new Error("groupId could not be empty.");
              case 2:
                t = Dn.byScene(co.GROUP, e.groupId);
                _context33.next = 5;
                return this.markAsRead(t, e);
              case 5:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee34() {
        var t;
        return _regenerator.default.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                if (!es.isUndef(e.id)) {
                  _context34.next = 2;
                  break;
                }
                throw new Error("id could not be empty.");
              case 2:
                if (Object.values(co).includes(e.type)) {
                  _context34.next = 4;
                  break;
                }
                throw new Error("incorrect type, must be: " + Object.values(co));
              case 4:
                co.CS == e.type && es.isUndef(s) && (s = e.id);
                t = Dn.byScene(e.type, e.id, s);
                _context34.next = 8;
                return this.markAsRead(t, e);
              case 8:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));
    }
  }, {
    key: "markAsRead",
    value: function markAsRead(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee35() {
        var t;
        return _regenerator.default.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                t = this.findHistory(e);
                _context35.t0 = t;
                if (!_context35.t0) {
                  _context35.next = 5;
                  break;
                }
                _context35.next = 5;
                return t.markRead();
              case 5:
                sn.onSuccess(s);
              case 6:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));
    }
  }, {
    key: "onRemoteMarkRead",
    value: function onRemoteMarkRead(e) {
      var t = Dn.byMessageReadRemoteEvent(e),
        s = this.findHistory(t);
      s && s.syncMarkedMessage(e);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee36() {
        var t, s, n;
        return _regenerator.default.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                this.validateMessageArray(e.messages), Fn.validate(e);
                t = e.messages[0], s = Dn.byIMMessage(t), n = this.findHistory(s);
                if (n) {
                  _context36.next = 4;
                  break;
                }
                throw {
                  code: 400,
                  content: "No message that could be deleted"
                };
              case 4:
                _context36.next = 6;
                return n.deleteMessages(e);
              case 6:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));
    }
  }, {
    key: "onRemoteMessageDeleted",
    value: function onRemoteMessageDeleted(e) {
      var t = Dn.byIMMessageDeletedEvent(e),
        s = this.findHistory(t);
      s && s.syncDeletedMessage(e.deleterId, e.times);
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee37() {
        var t, s, n;
        return _regenerator.default.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                this.validateMessageArray(e.messages), Ln.validate(e);
                t = e.messages[0], s = Dn.byIMMessage(t), n = this.findHistory(s);
                if (n) {
                  _context37.next = 4;
                  break;
                }
                throw {
                  code: 400,
                  content: "No message that could be recalled"
                };
              case 4:
                _context37.next = 6;
                return n.recallMessage(e);
              case 6:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37, this);
      }));
    }
  }, {
    key: "onRemoteMessageRecalled",
    value: function onRemoteMessageRecalled(e) {
      var t = Dn.byRemoteRecallEvent(e),
        s = this.findHistory(t);
      s && s.syncRecalledMessage(e.times);
    }
  }, {
    key: "onDisconnected",
    value: function onDisconnected() {
      this.map.forEach(function (e, t) {
        e.expire();
      });
    }
  }, {
    key: "findOrCreateHistory",
    value: function findOrCreateHistory(e) {
      var t = this.findHistory(e);
      return t || (t = e.scene === co.CS ? js.u() === e.customerId() ? new ii(e) : new ni(e) : new Kn(e), this.map.set(e.toString(), t), t);
    }
  }, {
    key: "findHistory",
    value: function findHistory(e) {
      return this.map.get(e.toString());
    }
  }, {
    key: "validateMessageArray",
    value: function validateMessageArray(e) {
      if (!es.isArray(e) || es.isEmpty(e)) throw {
        code: 400,
        content: "messages requires non empty array"
      };
      if (e.length > 50) throw {
        code: 400,
        content: "The maximum number of messages is 50"
      };
      var t = Dn.byIMMessage(e[0]);
      for (var _s24 = 0; _s24 < e.length; _s24++) {
        var _n25 = e[_s24];
        if (!(_n25 instanceof On)) throw {
          code: 400,
          content: "message[" + _s24 + "] is not a correct message"
        };
        if (_s24 > 0) {
          var _e19 = Dn.byIMMessage(_n25);
          if (_e19.scene !== t.scene || _e19.id !== t.id) throw {
            code: 400,
            content: "each message must be from the same friend or group"
          };
        }
      }
    }
  }], [{
    key: "init",
    value: function init() {
      return oi.instance || (oi.instance = new oi()), oi.instance.map = new Map(), oi.instance;
    }
  }, {
    key: "get",
    value: function get(e) {
      return oi.instance.findOrCreateHistory(e);
    }
  }]);
  return oi;
}();
var ri = /*#__PURE__*/function () {
  function ri(e) {
    (0, _classCallCheck2.default)(this, ri);
    this.top = !1, this.data = null, this.dataLoaded = !1, this.target = e;
  }
  (0, _createClass2.default)(ri, [{
    key: "toDto",
    value: function toDto() {
      var e = this.target.scene,
        t = this.target.id,
        s = new lo();
      return e === co.PRIVATE ? s.userId = t : e === co.GROUP ? s.groupId = t : e === co.CS && (s.id = this.target.teamId), s.type = e, s.lastMessage = this.getMaxMessage(), s.unread = this.getUnreadAmount(), s.top = this.top, s.data = this.data, s;
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage() {
      return oi.get(this.target).getMaxMessage();
    }
  }, {
    key: "getUnreadAmount",
    value: function getUnreadAmount() {
      return oi.get(this.target).unreadAmount();
    }
  }, {
    key: "maxMessageTime",
    value: function maxMessageTime() {
      return oi.get(this.target).maxTime();
    }
  }]);
  return ri;
}();
var ai = /*#__PURE__*/function (_ri) {
  (0, _inherits2.default)(ai, _ri);
  var _super23 = _createSuper(ai);
  function ai(e) {
    var _this69;
    (0, _classCallCheck2.default)(this, ai);
    _this69 = _super23.call(this, e), _this69.accepted = !1;
    return _this69;
  }
  (0, _createClass2.default)(ai, [{
    key: "toDto",
    value: function toDto() {
      var e = new lo(),
        t = this.target.scene,
        s = this.target.id,
        n = this.target.teamId;
      return e.id = s, e.teamId = n, e.type = t, e.lastMessage = this.getMaxMessage(), e.unread = this.getUnreadAmount(), e.top = this.top, e.data = this.data, e.ended = this.isEnded(), e;
    }
  }, {
    key: "isEnded",
    value: function isEnded() {
      var e = this.getMaxMessage(),
        t = e.type,
        s = e.payload;
      return t === Rn.END || t === Rn.TRANSFER && s.transferTo.id !== js.u();
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage() {
      return oi.get(this.target).getMaxMessage(this.accepted);
    }
  }, {
    key: "getUnreadAmount",
    value: function getUnreadAmount() {
      return oi.get(this.target).unreadAmount(this.accepted);
    }
  }, {
    key: "maxMessageTime",
    value: function maxMessageTime() {
      return oi.get(this.target).maxTime(this.accepted);
    }
  }]);
  return ai;
}(ri);
var ci = /*#__PURE__*/(0, _createClass2.default)(function ci(e, t, s, n) {
  (0, _classCallCheck2.default)(this, ci);
  this.type = e, this.top = t, this.targetId = s, this.teamId = n;
});
var ui = /*#__PURE__*/(0, _createClass2.default)(function ui(e, t, s) {
  (0, _classCallCheck2.default)(this, ui);
  this.type = e, this.targetId = t, this.teamId = s;
});
var li = /*#__PURE__*/(0, _createClass2.default)(function li(e, t, s) {
  (0, _classCallCheck2.default)(this, li);
  this.type = e, this.targetId = t, this.teamId = s;
});
var di = /*#__PURE__*/function () {
  function di() {
    (0, _classCallCheck2.default)(this, di);
  }
  (0, _createClass2.default)(di, [{
    key: "top",
    value: function top(e, t) {
      var s = new ci(e.scene, t, e.id, e.teamId);
      return new Promise(function (e, t) {
        var n = new As({
          name: Os.topConversation,
          params: s,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          success: function success(s) {
            200 === s.code ? e(s) : t(s);
          },
          fail: function fail(e) {
            t(e);
          }
        });
        js.s().emit(n);
      });
    }
  }, {
    key: "remove",
    value: function remove(e) {
      var t = new ui(e.scene, e.id, e.teamId);
      return new Promise(function (e, s) {
        var n = new As({
          name: Os.removeConversation,
          params: t,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          success: function success(t) {
            200 == t.code ? e(t) : s(t);
          },
          fail: function fail(e) {
            s(e);
          }
        });
        js.s().emit(n);
      });
    }
  }, {
    key: "query",
    value: function query(e) {
      var _this70 = this;
      return new Promise(function (s, n) {
        var i = new As({
          name: e,
          params: {},
          permission: Jt.READ,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          fail: function fail(e) {
            n(e);
          },
          success: function success(e) {
            return t(_this70, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee38() {
              return _regenerator.default.wrap(function _callee38$(_context38) {
                while (1) {
                  switch (_context38.prev = _context38.next) {
                    case 0:
                      s(e);
                    case 1:
                    case "end":
                      return _context38.stop();
                  }
                }
              }, _callee38);
            }));
          }
        });
        js.s().emit(i);
      });
    }
  }, {
    key: "loadData",
    value: function loadData(e) {
      var t = new li(e.scene, e.id, e.teamId);
      return new Promise(function (e, s) {
        var n = new As({
          name: Os.imData,
          params: t,
          permission: Jt.READ,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          success: function success(t) {
            var s = JSON.parse(t.content);
            e(s);
          },
          fail: function fail(e) {
            s(e);
          }
        });
        js.s().emit(n);
      });
    }
  }]);
  return di;
}();
di.instance = new di();
var hi = /*#__PURE__*/function () {
  function hi() {
    var _this71 = this;
    (0, _classCallCheck2.default)(this, hi);
    this.list = new Array(), this.builder = new Hn(), this.remoteConversations = di.instance, this.synchronized = !1, Ds.on(Nn.MAX_MESSAGE_CHANGED, function (e) {
      return _this71.onMaxMessageChanged(e);
    }), Ds.on(Nn.UNREAD_AMOUNT_CHANGED, function (e) {
      return _this71.onUnreadMessageChanged(e);
    }), Ds.on(Nn.MAX_MESSAGE_DELETED, function (e) {
      return _this71.onMaxMessageDeleted(e);
    });
  }
  (0, _createClass2.default)(hi, [{
    key: "onUnreadMessageChanged",
    value: function onUnreadMessageChanged(e) {
      this.findConversation(e) && this.fireUpdated();
    }
  }, {
    key: "fireUpdated",
    value: function fireUpdated() {
      var e = this.loadLocalConversations(),
        t = this.getUpdatedEventName();
      Yi.aec.fire(t, {
        unreadTotal: e.content.unreadTotal,
        conversations: e.content.conversations
      });
    }
  }, {
    key: "getUpdatedEventName",
    value: function getUpdatedEventName() {
      return Ks.CONVERSATIONS_UPDATED;
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee39() {
        var t;
        return _regenerator.default.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                _context39.t0 = this.synchronized;
                if (_context39.t0) {
                  _context39.next = 4;
                  break;
                }
                _context39.next = 4;
                return this.loadServerConversations();
              case 4:
                t = this.loadLocalConversations();
                sn.onSuccess(e, t);
              case 6:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));
    }
  }, {
    key: "loadServerConversations",
    value: function loadServerConversations() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee40() {
        var e, t;
        return _regenerator.default.wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                e = this.rocketName();
                _context40.next = 3;
                return this.remoteConversations.query(e);
              case 3:
                t = _context40.sent;
                this.convertAbbrConversation(t.content), this.synchronized = !0;
              case 5:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this);
      }));
    }
  }, {
    key: "rocketName",
    value: function rocketName() {
      return Os.imLastConversations;
    }
  }, {
    key: "convertAbbrConversation",
    value: function convertAbbrConversation(e) {
      var t = e;
      var _iterator4 = _createForOfIteratorHelper(t),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _e20 = _step4.value;
          var _t23 = _e20.t,
            _s25 = _e20.top,
            _n26 = _e20.d ? JSON.parse(_e20.d) : {},
            _i13 = _e20.userOffsets;
          _e20.lmsg.t = _t23;
          var _o6 = _e20.lmsg,
            _r2 = this.builder.build(_o6),
            _a2 = Dn.byIMMessage(_r2),
            _c = this.findConversation(_a2);
          es.isUndef(_c) ? (_c = this.buildByAbbr(_e20, _r2), this.insertOne(_c)) : (_c.top = _s25, _c.data = _n26), oi.get(_a2).initMaxMessageAndOffsets(_r2, _i13), this.correctPosition(_c);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "onMaxMessageDeleted",
    value: function onMaxMessageDeleted(e) {
      this.removeConversation(e);
    }
  }, {
    key: "onMaxMessageChanged",
    value: function onMaxMessageChanged(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee41() {
        var _t24;
        return _regenerator.default.wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                if (!(e.scene() === co.CS)) {
                  _context41.next = 4;
                  break;
                }
                _t24 = e;
                if (!(js.u() != _t24.customerId() && (!1 === _t24.accepted || _t24.type === Rn.ACCEPT && _t24.senderId != js.u()))) {
                  _context41.next = 4;
                  break;
                }
                return _context41.abrupt("return");
              case 4:
                _context41.next = 6;
                return this.saveOrUpdateConversation(e);
              case 6:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this);
      }));
    }
  }, {
    key: "saveOrUpdateConversation",
    value: function saveOrUpdateConversation(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee42() {
        var t, s, n;
        return _regenerator.default.wrap(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                t = e.status, s = Dn.byIMMessage(e), n = this.findConversation(s);
                _context42.t0 = es.isUndef(n) && t !== uo.FAIL;
                if (!_context42.t0) {
                  _context42.next = 11;
                  break;
                }
                n = this.buildByMessage(e);
                this.insertOne(n);
                _context42.t1 = t === uo.SUCCESS;
                if (!_context42.t1) {
                  _context42.next = 11;
                  break;
                }
                _context42.next = 9;
                return this.remoteConversations.loadData(s);
              case 9:
                n.data = _context42.sent;
                n.dataLoaded = !0;
              case 11:
                t === uo.SENDING && (n.data = e.getToData(), n.dataLoaded = !0);
                n && n.dataLoaded && (this.correctPosition(n), this.fireUpdated());
              case 13:
              case "end":
                return _context42.stop();
            }
          }
        }, _callee42, this);
      }));
    }
  }, {
    key: "loadLocalConversations",
    value: function loadLocalConversations() {
      var e = 0,
        t = new Array();
      var _iterator5 = _createForOfIteratorHelper(this.list),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _s26 = _step5.value;
          if (_s26.dataLoaded && _s26.getMaxMessage()) {
            e += _s26.getUnreadAmount();
            var _n27 = _s26.toDto();
            t.push(_n27);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      return {
        code: 200,
        content: {
          unreadTotal: e,
          conversations: t
        }
      };
    }
  }, {
    key: "findConversationIndex",
    value: function findConversationIndex(e) {
      return this.list.findIndex(function (t) {
        return e.toString() === t.target.toString();
      });
    }
  }, {
    key: "findConversation",
    value: function findConversation(e) {
      var t = this.findConversationIndex(e);
      return this.list[t];
    }
  }, {
    key: "removeLocalConversation",
    value: function removeLocalConversation(e) {
      var t = this.findConversationIndex(e.target);
      this.list.splice(t, 1);
    }
  }, {
    key: "insertOne",
    value: function insertOne(e) {
      hi.sortedInserter.insert(this.list, e), this.list.length > hi.CONVERSATIONS_MAX_LENGTH && (this.list = this.list.slice(0, hi.CONVERSATIONS_MAX_LENGTH));
    }
  }, {
    key: "correctPosition",
    value: function correctPosition(e) {
      this.removeLocalConversation(e), this.insertOne(e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      var t = this.findConversation(e);
      t && (this.removeLocalConversation(t), this.fireUpdated());
    }
  }, {
    key: "top",
    value: function top(e, s, n) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee43() {
        var t;
        return _regenerator.default.wrap(function _callee43$(_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                if (es.isBoolean(s)) {
                  _context43.next = 2;
                  break;
                }
                throw new Error("top must be boolean.");
              case 2:
                t = this.findConversation(e);
                if (t) {
                  _context43.next = 5;
                  break;
                }
                throw new Error("conversation does not exist.");
              case 5:
                _context43.t0 = t.top != s;
                if (!_context43.t0) {
                  _context43.next = 11;
                  break;
                }
                _context43.next = 9;
                return this.remoteConversations.top(e, s);
              case 9:
                t.top = s;
                this.correctPosition(t);
              case 11:
                this.fireUpdated();
                sn.onSuccess(n);
              case 13:
              case "end":
                return _context43.stop();
            }
          }
        }, _callee43, this);
      }));
    }
  }, {
    key: "remove",
    value: function remove(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee44() {
        var t;
        return _regenerator.default.wrap(function _callee44$(_context44) {
          while (1) {
            switch (_context44.prev = _context44.next) {
              case 0:
                t = this.findConversation(e);
                if (t) {
                  _context44.next = 3;
                  break;
                }
                throw new Error("conversation does not exist.");
              case 3:
                if (!(t instanceof ai && !t.isEnded())) {
                  _context44.next = 5;
                  break;
                }
                throw new Error("CS conversation can only be deleted after it ends");
              case 5:
                _context44.next = 7;
                return this.remoteConversations.remove(e);
              case 7:
                this.removeLocalConversation(t);
                this.fireUpdated();
                sn.onSuccess(s);
              case 10:
              case "end":
                return _context44.stop();
            }
          }
        }, _callee44, this);
      }));
    }
  }, {
    key: "buildByAbbr",
    value: function buildByAbbr(e, t) {
      var s,
        n = Dn.byIMMessage(t);
      if (e.t === co.CS) {
        var _e21 = t;
        js.u() === _e21.customerId() ? s = new ri(n) : (s = new ai(n), s.accepted = _e21.accepted);
      } else s = new ri(n);
      return s.dataLoaded = !0, s.top = e.top, s.data = e.d ? JSON.parse(e.d) : {}, s;
    }
  }, {
    key: "buildByMessage",
    value: function buildByMessage(e) {
      var t,
        s = Dn.byIMMessage(e);
      if (e.scene() === co.CS) {
        var _n28 = e;
        js.u() === _n28.customerId() ? t = new ri(s) : (t = new ai(s), t.accepted = _n28.accepted);
      } else t = new ri(s);
      return t;
    }
  }]);
  return hi;
}();
hi.CONVERSATIONS_MAX_LENGTH = 200, hi.sortedInserter = new ( /*#__PURE__*/function (_Pn2) {
  (0, _inherits2.default)(_class14, _Pn2);
  var _super24 = _createSuper(_class14);
  function _class14() {
    (0, _classCallCheck2.default)(this, _class14);
    return _super24.apply(this, arguments);
  }
  (0, _createClass2.default)(_class14, [{
    key: "compare",
    value: function compare(e, t) {
      var s;
      if (e.top == t.top) {
        var _n29 = e.maxMessageTime();
        s = t.maxMessageTime() - _n29;
      } else s = e.top ? -1 : 1;
      return 0 === s ? 0 : s > 0 ? 1 : -1;
    }
  }]);
  return _class14;
}(Pn))();
var pi = /*#__PURE__*/function (_hi) {
  (0, _inherits2.default)(pi, _hi);
  var _super25 = _createSuper(pi);
  function pi() {
    var _this72;
    (0, _classCallCheck2.default)(this, pi);
    _this72 = _super25.call(this), _this72.expired = !1, Ds.on(Nn.CS_ONLINE_SUCCESS, function () {
      return _this72.onCSOnlineSuccess();
    }), Ds.on(Nn.CS_OFFLINE_SUCCESS, function () {
      return _this72.onCSOfflineSuccess();
    }), js.s().addDisconnectedObserver(_this72.onDisconnected.bind((0, _assertThisInitialized2.default)(_this72))), js.s().addConnectedObserver(_this72.onConnected.bind((0, _assertThisInitialized2.default)(_this72)));
    return _this72;
  }
  (0, _createClass2.default)(pi, [{
    key: "onMaxMessageChanged",
    value: function onMaxMessageChanged(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee45() {
        var _t25, _t26;
        return _regenerator.default.wrap(function _callee45$(_context45) {
          while (1) {
            switch (_context45.prev = _context45.next) {
              case 0:
                if (!(e.scene() === co.CS)) {
                  _context45.next = 10;
                  break;
                }
                _t25 = e;
                if (!(_t25.customerId() != js.u() && (!1 === _t25.accepted || _t25.type === Rn.ACCEPT))) {
                  _context45.next = 10;
                  break;
                }
                if (!(Rn.ACCEPT === e.type)) {
                  _context45.next = 8;
                  break;
                }
                _t26 = Dn.byIMMessage(e);
                this.removeConversation(_t26);
                _context45.next = 10;
                break;
              case 8:
                _context45.next = 10;
                return this.saveOrUpdateConversation(e);
              case 10:
              case "end":
                return _context45.stop();
            }
          }
        }, _callee45, this);
      }));
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      var _this73 = this;
      var s = Object.create(null, {
        latestConversations: {
          get: function get() {
            return (0, _get2.default)((0, _getPrototypeOf2.default)(pi.prototype), "latestConversations", _this73);
          }
        }
      });
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee46() {
        var t;
        return _regenerator.default.wrap(function _callee46$(_context46) {
          while (1) {
            switch (_context46.prev = _context46.next) {
              case 0:
                t = this.synchronized;
                _context46.next = 3;
                return s.latestConversations.call(this, e);
              case 3:
                this.list.length > 0 && !t && this.fireUpdated();
              case 4:
              case "end":
                return _context46.stop();
            }
          }
        }, _callee46, this);
      }));
    }
  }, {
    key: "onUnreadMessageChanged",
    value: function onUnreadMessageChanged(e) {}
  }, {
    key: "onCSOnlineSuccess",
    value: function onCSOnlineSuccess() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee47() {
        return _regenerator.default.wrap(function _callee47$(_context47) {
          while (1) {
            switch (_context47.prev = _context47.next) {
              case 0:
                _context47.next = 2;
                return this.loadServerConversations();
              case 2:
                this.fireUpdated();
              case 3:
              case "end":
                return _context47.stop();
            }
          }
        }, _callee47, this);
      }));
    }
  }, {
    key: "onCSOfflineSuccess",
    value: function onCSOfflineSuccess() {
      this.list = [], this.fireUpdated();
    }
  }, {
    key: "getUpdatedEventName",
    value: function getUpdatedEventName() {
      return Ks.PENDING_CONVERSATIONS_UPDATED;
    }
  }, {
    key: "rocketName",
    value: function rocketName() {
      return Os.CS_PENDING_CONVERSATION;
    }
  }, {
    key: "convertAbbrConversation",
    value: function convertAbbrConversation(e) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee48() {
        var t, _iterator6, _step6, _e22, _t27, _s27, _n30, _i14, _o7, _r3, _a3;
        return _regenerator.default.wrap(function _callee48$(_context48) {
          while (1) {
            switch (_context48.prev = _context48.next) {
              case 0:
                t = e;
                _iterator6 = _createForOfIteratorHelper(t);
                try {
                  for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    _e22 = _step6.value;
                    _e22.lastMessage.t = co.CS;
                    _t27 = _e22.customerData, _s27 = _e22.lastMessage, _n30 = _e22.userOffsets, _i14 = _t27 ? JSON.parse(_t27) : {}, _o7 = this.builder.build(_s27), _r3 = Dn.byIMMessage(_o7), _a3 = this.findConversation(_r3);
                    es.isUndef(_a3) && (_a3 = new ai(_r3), _a3.accepted = _o7.accepted, _a3.dataLoaded = !0, this.insertOne(_a3)), _a3.top = !1, _a3.data = _i14, oi.get(_r3).initPendingMaxMessageAndOffsets(_o7, _n30), this.correctPosition(_a3);
                  }
                } catch (err) {
                  _iterator6.e(err);
                } finally {
                  _iterator6.f();
                }
              case 3:
              case "end":
                return _context48.stop();
            }
          }
        }, _callee48, this);
      }));
    }
  }, {
    key: "onDisconnected",
    value: function onDisconnected() {
      this.expired = !0;
    }
  }, {
    key: "onConnected",
    value: function onConnected() {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee49() {
        var e;
        return _regenerator.default.wrap(function _callee49$(_context49) {
          while (1) {
            switch (_context49.prev = _context49.next) {
              case 0:
                e = js.supportIM();
                _context49.t0 = this.expired && e;
                if (!_context49.t0) {
                  _context49.next = 8;
                  break;
                }
                this.expired = !1;
                this.list = [];
                _context49.next = 7;
                return this.loadServerConversations();
              case 7:
                this.fireUpdated();
              case 8:
              case "end":
                return _context49.stop();
            }
          }
        }, _callee49, this);
      }));
    }
  }]);
  return pi;
}(hi);
var mi = /*#__PURE__*/function () {
  function mi() {
    (0, _classCallCheck2.default)(this, mi);
    this.conversations = new hi(), this.pendingConversations = new pi();
  }
  (0, _createClass2.default)(mi, [{
    key: "latestConversations",
    value: function latestConversations(e) {
      this.conversations.latestConversations(e);
    }
  }, {
    key: "latestPendingConversations",
    value: function latestPendingConversations(e) {
      this.pendingConversations.latestConversations(e);
    }
  }, {
    key: "topPrivateConversation",
    value: function topPrivateConversation(e) {
      var t = Dn.byScene(co.PRIVATE, e.userId);
      this.conversations.top(t, e.top, e);
    }
  }, {
    key: "topGroupConversation",
    value: function topGroupConversation(e) {
      var t = Dn.byScene(co.GROUP, e.groupId);
      this.conversations.top(t, e.top, e);
    }
  }, {
    key: "topConversation",
    value: function topConversation(e) {
      var t = e.conversation;
      this.validateConversationDTO(t);
      var s = Dn.byConversationDTO(t);
      this.conversations.top(s, e.top, e);
    }
  }, {
    key: "removePrivateConversation",
    value: function removePrivateConversation(e) {
      var t = Dn.byScene(co.PRIVATE, e.userId);
      this.conversations.remove(t, e);
    }
  }, {
    key: "removeGroupConversation",
    value: function removeGroupConversation(e) {
      var t = Dn.byScene(co.GROUP, e.groupId);
      this.conversations.remove(t, e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      var t = e.conversation;
      this.validateConversationDTO(t);
      var s = Dn.byConversationDTO(t);
      this.conversations.remove(s, e);
    }
  }, {
    key: "validateConversationDTO",
    value: function validateConversationDTO(e) {
      if (!(e instanceof lo)) throw new Error("Incorrect conversation object.");
      {
        var _t28 = e.lastMessage;
        if (_t28 instanceof Vn && _t28.customerId() !== js.u() && !1 === _t28.accepted) throw new Error("pending conversation cannot be topped or removed.");
      }
    }
  }]);
  return mi;
}();
var fi = /*#__PURE__*/function () {
  function fi() {
    (0, _classCallCheck2.default)(this, fi);
    this.builder = new Hn(), _s.instance.addAssembler(new ( /*#__PURE__*/function () {
      function _class15() {
        (0, _classCallCheck2.default)(this, _class15);
      }
      (0, _createClass2.default)(_class15, [{
        key: "assemble",
        value: function assemble(e) {
          var t = {
            messageId: e.id,
            timestamp: e.tm,
            type: e.t,
            senderId: e.sid,
            toType: e.tt
          };
          return e.tt === co.GROUP && (t.groupId = e.gid), t;
        }
      }, {
        key: "support",
        value: function support(e) {
          return !!e.sid;
        }
      }]);
      return _class15;
    }())());
  }
  (0, _createClass2.default)(fi, [{
    key: "initialGoEasySocket",
    value: function initialGoEasySocket() {
      js.s().addMessageObserver(Js.imMessage, this.onMessageReceived.bind(this));
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      if (e.t !== co.CS) {
        var _t29 = this.builder.build(e);
        this.sendAck(_t29);
        var _s28 = Dn.byIMMessage(_t29),
          _n31 = _s28.scene;
        oi.get(_s28).existsMessage(_t29) || (this.createNotification(e), Ds.fire(Nn.MESSAGE_RECEIVED, _t29), _n31 === co.PRIVATE ? Yi.aec.fire(Ks.PRIVATE_MESSAGE_RECEIVED, _t29) : _n31 === co.GROUP && Yi.aec.fire(Ks.GROUP_MESSAGE_RECEIVED, _t29));
      }
    }
  }, {
    key: "sendAck",
    value: function sendAck(e) {
      js.s().sendAck("imAck", {
        publishGuid: e.messageId
      });
    }
  }, {
    key: "createNotification",
    value: function createNotification(e) {
      var t = _s.instance.supportNotification();
      if (!es.isObject(e.nt) || e.s === js.u() || !t) return;
      var s = {
        id: e.i,
        tm: e.ts,
        t: e.mt,
        sid: e.s,
        tt: e.t
      };
      s.tt === co.GROUP && (s.gid = e.r), _s.instance.createLocalNotification(e.nt.t, e.nt.c, s);
    }
  }]);
  return fi;
}();
var gi = /*#__PURE__*/function () {
  function gi() {
    (0, _classCallCheck2.default)(this, gi);
  }
  (0, _createClass2.default)(gi, [{
    key: "subscribe",
    value: function subscribe(e) {
      Hs.validateIdArray(e.groupIds, "groupIds"), e.groupIds = e.groupIds.toString().split(",");
      var t = new As({
        name: Os.subscribeGroups,
        params: {
          groupIds: e.groupIds,
          at: e.accessToken
        },
        permission: Jt.WRITE,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        success: function success() {
          sn.onSuccess(e, {
            code: 200,
            content: "ok"
          });
        },
        fail: function fail(t) {
          sn.onFailed(e, {
            code: t.resultCode || 408,
            content: t.content || "Failed to subscribe group message"
          });
        }
      });
      js.s().emit(t);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      Hs.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = new As({
        name: Os.unsubscribeGroup,
        params: {
          groupId: e.groupId
        },
        permission: Jt.READ,
        singleTimeout: Rs.commonRequestSingle,
        totalTimeout: Rs.commonRequestTotal,
        success: function success() {
          sn.onSuccess(e, {
            code: 200,
            content: "ok"
          });
        },
        fail: function fail(t) {
          sn.onFailed(e, {
            code: t.resultCode || 408,
            content: t.content || "Failed to unsubscribe group message"
          });
        }
      });
      js.s().emit(t);
    }
  }]);
  return gi;
}();
var yi = /*#__PURE__*/function () {
  function yi() {
    (0, _classCallCheck2.default)(this, yi);
    js.s().addMessageObserver(Js.groupPresence, this.newMessageReceived.bind(this));
  }
  (0, _createClass2.default)(yi, [{
    key: "presence",
    value: function presence(e) {
      Hs.validateIdArray(e.groupIds, "groupIds"), e.groupIds.toString().split(",");
      var t = {
        groupIds: e.groupIds
      };
      this.emitRocket(Os.subscribeGroupPresence, t, function () {
        sn.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        sn.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to subscribe group message"
        });
      }, Rs.commonRequestSingle, Rs.commonRequestTotal);
    }
  }, {
    key: "unPresence",
    value: function unPresence(e) {
      Hs.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = {
        groupId: e.groupId
      };
      this.emitRocket(Os.unsubscribeGroupPresence, t, function () {
        sn.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        sn.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to unsubscribe presence"
        });
      }, Rs.commonRequestSingle, Rs.commonRequestTotal);
    }
  }, {
    key: "emitRocket",
    value: function emitRocket(e, t, s, n, i, o) {
      var r = new As({
        name: e,
        params: t,
        singleTimeout: i,
        totalTimeout: o,
        permission: Jt.WRITE,
        success: s,
        fail: n
      });
      js.s().emit(r);
    }
  }, {
    key: "newMessageReceived",
    value: function newMessageReceived(e) {
      var t = null;
      e.c && (t = JSON.parse(e.c)), t && t.events && t.events.map(function (e) {
        var s = e.userData ? JSON.parse(e.userData) : {},
          n = {
            time: e.time,
            action: e.action,
            groupOnlineCount: t.userAmount,
            groupId: t.groupId,
            id: e.userId,
            data: s
          };
        Yi.aec.fire(Ks.GROUP_PRESENCE, n);
      });
    }
  }]);
  return yi;
}();
var vi = /*#__PURE__*/function () {
  function vi() {
    (0, _classCallCheck2.default)(this, vi);
  }
  (0, _createClass2.default)(vi, [{
    key: "get",
    value: function get(e) {
      Hs.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = new As({
        name: Os.imGroupOnlineCount,
        params: {
          groupId: e.groupId
        },
        permission: Jt.READ,
        singleTimeout: Rs.commonQuerySingle,
        totalTimeout: Rs.commonQueryTotal,
        fail: function fail(t) {
          sn.onFailed(e, t || {
            code: 408,
            content: "Failed to query online group users"
          });
        },
        success: function success(t) {
          200 == t.code ? sn.onSuccess(e, t) : sn.onFailed(e, t);
        }
      });
      js.s().emit(t);
    }
  }]);
  return vi;
}();
var Ei = /*#__PURE__*/function () {
  function Ei() {
    (0, _classCallCheck2.default)(this, Ei);
  }
  (0, _createClass2.default)(Ei, [{
    key: "doHereNow",
    value: function doHereNow(e, t, s) {
      var n = new As({
        name: e,
        params: t,
        permission: Jt.READ,
        singleTimeout: Rs.commonQuerySingle,
        totalTimeout: Rs.commonQueryTotal,
        fail: function fail(e) {
          sn.onFailed(s, e);
        },
        success: function success(e) {
          var t = e.content;
          e.content = t.map(function (e) {
            var t = e.userData ? JSON.parse(e.userData) : {};
            return {
              id: e.userId,
              data: t
            };
          }), sn.onSuccess(s, e);
        }
      });
      js.s().emit(n);
    }
  }]);
  return Ei;
}();
var Ci = /*#__PURE__*/function (_Ei) {
  (0, _inherits2.default)(Ci, _Ei);
  var _super26 = _createSuper(Ci);
  function Ci() {
    (0, _classCallCheck2.default)(this, Ci);
    return _super26.apply(this, arguments);
  }
  (0, _createClass2.default)(Ci, [{
    key: "hereNow",
    value: function hereNow(e) {
      Hs.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = {
        groupId: e.groupId
      };
      this.doHereNow(Os.imGroupHereNow, t, e);
    }
  }]);
  return Ci;
}(Ei);
var Si = /*#__PURE__*/function () {
  function Si() {
    (0, _classCallCheck2.default)(this, Si);
    js.s().addMessageObserver(Js.userPresence, this.newMessageReceived.bind(this));
  }
  (0, _createClass2.default)(Si, [{
    key: "presence",
    value: function presence(e) {
      Hs.validateIdArray(e.userIds, "userIds"), e.userIds.toString().split(",");
      var t = {
        userIds: e.userIds
      };
      this.emitRocket(Os.subscribeUserPresence, t, function () {
        sn.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        sn.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to subscribe group message"
        });
      }, Rs.commonRequestSingle, Rs.commonRequestTotal);
    }
  }, {
    key: "unPresence",
    value: function unPresence(e) {
      Hs.validateId(e.userId, "userId"), e.userId = e.userId.toString();
      var t = {
        userId: e.userId
      };
      this.emitRocket(Os.unsubscribeUserPresence, t, function () {
        sn.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        sn.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to unsubscribe presence"
        });
      }, Rs.commonRequestSingle, Rs.commonRequestTotal);
    }
  }, {
    key: "emitRocket",
    value: function emitRocket(e, t, s, n, i, o) {
      var r = new As({
        name: e,
        params: t,
        singleTimeout: i,
        totalTimeout: o,
        permission: Jt.WRITE,
        success: s,
        fail: n
      });
      js.s().emit(r);
    }
  }, {
    key: "newMessageReceived",
    value: function newMessageReceived(e) {
      var t = [];
      e.c && (t = JSON.parse(e.c).events || []), t.map(function (e) {
        var t = e.userData ? JSON.parse(e.userData) : {},
          s = {
            time: e.time,
            action: e.action,
            id: e.userId,
            data: t
          };
        Yi.aec.fire(Ks.USER_PRESENCE, s);
      });
    }
  }]);
  return Si;
}();
var bi = /*#__PURE__*/function (_Ei2) {
  (0, _inherits2.default)(bi, _Ei2);
  var _super27 = _createSuper(bi);
  function bi() {
    (0, _classCallCheck2.default)(this, bi);
    return _super27.apply(this, arguments);
  }
  (0, _createClass2.default)(bi, [{
    key: "hereNow",
    value: function hereNow(e) {
      var t = e.userIds;
      Hs.validateIdArray(t, "userIds"), t.toString().split(","), this.doHereNow(Os.imHereNow, e, e);
    }
  }]);
  return bi;
}(Ei);
var wi = new ( /*#__PURE__*/function () {
  function _class16() {
    (0, _classCallCheck2.default)(this, _class16);
  }
  (0, _createClass2.default)(_class16, [{
    key: "fileExtension",
    value: function fileExtension(e, t) {
      if (es.isString(e)) try {
        var _s29 = e.split(t);
        return _s29[_s29.length - 1];
      } catch (e) {
        throw Error(e);
      }
    }
  }]);
  return _class16;
}())();
var Ii = /*#__PURE__*/(0, _createClass2.default)(function Ii() {
  (0, _classCallCheck2.default)(this, Ii);
});
var Mi = /*#__PURE__*/function (_Ii) {
  (0, _inherits2.default)(Mi, _Ii);
  var _super28 = _createSuper(Mi);
  function Mi() {
    var _this74;
    (0, _classCallCheck2.default)(this, Mi);
    _this74 = _super28.apply(this, arguments), _this74.contentType = "", _this74.name = "", _this74.size = 0, _this74.url = "";
    return _this74;
  }
  return (0, _createClass2.default)(Mi);
}(Ii);
var Ai = /*#__PURE__*/function (_Mi) {
  (0, _inherits2.default)(Ai, _Mi);
  var _super29 = _createSuper(Ai);
  function Ai() {
    var _this75;
    (0, _classCallCheck2.default)(this, Ai);
    _this75 = _super29.apply(this, arguments), _this75.width = 0, _this75.height = 0;
    return _this75;
  }
  return (0, _createClass2.default)(Ai);
}(Mi);
var Ti = /*#__PURE__*/function () {
  function Ti() {
    (0, _classCallCheck2.default)(this, Ti);
  }
  (0, _createClass2.default)(Ti, [{
    key: "build",
    value: function build(e) {
      this.validate(e.createOptions);
      var t = this.create();
      return this.setPayload(e, t), t;
    }
  }]);
  return Ti;
}();
var Ni = /*#__PURE__*/function (_Ti) {
  (0, _inherits2.default)(Ni, _Ti);
  var _super30 = _createSuper(Ni);
  function Ni() {
    (0, _classCallCheck2.default)(this, Ni);
    return _super30.apply(this, arguments);
  }
  (0, _createClass2.default)(Ni, [{
    key: "create",
    value: function create() {
      return new Mi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        n = e.createOptions.file;
      s.url = n.path, s.name = n.name, s.size = n.size, s.contentType = n.type, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!es.isObject(e)) throw Error("it is an empty message.");
      if (!es.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return Ni;
}(Ti);
var Ri = /*#__PURE__*/function (_Ni) {
  (0, _inherits2.default)(Ri, _Ni);
  var _super31 = _createSuper(Ri);
  function Ri() {
    (0, _classCallCheck2.default)(this, Ri);
    return _super31.apply(this, arguments);
  }
  (0, _createClass2.default)(Ri, [{
    key: "create",
    value: function create() {
      return new Ai();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Ri.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        n = t,
        i = s.path || s.tempFilePath,
        o = es.isEmpty(s.name) || void 0 === s.name ? i : s.name;
      n.name = "wx-image." + wi.fileExtension(o, "."), n.contentType = "image/" + wi.fileExtension(o, "."), n.url = i, n.size = s.size, e.complete = new Promise(function (e, t) {
        wx.getImageInfo({
          src: n.url,
          success: function success(t) {
            n.width = t.width, n.height = t.height, e();
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Ri.prototype), "validate", this).call(this, e);
    }
  }]);
  return Ri;
}(Ni);
var Oi = /*#__PURE__*/function (_Mi2) {
  (0, _inherits2.default)(Oi, _Mi2);
  var _super32 = _createSuper(Oi);
  function Oi() {
    var _this76;
    (0, _classCallCheck2.default)(this, Oi);
    _this76 = _super32.apply(this, arguments), _this76.duration = 0;
    return _this76;
  }
  return (0, _createClass2.default)(Oi);
}(Mi);
var _i = /*#__PURE__*/function (_Ni2) {
  (0, _inherits2.default)(_i, _Ni2);
  var _super33 = _createSuper(_i);
  function _i() {
    (0, _classCallCheck2.default)(this, _i);
    return _super33.apply(this, arguments);
  }
  (0, _createClass2.default)(_i, [{
    key: "create",
    value: function create() {
      return new Oi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(_i.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        n = t,
        i = s.tempFilePath,
        o = es.isEmpty(s.name) || null == s.name ? i : s.name,
        r = s.duration,
        a = s.fileSize;
      n.url = i, n.size = a, n.duration = r / 1e3, n.name = "wx-audio." + wi.fileExtension(o, "."), n.contentType = "audio/" + wi.fileExtension(o, "."), e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(_i.prototype), "validate", this).call(this, e);
    }
  }]);
  return _i;
}(Ni);
var Pi = /*#__PURE__*/function (_Ii2) {
  (0, _inherits2.default)(Pi, _Ii2);
  var _super34 = _createSuper(Pi);
  function Pi() {
    var _this77;
    (0, _classCallCheck2.default)(this, Pi);
    _this77 = _super34.apply(this, arguments), _this77.text = "";
    return _this77;
  }
  return (0, _createClass2.default)(Pi);
}(Ii);
var ki = /*#__PURE__*/function (_Ti2) {
  (0, _inherits2.default)(ki, _Ti2);
  var _super35 = _createSuper(ki);
  function ki() {
    (0, _classCallCheck2.default)(this, ki);
    return _super35.apply(this, arguments);
  }
  (0, _createClass2.default)(ki, [{
    key: "create",
    value: function create() {
      return new Pi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        n = e.createOptions;
      s.text = n.text, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (es.isEmpty(e.text)) throw {
        code: 400,
        content: "text is empty"
      };
      if (!es.isString(e.text)) throw {
        code: 400,
        content: "TypeError: text requires string."
      };
      if ("" === e.text.trim()) throw {
        code: 400,
        content: "text is empty"
      };
      if (e.text.length > 2500) throw {
        code: 400,
        content: "Message text over max length 2500"
      };
    }
  }]);
  return ki;
}(Ti);
var Di = /*#__PURE__*/function (_Ii3) {
  (0, _inherits2.default)(Di, _Ii3);
  var _super36 = _createSuper(Di);
  function Di() {
    var _this78;
    (0, _classCallCheck2.default)(this, Di);
    _this78 = _super36.apply(this, arguments), _this78.video = new Fi(), _this78.thumbnail = new xi();
    return _this78;
  }
  return (0, _createClass2.default)(Di);
}(Ii);
var xi = /*#__PURE__*/function () {
  function xi() {
    (0, _classCallCheck2.default)(this, xi);
    this.name = "", this.url = "", this.width = 0, this.height = 0, this.contentType = "";
  }
  (0, _createClass2.default)(xi, [{
    key: "initURL",
    value: function initURL(e) {
      var t = It.currentPlatform();
      [Et.APP_IOS, Et.APP_ANDROID].includes(t) ? this.appUrl(e) : [Et.APPLET_WX, Et.APPLET_WX_GAME].includes(t) ? this.wxUrl(e) : this.htmlUrl(e);
    }
  }, {
    key: "htmlUrl",
    value: function htmlUrl(e) {
      var t = document.createElement("canvas");
      t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0, t.width, t.height), this.url = t.toDataURL("image/png");
    }
  }, {
    key: "wxUrl",
    value: function wxUrl(e) {}
  }, {
    key: "appUrl",
    value: function appUrl(e) {}
  }]);
  return xi;
}();
var Fi = /*#__PURE__*/(0, _createClass2.default)(function Fi() {
  (0, _classCallCheck2.default)(this, Fi);
  this.name = "", this.url = "", this.width = 0, this.height = 0, this.contentType = "", this.size = 0, this.duration = 0;
});
var Ui = /*#__PURE__*/function (_Ti3) {
  (0, _inherits2.default)(Ui, _Ti3);
  var _super37 = _createSuper(Ui);
  function Ui() {
    (0, _classCallCheck2.default)(this, Ui);
    return _super37.apply(this, arguments);
  }
  (0, _createClass2.default)(Ui, [{
    key: "create",
    value: function create() {
      return new Di();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions.file,
        n = t,
        i = n.video,
        o = n.thumbnail,
        r = s.duration,
        a = s.height,
        c = s.size,
        u = s.tempFilePath,
        l = s.thumbTempFilePath,
        d = s.width,
        _s$name = s.name,
        h = _s$name === void 0 ? "" : _s$name,
        p = es.isEmpty(h) ? u : h;
      i.contentType = "video/" + wi.fileExtension(p, "."), i.name = "wx-video." + wi.fileExtension(p, "."), i.url = u, i.width = o.width = d, i.height = o.height = a, i.size = c, i.duration = r, o.url = l, o.contentType = "image/jpg", o.name = "wx-thumbnail.jpg", e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!es.isObject(e)) throw Error("it is an empty message.");
      if (!es.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return Ui;
}(Ti);
var Li = /*#__PURE__*/function (_Ti4) {
  (0, _inherits2.default)(Li, _Ti4);
  var _super38 = _createSuper(Li);
  function Li() {
    (0, _classCallCheck2.default)(this, Li);
    return _super38.apply(this, arguments);
  }
  (0, _createClass2.default)(Li, [{
    key: "create",
    value: function create() {
      return new Mi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        n = e.createOptions.file;
      s.url = n.fullPath, s.name = n.name, s.size = n.size, s.contentType = n.type, n.type, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!es.isObject(e)) throw Error("it is an empty message.");
      if (!es.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return Li;
}(Ti);
var Gi = /*#__PURE__*/function (_Li) {
  (0, _inherits2.default)(Gi, _Li);
  var _super39 = _createSuper(Gi);
  function Gi() {
    (0, _classCallCheck2.default)(this, Gi);
    return _super39.apply(this, arguments);
  }
  (0, _createClass2.default)(Gi, [{
    key: "create",
    value: function create() {
      return new Ai();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        n = e.createOptions.file;
      s.url = n.path, s.size = n.size;
      var i = es.isEmpty(n.name) || void 0 === n.name ? n.path : n.name;
      s.contentType = "image/" + wi.fileExtension(i, "."), s.name = "uni-image." + wi.fileExtension(i, "."), e.complete = new Promise(function (e, t) {
        uni.getImageInfo({
          src: n.path,
          success: function success(t) {
            s.width = t.width, s.height = t.height, e();
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Gi.prototype), "validate", this).call(this, e);
    }
  }]);
  return Gi;
}(Li);
var qi = /*#__PURE__*/function (_Li2) {
  (0, _inherits2.default)(qi, _Li2);
  var _super40 = _createSuper(qi);
  function qi() {
    (0, _classCallCheck2.default)(this, qi);
    return _super40.apply(this, arguments);
  }
  (0, _createClass2.default)(qi, [{
    key: "create",
    value: function create() {
      return new Oi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions,
        n = t,
        i = s.file,
        o = i.tempFilePath,
        r = es.isEmpty(i.name) || null == i.name ? o : i.name;
      n.url = o, n.name = "uni-audio." + wi.fileExtension(r, "."), n.contentType = "audio/" + wi.fileExtension(r, "."), e.complete = new Promise(function (e, t) {
        uni.getFileInfo({
          filePath: o,
          success: function success(i) {
            var r = i.size;
            if (n.size = r, 0 === r) e();else if (es.isDef(s.file.duration)) n.duration = s.file.duration / 1e3, e();else {
              var _s30 = uni.createInnerAudioContext();
              _s30.src = o, _s30.onCanplay(function (i) {
                i.errCode ? (_s30.destroy(), t(i)) : (n.duration = _s30.duration, _s30.destroy(), e());
              }), _s30.onError(function (n) {
                _s30.destroy(), -99 === n.errCode ? e() : t(n);
              });
            }
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(qi.prototype), "validate", this).call(this, e);
    }
  }]);
  return qi;
}(Li);
var Bi = /*#__PURE__*/function (_Ti5) {
  (0, _inherits2.default)(Bi, _Ti5);
  var _super41 = _createSuper(Bi);
  function Bi() {
    (0, _classCallCheck2.default)(this, Bi);
    return _super41.apply(this, arguments);
  }
  (0, _createClass2.default)(Bi, [{
    key: "create",
    value: function create() {
      return new Di();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions.file,
        n = t,
        i = n.video,
        o = n.thumbnail,
        r = s.duration,
        a = s.height,
        c = s.size,
        u = s.tempFilePath,
        l = s.width,
        _s$name2 = s.name,
        d = _s$name2 === void 0 ? "" : _s$name2,
        h = es.isEmpty(d) ? u : d;
      i.size = c, i.width = l, i.height = a, i.url = u, i.duration = r, i.contentType = "video/" + wi.fileExtension(h, "."), i.name = "uni-video." + wi.fileExtension(h, "."), o.url = u, o.height = 200, o.width = Number((i.width * o.height / i.height).toFixed(0)), o.contentType = "image/jpg", o.name = "uni-thumbnail.jpg", e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!es.isObject(e)) throw Error("it is an empty message.");
      if (!es.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return Bi;
}(Ti);
var ji = /*#__PURE__*/function (_Ti6) {
  (0, _inherits2.default)(ji, _Ti6);
  var _super42 = _createSuper(ji);
  function ji() {
    (0, _classCallCheck2.default)(this, ji);
    return _super42.apply(this, arguments);
  }
  (0, _createClass2.default)(ji, [{
    key: "create",
    value: function create() {
      return new Mi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        n = e.createOptions.file,
        i = window.URL || window.webkitURL;
      s.url = i.createObjectURL(n), s.name = n.name, s.size = n.size, s.contentType = n.type, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!es.isObject(e)) throw Error("it is an empty message.");
      if (!(e.file instanceof File)) throw Error("wrong file type.");
      if (0 == e.file.size) throw Error("File size is 0.");
      if (e.file.size > 524288e3) throw Error("message-length limit 30mib");
    }
  }]);
  return ji;
}(Ti);
var Vi = /*#__PURE__*/function (_ji) {
  (0, _inherits2.default)(Vi, _ji);
  var _super43 = _createSuper(Vi);
  function Vi() {
    (0, _classCallCheck2.default)(this, Vi);
    return _super43.apply(this, arguments);
  }
  (0, _createClass2.default)(Vi, [{
    key: "create",
    value: function create() {
      return new Ai();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Vi.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        n = t,
        i = window.URL || window.webkitURL,
        o = new Image();
      o.src = i.createObjectURL(s), e.complete = new Promise(function (e, t) {
        o.onload = function () {
          n.width = o.width, n.height = o.height, i.revokeObjectURL(o.src), e();
        }, o.onerror = function (e) {
          i.revokeObjectURL(o.src), t(e);
        };
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Vi.prototype), "validate", this).call(this, e);
      var t = ["gif", "jpg", "png", "jpeg"];
      if (!t.find(function (t) {
        return t === e.file.type.split("/")[1].toLowerCase();
      })) throw Error("Only " + t.join(",") + " is supported image.");
    }
  }]);
  return Vi;
}(ji);
var Hi = /*#__PURE__*/function (_ji2) {
  (0, _inherits2.default)(Hi, _ji2);
  var _super44 = _createSuper(Hi);
  function Hi() {
    (0, _classCallCheck2.default)(this, Hi);
    return _super44.apply(this, arguments);
  }
  (0, _createClass2.default)(Hi, [{
    key: "create",
    value: function create() {
      return new Oi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Hi.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        n = t,
        i = window.URL || window.webkitURL,
        o = document.createElement("audio");
      o.src = i.createObjectURL(s), e.complete = new Promise(function (e, t) {
        o.onloadedmetadata = function () {
          n.duration = o.duration, i.revokeObjectURL(o.src), e();
        }, o.onerror = function (e) {
          i.revokeObjectURL(o.src), t(e);
        };
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Hi.prototype), "validate", this).call(this, e);
      var t = ["mp3", "ogg", "wav", "wma", "ape", "acc", "mpeg"];
      if (!t.find(function (t) {
        return t === e.file.type.split("/")[1].toLowerCase();
      })) throw Error("Only " + t.join(",") + " is supported audio.");
    }
  }]);
  return Hi;
}(ji);
var Wi = /*#__PURE__*/function (_Ti7) {
  (0, _inherits2.default)(Wi, _Ti7);
  var _super45 = _createSuper(Wi);
  function Wi() {
    (0, _classCallCheck2.default)(this, Wi);
    return _super45.apply(this, arguments);
  }
  (0, _createClass2.default)(Wi, [{
    key: "create",
    value: function create() {
      return new Di();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var _this79 = this;
      var s = e.createOptions.file,
        n = t,
        i = n.video,
        o = n.thumbnail,
        r = window.URL || window.webkitURL,
        a = document.createElement("video");
      a.src = r.createObjectURL(s), i.size = s.size, i.name = s.name, i.contentType = s.type, i.url = a.src, o.name = s.name, o.contentType = "image/jpg", e.complete = new Promise(function (e, t) {
        a.onloadedmetadata = function () {
          i.duration = a.duration, i.width = a.videoWidth, i.height = a.videoHeight, o.width = a.videoWidth, o.height = a.videoHeight, o.url = _this79.getThumbnailUrl(a), r.revokeObjectURL(a.src), e();
        }, a.onerror = function (e) {
          r.revokeObjectURL(a.src), t(e);
        };
      });
    }
  }, {
    key: "getThumbnailUrl",
    value: function getThumbnailUrl(e) {
      var t = document.createElement("canvas");
      return t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0, t.width, t.height), t.toDataURL("image/png");
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!es.isObject(e)) throw Error("it is an empty message.");
      if (!(e.file instanceof File)) throw Error("wrong file type.");
      if (0 == e.file.size) throw Error("File size is 0.");
      if (e.file.size > 31457280) throw Error("message-length limit 30mib");
      var t = ["avi", "mov", "rmvb", "rm", "flv", "mp4", "3gp", "quicktime"];
      if (!t.find(function (t) {
        return t === e.file.type.split("/")[1].toLowerCase();
      })) throw Error("Only " + t.join(",") + " is supported video.");
    }
  }]);
  return Wi;
}(Ti);
var zi = /*#__PURE__*/function (_Ii4) {
  (0, _inherits2.default)(zi, _Ii4);
  var _super46 = _createSuper(zi);
  function zi() {
    (0, _classCallCheck2.default)(this, zi);
    return _super46.apply(this, arguments);
  }
  return (0, _createClass2.default)(zi);
}(Ii);
var Xi = /*#__PURE__*/function (_Ti8) {
  (0, _inherits2.default)(Xi, _Ti8);
  var _super47 = _createSuper(Xi);
  function Xi() {
    (0, _classCallCheck2.default)(this, Xi);
    return _super47.apply(this, arguments);
  }
  (0, _createClass2.default)(Xi, [{
    key: "create",
    value: function create() {
      return new zi();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions;
      t.payload = s.payload, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.type,
        s = e.payload;
      if (es.isEmpty(t)) throw Error("type is empty.");
      if (!es.isString(t)) throw Error("type require a string");
      if (es.isEmpty(s)) throw Error("payload is empty.");
      if (!es.isPlainObject(s) && !es.isStringOrNumber(s)) throw Error("payload require object | string | number.");
    }
  }]);
  return Xi;
}(Ti);
var Ji = /*#__PURE__*/(0, _createClass2.default)(function Ji(e, t) {
  (0, _classCallCheck2.default)(this, Ji);
  this.type = e, this.createOptions = t;
});
var Ki = /*#__PURE__*/function () {
  function Ki() {
    var _this$payloadBuilders;
    (0, _classCallCheck2.default)(this, Ki);
    this.framework = Mt.currentFramework();
    var e = It.currentPlatform() === Et.APPLET_WX;
    this.payloadBuilders = (_this$payloadBuilders = {}, (0, _defineProperty2.default)(_this$payloadBuilders, Ct.UNIAPP, {
      image: new Gi(),
      file: new Li(),
      audio: new qi(),
      video: new Bi(),
      text: new ki()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, Ct.NATIVE_APPLET_WX, {
      image: new Ri(),
      file: new Ni(),
      audio: new _i(),
      video: new Ui(),
      text: new ki()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, Ct.UNKNOWN, {
      image: new Vi(),
      file: new ji(),
      audio: new Hi(),
      video: new Wi(),
      text: new ki()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, Ct.TARO, {
      image: e ? new Ri() : new Vi(),
      file: e ? new Ni() : new ji(),
      audio: e ? new _i() : new Hi(),
      video: e ? new Ui() : new Wi(),
      text: new ki()
    }), _this$payloadBuilders);
  }
  (0, _createClass2.default)(Ki, [{
    key: "buildMessage",
    value: function buildMessage(e, t) {
      var s = this.payloadBuilders[this.framework][e],
        n = new Ji(e, t);
      if (s) {
        var _e23 = s.build(n);
        n.payload = _e23;
      } else {
        var _e24 = new Xi().build(n);
        n.payload = _e24.payload;
      }
      var i = this.build(n);
      return n.complete.then(function () {
        sn.onSuccess(t, i);
      }).catch(function (e) {
        sn.onFailed(t, e);
      }), i;
    }
  }, {
    key: "build",
    value: function build(e) {
      var t,
        s = e.type,
        n = e.payload,
        i = e.createOptions,
        o = i.to,
        r = o.type;
      return this.validate(i), r === co.GROUP ? (t = new jn(), t.groupId = o.id.toString(), t.senderData = js.ud()) : r === co.PRIVATE ? (t = new Bn(), t.read = !1, t.receiverId = o.id.toString()) : r === co.CS && (t = new Vn(), t.to = o.id.toString(), t.teamId = o.id.toString(), t.senderData = js.ud()), t.senderId = js.u(), t.messageId = Ms.get(), t.payload = n, t.timestamp = Date.now(), t.type = s, t.recalled = !1, t.status = uo.NEW, t.buildOptions = e, t;
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.to;
      if (!t) throw new Error("message require property to.");
      if (!es.isObject(t)) throw new Error("TypeError: to requires an object.");
      if (!es.isObject(t.data)) throw new Error("TypeError: to.data requires an object.");
      if (!t.type || t.type !== co.GROUP && t.type !== co.PRIVATE && t.type !== co.CS) throw new Error("message require property to.type");
      if (es.isEmpty(t.id)) throw new Error("message require property to.id");
      if (!es.isStringOrNumber(t.id)) throw new Error("to.id should be a string or number.");
      if (js.u() === t.id) throw new Error("to.id can not be the same as your id.");
      es.isDef(e.notification) && Hs.validateNotification(e.notification), e.wxmpTemplateMsg && Hs.validateWXMPTemplateMsg(e.wxmpTemplateMsg);
    }
  }]);
  return Ki;
}();
var Qi = /*#__PURE__*/function (_fi) {
  (0, _inherits2.default)(Qi, _fi);
  var _super48 = _createSuper(Qi);
  function Qi() {
    (0, _classCallCheck2.default)(this, Qi);
    return _super48.apply(this, arguments);
  }
  (0, _createClass2.default)(Qi, [{
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      var _this80 = this;
      if (e.t === co.CS) {
        var _t30 = this.builder.build(e);
        this.sendAck(_t30);
        var _s31 = Dn.byIMMessage(_t30);
        if (!oi.get(_s31).existsMessage(_t30)) {
          if (_t30.customerId() === js.u()) this.createNotification(e), Ds.fire(Nn.MESSAGE_RECEIVED, _t30), Yi.aec.fire(Ks.CS_MESSAGE_RECEIVED, _t30);else {
            ti.getInstance().queryTeams().then(function () {
              si.isMyMessage(_t30) && _this80.createNotification(e), Ds.fire(Nn.CS_AGENT_MESSAGE_RECEIVED, _t30);
            });
          }
        }
      }
    }
  }]);
  return Qi;
}(fi);
var Yi = /*#__PURE__*/function () {
  function Yi(e) {
    (0, _classCallCheck2.default)(this, Yi);
    this._iMReceiver = new fi(), this.csMessageReceiver = new Qi(), this.options = e, Yi.aec = new rn(), this._userHereNow = new bi(), this.goEasyUploader = new bn(), this._groupHereNow = new Ci(), this._groupOnlineCount = new vi(), this.groupMessageSubscriber = new gi();
  }
  (0, _createClass2.default)(Yi, [{
    key: "afterConnect",
    value: function afterConnect() {
      this._iMReceiver.initialGoEasySocket(), this.csMessageReceiver.initialGoEasySocket(), this.messageBuilder = new Ki(), this.messageSender = new _n(), this.histories = oi.init(), this.histories.initialListeners(), this.conversations = new mi(), this._groupPresenceSubscriber = new yi(), this._userPresenceSubscriber = new Si();
    }
  }, {
    key: "validateModules",
    value: function validateModules() {
      if (es.isUndef(js.s())) throw Error("Please call connect() first.");
      if (!this.options.modules || !this.options.modules.includes(qs)) throw Error("Invalid options: module '".concat(qs, "' is not enabled"));
    }
  }, {
    key: "catch",
    value: function _catch(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee50() {
        return _regenerator.default.wrap(function _callee50$(_context50) {
          while (1) {
            switch (_context50.prev = _context50.next) {
              case 0:
                _context50.prev = 0;
                this.validateModules();
                Hs.validateCallbackOptions(s);
                _context50.next = 5;
                return e();
              case 5:
                _context50.next = 10;
                break;
              case 7:
                _context50.prev = 7;
                _context50.t0 = _context50["catch"](0);
                sn.onFailed(s, _context50.t0);
              case 10:
              case "end":
                return _context50.stop();
            }
          }
        }, _callee50, this, [[0, 7]]);
      }));
    }
  }, {
    key: "on",
    value: function on(e, t) {
      Yi.aec.on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      Yi.aec.off(e, t);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(pn.TEXT, e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(pn.IMAGE, e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(pn.FILE, e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(pn.AUDIO, e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(pn.VIDEO, e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(e.type, e);
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(e) {
      var _this81 = this;
      this.catch(function () {
        _this81.messageSender.send(e);
      }, e);
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      var _this82 = this;
      this.catch(function () {
        _this82.histories.recallMessage(e);
      }, e);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      var _this83 = this;
      this.catch(function () {
        _this83.histories.deleteMessage(e);
      }, e);
    }
  }, {
    key: "markGroupMessageAsRead",
    value: function markGroupMessageAsRead(e) {
      var _this84 = this;
      this.catch(function () {
        return t(_this84, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee51() {
          return _regenerator.default.wrap(function _callee51$(_context51) {
            while (1) {
              switch (_context51.prev = _context51.next) {
                case 0:
                  _context51.next = 2;
                  return this.histories.groupMarkAsRead(e);
                case 2:
                case "end":
                  return _context51.stop();
              }
            }
          }, _callee51, this);
        }));
      }, e);
    }
  }, {
    key: "markPrivateMessageAsRead",
    value: function markPrivateMessageAsRead(e) {
      var _this85 = this;
      this.catch(function () {
        return t(_this85, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee52() {
          return _regenerator.default.wrap(function _callee52$(_context52) {
            while (1) {
              switch (_context52.prev = _context52.next) {
                case 0:
                  _context52.next = 2;
                  return this.histories.privateMarkAsRead(e);
                case 2:
                case "end":
                  return _context52.stop();
              }
            }
          }, _callee52, this);
        }));
      }, e);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e, s) {
      var _this86 = this;
      this.catch(function () {
        return t(_this86, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee53() {
          return _regenerator.default.wrap(function _callee53$(_context53) {
            while (1) {
              switch (_context53.prev = _context53.next) {
                case 0:
                  _context53.next = 2;
                  return this.histories.markMessageAsRead(e, s);
                case 2:
                case "end":
                  return _context53.stop();
              }
            }
          }, _callee53, this);
        }));
      }, e);
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      this.validateModules(), this.conversations.latestConversations(e);
    }
  }, {
    key: "removePrivateConversation",
    value: function removePrivateConversation(e) {
      var _this87 = this;
      this.catch(function () {
        return _this87.conversations.removePrivateConversation(e);
      }, e);
    }
  }, {
    key: "removeGroupConversation",
    value: function removeGroupConversation(e) {
      var _this88 = this;
      this.catch(function () {
        return _this88.conversations.removeGroupConversation(e);
      }, e);
    }
  }, {
    key: "topPrivateConversation",
    value: function topPrivateConversation(e) {
      var _this89 = this;
      this.catch(function () {
        return _this89.conversations.topPrivateConversation(e);
      }, e);
    }
  }, {
    key: "topGroupConversation",
    value: function topGroupConversation(e) {
      var _this90 = this;
      this.catch(function () {
        return _this90.conversations.topGroupConversation(e);
      }, e);
    }
  }, {
    key: "history",
    value: function history(e, t) {
      var _this91 = this;
      this.catch(function () {
        _this91.histories.loadHistory(e, t);
      }, e);
    }
  }, {
    key: "subscribeUserPresence",
    value: function subscribeUserPresence(e) {
      var _this92 = this;
      this.catch(function () {
        return _this92._userPresenceSubscriber.presence(e);
      }, e);
    }
  }, {
    key: "unsubscribeUserPresence",
    value: function unsubscribeUserPresence(e) {
      var _this93 = this;
      this.catch(function () {
        return _this93._userPresenceSubscriber.unPresence(e);
      }, e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      var _this94 = this;
      this.catch(function () {
        return _this94._userHereNow.hereNow(e);
      }, e);
    }
  }, {
    key: "subscribeGroup",
    value: function subscribeGroup(e) {
      var _this95 = this;
      this.catch(function () {
        return _this95.groupMessageSubscriber.subscribe(e);
      }, e);
    }
  }, {
    key: "unsubscribeGroup",
    value: function unsubscribeGroup(e) {
      var _this96 = this;
      this.catch(function () {
        return _this96.groupMessageSubscriber.unsubscribe(e);
      }, e);
    }
  }, {
    key: "subscribeGroupPresence",
    value: function subscribeGroupPresence(e) {
      var _this97 = this;
      this.catch(function () {
        return _this97._groupPresenceSubscriber.presence(e);
      }, e);
    }
  }, {
    key: "unsubscribeGroupPresence",
    value: function unsubscribeGroupPresence(e) {
      var _this98 = this;
      this.catch(function () {
        return _this98._groupPresenceSubscriber.unPresence(e);
      }, e);
    }
  }, {
    key: "groupHereNow",
    value: function groupHereNow(e) {
      var _this99 = this;
      this.catch(function () {
        return _this99._groupHereNow.hereNow(e);
      }, e);
    }
  }, {
    key: "groupOnlineCount",
    value: function groupOnlineCount(e) {
      var _this100 = this;
      this.catch(function () {
        return _this100._groupOnlineCount.get(e);
      }, e);
    }
  }, {
    key: "latestPendingConversations",
    value: function latestPendingConversations(e) {
      this.validateModules(), this.conversations.latestPendingConversations(e);
    }
  }, {
    key: "topConversation",
    value: function topConversation(e) {
      this.validateModules(), this.conversations.topConversation(e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      this.validateModules(), this.conversations.removeConversation(e);
    }
  }], [{
    key: "init",
    value: function init(e) {
      Yi.instance = new Yi(e);
    }
  }]);
  return Yi;
}();
var $i;
!function (e) {
  e.VIDEO = "VIDEO", e.VOICE = "VOICE";
}($i || ($i = {}));
var Zi = /*#__PURE__*/(0, _createClass2.default)(function Zi(e, t) {
  (0, _classCallCheck2.default)(this, Zi);
  this.customerId = e, this.teamId = t;
});
var eo = /*#__PURE__*/(0, _createClass2.default)(function eo(e, t) {
  (0, _classCallCheck2.default)(this, eo);
  this.teamId = e;
  var s = new po(t.id.toString(), JSON.stringify(t.data));
  this.customer = s;
});
var to = /*#__PURE__*/(0, _createClass2.default)(function to(e, t, s) {
  (0, _classCallCheck2.default)(this, to);
  this.customerId = e, this.teamId = t, this.agentId = s;
});
var so = /*#__PURE__*/(0, _createClass2.default)(function so(e, t) {
  (0, _classCallCheck2.default)(this, so);
  this.customerId = e, this.teamId = t;
});
var no = /*#__PURE__*/function () {
  function no(e) {
    (0, _classCallCheck2.default)(this, no);
    this.builder = new Hn(), this.teamId = e;
  }
  (0, _createClass2.default)(no, [{
    key: "accept",
    value: function accept(e, t) {
      var _this101 = this;
      var s = t.customer;
      if (es.isUndef(s)) throw {
        code: 400,
        content: "customer is required."
      };
      Hs.validateId(s.id, "customer.id");
      var n = s.data;
      if (es.isUndef(n) || !es.isObject(n)) throw {
        code: 400,
        content: "customer data must be non-empty object."
      };
      var i = new eo(e, s),
        o = new As({
          name: Os.CS_ACCEPT,
          params: i,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          fail: function fail(e) {
            sn.onFailed(t, e);
          },
          success: function success(e) {
            var s = _this101.builder.build(e.content.message);
            Ds.fire(Nn.CS_ACCEPTED, s), sn.onSuccess(t);
          }
        });
      js.s().emit(o);
    }
  }, {
    key: "end",
    value: function end(e, t) {
      var _this102 = this;
      Hs.validateId(t.id, "id");
      var s = t.id.toString(),
        n = new so(s, e),
        i = new As({
          name: Os.CS_END,
          params: n,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          fail: function fail(e) {
            sn.onFailed(t, e);
          },
          success: function success(e) {
            var s = _this102.builder.build(e.content.message);
            Ds.fire(Nn.CS_ENDED, s), sn.onSuccess(t);
          }
        });
      js.s().emit(i);
    }
  }, {
    key: "queryCustomerStatus",
    value: function queryCustomerStatus(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee54() {
        var t;
        return _regenerator.default.wrap(function _callee54$(_context54) {
          while (1) {
            switch (_context54.prev = _context54.next) {
              case 0:
                Hs.validateId(s.id, "id");
                _context54.next = 3;
                return this.doCustomerStatus(e, s.id);
              case 3:
                t = _context54.sent;
                this.activeCustomerStatus = t, this.activeCustomerStatusOptions = s, sn.onSuccess(s, t);
              case 5:
              case "end":
                return _context54.stop();
            }
          }
        }, _callee54, this);
      }));
    }
  }, {
    key: "doCustomerStatus",
    value: function doCustomerStatus(e, t) {
      var s = t.toString(),
        n = new Zi(s, e);
      return new Promise(function (e, t) {
        var s = new As({
          name: Os.CS_CUSTOMER_STATUS,
          params: n,
          permission: Jt.READ,
          singleTimeout: Rs.commonQuerySingle,
          totalTimeout: Rs.commonQueryTotal,
          fail: function fail(e) {
            t(e);
          },
          success: function success(t) {
            var s = t.content;
            s.agent && (s.agent.data = JSON.parse(s.agent.data)), e(s);
          }
        });
        js.s().emit(s);
      });
    }
  }, {
    key: "transfer",
    value: function transfer(e, t) {
      var _this103 = this;
      Hs.validateId(t.customerId, "customerId"), Hs.validateId(t.agentId, "agentId");
      var s = t.customerId.toString(),
        n = t.agentId.toString(),
        i = new to(s, e, n),
        o = new As({
          name: Os.CS_TRANSFER,
          params: i,
          permission: Jt.WRITE,
          singleTimeout: Rs.commonRequestSingle,
          totalTimeout: Rs.commonRequestTotal,
          fail: function fail(e) {
            sn.onFailed(t, e);
          },
          success: function success(e) {
            var s = _this103.builder.build(e.content.message);
            Ds.fire(Nn.CS_TRANSFER, s), sn.onSuccess(t);
          }
        });
      js.s().emit(o);
    }
  }]);
  return no;
}();
var io = /*#__PURE__*/function () {
  function io() {
    (0, _classCallCheck2.default)(this, io);
  }
  (0, _createClass2.default)(io, [{
    key: "createTextMessage",
    value: function createTextMessage(e, t) {
      var s = Yi.instance.createTextMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e, t) {
      var s = Yi.instance.createImageMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e, t) {
      var s = Yi.instance.createFileMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e, t) {
      var s = Yi.instance.createAudioMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e, t) {
      var s = Yi.instance.createVideoMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e, t) {
      var s = Yi.instance.createCustomMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "extendProps",
    value: function extendProps(e, t) {
      if (t.scene() === co.CS) {
        var _s32 = t;
        _s32.teamId = e, _s32.accepted = !0;
      }
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return io.instance || (io.instance = new io()), io.instance;
    }
  }]);
  return io;
}();
var oo = /*#__PURE__*/function () {
  function oo(e) {
    (0, _classCallCheck2.default)(this, oo);
    this.teamId = e, this.agentStatus = ti.getInstance(), this.conversationHandler = new no(e), this.messageCreator = io.getInstance();
  }
  (0, _createClass2.default)(oo, [{
    key: "catch",
    value: function _catch(e, s) {
      return t(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee55() {
        return _regenerator.default.wrap(function _callee55$(_context55) {
          while (1) {
            switch (_context55.prev = _context55.next) {
              case 0:
                _context55.prev = 0;
                Hs.validateCallbackOptions(s);
                _context55.next = 4;
                return e();
              case 4:
                _context55.next = 9;
                break;
              case 6:
                _context55.prev = 6;
                _context55.t0 = _context55["catch"](0);
                sn.onFailed(s, _context55.t0);
              case 9:
              case "end":
                return _context55.stop();
            }
          }
        }, _callee55, null, [[0, 6]]);
      }));
    }
  }, {
    key: "isOnline",
    value: function isOnline(e) {
      var _this104 = this;
      this.catch(function () {
        _this104.agentStatus.isOnline(_this104.teamId, e);
      }, e);
    }
  }, {
    key: "online",
    value: function online(e) {
      var _this105 = this;
      this.catch(function () {
        _this105.agentStatus.online(_this105.teamId, e);
      }, e);
    }
  }, {
    key: "offline",
    value: function offline(e) {
      var _this106 = this;
      this.catch(function () {
        _this106.agentStatus.offline(_this106.teamId, e);
      }, e);
    }
  }, {
    key: "customerStatus",
    value: function customerStatus(e) {
      var _this107 = this;
      this.catch(function () {
        _this107.conversationHandler.queryCustomerStatus(_this107.teamId, e);
      }, e);
    }
  }, {
    key: "accept",
    value: function accept(e) {
      var _this108 = this;
      this.catch(function () {
        _this108.conversationHandler.accept(_this108.teamId, e);
      }, e);
    }
  }, {
    key: "end",
    value: function end(e) {
      var _this109 = this;
      this.catch(function () {
        _this109.conversationHandler.end(_this109.teamId, e);
      }, e);
    }
  }, {
    key: "history",
    value: function history(e) {
      Yi.instance.history(e, this.teamId);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e) {
      Yi.instance.markMessageAsRead(e, this.teamId);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      this.messageCreator.createTextMessage(this.teamId, e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      this.messageCreator.createImageMessage(this.teamId, e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      this.messageCreator.createFileMessage(this.teamId, e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      this.messageCreator.createAudioMessage(this.teamId, e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      this.messageCreator.createVideoMessage(this.teamId, e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      this.messageCreator.createCustomMessage(this.teamId, e);
    }
  }, {
    key: "transfer",
    value: function transfer(e) {
      var _this110 = this;
      this.catch(function () {
        _this110.conversationHandler.transfer(_this110.teamId, e);
      }, e);
    }
  }, {
    key: "agents",
    value: function agents(e) {
      var _this111 = this;
      this.catch(function () {
        _this111.agentStatus.agents(_this111.teamId, e);
      }, e);
    }
  }, {
    key: "liveSession",
    value: function liveSession(e) {
      var _this112 = this;
      this.catch(function () {
        si.live(_this112.teamId, e);
      }, e);
    }
  }, {
    key: "quitLiveSession",
    value: function quitLiveSession(e) {
      this.catch(function () {
        si.quit(e);
      }, e);
    }
  }, {
    key: "listenCustomer",
    value: function listenCustomer(e) {
      var _this113 = this;
      var t = {
        customerId: e.id,
        onNewMessage: e.onNewMessage,
        onStatusUpdated: e.onStatusUpdated,
        onFailed: e.onFailed,
        onSuccess: e.onSuccess
      };
      this.catch(function () {
        si.live(_this113.teamId, t);
      }, e);
    }
  }, {
    key: "cancelListenCustomer",
    value: function cancelListenCustomer(e) {
      this.catch(function () {
        si.quit(e);
      }, e);
    }
  }]);
  return oo;
}();
var ro = /*#__PURE__*/function () {
  function ro() {
    (0, _classCallCheck2.default)(this, ro);
  }
  (0, _createClass2.default)(ro, null, [{
    key: "team",
    value: function team(e) {
      Hs.validateId(e, "teamId");
      var t = this.teams.get(e);
      return t || (t = new oo(e.toString()), this.teams.set(e.toString(), t)), t;
    }
  }]);
  return ro;
}();
ro.teams = new Map();
var ao = /*#__PURE__*/(0, _createClass2.default)(function ao() {
  (0, _classCallCheck2.default)(this, ao);
});
exports.CallBackOptions = ao;
var co, uo;
exports.MessageStatus = uo;
exports.Scene = co;
!function (e) {
  e.PRIVATE = "private", e.GROUP = "group", e.SYSTEM = "system", e.CS = "cs";
}(co || (exports.Scene = co = {})), function (e) {
  e.NEW = "new", e.SENDING = "sending", e.SUCCESS = "success", e.FAIL = "fail";
}(uo || (exports.MessageStatus = uo = {}));
var lo = /*#__PURE__*/(0, _createClass2.default)(function lo() {
  (0, _classCallCheck2.default)(this, lo);
});
exports.ConversationDTO = lo;
var ho = /*#__PURE__*/function (_ao) {
  (0, _inherits2.default)(ho, _ao);
  var _super49 = _createSuper(ho);
  function ho() {
    (0, _classCallCheck2.default)(this, ho);
    return _super49.apply(this, arguments);
  }
  return (0, _createClass2.default)(ho);
}(ao);
exports.AgentOnlineOptions = ho;
var po = /*#__PURE__*/(0, _createClass2.default)(function po(e, t) {
  (0, _classCallCheck2.default)(this, po);
  this.id = e, this.data = t;
});
exports.User = po;
var mo = /*#__PURE__*/function (_ao2) {
  (0, _inherits2.default)(mo, _ao2);
  var _super50 = _createSuper(mo);
  function mo() {
    (0, _classCallCheck2.default)(this, mo);
    return _super50.apply(this, arguments);
  }
  return (0, _createClass2.default)(mo);
}(ao);
exports.CustomerStatusOptions = mo;
var fo = /*#__PURE__*/function () {
  function fo(e) {
    (0, _classCallCheck2.default)(this, fo);
    nn.init(e);
  }
  (0, _createClass2.default)(fo, [{
    key: "initialGoEasySocket",
    value: function initialGoEasySocket() {
      nn.instance.initialGoEasySocket();
    }
  }, {
    key: "initialBeforeConnect",
    value: function initialBeforeConnect() {
      nn.instance.initialBeforeConnect();
    }
  }, {
    key: "publish",
    value: function publish(e) {
      nn.instance.publisher.publish(e);
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      nn.instance.subscriber.subscribe(e);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      nn.instance.subscriber.unsubscribe(e);
    }
  }, {
    key: "subscribePresence",
    value: function subscribePresence(e) {
      nn.instance.presence.subscribePresence(e);
    }
  }, {
    key: "unsubscribePresence",
    value: function unsubscribePresence(e) {
      nn.instance.presence.unsubscribePresence(e);
    }
  }, {
    key: "history",
    value: function history(e) {
      nn.instance.histories.get(e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      nn.instance.hereNows.byChannel(e);
    }
  }, {
    key: "hereNowByUserIds",
    value: function hereNowByUserIds(e) {
      nn.instance.hereNows.byUserId(e);
    }
  }]);
  return fo;
}();
exports.GoEasyPubSub = fo;
var go = /*#__PURE__*/function () {
  function go(e) {
    (0, _classCallCheck2.default)(this, go);
    Yi.init(e);
  }
  (0, _createClass2.default)(go, [{
    key: "afterConnect",
    value: function afterConnect() {
      Yi.instance.afterConnect();
    }
  }, {
    key: "on",
    value: function on(e, t) {
      Yi.instance.on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      Yi.instance.off(e, t);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      return Yi.instance.createTextMessage(e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      return Yi.instance.createImageMessage(e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      return Yi.instance.createFileMessage(e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      return Yi.instance.createAudioMessage(e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      return Yi.instance.createVideoMessage(e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      return Yi.instance.createCustomMessage(e);
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(e) {
      Yi.instance.sendMessage(e);
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      Yi.instance.recallMessage(e);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      Yi.instance.deleteMessage(e);
    }
  }, {
    key: "markGroupMessageAsRead",
    value: function markGroupMessageAsRead(e) {
      Yi.instance.markGroupMessageAsRead(e);
    }
  }, {
    key: "markPrivateMessageAsRead",
    value: function markPrivateMessageAsRead(e) {
      Yi.instance.markPrivateMessageAsRead(e);
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      Yi.instance.latestConversations(e);
    }
  }, {
    key: "removePrivateConversation",
    value: function removePrivateConversation(e) {
      Yi.instance.removePrivateConversation(e);
    }
  }, {
    key: "removeGroupConversation",
    value: function removeGroupConversation(e) {
      Yi.instance.removeGroupConversation(e);
    }
  }, {
    key: "topPrivateConversation",
    value: function topPrivateConversation(e) {
      Yi.instance.topPrivateConversation(e);
    }
  }, {
    key: "topGroupConversation",
    value: function topGroupConversation(e) {
      Yi.instance.topGroupConversation(e);
    }
  }, {
    key: "history",
    value: function history(e) {
      Yi.instance.history(e);
    }
  }, {
    key: "subscribeUserPresence",
    value: function subscribeUserPresence(e) {
      Yi.instance.subscribeUserPresence(e);
    }
  }, {
    key: "unsubscribeUserPresence",
    value: function unsubscribeUserPresence(e) {
      Yi.instance.unsubscribeUserPresence(e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      Yi.instance.hereNow(e);
    }
  }, {
    key: "subscribeGroup",
    value: function subscribeGroup(e) {
      Yi.instance.subscribeGroup(e);
    }
  }, {
    key: "unsubscribeGroup",
    value: function unsubscribeGroup(e) {
      Yi.instance.unsubscribeGroup(e);
    }
  }, {
    key: "subscribeGroupPresence",
    value: function subscribeGroupPresence(e) {
      Yi.instance.subscribeGroupPresence(e);
    }
  }, {
    key: "unsubscribeGroupPresence",
    value: function unsubscribeGroupPresence(e) {
      Yi.instance.unsubscribeGroupPresence(e);
    }
  }, {
    key: "groupHereNow",
    value: function groupHereNow(e) {
      Yi.instance.groupHereNow(e);
    }
  }, {
    key: "groupOnlineCount",
    value: function groupOnlineCount(e) {
      Yi.instance.groupOnlineCount(e);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e) {
      Yi.instance.markMessageAsRead(e);
    }
  }, {
    key: "csteam",
    value: function csteam(e) {
      return new vo(e);
    }
  }, {
    key: "pendingConversations",
    value: function pendingConversations(e) {
      Yi.instance.latestPendingConversations(e);
    }
  }, {
    key: "topConversation",
    value: function topConversation(e) {
      Yi.instance.topConversation(e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      Yi.instance.removeConversation(e);
    }
  }]);
  return go;
}();
exports.GoEasyIM = go;
var yo = /*#__PURE__*/function () {
  function yo(t) {
    (0, _classCallCheck2.default)(this, yo);
    if (es.isDef(yo.instance) && yo.instance.getConnectionStatus() !== e.DISCONNECTED) return yo.instance;
    this.validateOptions(t), At.init(t.reactNativeOptions), this.options = t, _s.init(t.allowNotification), this.pubsub = new fo(this.options), this.im = new go(this.options);
  }
  (0, _createClass2.default)(yo, [{
    key: "connect",
    value: function connect(t) {
      this.getConnectionStatus() !== e.DISCONNECTED && es.isObject(t) && es.isFunction(t.onFailed) ? t.onFailed({
        code: 408,
        content: "It is already connected, don't try again until disconnect() is called. "
      }) : (this.confirmUserId(t), Ds.initial(), this.pubsub.initialBeforeConnect(), this.goEasySocket = new Vs(this.options, t), this.goEasySocket.connect(), js.i(this.goEasySocket), this.im.afterConnect(), this.pubsub.initialGoEasySocket());
    }
  }, {
    key: "disconnect",
    value: function disconnect(e) {
      this.goEasySocket.disconnect().then(function () {
        es.isObject(e) && es.isFunction(e.onSuccess) && e.onSuccess();
      }).catch(function (t) {
        es.isObject(e) && es.isFunction(e.onFailed) && e.onFailed(t);
      });
    }
  }, {
    key: "getConnectionStatus",
    value: function getConnectionStatus() {
      return this.goEasySocket ? this.goEasySocket.getStatus() : e.DISCONNECTED;
    }
  }, {
    key: "validateOptions",
    value: function validateOptions(e) {
      var t = "";
      if (!es.isObject(e)) throw t = "options is require an object.", Error(t);
      if (!es.isPrimitive(e.appkey) || 0 == e.appkey.length) throw t = "Invalid options:'appkey' is empty.", Error(t);
      if (!es.isPrimitive(e.host) || 0 == e.host.length) throw t = "Invalid options:'host' is empty.", Error(t);
      if (!es.isArray(e.modules)) throw t = "Invalid options: 'modules' must be nonempty array", Error(t);
      var s = [qs, Bs],
        n = e.modules.map(function (e) {
          var n = e.toUpperCase();
          if (!s.includes(n)) throw t = "Invalid options: module '".concat(e, "' is not support"), Error(t);
          return n;
        });
      e.modules = n;
    }
  }, {
    key: "onClickNotification",
    value: function onClickNotification(e) {
      _s.instance.onClickNotification(e);
    }
  }, {
    key: "confirmUserId",
    value: function confirmUserId(e) {
      if (this.options.modules.includes(qs) && (es.isEmpty(e.id) || !es.isStringOrNumber(e.id))) throw {
        code: 400,
        content: "TypeError: id requires number or string."
      };
      if ("string" == typeof e.id && e.id.length > 60) throw {
        code: 400,
        content: "id over max length 60"
      };
    }
  }], [{
    key: "getInstance",
    value: function getInstance(e) {
      return es.isUndef(yo.instance) && (yo.instance = new yo(e)), yo.instance;
    }
  }]);
  return yo;
}();
exports.default = yo;
yo.version = "2.6.6", yo.IM_EVENT = Ks, yo.IM_SCENE = co, yo.MEDIA_TYPE = $i;
var vo = /*#__PURE__*/function () {
  function vo(e) {
    (0, _classCallCheck2.default)(this, vo);
    this.id = e;
  }
  (0, _createClass2.default)(vo, [{
    key: "isOnline",
    value: function isOnline(e) {
      ro.team(this.id).isOnline(e);
    }
  }, {
    key: "online",
    value: function online(e) {
      ro.team(this.id).online(e);
    }
  }, {
    key: "offline",
    value: function offline(e) {
      ro.team(this.id).offline(e);
    }
  }, {
    key: "customerStatus",
    value: function customerStatus(e) {
      ro.team(this.id).customerStatus(e);
    }
  }, {
    key: "accept",
    value: function accept(e) {
      ro.team(this.id).accept(e);
    }
  }, {
    key: "end",
    value: function end(e) {
      ro.team(this.id).end(e);
    }
  }, {
    key: "history",
    value: function history(e) {
      ro.team(this.id).history(e);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e) {
      ro.team(this.id).markMessageAsRead(e);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      ro.team(this.id).createTextMessage(e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      ro.team(this.id).createImageMessage(e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      ro.team(this.id).createFileMessage(e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      ro.team(this.id).createAudioMessage(e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      ro.team(this.id).createVideoMessage(e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      ro.team(this.id).createCustomMessage(e);
    }
  }, {
    key: "transfer",
    value: function transfer(e) {
      ro.team(this.id).transfer(e);
    }
  }, {
    key: "agents",
    value: function agents(e) {
      ro.team(this.id).agents(e);
    }
  }, {
    key: "liveSession",
    value: function liveSession(e) {
      ro.team(this.id).liveSession(e);
    }
  }, {
    key: "quitLiveSession",
    value: function quitLiveSession(e) {
      ro.team(this.id).quitLiveSession(e);
    }
  }, {
    key: "listenCustomer",
    value: function listenCustomer(e) {
      ro.team(this.id).listenCustomer(e);
    }
  }, {
    key: "cancelListenCustomer",
    value: function cancelListenCustomer(e) {
      ro.team(this.id).cancelListenCustomer(e);
    }
  }]);
  return vo;
}();
exports.CSTeam = vo;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../HbuilerX/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../../../../../HbuilerX/HBuilderX/plugins/uniapp-cli/node_modules/node-libs-browser/mock/process.js */ 41), __webpack_require__(/*! ./../../../../../HbuilerX/HBuilderX/plugins/uniapp-cli/node_modules/buffer/index.js */ 43).Buffer, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),
/* 41 */
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    setTimeout(function () {
        fn.apply(null, args);
    }, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 42);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),
/* 42 */
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 41)))

/***/ }),
/* 43 */
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ 44)
var ieee754 = __webpack_require__(/*! ieee754 */ 45)
var isArray = __webpack_require__(/*! isarray */ 46)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ 3)))

/***/ }),
/* 44 */
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 45 */
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 46 */
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 47 */
/*!************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/@babel/runtime/regenerator/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! @babel/runtime/helpers/regeneratorRuntime */ 48)();
module.exports = runtime;

/***/ }),
/* 48 */
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) {
              if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            }
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) {
      keys.push(key);
    }
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) {
        "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      }
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 49 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 50 */
/*!****************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/get.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var superPropBase = __webpack_require__(/*! ./superPropBase.js */ 51);
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _get.apply(this, arguments);
}
module.exports = _get, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 51 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/superPropBase.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(/*! ./getPrototypeOf.js */ 52);
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
module.exports = _superPropBase, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 52 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 53 */
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 54 */
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized.js */ 49);
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map