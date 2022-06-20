import Vue from 'vue'
import App from './App.vue'
import router from './router'

import "./assets/global.css"

import "./assets/fonts/iconfont.css"
//import 'element-ui/lib/theme-chalk/index.css';
// import {
// 	Form,
// 	FormItem,
// 	Input,
// 	Button,
// 	Message,
// 	Container,
// 	Header,
// 	Aside,
// 	Main,
// 	Menu,
// 	Submenu,
// 	MenuItem,
// 	Breadcrumb,
// 	BreadcrumbItem,
// 	Card,
// 	Col,
// 	Row,
// 	Table,
// 	TableColumn,
// 	Switch,
// 	Tooltip,
// 	Pagination,
// 	Dialog,
// 	MessageBox,
// 	Tag,
// 	Tree,
// 	Select,
// 	Option,
// 	Cascader,
// 	Alert,
// 	Tabs,
// 	TabPane,
// 	Steps,
// 	Step,
// 	Checkbox,
// 	CheckboxGroup,
// 	Upload,
// 	Timeline,
// 	TimelineItem
// } from 'element-ui'
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
// Vue.use(Button)
// Vue.use(Container)
// Vue.use(Header)
// Vue.use(Aside)
// Vue.use(Main)
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItem)
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
// Vue.use(Card)
// Vue.use(Col)
// Vue.use(Row)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Switch)
// Vue.use(Tooltip)
// Vue.use(Pagination)
// Vue.use(Dialog)
// Vue.use(Tag)
// Vue.use(Tree)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Cascader)
// Vue.use(Alert)
// Vue.use(Tabs)
// Vue.use(TabPane)
// Vue.use(Steps)
// Vue.use(Step)
// Vue.use(Checkbox)
// Vue.use(CheckboxGroup)
// Vue.use(Upload)
// Vue.use(Timeline)
// Vue.use(TimelineItem)
// Vue.prototype.$message = Message
// Vue.prototype.$confirm = MessageBox.confirm


import Nprogress from "nprogress"
//import "nprogress/nprogress.css"
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
	Nprogress.start()
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config
})
axios.interceptors.response.use(config => {
	Nprogress.done()
	return config
})
Vue.prototype.$http = axios;


import TreeTable from 'vue-table-with-tree-grid'
Vue.component("tree-table", TreeTable)


import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)


Vue.filter('dateFormat', function(originVal) {
	const dt = new Date(originVal)

	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
	const d = (dt.getDate() + '').padStart(2, '0')

	const hh = (dt.getHours() + '').padStart(2, '0')
	const mm = (dt.getMinutes() + '').padStart(2, '0')
	const ss = (dt.getSeconds() + '').padStart(2, '0')

	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
