<template>
  <div>
    <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal">
      <div class="div_menu">
        智慧物业管理系统
      </div>
      <div class="right" @click="exit()">
        <span>退出登录</span>
        <i class="el-icon-switch-button"></i>
      </div>
      

    </el-menu>


  </div>
</template>
<script>
export default {
  data() {
    return {
      tishi: true,
    };
  },
  props: ["menuall"],
  created() { },
  methods: {
    //退出
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setTimeout(() => {
            //  this.$store.commit(方法名称，值) 调用状态管理mutations中的方法，才能在store存储成功。
            this.$store.commit('userInfo', 'false')
            
            localStorage.removeItem('userData')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('menuall')
            localStorage.removeItem('menuid')
            this.$router.push({ path: '/login' })
            this.$message({
              type: 'success',
              message: '已退出登录!'
            })
          }, 500)

        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
};
</script>
<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}

.el-menu--horizontal {
  border-bottom: solid 1px #fff !important;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 2px solid #fff !important;
  color: #5D4ED9 !important;
}

.isactives {
  border-bottom: 2px solid #5D4ED9 !important;
}

.div_menu {
  float: left;
  /* width: 240px; */
  height: 61px;
  font-size: 24px;
  font-weight: 900;
  line-height: 61px;
  margin-left: 20px;
}

.div_menu>img {
  margin-top: 13px;
  width: 200px !important;
  height: 47px !important;
}

.right {
  float: right;
  line-height: 61px;
  font-size: 20px;
  
  margin-right: 20px;
  cursor: pointer;
}

.el-icon-arrow-down:before {
  content: "" !important;
}

.right span {
  font-size: 16px;
  color: #474646;
}
</style>