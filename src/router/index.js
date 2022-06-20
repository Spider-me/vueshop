import Vue from 'vue'
import VueRouter from 'vue-router'

//import Login from '../components/Login'
const Login = () => import( /* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
//import Home from '../components/Home'
const Home = () => import( /* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
//import Welcome from '../components/Welcome'
const Welcome = () => import( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

//import Users from '../components/user/Users'
const Users = () => import( /* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
//import Rights from '../components/power/Rights'
const Rights = () => import( /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
//import Roles from '../components/power/Roles'
const Roles = () => import( /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

//import Cate from '../components/goods/Cate'
const Cate = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
//import Params from '../components/goods/Params'
const Params = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

//import List from '../components/goods/List'
const List = () => import( /* webpackChunkName: "List_Add" */ '../components/goods/List.vue')
//import Add from '../components/goods/Add'
const Add = () => import( /* webpackChunkName: "List_Add" */ '../components/goods/Add.vue')

//import Order from '../components/order/Order'
const Order = () => import( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
//import Report from '../components/report/Report'
const Report = () => import( /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [{
	path: '/',
	redirect: "/login"
}, {
	path: '/login',
	component: Login
}, {
	path: '/home',
	component: Home,
	redirect: "/welcome",
	children: [{
		path: '/welcome',
		component: Welcome
	}, {
		path: '/users',
		component: Users
	}, {
		path: '/rights',
		component: Rights
	}, {
		path: '/roles',
		component: Roles
	}, {
		path: '/categories',
		component: Cate
	}, {
		path: '/params',
		component: Params
	}, {
		path: '/goods',
		component: List,
	}, {
		path: '/goods/add',
		component: Add,
	}, {
		path: '/orders',
		component: Order,
	}, {
		path: '/reports',
		component: Report,
	}],
}]

const router = new VueRouter({
	routes
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next();
	const tokenstr = sessionStorage.getItem("token");
	if (!tokenstr) return next('/login')
	next()
})

export default router
