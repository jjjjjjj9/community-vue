<template>
    <!-- 账号管理 -->
    <div>
      <el-card class="box-card box-cards">
        <el-row>
          <el-form :inline="true" class="user-search">
            <el-col :span="24">
              <el-form-item>
                <div class="card_top"><span>基本信息</span></div>
              </el-form-item>
  
            </el-col>
          </el-form>
        </el-row>
      </el-card>
      <el-card class="box-card box-cards2">
        <div class="demo-drawer__content">
          <el-row :gutter="20">
            <el-form label-width="110px" :model="editForm" ref="editForm">
              
              <el-col :span="12">
                <el-col class="titleq" style="margin-bottom: 20px">小程序配置信息</el-col>
                <div class="grid-content bg-purple">
                  <el-form-item label="Appid：" prop="name" label-width="140px">
                    <el-input v-model="editForm.appid"></el-input>
                  </el-form-item>
                  <el-form-item label="Secret：" prop="name" label-width="140px">
                    <el-input v-model="editForm.secret"></el-input>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="12">
                <el-col class="titleq" style="margin-bottom: 20px">OSS 配置信息</el-col>
                <div class="grid-content bg-purple">
                  <el-form-item label="Endpoint：" prop="name" label-width="140px">
                    <el-input v-model="editForm.endpoint"></el-input>
                  </el-form-item>
                  <el-form-item label="BucketName：" prop="name" label-width="140px">
                    <el-input v-model="editForm.bucketName"></el-input>
                  </el-form-item>
                  <el-form-item label="AccessKeyId：" prop="name" label-width="140px">
                    <el-input v-model="editForm.accessKeyId"></el-input>
                  </el-form-item>
                  <el-form-item label="AccessKeySecret：" prop="name" label-width="140px">
                    <el-input v-model="editForm.accessKeySecret"></el-input>
                  </el-form-item>
                </div>
              </el-col>
  
            </el-form>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="goon" class="title" @click="submitForm('editForm')">
              保存</el-button>
          </div>
          <div style="height: 60px; margin-top: 50px"></div>
        </div>
       
      </el-card>
  
  
    </div>
  </template>
  <script>
  import {
    BasicEdit, BasicByDate
  } from "../../api/userMG";
  import { imgsrc } from "../../utils/utils";
  import wangEditor from "@/components/wangEditor";
  export default {
    data() {
      return {
        formInline: {
          lxid: 1
        },
        editForm: {
          id: 0,
          appid: "",
          secret: "",
          endpoint: "",
          bucketName: "",
          accessKeyId: "",
          accessKeySecret: ""

  
        }
  
      };
    },
    components: {
      wangEditor
    },
    created() {
      this.userlist(this.formInline);
      this.imgsrc = imgsrc;//上传地址
    },
    methods: {
      
      //显示数据
      userlist(parameter) {
        this.loading = true;
        BasicByDate(parameter)
          .then((res) => {
            this.loading = false;
            // console.log("userlist", res.data);
            if (res.code != 200) {
              this.$message({
                type: "info",
                message: res.msg,
              });
            } else {
              this.editForm = res.data;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error("加载失败，请稍后再试！");
          });
      },
     
      submitForm(info) {
  
        BasicEdit(this.editForm)
          .then(res => {
            // console.log("useradd", res);
            //显示
            if (res.code == 200) {
              this.editFormVisible = false;
              this.loading2 = false;
              // this.userlist(this.formInline);
              this.$message({
                message: "保存成功！",
                type: "success",
              });
            } else {
              this.loading2 = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          })
          .catch((err) => {
            this.editFormVisible = false;
            this.loading2 = false;
            this.$message.error("保存失败，请稍后再试！");
          });
      },
      chakan(index, row) {
            this.ne=row.content
            this.editFormVisible2=true
      },
      
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
  
  .el-tag+.el-tag {
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