<!-- 模板 -->
<template>
	<div class="category">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item>主页</el-breadcrumb-item>
			<el-breadcrumb-item>业务管理</el-breadcrumb-item>
			<el-breadcrumb-item>栏目管理</el-breadcrumb-item>
      	</el-breadcrumb>
		<!-- 添加/修改信息对话框 -->
		<el-dialog title="添加/修改 栏目信息" :visible="dialogFormVisible" @close="closeDialogHandler">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="名称" prop="name"  label-width="80px">
				<el-input v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="序号" prop="num"  label-width="80px">
				<el-input v-model="form.num" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图标" prop="icon"  label-width="80px">
				<el-input v-model="form.icon" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="父栏目ID" prop="parentId"  label-width="80px">
				<el-input v-model="form.parentId" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialogHandler">取 消</el-button>
				<el-button type="primary" @click="submitHandler">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 添加/修改信息对话框结束 -->
		<!-- 上方操作栏 -->
		<el-row :gutter="10" style="margin:20px 0;">
			<!-- 左边按钮 -->
			<el-col :span="2">
				<el-button type="danger" @click="batchDeleteHandler">批量删除</el-button>
			</el-col>
			<el-col :span="2">
				<el-button type="primary" @click="toAddHandler">添加</el-button>
			</el-col>
			<!-- 左边按钮结束 -->
			<!-- 关键字选择框 -->
			<el-col :span="2" :offset="11">
				<el-select v-model="searchType" placeholder="关键字">
					<el-option label="名称" value="name"></el-option>
					<el-option label="序号" value="num"></el-option>
				</el-select>
			</el-col>
			<!-- 关键字选择框结束 -->
			<!-- 搜索框和搜索按钮 -->
			<el-col :span="4">
				<el-input v-show="searchType==''" placeholder="请先选择关键字" v-model="invalid">
				</el-input>
				<el-input v-show="searchType=='name'" placeholder="请输入搜索内容" v-model="params.name">
				</el-input>
				<el-input v-show="searchType=='num'" placeholder="请输入搜索内容" v-model="params.num">
				</el-input>
			</el-col>
			<el-col :span="1">
				<el-button type="primary" @click="loadCategories(params)">搜索</el-button>
			</el-col>
			<!-- 搜索框和搜索按钮结束 -->
		</el-row>
		<!-- 上方操作栏结束 -->
		<!-- 数据表 -->
		<el-table :data="categories.list" border stripe style="width:100%"  @selection-change="idsChangeHandler">
			<el-table-column
			type="selection">
			</el-table-column>
			<el-table-column
			prop="name"
			label="名称">
			</el-table-column>
			<el-table-column
			prop="num"
			label="序号">
			</el-table-column>
			<el-table-column label="图标">
				<!-- 利用作用域（回调）插槽来自定义显示 -->
				<template v-slot:default="record">
					<img :src="record.row.icon" alt="暂无图片">
				</template>
			</el-table-column>
			<el-table-column
			prop="parentId"
			label="父栏目">
			</el-table-column>
			<el-table-column label="操作">
				<!-- 作用域插槽自定义显示 -->
				<template slot-scope="scope">
					<el-button size="mini" @click.prevent="editHandler(scope.row)">
						<i class="el-icon-edit"></i>
					</el-button>
					<el-button size="mini" type="danger" 
					@click.prevent="deleteHandler(scope.row.id)">
						<i class="el-icon-delete-solid"></i>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 数据表结束 -->
		<!-- 分页 -->
		<div style="margin:20px 0;text-align:center;">
			<el-pagination background layout="prev, pager, next" @current-change="pageChangeHandler"
			:total="categories.total"
			:page-size="categories.pageSize"
			:current-page="params.page+1">
			</el-pagination>
		</div>
		<!-- 分页 -->
	</div>
</template>

<!-- vue实例 -->
<script>
	// 从vuex中导入映射方法
	import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
	export default {
		data(){
			// 结合正则表达式校验表单输入值方法
			let validNum = (rule, value, callback) => {
				let reg_num = /\d/;
				if (value === '' || value === undefined) {
					callback(new Error('请输入序号'));
				} else if (!reg_num.test(value)) {
					callback(new Error('此数序号不合规范！'));
				} else {
					callback();
				}
			};
			return {
				searchType: "",// 关键字类型
				invalid: "",// 存放无效值
				// 分页接口所需参数
				params: {
					page: 0,
					pageSize: 4,
					name: "",
					num: ""
				},
				dialogFormVisible: false,// 控制信息对话框显示
				form: {},// 存放信息对话框表单中缓存的数据项数据
				rules: {
					num: [
						// 相应绑定值失焦时触发校验方法
						{ validator: validNum, trigger:"blur" }
					]
				},
				// 存放表单中选中数据项的标识
				ids: []
			}
		},
		watch:{
			// 监听关键字选择框的变化
			"searchType": function() {
				// 初始化分页参数
				this.params.page = 0;
				this.params.pageSize = 4;
				this.params.name = "";
				this.params.num = "";
				// 重载数据
				this.loadCategories(this.params);
			}
		},
		computed:{
			// 映射vuex中存放的数据源（为了能在本组件中使用）
			...mapState("category", ["categories"])
		},
		created() {
			// 初始化数据
			this.loadCategories(this.params);
		},
		methods:{
			// 映射vuex中动作区的方法
			...mapActions("category", ["loadCategories", "deleteCategory", "batchDeleteCategories", "saveCategory"]),
			// 信息对话框关闭方法
			closeDialogHandler() {
				// 关闭信息对话框
				this.dialogFormVisible = false;
				// 清除校验残留
				this.$refs.form.clearValidate();
				// 清除信息对话框表单中缓存的数据项数据
				this.form = {};
			},
			// 更新当前页数及对应显示方法
			pageChangeHandler(currentPage) {
				// 因为此后台从0开始计算页数
				this.params.page = currentPage-1;
				// 加载对应页数据
				this.loadCategories(this.params);
			},
			// 删除操作处理方法
			deleteHandler(id) {
				// 消息确认框
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					type: 'warning',
					cancelButtonText: '取消',
					confirmButtonText: '继续'
				}).then(() => {
					// 调用vuex动作区映射过来的方法并接收返回值
					this.deleteCategory(id)
					.then((response) => {
						// 消息提示框
						this.$message({
							type: 'success',
							message: response.statusText
						});
						this.loadCategories(this.params);
					})
					.catch(() => {
						this.$message({
							type: 'error',
							message: '后台接口异常，操作失败'
						})
					});
				});
			},
			// 选中操作处理方法
			idsChangeHandler(val) {
				// 映射相应数据项的值并存到data的对应属性中
				this.ids = val.map(item => item.id);
			},
			// 批量删除操作处理方法
			batchDeleteHandler() {
				if(this.ids != '') {
					this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
						type: 'warning',
						cancelButtonText: '取消',
						confirmButtonText: '继续'
					}).then(() => {
						this.batchDeleteCategories(this.ids)
						.then((response) => {
							// 消息提示框
							this.$message({
								type: 'success',
								message: response.statusText
							});
							this.loadCategories(this.params);
						})
						.catch(() => {
							this.$message({
								type: 'error',
								message: '后台接口异常，操作失败'
							})
						});
					});
				}else {
					this.$message({
						type: 'error',
						message: '未选中任何项'
					});
				}
			},
			// 添加操作处理方法
			toAddHandler() {
				// 打开信息对话框
				this.dialogFormVisible = true;
			},
			// 编辑操作处理方法
			editHandler(row) {
				// 将当前数据项数据渲染到信息对话框表单中
				this.form = row;
				this.dialogFormVisible = true;
			},
			// 提交操作处理方法
			submitHandler() {
				// 检查校验是否通过
				this.$refs['form'].validate((valid) => {
					if(valid) {
						this.dialogFormVisible = false;
						this.saveCategory(this.form)
						.then((response) => {
							this.$message({
								type: 'success',
								message: response.statusText
							});
						})
						.catch(() => {
							this.$message({
								type: 'error',
								message: '后台接口异常，操作失败'
							})
						});
						this.loadCategories(this.params);
					}else {
						this.$message({
							type: 'error',
							message: '输入格式有误，提交失败'
						});
					}
				});				
			}
		}
	}
</script>

<!-- 样式 -->
<style scoped>
	
</style>