<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCate">添加分类</el-button>
				</el-col>
			</el-row>
			<tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index
				border index-text="#" :show-row-hover="false">
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
					<i class="el-icon-error" v-else style="color: red;"></i>
				</template>
				<template slot="order" slot-scope="scope">
					<el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
					<el-tag size="mini" type="warning" v-else>三级</el-tag>
				</template>
				<template slot="opt" slot-scope="scope">
					<el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
				</template>
			</tree-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>


		<el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateclose">
			<div>
				<el-form :model="addCateForm" :rules="addCateFormrules" ref="addCateFormref" label-width="100px">
					<el-form-item label="分类名称" prop="cat_name">
						<el-input v-model="addCateForm.cat_name"></el-input>
					</el-form-item>
					<el-form-item label="父级分类">
						<!-- <el-input v-model="addCateForm.cat_pid"></el-input> -->
						<el-cascader v-model="selecteKeys" :options="parentCateList" :props="Cascateprops"
							@change="ParentCatechange" clearable change-on-select></el-cascader>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCateEvent()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "cate",
		data() {
			return {
				cateList: [],
				queryInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				total: 0,
				columns: [{
					label: "分类名称",
					prop: "cat_name"
				}, {
					label: "是否有效",
					type: "template",
					template: "isok"
				}, {
					label: "排序",
					type: "template",
					template: "order"
				}, {
					label: "操作",
					type: "template",
					template: "opt"
				}],
				addCateDialogVisible: false,
				addCateForm: {
					cat_name: "",
					cat_pid: 0,
					cat_level: 0
				},
				addCateFormrules: {
					cat_name: [{
						required: true,
						message: "请输入分类名称",
						trigger: "blur"
					}]
				},
				parentCateList: [],
				Cascateprops: {
					value: "cat_id",
					label: "cat_name",
					children: "children",
					expandTrigger: 'hover'
				},
				selecteKeys: []

			}
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: this.queryInfo
				});
				if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
				this.cateList = res.data.result;
				this.total = res.data.total;
			},
			handleSizeChange(newsize) {
				this.queryInfo.pagesize = newsize;
				this.getCateList()
			},
			handleCurrentChange(newpage) {
				this.queryInfo.pagenum = newpage;
				this.getCateList()
			},
			showAddCate() {
				this.getparentCateList()
				this.addCateDialogVisible = true;
			},
			async getparentCateList() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: {
						type: 2
					}
				})
				if (res.meta.status != 200) {
					return this.$message.error("获取列表失败")
				}
				//console.log(res.data);
				this.parentCateList = res.data;
			},
			ParentCatechange() {
				//console.log(this.selecteKeys)
				if (this.selecteKeys.length > 0) {
					this.addCateForm.cat_pid = this.selecteKeys[this.selecteKeys.length - 1]
					this.addCateForm.cat_level = this.selecteKeys.length;
				} else {
					this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0
				}
			},
			addCateEvent() {
				this.$refs.addCateFormref.validate(async vaild => {
					if (!vaild) return
					const {
						data: res
					} = await this.$http.post("categories", this.addCateForm);
					if (res.meta.status != 201) {
						return this.$message.error("添加商品分类失败");
					} else {
						this.getCateList()
						this.addCateDialogVisible = false;
					}
				})
			},
			addCateclose() {
				this.$refs.addCateFormref.resetFields();
				this.addCateForm.cat_pid = 0;
				this.addCateForm.cat_level = 0;
				this.selecteKeys = [];
			}
		},
		created() {
			this.getCateList()
		}
	}
</script>

<style lang="less" scoped>
	.el-cascader {
		width: 100%;
	}
</style>
