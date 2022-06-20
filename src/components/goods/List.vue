<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
						@clear="getGoodsList">
						<el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addgoodsEvent">添加商品</el-button>
				</el-col>
			</el-row>
			<el-table border stripe :data="goodsList">
				<el-table-column type="index" label="#">
				</el-table-column>
				<el-table-column prop="goods_name" label="商品名称">
				</el-table-column>
				<el-table-column prop="goods_price" label="价格(元)" width="90px">
				</el-table-column>
				<el-table-column prop="goods_weight" label="重量" width="70px">
				</el-table-column>
				<el-table-column prop="add_time" label="创建时间" width="140px">
				</el-table-column>
				<el-table-column label="操作" width="130px">
					<template slot-scope="scope">
						<el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
							<el-button size="mini" @click="" type="primary" icon="el-icon-edit">
							</el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
							<el-button size="mini" @click="deleteEvent(scope.row.goods_id)" type="danger"
								icon="el-icon-delete">
							</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total" background>
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				queryInfo: {
					query: "",
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0,
			}
		},
		methods: {
			async getGoodsList() {
				const {
					data: res
				} = await this.$http.get('goods', {
					params: this.queryInfo
				});
				if (res.meta.status !== 200) return this.$message.error('获取商品列表失败!')
				this.goodsList = res.data.goods;
				this.total = res.data.total;
			},
			handleSizeChange(newsize) {
				this.queryInfo.pagesize = newsize;
				this.getGoodsList()
			},
			handleCurrentChange(newpage) {
				this.queryInfo.pagenum = newpage;
				this.getGoodsList()
			},
			async deleteEvent(delid) {
				const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(error => error)
				if (confirmResult == "confirm") {
					const {
						data: res
					} = await this.$http.delete(`goods/${delid}`);
					if (res.meta.status !== 200) return this.$message.error('删除商品失败!')
					this.getGoodsList()
				} else {
					this.$message.info('已取消删除!')
				}
			},
			addgoodsEvent() {
				this.$router.push("/goods/add")
			}
		},
		created() {
			this.getGoodsList()
		}
	}
</script>

<style lang="less" scoped>
</style>
