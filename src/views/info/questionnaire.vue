<template>
    <div>
      <el-card class="box-card box-cards">
          <el-row>
            <el-form :inline="true" class="user-search">
              <el-col :span="24">
                <el-form-item>
                  <div class="card_top"><span>调查问卷管理</span></div>
                </el-form-item>
    
              </el-col>
            </el-form>
          </el-row>
        </el-card>
      <el-card class="box-card box-cards2">
          <el-tabs v-model="activeName">
              <el-tab-pane label="调查问卷列表" name="baoxiu"><questionnaireadd></questionnaireadd></el-tab-pane>
              <el-tab-pane label="调查问卷提交列表" name="first"><questionnairelist></questionnairelist></el-tab-pane>
         </el-tabs>     
      </el-card>
    </div>
  </template>
  <script>
  import questionnaireadd from "./questionnaireadd";
  import questionnairelist from "./questionnairelist";
  
  
  export default {
    data() {
      return {    
          activeName:'baoxiu',
        
      };
    },
    components: {
        questionnaireadd,
        questionnairelist
    },
    created() {
      
    },
    methods: {
  
    },
  };
  </script>
  <style>
  @import "../../assets/css/index.css";
  
  </style>