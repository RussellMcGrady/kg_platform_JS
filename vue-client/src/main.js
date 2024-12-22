import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import EleForm from 'vue-ele-form'
import i18n from '@/lang' // internationalization
import Cookies from 'js-cookie'
import './styles/css/neo4jd3.css?v=0.0.1'
import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/index.scss' // global css
import './styles/bpmn-custom-color.css' // 自定义样式

// import dictionaryFunction from '@/functions/dictionary'
// import dictionaryFilter from '@/filters/dictionary'

import EleFormUploadFile from 'vue-ele-form-upload-file'
import EleFormImageUploader from 'vue-ele-form-image-uploader'
import EleFormGallery from 'vue-ele-form-gallery'
import EleFormTreeSelect from 'vue-ele-form-tree-select'

Vue.config.productionTip = false

// 路由跳转
Vue.prototype.$goRoute = function(index) {
  this.$router.push(index)
}

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(EleForm)

// 设置浏览器标题
Vue.directive('title', {
  inserted: function(el) {
    document.title = el.dataset.title
  }
})

localStorage.setItem('id', '1')
localStorage.setItem('name', 'admin')
localStorage.setItem(('company_id'), '1')
localStorage.setItem(('company_name'), '平台运营')
// 注册 image-uploader 组件
Vue.component('ImageUploader', EleFormImageUploader)

// 注册 upload-file 组件
Vue.component('UploadFile', EleFormUploadFile)

// 注册 gallery 组件
Vue.component('Gallery', EleFormGallery)

// 注册 tree-select 组件
Vue.component('TreeSelect', EleFormTreeSelect)

// 注册 ele-form
Vue.use(EleForm, {
  // 专门设置全局的 tree-select 属性
  // 属性参考: https://vue-treeselect.js.org/
  'tree-select': {
    clearable: true // 所有的 tree-select 都会有 clearable = true的属性值
  }
})
// 注册 ele-form
Vue.use(EleForm, {
  // 对所有具有上传属性的组件适用
  upload: {
    fileSize: 10
  },
  // 可以在这里设置全局的 image-uploader 属性
  'image-uploader': {
    action: 'https://jsonplaceholder.typicode.com/posts' // 上传地址
  }
})
// 注册 ele-form
Vue.use(EleForm, {
  // 对所有具有上传属性的组件适用
  upload: {
    fileSize: 10
  },
  // 专门设置全局的 upload-file 属性
  'upload-file': {
    action: 'https://jsonplaceholder.typicode.com/posts' // 上传地址
  }
})
// 注册 ele-form
Vue.use(EleForm, {
  // 可以在这里设置全局的 gallery 属性
  // 属性参考下方 #attrs
  gallery: {
    size: 150
  }
})
// 注册 ele-form
Vue.use(EleForm, {
  // 可以在这里设置全局的 json-editor 属性
  'json-editor': {
    height: 300
  }
})
// 注册 json 组件
import EleFormJsonEditor from 'vue-ele-form-json-editor'
Vue.component('JsonEditor', EleFormJsonEditor)
Vue.prototype.$axios = axios
// /* 注册数据字典全局方法*/
// Vue.use(dictionaryFunction)
// /* 注册数据字典全局过滤器*/
// Vue.use(dictionaryFilter)
// Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
