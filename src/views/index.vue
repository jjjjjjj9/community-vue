<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <leftnav ></leftnav>
      </el-aside>
      <el-container>
        <el-header height=" 70px">
          <navcon ></navcon>
        </el-header>
        <el-main>    
          <router-view></router-view>
          <div class="shuom">技术支持 ©  谢经理：13476865273（微信同号）</div>
        </el-main>
      </el-container>
    </el-container>
    
  </div>
</template>
<script>
import leftnav from "../components/leftnav";
import navcon from "../components/navcon";
export default {
  data() {
    return {
        menuall:[]
    };
  },
  components: {
    leftnav,
    navcon,
  },
   created() {
    let ctime=Date.now()-localStorage.getItem('ctime');
    let data=172800000-ctime;
    if(data<0){
      localStorage.setItem('userInfo', 'false')
      localStorage.removeItem('userData')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('menuall')
      localStorage.removeItem('menuid')
      this.$router.push({ path: '/login' })
    }
  },
  methods: {
  },
};
</script>
<style>
.el-header {
  background-color: #fff;
  color: #333;
  box-shadow: 0px 15px 10px -13px rgb(224, 224, 224);
  padding:0 !important;
  position: relative;
  z-index: 1;
}

.el-aside {
  background-color: #ffffff;
  /* color: #333; */
  text-align: center;
  height: 100vh;
}

.el-main {
  height: 80vh;
  width: 100%;
  text-align: left;
  
}
.el-menu {
    border-right: solid 0px #e6e6e6;
}
.shuom{
  color: #7a7979;
  text-align: center;
  margin: 20px 0;
}
</style>