<template>
    <div>
        <el-card class="box-card box-cards">
            <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item>
                            <div class="card_top"><span>住户管理</span></div>
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
                <el-table-column prop="ftitle" label="楼栋名称" align="center" width="120"></el-table-column>
                <el-table-column prop="unit" label="单元数" align="center" width="100"></el-table-column>
                <el-table-column prop="title" label="房间号" align="center" width="100"></el-table-column>
                <el-table-column prop="yname" label="业主姓名" align="center" width="120"></el-table-column>
                <el-table-column prop="relationship" label="与业主关系" align="center" width="150"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center" width="120"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" width="80">
                    <template slot-scope="scope">
                        <div>{{ scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "未知" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center" width="120"></el-table-column>
                <el-table-column prop="idcard" label="身份证证件号" align="center" width="170"></el-table-column>
                <el-table-column prop="ioc1" label="身份证正面" align="center" width="150">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc1" style="width: 130px; height: 60px"
                            :src="scope.row.ioc1.split(',')[0]" :preview-src-list="scope.row.ioc1.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="ioc2" label="身份证反面" align="center" width="150">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc2" style="width: 130px; height: 60px"
                            :src="scope.row.ioc2.split(',')[0]" :preview-src-list="scope.row.ioc2.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="ioc3" label="房产证照片" align="center" v-if="relationship != '租客'" width="150">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc3" style="width: 130px; height: 60px"
                            :src="scope.row.ioc3.split(',')[0]" :preview-src-list="scope.row.ioc3.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="ioc3" label="租房合同照片" align="center" v-if="relationship == '租客'" width="150">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc3" style="width: 130px; height: 60px"
                            :src="scope.row.ioc1.split(',')[0]" :preview-src-list="scope.row.ioc3.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <div>{{ scope.row.status == 1 ? "正常" : scope.row.status == 2 ? "驳回" : scope.row.status == 3 ? "搬出" : "审核中" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="wxid" label="是否注册" align="center" width="120">
                    <template slot-scope="scope">
                        <div>{{ scope.row.wxid > 0 ? "已注册" : "未注册" }}</div>
                    </template>
                </el-table-column>



                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.status == 0"
                            @click="handleEdit(scope.$index, scope.row, 1)">通过</el-button>
                        <el-button size="mini" type="success" v-if="scope.row.status == 0"
                            @click="handleEdit(scope.$index, scope.row, 2)">驳回</el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.status == 1"
                            @click="handleEdit(scope.$index, scope.row, 3)">搬出</el-button>

                        <el-button size="mini" type="danger" v-if="scope.row.status > 1"
                            @click="handleEditdel(scope.$index, scope.row)">删除</el-button>
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
import { OwnerMemberUpdate, OwnerMemberList, OwnerMemberDel } from "../../api/userMG";
export default {
    data() {
        return {

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
            OwnerMemberList(parameter)
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

        handleEdit(index, row, e) {

            let title = "";
            if (e == 1) { title = "通过" }
            else if (e == 2) { title = "驳回申请" }
            else if (e == 3) { title = "搬出" }
            this.$confirm("确定要" + title + "吗?", "信息", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                OwnerMemberUpdate({ id: row.id, status: e }).then((res) => {
                    // console.log("d", res);
                    if (res.code == 200) {
                        this.$message({
                            type: "success",
                            message: title + "成功!",
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
                        this.$message.error(title + "失败，请稍后再试！");
                    });
            })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        handleEditdel(index, row) {

            this.$confirm("确定要删除吗?", "信息", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                OwnerMemberDel({ id: row.id }).then((res) => {
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



    },
};
</script>
<style>
@import "../../assets/css/index.css";
</style>