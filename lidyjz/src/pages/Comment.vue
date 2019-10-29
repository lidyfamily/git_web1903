<!-- 模板 -->
<template>
	<div class="comment">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item>主页</el-breadcrumb-item>
			<el-breadcrumb-item>服务管理</el-breadcrumb-item>
			<el-breadcrumb-item>评论管理</el-breadcrumb-item>
      	</el-breadcrumb>
		<!-- 添加/修改信息对话框 -->
		<el-dialog title="添加/修改 评论信息" :visible="visible" @close="closeDialogHandler">
			<el-form :model="form"  ref="form">
				<el-form-item label="内容" prop="content"  label-width="80px">
					<el-input v-model="form.content" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item  label="时间" prop="commentTime"  label-width="80px">
					<el-date-picker  type="date" v-model="form.commentTime" autocomplete="off"></el-date-picker>
				</el-form-item>
				<el-form-item label="订单号" prop="orderId" label-width="80px">
					<el-select v-model="form.orderId" placeholder="请选择订单号">
					<el-option  v-for="c in orders" :value="c.id"></el-option>
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
				<el-button type="danger" @click="batchDeleteHandler" >批量删除</el-button>
			</el-col>
			<el-col :span="2">
				<el-button type="primary" @click="toAddHandler">添加</el-button>
			</el-col>
			<!-- 左边按钮结束 -->
		</el-row>
		<!-- 上方操作栏结束 -->
		<!-- 数据表 -->
		<el-table  :data="comments.list" border stripe style="width:100%" @selection-change="idsChangeHandler" >
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="content" label="内容" ></el-table-column>
			<el-table-column prop="commentTime" label="评论时间" :formatter="dateFormatter"></el-table-column>
			<el-table-column prop="orderId" label="订单号" ></el-table-column>
			<el-table-column label="操作" width="200">
				<!-- 作用域插槽自定义显示 -->
				<template slot-scope="scope" >
					<el-button size="mini" >
						<i class="el-icon-edit" @click.prevent="editHandler(scope.row)"></i>
					</el-button>
					<el-button size="mini" type="danger" >
						<i class="el-icon-delete-solid" @click.prevent="deleteHandler(scope.row.id)"></i>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 数据表结束 -->
		<!-- 分页 -->
		<div style="margin:20px 0;text-align:center;">
			<el-pagination background layout="prev, pager, next" @current-change="pageChangeHandler"
			:total="comments.total"
			:page-size="comments.pageSize"
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
			return{
				ids:[],
				form:{},
				params: {
					page: 0,
					pageSize: 6,
				},
				visible: false,
			}
		},
		computed:{
			// 映射vuex中存放的数据源（为了能在本组件中使用）
			...mapState("comment", ["comments","orders"])
		},
		created() {
			// 初始化数据
			this.loadComments(this.params);
			this.findAllOrders();
		},
		methods:{
			// 映射vuex中动作区的方法
			...mapActions("comment", ["loadComments", "deleteComment", "batchDeleteComments", "saveComment","findAllOrders"]),
			// 删除
            deleteHandler(id) {
				// 消息确认框
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					type: 'warning',
					cancelButtonText: '取消',
					confirmButtonText: '继续'
				}).then(() => {
					// 调用vuex动作区映射过来的方法并接收返回值
					this.deleteComment(id)
					.then((response) => {
						// 消息提示框
						this.$message({
							type: 'success',
							message: response.statusText
						});
						this.loadComments(this.params);
					})
					.catch(() => {
						this.$message({
							type: 'error',
							message: '后台接口异常，操作失败'
						})
					});
				});
			},
			// 将时间戳转化为自定义时间显示格式
			dateFormatter(row, column){
				let date = new Date(row.commentTime);
				let YYYY = date.getFullYear()+'-';
				let MM = (date.getMonth() 
					+ 1<10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-';
				let DD = date.getDate()+' ';
				let hh = date.getHours()+':';
				let mm = date.getMinutes();
				return YYYY+MM+DD+hh+mm;
			},
			// 选中操作处理方法
			idsChangeHandler(val) {
				// 映射相应数据项的值并存到data的对应属性中
				this.ids = val.map(item => item.id);
			},
			// 批量删除
			batchDeleteHandler() {
				if(this.ids != '') {
					this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
						type: 'warning',
						cancelButtonText: '取消',
						confirmButtonText: '继续'
					}).then(() => {
						this.batchDeleteComments(this.ids)
						.then((response) => {
							// 消息提示框
							this.$message({
								type: 'success',
								message: response.statusText
							});
							this.loadComments(this.params);
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
			// 更新当前页数及对应显示方法
			pageChangeHandler(currentPage) {
				// 因为此后台从0开始计算页数
				this.params.page = currentPage-1;
				// 加载对应页数据
				this.loadComments(this.params);
			},
			// 信息对话框关闭方法
			closeDialogHandler() {
				this.visible = false;
				this.form = {};
			},
			// 添加操作处理方法
			toAddHandler() {
				this.form = {};
				this.visible = true;
				console.log(new Date())
			},
			// 编辑操作处理方法
			editHandler(row) {
				// 将当前数据项数据渲染到信息对话框表单中
				this.form = row;
				this.visible = true;
		
			},
			// 提交操作处理方法
			submitHandler() {
				// 判断是否存在id
                this.$refs['form'].validate((valid)=>{
                    if(valid){
					this.form.commentTime = (new Date()).getTime();
                    // 2.提交表单
                    this.saveComment(this.form)
                    .then((response)=>{
                        this.$message({type:"success",message:response.statusText});
                    })
                    } else {
                    return false;
					}
					this.visible = false;
				})
				this.loadComments(this.params);
            }
		}
	}
</script>

<!-- 样式 -->
<style scoped>
	
</style>