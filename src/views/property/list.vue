<template>
    <!-- 账号管理 -->
    <div>
      <el-card class="box-card box-cards">
        <el-row>
          <!-- 搜索筛选 -->
          <el-form :inline="true" class="user-search">
            <el-col :span="24">
              <el-form-item>
                <div class="card_top"><span>联系热线</span></div>
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
        <!--列表-->
        <el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark"
          style="width: 100%;" :header-cell-style="headStyle" v-loading="loading">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="phone" label="联系方式" align="center">
          </el-table-column>
          <el-table-column prop="aid" label="类型" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.aid==0?"社区联系方式":"师傅联系方式"}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleEditdel(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <!-- <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination> -->
      </el-card>
  
      <!-- 新增 -->
      <el-drawer :title="title" :visible.sync="editFormVisible" :before-close="handleClose" direction="rtl"
        custom-class="demo-drawer" ref="drawer" size="30%">
        <div class="demo-drawer__content">
          <el-row>
            <el-form label-width="110px" :model="editForm" ref="editForm">
              <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
              <el-col :span="22">
                <div class="grid-content bg-purple">
  
                  <el-form-item label="名称：" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="类型：" prop="telephone">
                    <el-select v-model="editForm.aid" placeholder="请选择">
                      <el-option label="社区联系方式" value="0"> </el-option>
                      <el-option label="师傅联系方式" value="1"> </el-option>
  
                    </el-select>
                  </el-form-item>
                  <el-form-item label="联系方式：" prop="telephone">
                    <el-input v-model="editForm.phone"></el-input>
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
    Telephoneadd, TelephoneList, Telephonedel
  } from "../../api/userMG";
  import { imgsrc } from "../../utils/utils";
  import wangEditor from "@/components/wangEditor";
  export default {
    data() {
      return {
        title: "",
        loading: false,
        loading2: false,
        editFormVisible: false,
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
          limit: 10
        },
        editForm: {
          name: "",
          phone: "",
          aid: '0'
        }
  
      };
    },
    components: {
      Pagination,
      wangEditor
    },
    created() {
      //数据列表
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
        TelephoneList(parameter)
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
        this.editForm = {
          name: "",
          phone: "",
          aid: '0'
        }
      },
  
      submitForm(info) {
  
        Telephoneadd(this.editForm)
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
      //删除
      handleEditdel(index, row) {
        this.$confirm("确定要删除吗?", "信息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            Telephonedel({ id: row.id }) //删除
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
  </style>