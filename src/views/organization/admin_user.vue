<template>
  <div>
    <el-card class="box-card box-cards">
      <el-row>
        <el-form :inline="true" class="user-search">
          <el-col :span="24">
            <el-form-item>
              <div class="card_top"><span>员工管理</span></div>
            </el-form-item>
            <el-form-item label="搜索：">
              <el-input size="small" v-model="formInline.name" placeholder="输入姓名"></el-input>
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
      <el-table border ref="multipleTable" :data="tableData" :header-cell-style="headStyle" tooltip-effect="dark"
        style="width: 100%; " v-loading="loading">
        <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="ioc" label="头像" align="center" width="100">
           <template slot-scope="scope">
            <img :src="scope.row.ioc" alt="" style="border-radius: 50%;width:40px; height: 40px;">
           </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "未知"  }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="title" label="部门" align="center"></el-table-column>
        <el-table-column prop="zw" label="职务 " align="center"></el-table-column>
        <el-table-column prop="address" label="联系地址 " align="center"  width="150"></el-table-column>
        <el-table-column prop="enable" label="是否维修工人" align="center"  width="170">
          <template slot-scope="scope">
            <div>{{ scope.row.bid == 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="是否住户查询" align="center"  width="170">
          <template slot-scope="scope">
            <div>{{ scope.row.cid == 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="小程序显示" align="center"  width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.xs == 1 ? "显示" : "不显示" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="小程序绑定" align="center" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.aid>0 ? "已绑定" : "未绑定" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ctime" label="更新时间" align="center"  width="160">
          <template slot-scope="scope">
            <div>{{ scope.row.ctime | timestampToTime }}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150">
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
                <el-form-item label="头像：" prop="logo">
                  <el-upload class="avatar-uploader" :action="imgsrc" :show-file-list="false"
                    :on-success="licenseSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="editForm.ioc" :src="editForm.ioc" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="姓名：" prop="name">
                  <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="enable">
                  <el-select v-model="editForm.sex" placeholder="请选择性别">
                    <el-option v-for="item in optionslist" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="绑定微信：" prop="zw">
                  <el-input v-model="editForm.aid" placeholder="请输入微信编号；0不绑定"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                  <el-input v-model="editForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="部门：" prop="enable">
                  <el-select v-model="editForm.departmentid" placeholder="请选择部门">
                    <el-option v-for="item in useroptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="职务：" prop="zw">
                  <el-input v-model="editForm.zw" placeholder="请输入职务"></el-input>
                </el-form-item>
                <el-form-item label="维修人员：" prop="enable">
                  <el-select v-model="editForm.bid" placeholder="请选择类型">
                    <el-option v-for="item in lxlist" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="住户查询：" prop="enable">
                  <el-select v-model="editForm.cid" placeholder="请选择类型">
                    <el-option v-for="item in lxlist" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系住址：" prop="address">
                  <el-input v-model="editForm.address" placeholder="请输入联系地址"></el-input>
                </el-form-item>
                <el-form-item label="小程序显示：" prop="xs">
                  <el-select v-model="editForm.xs" placeholder="请选择类型">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
import { AdminUserList, AdminUserEdit, AdminUserDel,DepartmentXlList } from "../../api/userMG";
export default {
  data() {
    return {
      optionslist: [{
        value: 0,
        label: '未知'
      }, {
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      lxlist: [{
        value: 0,
        label: '否'
      }, {
        value: 1,
        label: '是'
      }],
      options: [{
        value: 0,
        label: '首页不显示'
      }, {
        value: 1,
        label: '首页显示'
      }],
      
      useroptions:[],
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
        ioc: "",
        sex: "",
        phone: "",
        address: "",
        xs: "",
        departmentid: "",
        zw: "",
        aid:0,
        bid:0

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
    this.getlistmane()

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
    getlistmane() {
      DepartmentXlList({}).then((res) => {
        console.log(res)
                    this.useroptions = res.data
            })
            .catch((err) => {
            });
      },
    //显示数据
    getlist(parameter) {
      this.loading = true;
      AdminUserList(parameter)
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
    //添加，修改
    handleEdit(index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {//修改
        this.title = "修改";
        this.editForm = {
          id: row.id,
          name: row.name,
          ioc: row.ioc,
          sex: row.sex,
          phone: row.phone,
          address: row.address,
          xs: row.xs,
          departmentid: row.departmentid,
          zw: row.zw,
          aid:row.aid,
          bid:row.bid,
          cid:row.cid

        }
      } else {//添加   
        this.title = "添加";
        this.editForm = {
          id: 0,
          name: "",
          ioc: "",
          sex: "",
          phone: "",
          address: "",
          xs: "",
          departmentid: "",
          zw: "",
          aid:0,
          bid:0,
          cid:0


        }

      }
    },
    //提交添加，修改
    submitForm(info) {
      console.log(this.editForm)
      this.loading2 = true;
      debounce(() => {
        AdminUserEdit(this.editForm)
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
          AdminUserDel({ id: row.id }) //删除
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