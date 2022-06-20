<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
						@clear="getUsersList">
						<el-button @click="getUsersList" slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<el-table border stripe :data="usersList">
				<el-table-column type="index" label="#">
				</el-table-column>
				<el-table-column prop="username" label="姓名">
				</el-table-column>
				<el-table-column prop="email" label="邮箱">
				</el-table-column>
				<el-table-column prop="mobile" label="电话">
				</el-table-column>
				<el-table-column prop="role_name" label="角色">
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="setstatechange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tooltip effect="dark" content="修改用户信息" placement="top" :enterable="false">
							<el-button size="mini" @click="EditDialog(scope.row.id)" type="primary" icon="el-icon-edit">
							</el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
							<el-button size="mini" @click="DelDialg(scope.row.id)" type="danger" icon="el-icon-delete">
							</el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							<el-button size="mini" type="warning" icon="el-icon-setting" @click="setRole(scope.row)">
							</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogclose">
			<el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDialogtrue">确 定</el-button>
			</span>
		</el-dialog>


		<el-dialog title="修改用户" :visible.sync="EditdialogVisible" width="50%" @close="EditDialogclose">
			<el-form :model="editForm" :rules="editFormrules" ref="editFormref" label-width="100px"
				class="demo-ruleForm">
				<el-form-item label="用户名">
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="EditdialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="EditdDialogtrue">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
			<div>
				<p>当前的用户：{{userInfo.username}}</p>
				<p>当前的角色：{{userInfo.role_name}}</p>
				<p>分配新角色：
					<el-select v-model="selectedRoleId" placeholder="请选择">
						<el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRoleDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveRoleInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "Users",
		data() {
			// 验证邮箱的规则
			var checkEmail = (rule, value, cb) => {
				// 验证邮箱的正则表达式
				const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
				if (regEmail.test(value)) {
					// 合法的邮箱
					return cb()
				}
				cb(new Error('请输入合法的邮箱'))
			}
			// 验证手机号的规则
			var checkMobile = (rule, value, cb) => {
				// 验证手机号的正则表达式
				const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
				if (regMobile.test(value)) {
					return cb()
				}
				cb(new Error('请输入合法的手机号'))
			}

			return {
				queryInfo: {
					query: "",
					pagenum: 1,
					pagesize: 10
				},
				usersList: [],
				total: 0,
				addDialogVisible: false,
				addForm: {
					username: "",
					password: "",
					email: "",
					mobile: ""
				},
				addFormrules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, {
						min: 3,
						max: 10,
						message: '字符在3到10之间',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						min: 6,
						max: 10,
						message: '字符在6到10之间',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}, {
						validator: checkMobile,
						trigger: 'blur'
					}],
				},
				EditdialogVisible: false,
				editForm: {},
				editFormrules: {
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						min: 6,
						max: 10,
						message: '字符在6到10之间',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}]
				},
				// 控制分配角色对话框的显示与隐藏
				setRoleDialogVisible: false,
				// 需要被分配角色的用户信息
				userInfo: {},
				// 所有角色的数据列表
				rolesList: [],
				// 已选中的角色Id值
				selectedRoleId: ''

			}
		},
		created() {
			this.getUsersList()
		},
		methods: {
			async getUsersList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				});
				if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
				this.usersList = res.data.users;
				this.total = res.data.total;
			},
			handleSizeChange(newsize) {
				this.queryInfo.pagesize = newsize;
				this.getUsersList()
			},
			handleCurrentChange(newpage) {
				this.queryInfo.pagenum = newpage;
				this.getUsersList()
			},
			async setstatechange(userobj) {
				const {
					data: res
				} = await this.$http.put(`users/${userobj.id}/state/${userobj.mg_state}`)
				if (res.meta.status !== 200) {
					userobj.mg_state = !userobj.mg_state;
					return this.$message.error('更新用户状态失败!');
				} else {
					return this.$message.success('更新用户状态成功!');
				}
			},
			addDialogclose() {
				this.$refs.addFormref.resetFields()
			},
			addDialogtrue() {
				this.$refs.addFormref.validate(async (valid) => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.post('users', this.addForm)
					if (res.meta.status !== 201) {
						this.$message.error("添加用户失败!")
					} else {
						this.$message.success("添加用户成功!");
						this.addDialogVisible = false;
						this.getUsersList()
					}
				})
			},
			async EditDialog(id) {
				const {
					data: res
				} = await this.$http.get(`users/${id}`)
				if (res.meta.status !== 200) {
					return this.$message.error("获取用户失败!")
				} else {
					this.editForm = res.data;
					this.EditdialogVisible = true;
				}
			},
			EditDialogclose() {
				this.$refs.editFormref.resetFields()
			},
			EditdDialogtrue() {
				this.$refs.editFormref.validate(async (valid) => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.put(`users/${this.editForm.id}`, {
						email: this.editForm.email,
						mobile: this.editForm.mobile
					})
					if (res.meta.status !== 200) {
						this.$message.error("修改用户信息失败!")
					} else {
						this.EditdialogVisible = false;
						this.getUsersList()
					}
				})
			},
			async DelDialg(delid) {
				const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(error => error)
				if (confirmResult == "confirm") {
					const {
						data: res
					} = await this.$http.delete(`users/${delid}`)
					if (res.meta.status !== 200) {
						return this.$message.error('删除用户失败!');
					} else {
						this.getUsersList()
						return this.$message.success('删除用户成功!');
					}
				} else if (confirmResult == "cancel") {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				}
			},
			// 展示分配角色的对话框
			async setRole(userInfo) {
				this.userInfo = userInfo

				// 在展示对话框之前，获取所有角色的列表
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败！')
				}

				this.rolesList = res.data

				this.setRoleDialogVisible = true
			},
			// 点击按钮，分配角色
			async saveRoleInfo() {
				if (!this.selectedRoleId) {
					return this.$message.error('请选择要分配的角色！')
				}

				const {
					data: res
				} = await this.$http.put(
					`users/${this.userInfo.id}/role`, {
						rid: this.selectedRoleId
					}
				)

				if (res.meta.status !== 200) {
					return this.$message.error('更新角色失败！')
				}

				this.$message.success('更新角色成功！')
				this.getUsersList()
				this.setRoleDialogVisible = false
			},
			// 监听分配角色对话框的关闭事件
			setRoleDialogClosed() {
				this.selectedRoleId = ''
				this.userInfo = {}
			}
		}
	}
</script>

<style lang="less" scoped>
</style>
