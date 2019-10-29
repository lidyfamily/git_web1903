// 从封装好的axios配置中导入所需
import {get, post, post_array} from '../http/axios'
export default{
    // 命名空间作用生效
    namespaced: true,
    state: {
        //存放可共享的顾客数据集合
        customers: []
    },
    getters: {
    },
    mutations: {
        // 更新顾客数据集合方法
        refreshCustomer(state, customers) {
            state.customers = customers;
        }
    },
    actions: {
        // 异步的分页加载顾客数据集合方法
        async loadCustomers(context, params) {
            // 等待接收异步请求返回的结果（异步的同步化）
            let response = await post("/customer/query", params);
            // 调用突变区方法更新顾客数据集合
            context.commit("refreshCustomer", response.data);
        },
        // 异步的删除对应顾客数据方法
        async deleteCustomer(context, id) {
            let response = await get("/customer/deleteById?id="+id);
            if(response.status == 200){
                // 请求成功时返回一个fulfilled状态的Promise
                return Promise.resolve(response);
            }else {
                // 请求失败时返回一个rejected状态的Promise
                return Promise.reject(response);
            }
        },
        async batchDeleteCustomers(context, ids) {
            let response = await post_array("/customer/batchDelete", {ids});
            if(response.status == 200){
                return Promise.resolve(response);
            }else {
                return Promise.reject(response);
            }
        },
        async saveCustomer(context, form) {
            let response = await post("/customer/saveOrUpdate", form);
            if(response.status == 200){
                return Promise.resolve(response);
            }else {
                return Promise.reject(response);
            }
        }
    },
    modules: {
    }
}