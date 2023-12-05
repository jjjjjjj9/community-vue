<template>
    <div>
        <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item label="车库信息：">
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" plain @click="handleEdit()">添加
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        <!--列表-->
        <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" :header-cell-style="headStyle"
            style="width: 100%; " v-loading="loading">
            <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="name" label="车库名称" align="center"></el-table-column>
            <el-table-column prop="region" label="车位区域" align="center"></el-table-column>
            <el-table-column prop="remarks" label="备注" align="center"></el-table-column>

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
        <!-- 新增 -->
        <el-drawer :title="title" :visible.sync="editFormVisible" :before-close="handleClose" direction="rtl"
            custom-class="demo-drawer" ref="drawer" size="30%">
            <div class="demo-drawer__content">
                <el-row>
                    <el-form label-width="110px" :model="editForm" :rules="rules" ref="editForm">
                        <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
                        <el-col :span="22">
                            <div class="grid-content bg-purple">
                                <el-form-item label="车库名称：" prop="name">
                                    <el-input v-model="editForm.name"  placeholder="请输入车库名称"></el-input>
                                </el-form-item>
                                <el-form-item label="车位区域：" prop="username">
                                    <el-input v-model="editForm.region"  placeholder="请输入车位区域"></el-input>
                                </el-form-item>
                                <el-form-item label="备注信息：" prop="password">
                                    <el-input  type="textarea"  :rows="3" placeholder="请输入备注信息" v-model="editForm.remarks"></el-input>

                                </el-form-item>
                            </div>
                        </el-col>

                    </el-form>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="handleClose">取消</el-button>
                    <el-button size="small" type="goon" :loading="loading2" class="title"
                        @click="submitForm('editForm')">
                        保存</el-button>
                </div>
                <div style="height: 60px; margin-top: 50px"></div>
            </div>
        </el-drawer>
        <!-- 查看视频 -->
    </div>
</template>
<script>
import Pagination from "../../components/Pagination";
import { imgsrc } from "../../utils/utils";
import debounce from "../../utils/debounce";
import { GarageEdit, GarageDel, GarageList } from "../../api/userMG";
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
                lx: 1,
                page: 1,
                limit: 10
            },
            //添加，修改数据
            editForm: {
                id: 0,
                name: '',
                region: '',  
                remarks: ''
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
        this.userlist(this.formInline);
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
        userlist(parameter) {
            this.loading = true;
            GarageList(parameter)
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
            this.userlist(this.formInline);
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
                this.editForm.id = row.id;
                this.editForm.region = row.region
                this.editForm.name = row.name
                this.editForm.remarks = row.remarks 
            } else {//添加   
                this.title = "添加";
                this.editForm.id = 0
                this.editForm.region = ''
                this.editForm.name = ''
                this.editForm.remarks = ''

            }
        },
        //提交添加，修改
        submitForm(info) {
            this.loading2 = true;
            debounce(() => {//防抖事件
                GarageEdit(this.editForm)
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
                    GarageDel({ id: row.id }) //删除
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