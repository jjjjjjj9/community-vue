<template>
   
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
            <span>车位信息</span>
        </div>
        <div >
            <el-descriptions class="margin-top" :column="3" border  v-for="(itme,index) in tableData" :key="index">
                <el-descriptions-item><template slot="label">序号</template> {{index+1}}</el-descriptions-item>
                <el-descriptions-item><template slot="label">姓名</template>{{itme.name}}</el-descriptions-item>
                <el-descriptions-item><template slot="label"> 更新时间</template>{{itme.ctime}}</el-descriptions-item>
                <el-descriptions-item><template slot="label">车库名称</template>{{itme.dname}}</el-descriptions-item>
                <el-descriptions-item><template slot="label">车位区域</template> {{itme.region}}</el-descriptions-item>
                <el-descriptions-item><template slot="label"> 车位号</template>{{itme.cname}}</el-descriptions-item>
            </el-descriptions>
            
        </div>
        
    </el-card>
</template>
<script>

import {OwnerVehicleAdminList } from "../../api/userMG";

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
       
        getlist(){
            OwnerVehicleAdminList({houseid:this.$route.query.houseid}).then((res) => {
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
<style>
 
.el-descriptions {
    margin-bottom: 20px;
}
</style>