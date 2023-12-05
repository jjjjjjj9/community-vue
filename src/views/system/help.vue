<template>
    <!-- 账号管理 -->
    <div>
      <el-card class="box-card box-cards">
        <el-row>
          <el-form :inline="true" class="user-search">
            <el-col :span="24">
              <el-form-item>
                <div class="card_top"><span>帮助中心</span></div>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="success" @click="handleEdit()">添加
                </el-button>
              </el-form-item>
  
            </el-col>
          </el-form>
        </el-row>
      </el-card>
      <el-card class="box-card box-cards2">
        
        <el-collapse accordion>
          <el-collapse-item v-for="(itme,index) in  tableData" :key="index">
            <template slot="title">
              {{itme.title}}<i class="header-icon el-icon-delete" @click="handleEditdel(itme)"></i>
            </template>
            <div v-html="itme.content" ></div>
          </el-collapse-item>
          
        </el-collapse>
      </el-card>
  
      <!-- 新增 -->
      <el-drawer :title="title" :visible.sync="editFormVisible" :before-close="handleClose" direction="rtl"
        custom-class="demo-drawer" ref="drawer" size="50%">
        <div class="demo-drawer__content">
          <el-row>
            <el-form label-width="110px" :model="editForm" ref="editForm">
              <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
              <el-col :span="22">
                <div class="grid-content bg-purple">
                  <el-form-item label="标题：" prop="name">
                    <el-input v-model="editForm.title"></el-input>
                  </el-form-item>
                  <el-form-item label="内容：" prop="telephone">
                    <wangEditor v-model="editForm.content"></wangEditor>
                  </el-form-item>
                </div>
              </el-col>
  
            </el-form>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="handleCloseone">取消</el-button>
            <el-button size="small" type="goon" :loading="loading2" class="title" @click="submitForm('editForm')">
              保存</el-button>
          </div>
          <div style="height: 60px; margin-top: 50px"></div>
        </div>
      </el-drawer>
  
     
  
  
    </div>
  </template>
  <script>
  import Pagination from "../../components/Pagination";
  import {
    BasicAdd, BasicList, BasicDel
  } from "../../api/userMG";
  import { imgsrc } from "../../utils/utils";
  import wangEditor from "@/components/wangEditor";
  export default {
    data() {
      return {
        options: [],

        title: "",
        loading: false,
        loading2: false,
        editFormVisible: false,
        editFormVisible2: false,
        ne:"",
        tableData: [],
  
        imgsrc: "",
        //分页
        pageparm: {
          currentPage: 1,
          pageSize: 10,
          total: 10,
        },
        formInline: {
          name: '',
          lx: 0,
          page: 1,
          limit: 10,
          aid:0
        },
        editForm: {
          ioc: "",
          title: "",
          content: "",
          info_class_id:''
  
        }
  
      };
    },
    components: {
      Pagination,
      wangEditor
    },
    created() {

      this.userlist(this.formInline);
      this.imgsrc = imgsrc;//上传地址
    },
    methods: {
      //列表样式
      headStyle() {
        return {
          background: "#A1BBFF",
          color: "#fff",
          letterSpacing: "10px",
          border: " 1px solid #A1BBFF",
          textAlign: "center",
          height: "39px",
        };
      },
      
      //显示数据
      userlist(parameter) {
        this.loading = true;
        BasicList(parameter)
          .then((res) => {
            this.loading = false;
            // console.log("userlist", res.data);
            if (res.code != 200) {
              this.$message({
                type: "info",
                message: res.msg,
              });
            } else {
              this.tableData = res.data;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error("加载失败，请稍后再试！");
          });
      },
      // 分页插件事件
      callFather(parm) {
        this.formInline.page = parm.currentPage;
        this.formInline.limit = parm.pageSize;
        this.userlist(this.formInline);
      },
      // 搜索事件
      search() {
        this.formInline.page = 1;
        this.userlist(this.formInline); //显示
      },
      //关闭弹框
      handleClose(done) {
        this.$confirm("还有未保存的工作哦确定关闭吗？")
          .then((_) => {
            done();
          })
          .catch((_) => { });
      },
      handleCloseone() {
        this.$confirm("还有未保存的工作哦确定关闭吗？")
          .then((_) => {
            this.editFormVisible = false;
          })
          .catch((_) => { });
      },
      //添加，修改
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editForm={
          title: "",
          content: ""
        }
      },
      //上传头像
      licenseSuccess(response, file) {
        this.editForm.ioc = response.data
      },
      //限制上传的文件
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 格式或者png格式!');
        }
        return isJPG || isPNG;
      },
      submitForm(info) {
  
        BasicAdd(this.editForm)
          .then(res => {
            // console.log("useradd", res);
            //显示
            if (res.code == 200) {
              this.editFormVisible = false;
              this.loading2 = false;
              this.userlist(this.formInline);
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
      //删除
      handleEditdel(row) {
        this.$confirm("确定要删除吗?", "信息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            BasicDel({ id: row.id }) //删除
              .then((res) => {
                // console.log("d", res);
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.userlist(this.formInline);
                } else {
                  this.$message({
                    type: "info",
                    message: res.msg,
                  });
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error("删除失败，请稍后再试！");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
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
  .header-icon{
    color: red;
    margin-left: 20px;
  }
  </style>