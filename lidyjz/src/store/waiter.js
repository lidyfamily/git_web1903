// 从封装好的axios配置中导入所需
import {get, post, post_array} from '../http/axios'
export default{
    // 命名空间作用生效
    namespaced: true,
    state: {
        //存放可共享的员工数据集合
        waiters: []
    },
    getters: {
    },
    mutations: {
        // 更新员工数据集合方法
        refreshWaiter(state, waiters) {
            state.waiters = waiters;
        }
    },
    actions: {
        // 异步的分页加载员工数据集合方法
        async loadWaiters(context, params) {
            // 等待接收异步请求返回的结果（异步的同步化）
            let response = await post("/waiter/query", params);
            // 调用突变区方法更新员工数据集合
            context.commit("refreshWaiter", response.data);
        },
        // 异步的删除对应员工数据方法
        async deleteWaiter(context, id) {
            let response = await get("/waiter/deleteById?id="+id);
            if(response.status == 200){
                // 请求成功时返回一个fulfilled状态的Promise
                return Promise.resolve(response);
            }else {
                // 请求失败时返回一个rejected状态的Promise
                return Promise.reject(response);
            }
        },
        async batchDeleteWaiters(context, ids) {
            let response = await post_array("/waiter/batchDelete", {ids});
            if(response.status == 200){
                return Promise.resolve(response);
            }else {
                return Promise.reject(response);
            }
        },
        async saveWaiter(context, form) {
            let response = await post("/waiter/saveOrUpdate", form);
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