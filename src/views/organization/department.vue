<template>
    <div>
      <el-card class="box-card box-cards">
        <el-row>
          <el-form :inline="true" class="user-search">
            <el-col :span="24">
              <el-form-item>
                <div class="card_top"><span>组织架构</span></div>
              </el-form-item>
              <el-form-item label="搜索：">
                <el-input size="small" v-model="formInline.name" placeholder="输入关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="goon" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button size="small" type="primary" plain @click="handleEdit()">添加
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-card>
      <el-card class="box-card box-cards2">
        <!--列表-->
        <el-table border ref="multipleTable" :data="tableData" :header-cell-style="headStyle" tooltip-effect="dark" style="width: 100%; "
          v-loading="loading">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="name" label="部门名称" align="center"></el-table-column>
          <el-table-column prop="username" label="部门负责人" align="center"></el-table-column>
          <el-table-column prop="remarks" label="部门描述" align="center"></el-table-column>
          <el-table-column prop="enable" label="启状态用" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.enable==1?"启用":"不启用"}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="更新时间" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.ctime | timestampToTime}}</div>
            </template>
          </el-table-column>
  
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">修改
              </el-button>
              <el-button size="mini" type="danger" @click="handleEditdel(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-card>
  
      <!-- 新增 -->
      <el-drawer :title="title" :visible.sync="editFormVisible" :before-close="handleClose" direction="rtl"
        custom-class="demo-drawer" ref="drawer" size="30%">
        <div class="demo-drawer__content">
          <el-row>
            <el-form label-width="110px" :model="editForm" :rules="rules" ref="editForm">
              <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
              <el-col :span="22">
                <div class="grid-content bg-purple">
                  <el-form-item label="部门名称：" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入部门名称"></el-input>
                  </el-form-item>
                  <el-form-item label="负责人姓名：" prop="username">
                    <el-input v-model="editForm.username" placeholder="请输入负责人姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="描述信息：" prop="remarks">
                    <el-input  type="textarea"  :rows="3" placeholder="请输入描述信息" v-model="editForm.remarks"></el-input>
                  </el-form-item>
                  <el-form-item label="是否启用：" prop="enable">
                    <el-select v-model="editForm.enable" placeholder="请选择类型">
                        <el-option
                        v-for="item in optionslist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
  
                </div>
              </el-col>
  
            </el-form>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="handleClose">取消</el-button>
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
  import { imgsrc } from "../../utils/utils";
  import debounce from "../../utils/debounce";
  import { DepartmentList,DepartmentEdit, DepartmentDel } from "../../api/userMG";
  export default {
    data() {
      return {
        optionslist: [{
                value: 0,
                label: '不启用'
                }, {
                value: 1,
                label: '启用'
            }],
        title: "",
        loading: false,
        loading2: false,
        editFormVisible: false,
        dialogVisiblevideo: false,//查看视频
        //分页
        pageparm: {
          currentPage: 1,
          pageSize: 10,
          total: 10,
        },
        imgsrc: "", //图片
        tableData: [], //表格数据
        formInline: {
          name: '',
          page: 1,
          limit: 10
        },
        //添加，修改数据
        editForm: {
          id: 0,
          name: "",
          enable: 0,
          username: "",
         
          remarks: ""
        },
        //规则验证
        rules: {},
      };
    },
    components: {
      Pagination
    },
    created() {
      this.imgsrc = imgsrc;//上传地址
      //数据列表
      this.getlist(this.formInline);
    },
    methods: {
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
      getlist(parameter) {
        this.loading = true;
        DepartmentList(parameter)
          .then((res) => {
            this.loading = false;
            // console.log("userlist", res);
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
        this.getlist(this.formInline);
      },
      // 搜索事件
      search() {
        this.formInline.page = 1;
        this.getlist(this.formInline); //显示
      },
      //关闭弹框
      handleClose(done) {
        this.$confirm("还有未保存的工作哦确定关闭吗？")
          .then((_) => {
            this.editFormVisible = false
            // done();
          })
          .catch((_) => { });
      },
  
      //添加，修改
      handleEdit(index, row) {
        this.editFormVisible = true;
        if (row != undefined && row != "undefined") {//修改
          this.title = "修改";
          this.editForm = {
            id: row.id,
            name: row.name,
            enable: row.enable,
            username: row.username,
            remarks: row.remarks
          }
        } else {//添加   
          this.title = "添加";
          this.editForm = {
            id: 0,
            name: "",
            enable: 0,
            username: "",
         
          }
  
        }
      },
      //提交添加，修改
      submitForm(info) {
        console.log( this.editForm)
            this.loading2 = true;
            debounce(() => {
                DepartmentEdit(this.editForm)
                .then(res => {
                  if (res.code == 200) {
                    this.editFormVisible = false;
                    this.loading2 = false;
                    this.getlist(this.formInline);
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
  
  
            }, 1500);
      },
      //删除
      handleEditdel(index, row) {
        this.$confirm("确定要删除吗?", "信息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            DepartmentDel({ id: row.id }) //删除
              .then((res) => {
                // console.log("d", res);
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.getlist(this.formInline);
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
  
  </style>