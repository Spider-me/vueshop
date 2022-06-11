<template>
	<el-container>
		<el-header>
			<div>
				<img src="../assets/heima.png" alt="">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<el-aside :width="isCollapse?'64px':'200px'">
				<div class="toggle-button" @click="toggleCollapse">
					|||
				</div>
				<el-menu :default-active="activePath" :router="true" :collapse="isCollapse" :collapse-transition="false"
					unique-opened background-color="#333744" text-color="#fff" active-text-color="#409eff">
					<el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
						<template slot="title">
							<i :class=iconsobj[item.id]></i>
							<span>{{item.authName}}</span>
						</template>
						<el-menu-item @click="saveNav('/'+item1.path)" :index="'/'+item1.path"
							v-for="item1 in item.children" :key="item1.id">
							<i class="el-icon-menu"></i>
							<span>{{item1.authName}}</span>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		name: "Home",
		data() {
			return {
				menulist: [],
				iconsobj: {
					'125': "iconfont icon-users",
					'103': "iconfont icon-tijikongjian",
					'101': "iconfont icon-shangpin",
					'102': "iconfont icon-danju",
					'145': "iconfont icon-baobiao"
				},
				isCollapse: false,
				activePath: ""
			}
		},
		methods: {
			logout() {
				window.sessionStorage.clear();
				this.$router.push('/login')
			},
			async getMenulist() {
				const {
					data: res
				} = await this.$http.get("menus")
				if (res.meta.status != 200) return this.$message.error(res.meta.msg)
				this.menulist = res.data
			},
			toggleCollapse() {
				this.isCollapse = !this.isCollapse;
			},
			saveNav(activePath) {
				window.sessionStorage.setItem("activePath", activePath);
				this.activePath = activePath;
			}
		},
		created() {
			this.getMenulist()
			this.activePath = window.sessionStorage.getItem("activePath") != undefined ? window.sessionStorage.getItem(
				"activePath") : '/users'
		}
	}
</script>

<style lang="less" scoped>
	.el-container {
		height: 100%;
	}

	.el-header {
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #fff;
		font-size: 20px;

		>div {
			display: flex;
			align-items: center;

			span {
				margin-left: 15px;
			}
		}
	}

	.el-aside {
		background-color: #333744;

		.el-menu {
			border: none;
		}

		.toggle-button {
			background-color: #4a5064;
			font-size: 10px;
			line-height: 24px;
			color: #fff;
			text-align: center;
			letter-spacing: 0.2em;
			cursor: pointer;
		}
	}

	.el-main {
		background-color: #eaedf1;
	}

	.iconfont {
		margin-right: 10px;
	}
</style>
