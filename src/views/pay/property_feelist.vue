<template>
    <div>
        <el-row>
            <el-form :inline="true" class="user-search">
                <el-col :span="24">
                    <el-form-item label="搜索：">
                        <el-input size="small" v-model="formInline.name" placeholder="输入房间号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="goon" icon="el-icon-search" @click="search">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <!--列表-->
        <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" :header-cell-style="headStyle"
            style="width: 100%; " v-loading="loading">
            <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="number" label="订单号" align="center" width="150"></el-table-column>
            <el-table-column prop="atitle" label="标题" align="center" width="180"></el-table-column>

            <el-table-column prop="title" label="楼栋名称" align="center" width="120"></el-table-column>
            <el-table-column prop="unit" label="单元" align="center" width="80"></el-table-column>
            <el-table-column prop="name" label="房间号" align="center" width="100"></el-table-column>
            <el-table-column prop="sarea" label="使用面积" align="center" width="120"></el-table-column>
            <el-table-column prop="garea" label="公摊面积" align="center" width="120"></el-table-column>
            <el-table-column prop="stime" label="起止时间" align="center" width="120">
                <template slot-scope="scope">
                    <div>{{ scope.row.stime | timestampToTimes }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="etime" label="截至时间" align="center" width="120">
                <template slot-scope="scope">
                    <div>{{ scope.row.etime | timestampToTimes }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="pay" label="应缴费用" align="center" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="80">
                <template slot-scope="scope">
                    <div>{{ scope.row.status == 1 ? "已交" : scope.row.status == 2 ? "待审核" : scope.row.status == 3 ? "驳回" : "未交"  }}</div>

                </template>
            </el-table-column>
            <el-table-column prop="spay" label="实缴费用" align="center" width="120"></el-table-column>
            <el-table-column prop="ioc3" label="支付凭证" align="center" width="150">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.dname" style="width: 130px; height: 60px"
                            :src="scope.row.dname.split(',')[0]" :preview-src-list="scope.row.dname.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
            <el-table-column prop="jtime" label="缴费时间" align="center" width="120">
                <template slot-scope="scope">
                    <div>{{ scope.row.jtime | timestampToTimes }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" align="center" width="350"></el-table-column>

            <el-table-column align="center" label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" v-if="scope.row.status == 0"
                        @click="handleEdit(scope.$index, scope.row)">缴费
                    </el-button>
                    <el-button size="mini" type="danger" v-if="scope.row.status == 0" @click="handleEditdel(scope.$index, scope.row)">删除
                    </el-button>
                    <el-button size="mini" type="primary" v-if="scope.row.status == 2" @click="handleEdit(scope.$index, scope.row)">通过
                    </el-button>
                    <el-button size="mini" type="warning" v-if="scope.row.status == 2" @click="gethuihu(scope.$index, scope.row)">驳回
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

    </div>
</template>
<script>
import Pagination from "../../components/Pagination";
import { imgsrc } from "../../utils/utils";
import debounce from "../../utils/debounce";
import { BillJiao, BillDel, BillList,Billbohui } from "../../api/userMG";
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
            BillList(parameter)
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
        search() {
            this.formInline.page = 1;
            this.userlist(this.formInline); //显示
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
            this.$prompt('请输入实缴金额', '缴费提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {

                debounce(() => {//防抖事件
                    BillJiao({ id: row.id, spay: value })
                        .then(res => {
                            // console.log("useradd", res);
                            //显示
                            if (res.code == 200) {
                                this.userlist(this.formInline);
                                this.$message({
                                    message: "缴费成功！",
                                    type: "success",
                                });
                            } else {
                                this.$message({
                                    type: "info",
                                    message: res.msg,
                                });
                            }
                        })
                        .catch((err) => {
                            this.$message.error("缴费失败，请稍后再试！");
                        });



                }, 1500);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },

        //删除
        handleEditdel(index, row) {
            this.$confirm("确定要删除吗?", "信息", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    BillDel({ id: row.id }) //删除
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
        gethuihu(index, row) {
            this.$confirm("确定要驳回吗?", "信息", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    Billbohui({ id: row.id }) //删除
                        .then((res) => {
                            // console.log("d", res);
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "驳回成功!",
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
                            this.$message.error("驳回失败，请稍后再试！");
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
</style>