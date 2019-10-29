// 从封装好的axios配置中导入所需
import {get, post, post_array} from '../http/axios'
export default{
    // 命名空间作用生效
    namespaced: true,
    state: {
        comments: [],
        orders:[]
    },
    getters: {
    },
    mutations: {
        refreshComment(state, comments) {
            state.comments = comments;
        },
        refreshOrders(state, orders) {
            state.orders = orders;
        }
    },
    actions: {
        async loadComments(context, params) {
            let response = await post("/comment/query", params);
            context.commit("refreshComment", response.data);
        },
        async deleteComment(context, id) {
            let response = await get("/comment/deleteById?id="+id);
            if(response.status == 200){
                return Promise.resolve(response);
            }else {
                return Promise.reject(response);
            }
        },
        async batchDeleteComments(context, ids) {
            let response = await post_array("/comment/batchDelete", {ids});
            if(response.status == 200){
                return Promise.resolve(response);
            }else {
                return Promise.reject(response);
            }
        },
        async saveComment(context, form) {
            let response = await post("/comment/saveOrUpdate", form);
            if(response.status == 200){
                return Promise.resolve(response);
            }else {
                return Promise.reject(response);
            }
        },
        async findAllOrders(context){
            // 1.查询所有订单信息
            let response = await get("/order/findAll");
            context.commit("refreshOrders",response.data)
        },

    },
    modules: {
    }
}