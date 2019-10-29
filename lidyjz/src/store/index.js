import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import address from './address'
import category from './category'
import comment from './comment'
import customer from './customer'
import dashboard from './dashboard'
import order from './order'
import product from './product'
import waiter from './waiter'

export default new Vuex.Store({
  modules: {
    address,
    category,
    comment,
    customer,
    dashboard,
    order,
    product,
    waiter
  }
})
