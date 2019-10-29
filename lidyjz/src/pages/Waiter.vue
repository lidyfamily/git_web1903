<!-- 模板 -->
<template>
	<div class="waiter">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item>主页</el-breadcrumb-item>
			<el-breadcrumb-item>人员管理</el-breadcrumb-item>
			<el-breadcrumb-item>员工管理</el-breadcrumb-item>
      	</el-breadcrumb>
		<!-- 添加/修改信息对话框 -->
		<el-dialog title="添加/修改 员工信息" :visible="dialogFormVisible" @close="closeDialogHandler">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="姓名" prop="realname"  label-width="80px">
					<el-input v-model="form.realname" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password"  label-width="80px">
					<el-input type="password" v-model="form.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="telephone"  label-width="80px">
					<el-input v-model="form.telephone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="身份证号" prop="idCard"  label-width="80px">
					<el-input v-model="form.idCard" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="银行卡号" prop="bankCard"  label-width="80px">
					<el-input v-model="form.bankCard" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="头像" prop="photo"  label-width="80px">
					<el-input v-model="form.photo" autocomplete="off"></el-input>
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
					<el-option label="姓名" value="realname"></el-option>
					<el-option label="手机号" value="telephone"></el-option>
					<el-option label="身份证号" value="idCard"></el-option>
					<el-option label="状态" value="status"></el-option>
				</el-select>
			</el-col>
			<!-- 关键字选择框结束 -->
			<!-- 搜索框和搜索按钮 -->
			<el-col :span="4">
				<el-input v-show="searchType==''" placeholder="请先选择关键字" v-model="invalid">
				</el-input>
				<el-input v-show="searchType=='realname'" placeholder="请输入搜索内容" v-model="params.realname">
				</el-input>
				<el-input v-show="searchType=='telephone'" placeholder="请输入搜索内容" v-model="params.telephone">
				</el-input>
				<el-input v-show="searchType=='idCard'" placeholder="请输入搜索内容" v-model="params.idCard">
				</el-input>
				<el-input v-show="searchType=='status'" placeholder="请输入搜索内容" v-model="params.status">
				</el-input>
			</el-col>
			<el-col :span="1">
				<el-button type="primary" @click="loadWaiters(params)">搜索</el-button>
			</el-col>
			<!-- 搜索框和搜索按钮结束 -->
		</el-row>
		<!-- 上方操作栏结束 -->
		<!-- 数据表 -->
		<el-table :data="waiters.list" border stripe style="width:100%"  @selection-change="idsChangeHandler">
			<el-table-column
			type="selection">
			</el-table-column>
			<el-table-column
			prop="realname"
			label="姓名">
			</el-table-column>
			<el-table-column
			prop="telephone"
			label="手机号">
			</el-table-column>
			<el-table-column
			prop="idCard"
			label="身份证号">
			</el-table-column>
			<el-table-column
			prop="bankCard"
			label="银行卡号">
			</el-table-column>
			<el-table-column label="头像">
				<!-- 利用作用域（回调）插槽来自定义显示 -->
				<template v-slot:default="record">
					<img :src="record.row.photo" alt="暂无图片">
				</template>
			</el-table-column>
			<el-table-column
			prop="registerTime"
			:formatter="dateFormatter"
			label="注册时间">
			</el-table-column>
			<el-table-column
			prop="status"
			label="状态">
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
			:total="waiters.total"
			:page-size="waiters.pageSize"
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
			// 校验姓名
			let validRealname = (rule, value, callback) => {
				let reg_realname = /^(([\u4E00-\u9FA5]{2,4})|([a-zA-Z]{2,}))$/;
				if (value === '' || value === undefined) {
					callback(new Error('请输入姓名'));
				} else if (!reg_realname.test(value)) {
					callback(new Error('此姓名不合规范！'));
				} else {
					callback();
				}
			};
			// 校验密码
			let validPassword = (rule, value, callback) => {
				let reg_password = /\w{4,}/;
				if (value === ''|| value === undefined) {
					callback(new Error('请输入密码'));
				} else if (!reg_password.test(value)) {
					callback(new Error('密码需在4位数以上！'));
				} else {
					callback();
				}
			};
			// 校验手机号
			let validTelephone = (rule, value, callback) => {
				let reg_telephone = /^((1[3456789]\d{9})|(\d{3,4}?-\d{7,8}))$/;
				if (value === ''|| value === undefined) {
					callback(new Error('请输入手机号'));
				} else if (!reg_telephone.test(value)) {
					callback(new Error('手机号不正确！'));
				} else {
					callback();
				}
			};
			// 校验身份证号
			let validIdCard = (rule, value, callback) => {
				let reg_idCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
				if (value === ''|| value === undefined) {
					callback(new Error('请输入身份证号'));
				} else if (!reg_idCard.test(value)) {
					callback(new Error('身份证号不正确！'));
				} else {
					callback();
				}
			};
			// 校验银行卡号
			let validBankCard = (rule, value, callback) => {
				let reg_bankCard = /^([1-9]{1})(\d{14}|\d{18})$/;
				if (value === ''|| value === undefined) {
					callback();
				} else if (!reg_bankCard.test(value)) {
					callback(new Error('银行卡号不正确！'));
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
					realname: "",
					telephone: "",
					idCard: "",
					status: ""
				},
				dialogFormVisible: false,// 控制信息对话框显示
				form: {},// 存放信息对话框表单中缓存的数据项数据
				rules: {
					realname: [
					// 失焦时触发校验
						{ validator: validRealname, trigger:"blur" }
					],
					password: [
						{ validator: validPassword, trigger:"blur" }
					],
					telephone: [
						{ validator: validTelephone, trigger:"blur" }
					],
					idCard: [
						{ validator: validIdCard, trigger:"blur" }
					],
					bankCard: [
						{ validator: validBankCard, trigger:"blur" }
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
				this.params.realname = "";
				this.params.telephone = "";
				this.params.idCard = "";
				this.params.status = "";
				// 重载数据
				this.loadWaiters(this.params);
			}
		},
		computed:{
			// 映射vuex中存放的数据源（为了能在本组件中使用）
			...mapState("waiter", ["waiters"])
		},
		created() {
			// 初始化数据
			this.loadWaiters(this.params);
		},
		methods:{
			// 将时间戳转化为自定义时间显示格式
			dateFormatter(row, column){
				let date = new Date(row.registerTime);
				let YYYY = date.getFullYear()+'-';
				let MM = (date.getMonth() 
					+ 1<10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-';
				let DD = date.getDate()+' ';
				let hh = date.getHours()+':';
				let mm = date.getMinutes()+':';
				let ss = date.getSeconds();
				return YYYY+MM+DD+hh+mm+ss;
			},
			// 映射vuex中动作区的方法
			...mapActions("waiter", ["loadWaiters", "deleteWaiter", "batchDeleteWaiters", "saveWaiter"]),
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
				this.loadWaiters(this.params);
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
					this.deleteWaiter(id)
					.then((response) => {
						// 消息提示框
						this.$message({
							type: 'success',
							message: response.statusText
						});
						this.loadWaiters(this.params);
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
						this.batchDeleteWaiters(this.ids)
						.then((response) => {
							// 消息提示框
							this.$message({
								type: 'success',
								message: response.statusText
							});
							this.loadWaiters(this.params);
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
						// 手动添加当前操作时间到注册时间属性中
              			this.form.registerTime = (new Date()).getTime();
						this.saveWaiter(this.form)
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
						this.loadWaiters(this.params);
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