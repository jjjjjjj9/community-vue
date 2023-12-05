<template>
  <div>
    <el-card class="box-card box-cards">
      <el-row>
        <el-form :inline="true" class="user-search">
          <el-col :span="24">
            <el-form-item>
              <div class="card_top"><span>楼栋管理</span></div>
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
        <el-table-column prop="name" label="楼栋名称" align="center"></el-table-column>
        <el-table-column prop="unit" label="单元数" align="center"></el-table-column>
        <el-table-column prop="building_type" label="楼栋类型" align="center"></el-table-column>
        <el-table-column prop="building_structure" label="建筑结构" align="center"></el-table-column>
        <el-table-column prop="layer" label="层数" align="center"></el-table-column>
        <el-table-column prop="building_use" label="楼栋用途" align="center"></el-table-column>
        <el-table-column prop="jtime" label="建成日期" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.jtime | timestampToTimes}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ytime" label="验收日期" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.ytime | timestampToTimes}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="jarea" label="建筑面积" align="center"></el-table-column>
        <el-table-column prop="sarea" label="使用面积" align="center"></el-table-column>

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
                <el-form-item label="楼栋名称：" prop="name">
                  <el-input v-model="editForm.name" placeholder="请输入楼栋名称"></el-input>
                </el-form-item>
                <el-form-item label="单元数：" prop="unit">
                  <el-input v-model="editForm.unit" type="number" :min="1" placeholder="请输入单元数"></el-input>
                </el-form-item>
                <el-form-item label="楼栋类型：" prop="building_type">
                  <el-input v-model="editForm.building_type" placeholder="请输入楼栋类型"></el-input>
                </el-form-item>
                <el-form-item label="建筑结构：" prop="building_structure">
                  <el-input v-model="editForm.building_structure" placeholder="请输入建筑结构"></el-input>
                </el-form-item>
                <el-form-item label="层数：" prop="layer">
                  <el-input v-model="editForm.layer" type="number"  :min="1" placeholder="请输入层数"></el-input>
                </el-form-item>
                <el-form-item label="楼栋用途：" prop="building_use">
                  <el-input v-model="editForm.building_use" placeholder="请输入楼栋用途"></el-input>
                </el-form-item>
                <el-form-item label="建成日期：" prop="jtime">
                  <el-date-picker v-model="editForm.jtime" type="date"  placeholder="选择建成日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="验收日期:" prop="ytime">
                  <el-date-picker v-model="editForm.ytime" type="date"  placeholder="选择验收日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="建筑面积:" prop="jarea">
                  <el-input v-model="editForm.jarea" placeholder="请输入建筑面积"></el-input>
                </el-form-item>
                <el-form-item label="使用面积：" prop="sarea">
                  <el-input v-model="editForm.sarea" placeholder="请输入使用面积"></el-input>
                </el-form-item>
                <el-form-item label="备注信息：" prop="remarks">
                  <el-input  type="textarea"  :rows="3" placeholder="请输入备注信息" v-model="editForm.remarks"></el-input>
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
import { BuildingList,BuildingEdit, BuildingDel } from "../../api/userMG";
export default {
  data() {
    return {
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
        unit: 1,
        building_type: "",
        building_structure: "",
        layer: 1,
        building_use: "",
        jtime: "",
        ytime: "",
        jarea: "",
        sarea: "",
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
      BuildingList(parameter)
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
          unit: row.unit,
          building_type: row.building_type,
          building_structure: row.building_structure,
          layer: row.layer,
          building_use: row.building_use,
          jtime: row.jtime,
          ytime: row.ytime,
          jarea: row.jarea,
          sarea: row.sarea,
          remarks: row.remarks
        }
      } else {//添加   
        this.title = "添加";
        this.editForm = {
          id: 0,
          name: "",
          unit: 1,
          building_type: "",
          building_structure: "",
          layer: 1,
          building_use: "",
          jtime: "",
          ytime: "",
          jarea: "",
          sarea: "",
          remarks: ""
        }

      }
    },
    //提交添加，修改
    submitForm(info) {
      console.log( this.editForm)
          this.loading2 = true;
          debounce(() => {
            BuildingEdit(this.editForm)
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
          BuildingDel({ id: row.id }) //删除
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