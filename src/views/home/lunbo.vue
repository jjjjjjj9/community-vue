<template>
    <div>
        <el-card class="box-card box-cards">
            <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item>
                            <div class="card_top"><span>小程序首页轮播图管理</span></div>
                        </el-form-item>
                        <el-form-item>
                            <!-- <el-button size="small"  icon="el-icon-search" @click="search">搜索</el-button> -->
                            <el-upload class="upload-demo" :action="imgsrc" :limit="1" :show-file-list="false"
                                :on-success="licenseSuccess" :before-upload="beforeAvatarUpload">
                                <el-button size="small" type="primary">图片上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-link type="warning" :underline="false">建议上传图片的尺寸为：750 x 360</el-link>
                        </el-form-item>
                    </el-col>
                    
                </el-form>

            </el-row>
        </el-card>
        <el-card class="box-card box-cards2">
            <el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark"
                style="width: 100%; font-size: 16px" :header-cell-style="headStyle" v-loading="loading">
                <el-table-column align="center" type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="url" label="轮播图" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.url" alt="" style="width:300px; height: 100px;">
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="handleEditdel(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


    </div>
</template>
<script>
import { imgsrc } from "../../utils/utils";
import debounce from "../../utils/debounce";
import { CarouselList, Carouseladd, Carouseldel } from "../../api/userMG";
export default {
    data() {
        return {

            imgsrc: "", //图片
            loading: false,
            loading2: false,
            editFormVisible: false,
            editForm:{
                ioc: "", 
            },
            imgsrc: "", //图片
            tableData: [], //表格数据  
        };
    },
    created() {
        this.imgsrc = imgsrc;//上传地址
        this.OperateList();
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
        OperateList() {
            this.loading = true;
            CarouselList({}).then((res) => {
                this.loading = false;
                //   console.log("Recoverylist", res);
                if (res.code != 200) {
                    this.$message({
                        type: "info",
                        message: res.msg,
                    });
                } else {
                    this.tableData = res.data;
                }
            })
                .catch((err) => {
                    this.loading = false;
                    this.$message.error("加载失败，请稍后再试！");
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
                    Carouseldel({ id: row.id }) //删除
                        .then((res) => {
                            // console.log("d", res);
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                                this.OperateList();
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
        //上传封面图
        licenseSuccess(response, file) {
            this.editForm.ioc = response.data
            Carouseladd(this.editForm).then(res => {
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '上传成功!'
                    })
                    this.OperateList();
                }
            })
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

    },
};
</script>
<style>
@import "../../assets/css/index.css";
</style>