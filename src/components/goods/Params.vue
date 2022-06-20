<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-alert :closable="false" show-icon title="注意:只允许为第三季分类设置相关参数!" type="warning"></el-alert>
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类:</span>
					<el-cascader :options="CateList" :props="cateprops" v-model="selectedcatekey"
						@change="Catelistchange" clearable change-on-select></el-cascader>
				</el-col>
			</el-row>
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" :disabled="isBtnDisable" @click="addparamsEvent">添加参数</el-button>
					<el-table :data="manytableData" border stripe>
						<el-table-column type="expand" label="展开行">
							<template slot-scope="scope">
								<el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
									@close="handleClose(i,scope.row)">{{item}}</el-tag>

								<el-input class="input-new-tag" v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue" ref="saveTagInput" size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
									New Tag
								</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="attr_name" label="参数名称"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini"
									@click="showEditevent(scope.row.attr_id)">编辑
								</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini"
									@click="delectEvent(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" :disabled="isBtnDisable" @click="addparamsEvent">添加属性</el-button>
					<el-table :data="onlytableData" border stripe>
						<el-table-column type="expand" label="展开行">
							<template slot-scope="scope">
								<el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
									@close="handleClose(i,scope.row)">{{item}}</el-tag>

								<el-input class="input-new-tag" v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue" ref="saveTagInput" size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
									New Tag
								</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="attr_name" label="属性名称"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini"
									@click="showEditevent(scope.row.attr_id)">编辑
								</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini"
									@click="delectEvent(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>


		<el-dialog :title="'添加'+ParamsTitle" :visible.sync="addParamsDialogVisible" width="50%" @close="addParamsclose">
			<div>
				<el-form :model="addParamsForm" :rules="addParamsFormrules" ref="addParamsFormref" label-width="100px">
					<el-form-item :label="ParamsTitle" prop="attr_name">
						<el-input v-model="addParamsForm.attr_name"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addParamsDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>


		<el-dialog :title="'修改'+ParamsTitle" :visible.sync="EditDialogVisible" width="50%" @close="Editclose">
			<div>
				<el-form :model="EditForm" :rules="EditFormrules" ref="EditFormref" label-width="100px">
					<el-form-item :label="ParamsTitle" prop="attr_name">
						<el-input v-model="EditForm.attr_name"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="EditDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="EditEvent">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "params",
		data() {
			return {
				CateList: [],
				cateprops: {
					value: "cat_id",
					label: "cat_name",
					children: "children",
					expandTrigger: 'hover'
				},
				selectedcatekey: [],
				activeName: "many",
				manytableData: [],
				onlytableData: [],
				addParamsDialogVisible: false,
				addParamsForm: {
					attr_name: ""
				},
				addParamsFormrules: {
					attr_name: [{
						required: true,
						message: "请输入参数名称",
						trigger: 'blur'
					}]
				},
				EditDialogVisible: false,
				EditForm: {},
				EditFormrules: {
					attr_name: [{
						required: true,
						message: "请输入参数名称",
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await this.$http.get("categories")
				if (res.meta.status != 200) {
					return this.$message.error("获取商品分类失败")
				}
				this.CateList = res.data;
			},
			Catelistchange() {
				this.getParamsList()
			},
			handleTabClick() {
				this.getParamsList()
			},
			async getParamsList() {
				if (this.selectedcatekey.length != 3) {
					this.selectedcatekey = [];
					this.manytableData = [];
					this.onlytableData = [];
					return;
				}
				const {
					data: res
				} = await this.$http.get(`categories/${this.cateId}/attributes`, {
					params: {
						sel: this.activeName
					}
				});
				if (res.meta.status != 200) {
					return this.$message.error("获取参数列表失败");
				}
				res.data.forEach(item => {
					item.inputVisible = false;
					item.inputValue = "";
					if (item.attr_vals != '') {
						item.attr_vals = item.attr_vals.split(" ")
					} else {
						item.attr_vals = [];
					}
				})
				if (this.activeName === 'many') {
					this.manytableData = res.data
				} else if (this.activeName === 'only') {
					this.onlytableData = res.data
				}
			},
			addparamsEvent() {
				this.addParamsDialogVisible = true;
			},
			addParams() {
				this.$refs.addParamsFormref.validate(async valid => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.post(`categories/${this.cateId}/attributes`, {
						attr_name: this.addParamsForm.attr_name,
						attr_sel: this.activeName
					})
					if (res.meta.status != 201) {
						return this.$message.error("添加参数失败");
					}
					this.getParamsList();
					this.addParamsDialogVisible = false;
					return this.$message.success("添加参数成功");
				})
			},
			addParamsclose() {
				this.addParamsForm.attr_name = ""
			},
			async showEditevent(attr_id) {
				const {
					data: res
				} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
					params: {
						attr_sel: this.activeName
					}
				})
				if (res.meta.status != 200) {
					return this.$message.error("获取名称失败");
				}
				this.EditForm = res.data;
				this.EditDialogVisible = true;
			},
			EditEvent() {
				this.$refs.EditFormref.validate(async valid => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.put(`categories/${this.cateId}/attributes/${this.EditForm.attr_id}`, {
						attr_name: this.EditForm.attr_name,
						attr_sel: this.activeName
					})
					if (res.meta.status != 200) {
						return this.$message.error("修改名称失败");
					}
					this.getParamsList();
					this.EditDialogVisible = false;
				})
			},
			Editclose() {
				this.$refs.EditFormref.resetFields()
			},
			async delectEvent(attr_id) {
				const comfirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (comfirmResult != 'confirm') {
					return this.$message.info("已取消删除");
				}
				const {
					data: res
				} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
				if (res.meta.status != 200) {
					return this.$message.error("删除参数失败");
				}
				this.getParamsList();
			},
			handleInputConfirm(row) {
				if (row.inputValue.trim().length === 0) {
					row.inputValue = '';
					row.inputVisible = false;
					return;
				}
				row.attr_vals.push(row.inputValue.trim())
				row.inputValue = '';
				row.inputVisible = false;
				this.saveAttrvals(row)
			},
			showInput(row) {
				row.inputVisible = true;
				//$nextTick方法作用，就是当页面上的元素被重新渲染之后，才会指定回调函数的代码
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleClose(i, row) {
				row.attr_vals.splice(i, 1);
				this.saveAttrvals(row)
			},
			async saveAttrvals(row) {
				const {
					data: res
				} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {

					attr_sel: this.activeName,
					attr_name: row.attr_name,
					attr_vals: row.attr_vals.join(" ")

				})
				if (res.meta.status != 200) {
					return this.$message.error("修改参数项失败");
				}
			}
		},
		computed: {
			isBtnDisable() {
				if (this.selectedcatekey.length != 3) {
					return true;
				}
				return false
			},
			cateId() {
				if (this.selectedcatekey.length === 3) {
					return this.selectedcatekey[2]
				}
				return null;
			},
			ParamsTitle() {
				if (this.activeName === 'many') {
					return "动态参数"
				} else if (this.activeName === 'only') {
					return "静态属性"
				}
			}
		},
		created() {
			this.getCateList()
		}
	}
</script>

<style lang="less" scoped>
	.cat_opt {
		margin: 15px;
	}

	.el-tag {
		margin: 15px;
	}

	.input-new-tag {
		width: 120px;
	}
</style>
