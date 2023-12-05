<template>
    <div>
      <el-card class="box-card box-cards">
          <el-row>
            <el-form :inline="true" class="user-search">
              <el-col :span="24">
                <el-form-item>
                  <div class="card_top"><span>停车费管理</span></div>
                </el-form-item>
    
              </el-col>
            </el-form>
          </el-row>
        </el-card>
      <el-card class="box-card box-cards2">
          <el-tabs v-model="activeName">
              <el-tab-pane label="停车费列表" name="baoxiu"><farelist></farelist></el-tab-pane>
              <el-tab-pane label="生成订单" name="first"><fareadd></fareadd></el-tab-pane>
         </el-tabs>     
      </el-card>
    </div>
  </template>
  <script>
  import fareadd from "./fareadd";
  import farelist from "./farelist";
 
  
  export default {
    data() {
      return {    
          activeName:'baoxiu',
        
      };
    },
    components: {
      fareadd,
      farelist
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