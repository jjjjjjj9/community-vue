<template>
    <div>
      <el-card class="box-card box-cards">
          <el-row>
            <el-form :inline="true" class="user-search">
              <el-col :span="24">
                <el-form-item>
                  <div class="card_top"><span>物业费管理</span></div>
                </el-form-item>
    
              </el-col>
            </el-form>
          </el-row>
        </el-card>
      <el-card class="box-card box-cards2">
          <el-tabs v-model="activeName">
              <el-tab-pane label="物业费列表" name="baoxiu"><property_feelist></property_feelist></el-tab-pane>
              <el-tab-pane label="生成订单" name="first"><property_feeadd></property_feeadd></el-tab-pane>
         </el-tabs>     
      </el-card>
    </div>
  </template>
  <script>
  import property_feeadd from "./property_feeadd";
  import property_feelist from "./property_feelist";
 
  
  export default {
    data() {
      return {    
          activeName:'baoxiu',
        
      };
    },
    components: {
      property_feeadd,
      property_feelist
    },
    created() {
      
    },
    methods: {
  
    },
  };
  </script>
  <style>
  @import "../../assets/css/index.css";
  .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      
      
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  .addgl {
    margin-right: 5%;
  }
  
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .box-card .el-input__inner,
  .user-search .el-input__inner {
    height: 34px;
    margin-top: 3px;
  }
  </style>
  <style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .divBox {
    /*flex-direction: row;*/
    float: left;
    position: relative;
    margin-right: 10px;
  }
  .imgSty {
    margin-left: 3px;
  }
  .delIcon {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 20px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>