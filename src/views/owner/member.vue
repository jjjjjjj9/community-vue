<template>
   
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
            <span>成员信息</span>
        </div>
        <div >
            <el-table border ref="multipleTable" :data="tableData" :header-cell-style="headStyle" tooltip-effect="dark"
                style="width: 100%; " v-loading="loading">
                <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="relationship" label="与业主关系" align="center" width="150"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center" width="120"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" width="80">
                    <template slot-scope="scope">
                        <div>{{scope.row.sex==1?"男":scope.row.sex==2?"女":"未知"}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center" width="120"></el-table-column>
                <el-table-column prop="idcard" label="身份证证件号" align="center" width="170"></el-table-column>
                <el-table-column prop="ioc1" label="身份证正面" align="center" >
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc1" style="width: 100px; height: 60px" :src="scope.row.ioc1.split(',')[0]"
                            :preview-src-list="scope.row.ioc1.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="ioc2" label="身份证反面" align="center">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc2" style="width: 100px; height: 60px" :src="scope.row.ioc2.split(',')[0]"
                            :preview-src-list="scope.row.ioc2.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="ioc3" label="房产证照片" align="center" v-if="relationship!='租客'">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc3" style="width: 100px; height: 60px" :src="scope.row.ioc3.split(',')[0]"
                            :preview-src-list="scope.row.ioc3.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="ioc3" label="租房合同照片" align="center" v-if="relationship=='租客'">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.ioc3"  style="width: 100px; height: 60px" :src="scope.row.ioc1.split(',')[0]"
                            :preview-src-list="scope.row.ioc3.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                        <div>{{scope.row.status==1?"正常":scope.row.status==2?"驳回":scope.row.status==3?"搬出":"审核中"}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="wxid" label="是否注册" align="center" width="120">
                    <template slot-scope="scope">
                        <div>{{scope.row.wxid>0?"已注册":"未注册"}}</div>
                    </template>
                </el-table-column>


                
            </el-table>
        </div>
    </el-card>
</template>
<script>

import {OwnerMemberByData } from "../../api/userMG";

export default {
    data() {
        return {
            tableData: [], //表格数据
        };
    },
    created() {
        //数据列表
        this.getlist();
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
        getlist(){
            OwnerMemberByData({houseid:this.$route.query.houseid}).then((res) => {
                    this.loading = false;
                    // console.log("userlist", res);
                    if (res.code != 200) {
                        this.$message({
                            type: "info",
                            message: res.msg,
                        });
                    } else {
                        this.tableData = res.data;
                        // console.log(this.tableData)
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    this.$message.error("加载失败，请稍后再试！");
                });
        }
    }
}
</script>