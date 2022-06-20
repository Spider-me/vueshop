<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-alert :closable="false" show-icon center title="添加商品信息" type="info"></el-alert>
			<el-steps :space="400" :active="activenum - 0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px" label-position="top">
				<el-tabs :tab-position="'left'" v-model="activenum" :before-leave="beforetableave"
					@tab-click="tabclick">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number" type="number">
							<el-input v-model="addForm.goods_number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProp"
								@change="handleChange"></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-form-item :label="item.attr_name" prop="" v-for="item in manyList" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name" prop="" v-for="item in onlyList" :key="item.attr_id">
							<el-input v-model="item.attr_vals.join(',')"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :headers="headerObj"
							:on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
							:on-success="handleSuccess">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<quill-editor v-model="addForm.goods_introduce"></quill-editor>
						<el-button type="primary" @click="add" class="btnadd">添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>

		<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
			<img :src="previewPath" alt="" class="previewImg">
		</el-dialog>
	</div>
</template>

<script>
	import _ from "lodash"
	export default {
		data() {
			return {
				activenum: '0',
				addForm: {
					goods_name: '',
					goods_price: 0,
					goods_weight: 0,
					goods_number: 0,
					goods_cat: [],
					pics: [],
					goods_introduce: '',
					attrs: []
				},
				addFormrules: {
					goods_name: [{
						required: true,
						message: "请输入商品名称",
						trigger: 'blur'
					}],
					goods_price: [{
						required: true,
						message: "请输入商品价格",
						trigger: 'blur'
					}],
					goods_weight: [{
						required: true,
						message: "请输入商品重量",
						trigger: 'blur'
					}],
					goods_number: [{
						required: true,
						message: "请输入商品数量",
						trigger: 'blur'
					}],
					goods_cat: [{
						required: true,
						message: "请选择商品分类",
						trigger: 'blur'
					}],
				},
				cateList: [],
				cateProp: {
					label: 'cat_name',
					value: 'cat_id',
					children: 'children',
					expandTrigger: 'hover'
				},
				manyList: [],
				onlyList: [],
				headerObj: {
					Authorization: window.sessionStorage.getItem('token')
				},
				previewPath: "",
				previewVisible: false
			}
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories');
				if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
				this.cateList = res.data;
			},
			handleChange() {
				if (this.addForm.goods_cat.length != 3) {
					this.addForm.goods_cat = []
				}
			},
			beforetableave(activeName, oldActiveName) {
				if (oldActiveName === '0' && this.addForm.goods_cat.length != 3) {
					this.$message.error("请选择商品分类")
					return false;
				}
			},
			async tabclick() {
				if (this.activenum == "1") {
					const {
						data: res
					} = await this.$http.get(`categories/${this.cateId}/attributes`, {
						params: {
							sel: 'many'
						}
					});
					if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败!')
					res.data.forEach(item => {
						if (item.attr_vals.length === 0) {
							item.attr_vals = [];
						} else {
							item.attr_vals = item.attr_vals.split(" ");
						}
					})
					this.manyList = res.data;
				} else if (this.activenum == "2") {
					const {
						data: res
					} = await this.$http.get(`categories/${this.cateId}/attributes`, {
						params: {
							sel: 'only'
						}
					});
					if (res.meta.status !== 200) return this.$message.error('获取静态属性列表失败!')
					res.data.forEach(item => {
						if (item.attr_vals.length === 0) {
							item.attr_vals = [];
						} else {
							item.attr_vals = item.attr_vals.split(" ");
						}
					})
					this.onlyList = res.data;
				}
			},
			handlePreview(file) {
				this.previewPath = file.response.data.url;
				this.previewVisible = true;
			},
			handleRemove(file) {
				const filepath = file.response.data.tmp_path;
				const i = this.addForm.pics.findIndex(x => x.pic === filepath)
				this.addForm.pics.splice(i, 1);
			},
			handleSuccess(response, file, fileList) {
				const picsinfo = {
					pic: response.data.tmp_path
				}
				this.addForm.pics.push(picsinfo)
			},
			async add() {
				this.$refs.addFormref.validate(valid => {
					if (!valid) {
						return this.$message.error("请填写必要的表单项")
					}
				})
				const from = _.cloneDeep(this.addForm)
				from.goods_cat = from.goods_cat.join(",")
				this.manyList.forEach(item => {
					const newinfo = {
						attr_id: item.attr_id,
						attr_value: item.attr_vals.join(" ")
					}
					this.addForm.attrs.push(newinfo)
				});
				this.onlyList.forEach(item => {
					const newinfo = {
						attr_id: item.attr_id,
						attr_value: item.attr_vals
					}
					this.addForm.attrs.push(newinfo)
				})
				from.attrs = this.addForm.attrs;
				const {
					data: res
				} = await this.$http.post('goods', from);
				if (res.meta.status !== 201) return this.$message.error('添加商品失败失败!')
				this.$router.push('/goods')
			}
		},
		created() {
			this.getCateList()
		},
		computed: {
			cateId() {
				if (this.addForm.goods_cat.length === 3) {
					return this.addForm.goods_cat[2]
				}
				return null
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-checkbox {
		margin: 0 10px 0 0 !important;
	}

	.previewImg {
		width: 100%;
	}

	.btnadd {
		margin-top: 15px;
	}
</style>
