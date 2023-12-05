<template>
  <div class="left">
    <div class="top">
      <div class="title">
        <div>
          <h1>智慧物业管理系统</h1>
        </div>
      </div>
      <div class="top_right"></div>
      <div class="top_logo">
        <div>
          <div class="topdiv1">
            <p>
            </p>
            <div class="topdiv1_title">
               <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="80"></el-avatar>
               <h2>用户登陆</h2>
            </div>
          </div>
          <div class="topdiv2">
            <el-form ref="form" :model="form" :rules="rules">
              <el-form-item label prop="username">
                <el-input v-model="form.username" placeholder="请输入账号"></el-input>
              </el-form-item>
              <el-form-item label prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-button type="logins" :loading="loading" @click="submitForm('form')">登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">技术支持 ©  谢经理：13476865273（微信同号）</div>
  </div>
</template>
<script>
import { login } from "../api/userMG";
export default {
  data() {
    return {
      loading:false,
      rememberpwd:false,//记住账号密码
      form: {
        username: "",//账号
        password: "" //密码
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.$message({
      message: "账号密码及验证码不为空即可",
      type: "success"
    });

    // 获取存在本地的账户密码
    // this.getUser();
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // console.log(this.form)
          this.loading = true;
          //  localStorage.setItem('menuid', 1)
                  // this.$store.commit('login', 'true')
                  // this.$router.push({ path: '/home/index' })
                  // localStorage.setItem('userData', {})
                  // localStorage.setItem('ctime', Date.now())
            
            login(this.form).then((res)=>{
              if(res.code==200){
                setTimeout(()=>{
                   // 缓存用户个人信息
                   localStorage.setItem('ctime', Date.now())
                  localStorage.setItem('userData', JSON.stringify(res.data))
                  localStorage.setItem('menuid', 1)
                  this.$store.commit('login', 'true')
                  this.$router.push({ path: '/home/index' })
                },1000)
              }else{
                this.loading = false;
                this.$message.error(res.msg)                
                return false
              }
            })
        } else {
          this.$message.error("请输入用户名密码！");
          this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>
<style>
  @import url('../assets/css/nav.css');
</style>