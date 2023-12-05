<template>
    <div>
      <el-card class="box-card box-cards">
        <el-row>
          <el-form :inline="true" class="user-search">
            <el-col :span="24">
              <el-form-item>
                <div class="card_top"><span>爱心物资管理</span></div>
              </el-form-item>
              <el-form-item label="搜索：">
                <el-input size="small" v-model="formInline.name" placeholder="输入姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="goon" icon="el-icon-search" @click="search">搜索</el-button>
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
          <el-table-column prop="uname" label="姓名" align="center"  width="100"></el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center"  width="160"></el-table-column>
          <el-table-column prop="title" label="楼栋" align="center"  width="100"></el-table-column>
          <el-table-column prop="unit" label="单元" align="center"  width="100"></el-table-column>
          <el-table-column prop="name" label="房间" align="center"  width="100"></el-table-column>
          
          <el-table-column prop="remarks" label="物资清单信息" align="center" ></el-table-column>
         
          <el-table-column prop="enable" label="验证状态" align="center"  width="120">
            <template slot-scope="scope">
              <div>{{scope.row.status==1?"验证成功":scope.row.status==2?"验证失败":"待验证"}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="捐款时间" align="center"  width="160">
            <template slot-scope="scope">
              <div>{{scope.row.ctime | timestampToTime}}</div>
            </template>
          </el-table-column>
  
          <el-table-column align="center" label="操作" width="250" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" v-if="scope.row.status==0" @click="handleEdit(scope.$index, scope.row,1)">成功</el-button>
              <el-button size="mini" type="warning" v-if="scope.row.status==0" @click="handleEdit(scope.$index, scope.row,2)">驳回</el-button>

              <el-button size="mini" type="danger" v-if="scope.row.status!=1" @click="handleEditdel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-card>
  
    </div>
  </template>
  <script>
  import Pagination from "../../components/Pagination";
  import { imgsrc } from "../../utils/utils";
  import debounce from "../../utils/debounce";
  import { MaterialList,Materialshenhe, MaterialDel } from "../../api/userMG";
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
        MaterialList(parameter)
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
              console.log(this.tableData)
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
     
  
     
      //删除
      handleEditdel(index, row) {
        this.$confirm("确定要删除吗?", "信息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            MaterialDel({ id: row.id }) //删除
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
      },
      handleEdit(index, row,e) {
        this.$confirm("确定要更变校验类型吗?", "信息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            Materialshenhe({ id: row.id,status:e }) //删除
              .then((res) => {
                // console.log("d", res);
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "更变成功!",
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
                this.$message.error("更变失败，请稍后再试！");
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