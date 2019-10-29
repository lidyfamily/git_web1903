<!-- 模板 -->
<template>
	<div class="order">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item>主页</el-breadcrumb-item>
			<el-breadcrumb-item>服务管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
      	</el-breadcrumb>
		<!-- 添加/修改信息对话框 -->
		<el-dialog title="添加订单信息" :visible="dialogFormVisible" @close="closeDialogHandler">
			<el-form :model="form" ref="form">
				<el-form-item label="下单时间" prop="orderTime"  label-width="80px">
					<el-input v-model="form.orderTime" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="总计" prop="total"  label-width="80px">
					<el-input v-model="form.total" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status"  label-width="80px">
					<el-input v-model="form.status" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="评论" prop="remark"  label-width="80px">
					<el-input v-model="form.remark" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="顾客ID" prop="customerId"  label-width="80px">
					<el-input v-model="form.customerId" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="服务员ID" prop="waiterId"  label-width="80px">
					<el-input v-model="form.waiterId" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址ID" prop="addressId"  label-width="80px">
					<el-input v-model="form.addressId" autocomplete="off"></el-input>
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
					<el-option label="下单时间" value="orderTime"></el-option>
					<el-option label="总计" value="total"></el-option>
					<el-option label="状态" value="status"></el-option>
				</el-select>
			</el-col>
			<!-- 关键字选择框结束 -->
			<!-- 搜索框和搜索按钮 -->
			<el-col :span="4">
				<el-input v-show="searchType==''" placeholder="请先选择关键字" v-model="invalid">
				</el-input>
				<el-input v-show="searchType=='orderTime'" placeholder="请输入搜索内容" v-model="params.realname">
				</el-input>
				<el-input v-show="searchType=='total'" placeholder="请输入搜索内容" v-model="params.telephone">
				</el-input>
				<el-input v-show="searchType=='status'" placeholder="请输入搜索内容" v-model="params.status">
				</el-input>
			</el-col>
			<el-col :span="1">
				<el-button type="primary" @click="loadOrders(params)">搜索</el-button>
			</el-col>
			<!-- 搜索框和搜索按钮结束 -->
		</el-row>
		<!-- 上方操作栏结束 -->
		<!-- 数据表 -->
		<el-table :data="orders.list" border stripe style="width:100%"  @selection-change="idsChangeHandler">
			<el-table-column
			type="selection">
			</el-table-column>
			<el-table-column
			prop="orderTime"
			label="下单时间">
			</el-table-column>
			<el-table-column
			prop="total"
			label="总计">
			</el-table-column>
			<el-table-column prop="status" label="总计">
			</el-table-column>
			<el-table-column
			prop="remark"
			label="评论">
			</el-table-column>
			<el-table-column
			prop="customerId"
			label="顾客ID">
			</el-table-column>
			<el-table-column
			prop="waiterId"
			label="服务员ID">
			</el-table-column>
			<el-table-column
			prop="addressId"
			label="地址ID">
			</el-table-column>
			<el-table-column label="操作">
				<!-- 作用域插槽自定义显示 -->
				<template slot-scope="scope">
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
			:total="orders.total"
			:page-size="orders.pageSize"
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
			return {
				searchType: "",// 关键字类型
				invalid: "",// 存放无效值
				// 分页接口所需参数
				params: {
					page: 0,
					pageSize: 6,
					orderTime: "",
					total: "",
					status: ""
				},
				dialogFormVisible: false,// 控制信息对话框显示
				form: {},// 存放信息对话框表单中缓存的数据项数据
				// 存放表单中选中数据项的标识
				ids: []
			}
		},
		watch:{
			// 监听关键字选择框的变化
			"searchType": function() {
				// 初始化分页参数
				this.params.page = 0;
				this.params.pageSize = 6;
				this.params.orderTime = "";
				this.params.total = "";
				this.params.status = "";
				// 重载数据
				this.loadOrders(this.params);
			}
		},
		computed:{
			// 映射vuex中存放的数据源（为了能在本组件中使用）
			...mapState("order", ["orders"])
		},
		created() {
			// 初始化数据
			this.loadOrders(this.params);
		},
		methods:{
			// 映射vuex中动作区的方法
			...mapActions("order", ["loadOrders", "deleteOrders", "batchDeleteOrders", "saveOrders"]),
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
				this.loadOrders(this.params);
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
					this.deleteOrders(id)
					.then((response) => {
						// 消息提示框
						this.$message({
							type: 'success',
							message: response.statusText
						});
						this.loadOrders(this.params);
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
						this.batchDeleteOrders(this.ids)
						.then((response) => {
							// 消息提示框
							this.$message({
								type: 'success',
								message: response.statusText
							});
							this.loadOrders(this.params);
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
			// 提交操作处理方法
			submitHandler() {
				// 检查校验是否通过
				this.$refs['form'].validate((valid) => {
					if(valid) {
						this.dialogFormVisible = false;
						this.saveOrders(this.form)
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
						this.loadOrders(this.params);
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