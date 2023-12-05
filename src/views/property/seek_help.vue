<template>
    <div>
        <el-card class="box-card box-cards">
            <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item>
                            <div class="card_top"><span>业主求助</span></div>
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
            <el-table border ref="multipleTable" :data="tableData" :header-cell-style="headStyle" tooltip-effect="dark"
                style="width: 100%; " v-loading="loading">
                <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="lx" label="求助类型" align="center" width="120">
                    <template slot-scope="scope">
                    <div>{{ scope.row.lx==1?"个人困难":"纠纷调解"}}</div>
                    </template>
                </el-table-column>
                
                <el-table-column prop="details" label="求助描述" align="center" width="300"></el-table-column>
                <el-table-column prop="logo" label="求助图片" align="center" width="280">
                    <template slot-scope="scope">
                    <el-image style="width: 60px; height: 60px" :src="scope.row.ioc.split(',')[0]"
                        :preview-src-list="scope.row.ioc.split(',')">
                    </el-image>
                    <el-image style="width: 60px; height: 60px" v-if="scope.row.ioc.split(',')[1]" :src="scope.row.ioc.split(',')[1]"
                        :preview-src-list="scope.row.ioc.split(',')">
                    </el-image>
                    <el-image style="width: 60px; height: 60px" v-if="scope.row.ioc.split(',')[2]" :src="scope.row.ioc.split(',')[2]"
                        :preview-src-list="scope.row.ioc.split(',')">
                    </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="楼栋名称" align="center" width="120"></el-table-column>
                <el-table-column prop="unit" label="单元" align="center" width="100"></el-table-column>
                <el-table-column prop="name" label="房间号" align="center" width="100"></el-table-column>
                <el-table-column prop="username" label="姓名" align="center" width="100"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center" width="120"></el-table-column>
                <el-table-column prop="ctime" label="提交时间" align="center" width="180">
                    <template slot-scope="scope">
                    <div>{{ scope.row.ctime | timestampToTime }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="处理状态" align="center" width="120" >
                    <template slot-scope="scope">
                    <div v-if="scope.row.status == 0">待受理</div>
                    <div v-if="scope.row.status == 1">已安排负责人</div>

                    </template>
                </el-table-column>
                <el-table-column prop="fname" label="负责人姓名" align="center" width="160"></el-table-column>
                <el-table-column prop="fphone" label="负责人电话" align="center" width="160"></el-table-column>
                <el-table-column align="center" label="操作" width="220" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success"  @click="handleEdit(scope.$index, scope.row)"  v-if="scope.row.status ==0" >安排负责人</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
        </el-card>

        <!-- 新增 -->
        <el-drawer title="负责人登记" :visible.sync="editFormVisible" :before-close="handleClose" direction="rtl"
            custom-class="demo-drawer" ref="drawer" size="30%">
            <div class="demo-drawer__content">
                <el-row>
                    <el-form label-width="110px" :model="editForm" :rules="rules" ref="editForm">
                        <el-col class="titleq" style="margin-bottom: 20px">登记信息</el-col>
                        <el-col :span="22">
                            <div class="grid-content bg-purple">
                                <el-form-item label="负责人姓名：" prop="unit">
                                    <el-input v-model="editForm.name"  placeholder="请输入姓名"></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式：" prop="name"  >
                                    <el-input v-model="editForm.phone" placeholder="请输入联系方式" ></el-input>
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
        
    </div>
</template>
<script>
import Pagination from "../../components/Pagination";
import { imgsrc } from "../../utils/utils";
import debounce from "../../utils/debounce";
import { SeekHelpAp, SeekHelpList } from "../../api/userMG";
export default {
    data() {
        return {
            options: [],
            optionslist: [],
            max:1,
            title: "",
            loading: false,
            loading2: false,
            editFormVisible: false,
            editFormVisible1: false,

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
                name: "",
                phone:"",
                ioc:"",
                remarks:"",
                status:"",
                lx:0,
                wxid:0
            },
            //规则验证
            rules: {},
            fileList2: [],
            lists2:[],
            logtableData: [],
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
            SeekHelpList(parameter)
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
            // this.$confirm("还有未保存的工作哦确定关闭吗？")
            //     .then((_) => {
                    this.editFormVisible = false
                    this.editFormVisible1 = false

                    // done();
                // })
                // .catch((_) => { });
        },
        xhuang(e){
            // console.log(e)
                var obj = {};
                obj = this.options.find(function(item){
                    return item.id === e;
                })
                this.max=obj.unit;
            // console.log(obj);
        },
        //添加，修改
        handleEdit(index, row) {
            this.editFormVisible = true;
            
            this.editForm={
                id: row.id,
                name: "",
                phone:"",
                wxid:row.wxid
            } 
               
           
        },
        //提交添加，修改
        submitForm(info) {
            this.editForm.ioc = this.lists2.join(',')
            this.loading2 = true;
            debounce(() => {//防抖事件
                SeekHelpAp(this.editForm)
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
     

    },
};
</script>
<style>
@import "../../assets/css/index.css";

</style>