<template>
    <div>
        <el-row>
          <!-- 搜索筛选 -->
          <el-form :inline="true" class="user-search">
            <el-col :span="24">
              <el-form-item label="搜索：">
                <el-input size="small" v-model="formInline.title" placeholder="输入活动标题"></el-input>
              </el-form-item>
              <el-form-item >
                <el-input size="small" v-model="formInline.name" placeholder="输入姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="goon" icon="el-icon-search" @click="search">搜索</el-button>
              </el-form-item>
  
            </el-col>
          </el-form>
        </el-row>
        <!--列表-->
        <el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark"
          style="width: 100%; " :header-cell-style="headStyle" v-loading="loading">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="title" label="标题" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center" width="80"></el-table-column>
          <el-table-column prop="phone" label="手机号" align="center" width="140"></el-table-column>
          <el-table-column prop="bphone" label="备用手机号" align="center" width="160"></el-table-column>
          <el-table-column prop="cname" label="楼栋" align="center" width="80"></el-table-column>
          <el-table-column prop="unit" label="单元" align="center" width="80"></el-table-column>
          <el-table-column prop="hname" label="房间号" align="center" width="100"></el-table-column>
          <el-table-column prop="benks" label="备注" align="center" width="140"></el-table-column>

          <el-table-column prop="mun" label="报名状态" align="center" width="140">
            <template slot-scope="scope">
              <div>{{ scope.row.zid==1?"通过": scope.row.zid==2?"驳回":"待审核"}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="报名时间" align="center" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.ctime | timestampToTime }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160" >
            <template slot-scope="scope" >
              <el-button size="mini" type="primary" @click="handleEditdel(scope.$index, scope.row,1)" v-if="scope.row.zid==0">通过</el-button>
              <el-button size="mini" type="danger" @click="handleEditdel(scope.$index, scope.row,2)" v-if="scope.row.zid==0">驳回</el-button>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- </el-card> -->
  
      
       
  
  
    </div>
  </template>
  <script>
  import Pagination from "../../components/Pagination";
  import {
    ActivityUserList,ActivityUserupdate
  } from "../../api/userMG";
  import { imgsrc } from "../../utils/utils";
  import wangEditor from "@/components/wangEditor";
  export default {
    data() {
      return {
        id:0,
        title: "",
        loading: false,
        loading2: false,
        innerDrawer: false,
        editFormVisible: false,
        editFormVisible1: false,
        editFormVisible2: false,
        ne: "",
        tableData: [],
        userData: [],
        value1: "",
        imgsrc: "",
        //分页
        pageparm: {
          currentPage: 1,
          pageSize: 10,
          total: 10,
        },
        formInline: {
          title:"",
          name: '',
          page: 1,
          limit: 10
        },
        
  
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
        ActivityUserList(parameter)
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
              // 分页赋值
              this.pageparm.currentPage = this.formInline.page;
              this.pageparm.pageSize = this.formInline.limit;
              this.pageparm.total = res.maxPage;
              // console.log(this.tableData)
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
     
      handleEditdel(index, row,zid) {
        this.$confirm("确定要更换报名人身份吗?", "信息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            ActivityUserupdate({ id: row.id,zid:zid }) //删除
              .then((res) => {
                // console.log("d", res);
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功!",
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
                this.$message.error("操作失败，请稍后再试！");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
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
  
  .yidong {
    margin-left: 20px;
  }
  </style>