// 从封装好的axios配置中导入所需
import {get, post, post_array} from '../http/axios'
export default{
    // 命名空间作用生效
    namespaced: true,
    state: {
        //存放可共享的栏目数据集合
        categories: []
    },
    getters: {
    },
    mutations: {
        // 更新栏目数据集合方法
        refreshCategory(state, categories) {
            state.categories = categories;
        }
    },
    actions: {
        // 异步的分页加载栏目数据集合方法
        async loadCategories(context, params) {
            // 等待接收异步请求返回的结果（异步的同步化）
            let response = await post("/category/query", params);
            // 调用突变区方法更新栏目数据集合
            context.commit("refreshCategory", response.data);
        },
        // 异步的删除对应栏目数据方法
        async deleteCategory(context, id) {
            let response = await get("/category/deleteById?id="+id);
            if(response.status == 200){
                // 请求成功时返回一个fulfilled状态的Promise
                return Promise.resolve(response);
            }else {
                // 请求失败时返回一个rejected状态的Promise
                return Promise.reject(response);
            }
        },
        async batchDeleteCategories(context, ids) {
            let response = await post_array("/category/batchDelete", {ids});
            if(response.status == 200){
                return Promise.resolve(response);
            }else {
                return Promise.reject(response);
            }
        },
        async saveCategory(context, form) {
            let response = await post("/category/saveOrUpdate", form);
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