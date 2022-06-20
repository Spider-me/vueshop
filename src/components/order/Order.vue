<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
						@clear="getOrderlist">
						<el-button @click="getOrderlist" slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<el-table border stripe :data="ordersList">
				<el-table-column type="index" label="#">
				</el-table-column>
				<el-table-column prop="order_number" label="订单编号">
				</el-table-column>
				<el-table-column prop="order_price" label="订单价格">
				</el-table-column>
				<el-table-column prop="pay_status" label="是否付款">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.pay_status == '1'">已付款</el-tag>
						<el-tag type="danger" v-else>未付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="is_send" label="是否发货">
				</el-table-column>
				<el-table-column label="下单时间">
					<template slot-scope="scope">
						{{scope.row.create_time | dateFormat}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tooltip effect="dark" content="修改订单地址" placement="top" :enterable="false">
							<el-button size="mini" @click="showBox(scope.row)" type="primary" icon="el-icon-edit">
							</el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="物流进度" placement="top" :enterable="false">
							<el-button size="mini" @click="showProgressBox" type="success" icon="el-icon-location">
							</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[10, 15, 20, 25]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

		<el-dialog title="修改地址" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<div>
				<el-form :model="addressForm" :rules="addressFormrules" ref="addressFormref" label-width="100px">
					<el-form-item label="省市区/县" prop="address1">
						<el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
					</el-form-item>
					<el-form-item label="详细地址" prop="address2">
						<el-input v-model="addressForm.address2"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="物流进度" :visible.sync="showProgressVisible" width="50%">
			<div>
				<el-timeline :reverse="true">
					<el-timeline-item v-for="(activity, index) in progressInfo" :key="index"
						:timestamp="activity.ftime">
						{{activity.context}}
					</el-timeline-item>
				</el-timeline>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import kuaidi from './interface/kuaidi.js'
	import cityData from './citydata.js'
	export default {
		data() {
			return {
				queryInfo: {
					query: "",
					pagenum: 1,
					pagesize: 10
				},
				ordersList: [],
				total: 0,
				addDialogVisible: false,
				addressForm: {
					address1: [],
					address2: ""
				},
				addressFormrules: {
					address1: [{
						required: true,
						message: "请选择省市区/县",
						trigger: 'blur'
					}],
					address2: [{
						required: true,
						message: "请输入详细地址",
						trigger: 'blur'
					}]
				},
				cityData,
				showProgressVisible: false,
				progressInfo: kuaidi
			}
		},
		created() {
			this.getOrderlist()
		},
		methods: {
			async getOrderlist() {
				const {
					data: res
				} = await this.$http.get('orders', {
					params: this.queryInfo
				});
				if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
				this.ordersList = res.data.goods;
				this.total = res.data.total;
			},
			handleSizeChange(newsize) {
				this.queryInfo.pagesize = newsize;
				this.getOrderlist()
			},
			handleCurrentChange(newpage) {
				this.queryInfo.pagenum = newpage;
				this.getOrderlist()
			},
			showBox() {
				this.addDialogVisible = true;
			},
			addDialogClosed() {
				this.$refs.addressFormref.resetFields()
			},
			showProgressBox() {
				this.showProgressVisible = true;
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-cascader {
		width: 100%;
	}
</style>
