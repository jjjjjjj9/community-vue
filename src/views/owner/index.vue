<template>
    <div>
        <el-card class="box-card box-cards">
            <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item>
                            <div class="card_top"><span>业主管理</span></div>
                        </el-form-item>
                        <el-form-item label="搜索：">
                            <el-input size="small" v-model="formInline.name" placeholder="输入姓名或房间号"></el-input>
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
            <el-table border ref="multipleTable" :data="tableData" :header-cell-style="headStyle" tooltip-effect="dark"
                style="width: 100%; " v-loading="loading">
                <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="title" label="楼栋名称" align="center"></el-table-column>
                <el-table-column prop="unit" label="单元数" align="center"></el-table-column>
                <el-table-column prop="f_title" label="房间号" align="center"></el-table-column>
                <el-table-column prop="name" label="业主姓名" align="center"></el-table-column>
                <el-table-column prop="phone" label="业主手机号" align="center"></el-table-column>
                <el-table-column prop="idcard" label="身份证号" align="center"></el-table-column>
               


                <el-table-column align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.uid==0" @click="handleEdit(scope.$index, scope.row)">绑定业主</el-button>
                        <el-button size="mini" type="success" v-if="scope.row.uid>0" @click="handleEdit(scope.$index, scope.row)">更换业主</el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.uid>0" @click="dengji(scope.$index, scope.row)">成员登记</el-button>


                        <el-button size="mini" type="info" @click="handleEditdel(scope.$index, scope.row)">查看</el-button>
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
                <el-row >
                    <el-form label-width="110px" :model="editForm" :rules="rules" ref="editForm">
                        <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
                        <el-col :span="22">
                            <div class="grid-content bg-purple">
                                <el-form-item label="姓名：" prop="unit">
                                    <el-input v-model="editForm.name"  placeholder="请输入姓名"></el-input>
                                </el-form-item>
                                <el-form-item label="性别：" prop="unit">
                                    <el-select v-model="editForm.sex" placeholder="请选择性别">
                                        <el-option
                                        v-for="item in optionslist"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="电话：" prop="unit">
                                    <el-input v-model="editForm.phone"  placeholder="请输入电话"></el-input>
                                </el-form-item>
                                <el-form-item label="出生日期：" prop="unit">
                                    <el-date-picker v-model="editForm.birthday" type="date"  placeholder="选择出生日期"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="政治面貌：" prop="unit">
                                    <el-input v-model="editForm.face" placeholder="请输入政治面貌"></el-input>
                                </el-form-item>
                                <el-form-item label="民族：" prop="unit">
                                    <el-input v-model="editForm.nation" placeholder="请输入民族"></el-input>
                                </el-form-item>
                                <el-form-item label="婚姻状况：" prop="unit">
                                    <el-input v-model="editForm.marital"  placeholder="请输入婚姻状况"></el-input>
                                </el-form-item>
                                <el-form-item label="户口类型：" prop="unit">
                                    <el-input v-model="editForm.inhabitant"  placeholder="请输入户口类型"></el-input>
                                </el-form-item>
                                <el-form-item label="身份证号：" prop="unit">
                                    <el-input v-model="editForm.idcard"  placeholder="请输入身份证号"></el-input>
                                </el-form-item>
                                <el-form-item label="户籍所在地：" prop="unit">
                                    <el-input v-model="editForm.registered_residence"  placeholder="请输入户籍所在地"></el-input>
                                </el-form-item>
                                <el-form-item label="现住地址：" prop="unit">
                                    <el-input v-model="editForm.address"  placeholder="请输入现住地址"></el-input>
                                </el-form-item> 
                                <el-form-item label="备注信息：" prop="unit">
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
        
        <el-drawer title="成员登记" :visible.sync="editFormVisibledengji" :before-close="handleClose" direction="rtl"
            custom-class="demo-drawer" ref="drawer" size="30%">
            <div class="demo-drawer__content">
                <el-row >
                    <el-form label-width="110px" :model="editForm" :rules="rules" ref="editForm">
                        <el-col class="titleq" style="margin-bottom: 20px">信息</el-col>
                        <el-col :span="22">
                            <div class="grid-content bg-purple">
                                <el-form-item label="楼栋:" prop="unit">
                                    <el-input v-model="house.title"  :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="单元:" prop="unit">
                                    <el-input v-model="house.unit"  :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="房间号:" prop="unit">
                                    <el-input v-model="house.f_title"  :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="业主:" prop="unit">
                                    <el-input v-model="house.name"  :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="与业主关系：" prop="unit">
                                    <el-select v-model="dengjieditForm.relationship" placeholder="请选择与业主关系">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="姓名：" prop="unit">
                                    <el-input v-model="dengjieditForm.name"  placeholder="请输入姓名"></el-input>
                                </el-form-item>
                                <el-form-item label="性别：" prop="unit">
                                    <el-select v-model="dengjieditForm.sex" placeholder="请选择性别">
                                        <el-option
                                        v-for="item in optionslist"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="电话：" prop="unit">
                                    <el-input v-model="dengjieditForm.phone"  placeholder="请输入电话"></el-input>
                                </el-form-item>
                                <el-form-item label="身份证号：" prop="unit">
                                    <el-input v-model="dengjieditForm.idcard"  placeholder="请输入身份证号"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        

                    </el-form>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="handleClose">取消</el-button>
                    <el-button size="small" type="goon" :loading="loading2" class="title"
                        @click="baocun('editForm')">
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
import { OwnerEdit, OwnerList,OwnerMemberEdit } from "../../api/userMG";
export default {
    data() {
        return {
            options: [{
                value: "本人",
                label: '本人'
                },{
                value: "家人",
                label: '家人'
                },{
                value: "租户",
                label: '租户'
                }
            ],
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
            max:1,
            title: "",
            house: "",

            loading: false,
            loading2: false,
            editFormVisible: false,
            editFormVisibledengji: false,
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
                uid:0,
                houseid:0,
                name :"",
                phone :"",
                sex:"",
                birthday:"",
                idcard :"",
                nation :"",
                face :"",
                marital :"",
                inhabitant :"",
                registered_residence :"",
                remarks :"",
                address :""    
            },
            dengjieditForm: {
                houseid:0,
                name :"",
                phone :"",
                sex:"",
                idcard :"",
                relationship :"家人",
                status:1
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
            OwnerList(parameter)
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
        // 搜索事件
        search() {
            this.formInline.page = 1;
            this.userlist(this.formInline); //显示
        },
        //关闭弹框
        handleClose(done) {
            this.$confirm("还有未保存的工作哦确定关闭吗？")
                .then((_) => {
                    this.editFormVisible = false
                    this.editFormVisibledengji=false

                    // done();
                })
                .catch((_) => { });
        },
       
        //添加，修改
        handleEdit(index, row) {
            this.editFormVisible = true;
            this.title = "业主信息";
                this.editForm={
                    uid: row.uid,
                    houseid:row.houseid,
                    name :"",
                    phone :"",
                    sex:"",
                    birthday:"",
                    idcard :"",
                    nation :"",
                    face :"",
                    marital :"",
                    inhabitant :"",
                    registered_residence :"",
                    remarks :"",
                    address :""   
                }
        },
        //提交添加，修改
        submitForm(info) {
            this.loading2 = true;
            debounce(() => {//防抖事件
                OwnerEdit(this.editForm)
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
        handleEditdel(index, row) {
            // console.log(row.houseid)
            this.$router.push({ path: './details?houseid='+row.houseid  })
        },
        dengji(index, row) {
            this.editFormVisibledengji = true;
            this.house=row
            this.dengjieditForm={
                houseid:row.houseid,
                name :"",
                phone :"",
                sex:"",
                idcard :"",
                relationship :"家人",
                status:1
            }
        },
        baocun(){
            this.loading2 = true;
            debounce(() => {//防抖事件
                OwnerMemberEdit(this.dengjieditForm)
                    .then(res => {
                        // console.log("useradd", res);
                        //显示
                        if (res.code == 200) {
                            this.editFormVisibledengji = false;
                            this.loading2 = false;
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