<!-- 模板 -->
<template>
	<div class="address">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item>主页</el-breadcrumb-item>
			<el-breadcrumb-item>服务管理</el-breadcrumb-item>
			<el-breadcrumb-item>地址管理</el-breadcrumb-item>
      	</el-breadcrumb>
		<!-- 添加/修改信息对话框 -->
		<el-dialog title="添加/修改 产品信息" :visible="dialogFormVisible" @close="closeDialogHandler">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="省份" prop="province"  label-width="80px">
				<el-input v-model="form.province" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="城市" prop="city"  label-width="80px">
				<el-input v-model="form.city" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="县/区" prop="area"  label-width="80px">
				<el-input v-model="form.area" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address"  label-width="80px">
				<el-input v-model="form.address" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="telephone"  label-width="80px">
				<el-input v-model="form.telephone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="顾客ID" prop="customerId" label-width="80px">
					<el-select v-model="form.customerId" placeholder="请选择顾客ID">
					<el-option  v-for="c in customers" :value="c.id"></el-option>
					</el-select>
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
					<el-option label="省份" value="province"></el-option>
					<el-option label="城市" value="city"></el-option>
					<el-option label="县/区" value="area"></el-option>
				</el-select>
			</el-col>
			<!-- 关键字选择框结束 -->
			<!-- 搜索框和搜索按钮 -->
			<el-col :span="4">
				<el-input v-show="searchType==''" placeholder="请先选择关键字" v-model="invalid">
				</el-input>
				<el-input v-show="searchType=='province'" placeholder="请输入搜索内容" v-model="params.province">
				</el-input>
				<el-input v-show="searchType=='city'" placeholder="请输入搜索内容" v-model="params.city">
				</el-input>
				</el-input>
				<el-input v-show="searchType=='area'" placeholder="请输入搜索内容" v-model="params.area">
				</el-input>
			</el-col>
			<el-col :span="1">
				<el-button type="primary" @click="loadAddresses(params)">搜索</el-button>
			</el-col>
			<!-- 搜索框和搜索按钮结束 -->
		</el-row>
		<!-- 上方操作栏结束 -->
		<!-- 数据表 -->
		<el-table :data="addresses.list" border stripe style="width:100%"  @selection-change="idsChangeHandler">
			<el-table-column
			type="selection">
			</el-table-column>
			<el-table-column
			prop="province"
			label="省份">
			</el-table-column>
			<el-table-column
			prop="city"
			label="城市">
			</el-table-column>
			<el-table-column
			prop="area"
			label="县/区">
			</el-table-column>
			<el-table-column
			prop="address"
			label="地址">
			</el-table-column>
			<el-table-column
			prop="telephone"
			label="电话">
			</el-table-column>
			<el-table-column
			prop="customerId"
			label="顾客ID">
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
			:total="addresses.total"
			:page-size="addresses.pageSize"
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
				let reg_telephone = /\d/;
				if (value === '' || value === undefined) {
					callback(new Error('请输入电话'));
				} else if (!reg_telephone.test(value)) {
					callback(new Error('此电话不合规范！'));
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
					province: "",
					city: "",
					area:""
				},
				dialogFormVisible: false,// 控制信息对话框显示
				form: {},// 存放信息对话框表单中缓存的数据项数据
				rules: {
					
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
				this.params.province = "";
				this.params.city = "";
				this.params.area = "";
				// 重载数据
				this.loadAddresses(this.params);
			}
		},
		computed:{
			// 映射vuex中存放的数据源（为了能在本组件中使用）
			...mapState("address", ["addresses","customers"])
		},
		created() {
			// 初始化数据
			this.loadAddresses(this.params);
			this.findAllCustomers();
		},
		methods:{
			// 映射vuex中动作区的方法
			...mapActions("address", ["loadAddresses", "deleteAddress", "batchDeleteAddresses", "saveAddress","findAllCustomers"]),
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
				this.loadAddresses(this.params);
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
					this.deleteAddress(id)
					.then((response) => {
						// 消息提示框
						this.$message({
							type: 'success',
							message: response.statusText
						});
						this.loadAddresses(this.params);
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
						this.batchDeleteAddresses(this.ids)
						.then((response) => {
							// 消息提示框
							this.$message({
								type: 'success',
								message: response.statusText
							});
							this.loadAddresses(this.params);
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
						this.saveAddress(this.form)
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
						this.loadAddresses(this.params);
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
	img{
		height: 60px;
	}
</style>