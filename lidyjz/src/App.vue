<template>
  <el-row id="app">
    <el-col :span="4" class="left_nav" style="background-color:#00BFFF;">
      <h3 style="width:100%;line-height:24px;text-align:center;color:#fff;">
        <i class="el-icon-s-home"></i>
        Lidy-家政服务平台
      </h3>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#00BFFF"
        text-color="#fff"
        active-text-color="#333"
        :router="true">
        <el-menu-item index="/">
          <i class="el-icon-view" style="color:#fff;"></i>
          <span slot="title">
            业绩展示
          </span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-user" style="color:#fff;"></i>
            <span>人员管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/waiter">
              <i class="el-icon-user-solid" style="color:#fff;"></i>
              员工管理
            </el-menu-item>
            <el-menu-item index="/customer">
              <i class="el-icon-s-custom" style="color:#fff;"></i>
              顾客管理
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-help" style="color:#fff;"></i>
            <span>业务管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/category">
              <i class="el-icon-menu" style="color:#fff;"></i>
              栏目管理
            </el-menu-item>
            <el-menu-item index="/product">
              <i class="el-icon-s-open" style="color:#fff;"></i>
              产品管理
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-phone-outline" style="color:#fff;"></i>
            <span>服务管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/address">
              <i class="el-icon-location" style="color:#fff;"></i>
              地址管理
            </el-menu-item>
            <el-menu-item index="/order">
              <i class="el-icon-s-order" style="color:#fff;"></i>
              订单管理
            </el-menu-item>
            <el-menu-item index="/comment">
              <i class="el-icon-s-comment" style="color:#fff;"></i>
              评论管理
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
    <el-col :span="20" class="right_content">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        :collapse="isCollapse"
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group> -->
      <el-menu 
      :default-active="activeIndex" 
      class="el-menu-demo" 
      mode="horizontal">
      <!-- @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" -->
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="4">订单管理</el-menu-item>
        <div style="float:right;margin-right:40px;">用户显示区</div>
      </el-menu>
      <div class="line" style="margin-bottom:20px;"></div>
      <router-view/>
    </el-col>
  </el-row>
</template>

<style>
html,body,#app,.left_nav{
  height: 100%;
  margin: 0;
}
.right_content{
  padding: 20px;
}
</style>

<script>
  export default {
    data() {
      return {
        // isCollapse: true,
        activeIndex: '1'
      };
    }
  }
</script>