<template>
  <div>
    <el-row>
      <!-- 搜索筛选 -->
      <el-form :inline="true" class="user-search">
        <el-col :span="24">
          <el-form-item label="搜索：">
            <el-input size="small" v-model="formInline.name" placeholder="输入标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="goon" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button size="small" type="success" @click="handleEdit()">添加
            </el-button>
          </el-form-item>

        </el-col>
      </el-form>
    </el-row>
    <!--列表-->
    <el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%; "
      :header-cell-style="headStyle" v-loading="loading">
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="logo" label="封面图" align="center" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.ioc" alt="" style="width:160px; height: 50px;">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="问卷标题" align="center" width="140">
      </el-table-column>
      <el-table-column prop="content" label="问卷描述" align="center">
      </el-table-column>
      <el-table-column prop="mun" label="问卷状态" align="center" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.zt == 1 ? "进行中" : scope.row.zt == 3 ? "结束" : "未开始" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="stime" label="开始时间" align="center" width="160">
      </el-table-column>
      <el-table-column prop="etime" label="结束时间" align="center" width="160">
      </el-table-column>
      <el-table-column prop="ctime" label="发布时间" align="center" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.ctime | timestampToTime }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="chakan(scope.$index, scope.row)">设置题目</el-button>

          <!-- <el-button size="mini" type="primary" @click="handleEditdel1(scope.$index, scope.row)">查看报名名单</el-button> -->
          <el-button size="mini" type="danger" @click="handleEditdel(scope.$index, scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- </el-card> -->

    <!-- 新增 -->
    <el-drawer :title="title" :visible.sync="editFormVisible" :before-close="handleClose" direction="rtl"
      custom-class="demo-drawer" ref="drawer" size="30%">
      <div class="demo-drawer__content">
        <el-row>
          <el-form label-width="110px" :model="editForm" ref="editForm">
            <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
            <el-col :span="22">
              <div class="grid-content bg-purple">
                <el-form-item label="封面图：" prop="logo">
                  <el-upload class="avatar-uploader" :action="imgsrc" :show-file-list="false"
                    :on-success="licenseSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="editForm.ioc" :src="editForm.ioc" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="问卷标题：" prop="name">
                  <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <el-form-item label="报名时间：" prop="name">
                  <el-date-picker v-model="value1" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="time()">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="问卷描述：" prop="telephone">
                  <el-input v-model="editForm.content" type="textarea" placeholder="请输入问卷描述" maxlength="300"
                    show-word-limit rows="7"></el-input>
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




    <el-drawer title="设置题目" :visible.sync="editFormVisible2" :before-close="handleCloseasd" direction="rtl"
      custom-class="demo-drawer" ref="drawer" size="40%">
      <div class="demo-drawer__content">
        <el-row>
          <el-col class="titleq" style="margin-bottom: 20px">题目信息
            <el-button size="small" type="primary" round @click="addtm()">添加
            </el-button>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple" style="margin: 20px">
              <div v-for="(itme,index) in userData" :key="index">
                <div>{{index+1}}、{{itme.title}}({{itme.lxid==0?'单选':itme.lxid==1?'多选':'填空'}}) <i class="el-icon-delete" style="color:red" @click="shanchu(itme.id)"></i></div>
                <div v-for="(itm,ind) in itme.list" :key="ind" class="timug">{{itm.title}}</div>

              </div>
             
            </div>
          </el-col>
        </el-row>
        <div style="height: 60px; margin-top: 50px"></div>
      </div>


    </el-drawer>


    <el-drawer title="添加题目" :visible.sync="editFormVisibletm" :before-close="handleClosetm" direction="rtl"
      custom-class="demo-drawer" ref="drawer" size="30%">
      <div class="demo-drawer__content">
        <el-row>
          <el-form label-width="110px" :model="usereditForm" ref="editForm">
            <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
            <el-col :span="22">
              <div class="grid-content bg-purple">
                <el-form-item label="题目：" prop="name">
                  <el-input v-model="usereditForm.title"></el-input>
                </el-form-item>
                <el-form-item label="题目类型;">
                  <el-select v-model="usereditForm.lx" placeholder="请选择类型">
                    <el-option label="单选" value="0"></el-option>
                    <el-option label="多选" value="1"></el-option>
                    <el-option label="填空" value="2"></el-option>

                  </el-select>
                </el-form-item>
                <el-form-item label="选项:" v-if="usereditForm.lx!='2'">
                  <el-tag
                    :key="tag"
                    v-for="tag in usereditForm.name"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增选项</el-button>
                </el-form-item>
              </div>
            </el-col>

          </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleCloseonetm">取消</el-button>
          <el-button size="small" type="goon" :loading="loading2" class="title" @click="submitFormtm('editForm')">
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
  Questionnaireadd, QuestionnaireList, Questionnairedel,
  QuestionnaireTitleadd,QuestionnaireTitlelist,QuestionnaireTitledel
} from "../../api/userMG";
import { imgsrc } from "../../utils/utils";
import wangEditor from "@/components/wangEditor";
export default {
  data() {
    return {
      id: 0,
      title: "",
      loading: false,
      loading2: false,
      innerDrawer: false,
      editFormVisible: false,
      editFormVisible1: false,
      editFormVisible2: false,

      editFormVisibletm: false,
      inputVisible: false,
        inputValue: '',
      titleid:0,
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
        name: '',
        lx: 0,
        page: 1,
        limit: 10
      },
      editForm: {
        ioc: "",
        title: "",
        content: "",
        etime: "",
        stime: ""
      },
      usereditForm: {
        titleid: 0,
        lx:"0",
        title: "",
        name: []
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
      QuestionnaireList(parameter)
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
    //关闭弹框
    handleCloseasd(done) {
      done();

    },
    handleCloseone() {
      this.editFormVisible = false;
    },
    handleClosetm(done) {
      done();
    },
    handleCloseonetm() {
      this.editFormVisibletm = false;
    },
    addtm(){
      this.usereditForm={
        titleid: this.titleid,
        lx:"0",
        title: "",
        name: []
      }
      this.editFormVisibletm = true;

    },
    handleClose(tag) {
        this.usereditForm.name.splice(this.usereditForm.name.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.usereditForm.name.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    //添加，修改
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.editForm = {
        ioc: "",
        title: "",
        content: "",
        etime: "",
        stime: ""
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
    time() {
      this.editForm.stime = this.value1[0]
      this.editForm.etime = this.value1[1]
    },
    submitForm(info) {

      Questionnaireadd(this.editForm)
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
      this.titleid = row.id
      this.gettitle();
    },
    //删除
    handleEditdel(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Questionnairedel({ id: row.id }) //删除
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
    },
    submitFormtm(){
      this.usereditForm.titleid=this.titleid
      QuestionnaireTitleadd(this.usereditForm)
        .then(res => {
          //显示
          if (res.code == 200) {
            this.editFormVisibletm = false;
            this.loading2 = false;
            this.gettitle();
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
    gettitle(){
      QuestionnaireTitlelist({titleid:this.titleid})
        .then((res) => {
            this.userData = res.data;
            this.editFormVisible2 = true

        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("加载失败，请稍后再试！");
        });
    },
    shanchu(id){
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          QuestionnaireTitledel({ id: id }) //删除
            .then((res) => {
              // console.log("d", res);
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.gettitle();
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

.yidong {
  margin-left: 20px;
}
.el-tag{
  width: 100%;
}
.el-tag + .el-tag {
    margin-left: 0px;
  }
  .button-new-tag {
    margin-left: 0px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    /* width: 100%; */
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .timug{
    padding: 5px 0 5px 20px;
  }
</style>