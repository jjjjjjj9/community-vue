<template>
    <div>
        <el-card class="box-card box-cards">
            <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item>
                            <div class="card_top"><span>业主信息</span></div>
                        </el-form-item>

                    </el-col>
                </el-form>
            </el-row>
        </el-card>
        <el-card class="box-card box-cards2">
            <el-tabs v-model="activeName">
                <el-tab-pane label="业主信息" name="first">
                    <el-card class="box-card" shadow="never">
                        <div slot="header" class="clearfix">
                            <span>业主信息</span>
                        </div>
                        <div >
                            <el-descriptions class="margin-top" :column="2" border >
                                <el-descriptions-item><template slot="label">姓名</template> {{tableData.owner.name}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label"> 性别</template> {{tableData.owner.sex==1?"男":tableData.owner.sex==2?"女":"未知"}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">电话</template>{{tableData.owner.phone}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label"> 民族</template> {{tableData.owner.nation}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">政治面貌</template>{{tableData.owner.face}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label"> 婚姻状况</template>{{tableData.owner.marital}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">户口类型 </template>{{tableData.owner.inhabitant}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label"> 身份证号</template> {{tableData.owner.idcard}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label"> 出生日期</template>{{tableData.owner.birthday| timestampToTimes}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">户籍所在地</template>{{tableData.owner.registeredResidence}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">现住地址</template> {{tableData.owner.address}} </el-descriptions-item>
                                <el-descriptions-item><template slot="label">备注信息</template> {{tableData.owner.remarks}}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </el-card>
                   
                </el-tab-pane>
                <el-tab-pane label="房屋信息" name="second">
                    <el-card class="box-card" shadow="never">
                        <div slot="header" class="clearfix">
                            <span>房屋信息</span>
                        </div>
                        <div >
                            <el-descriptions class="margin-top" :column="2" border >
                                <el-descriptions-item><template slot="label">楼栋名称</template> {{tableData.house.title}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">单元数</template>{{tableData.house.unit}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label"> 房间号</template>{{tableData.house.name}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">房屋类型</template>{{tableData.house.building_type}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">建筑面积</template> {{tableData.house.jarea}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label"> 使用面积</template>{{tableData.house.sarea}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">公摊面积 </template>{{tableData.house.garea}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">房屋户型</template> {{tableData.house.house_type}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">房屋朝向</template>{{tableData.house.orientation}}</el-descriptions-item>
                                <el-descriptions-item><template slot="label">备注信息</template>{{tableData.house.remarks}}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="成员信息" name="third"><member></member></el-tab-pane>
                <!-- <el-tab-pane label="储藏室" name="fourth">储藏室</el-tab-pane> -->
                <el-tab-pane label="车位信息" name="che"><che></che></el-tab-pane>

            </el-tabs>
        </el-card>

    </div>
</template>
<script>
import member from "./member";
import che from "./che";

import {OwnerByData } from "../../api/userMG";

export default {
    data() {
        return {
            activeName: 'first',
            tableData:null
        };
    },
    components: {
        member,
        che
    },
    created() {
        //数据列表
        this.getlist();
    },
    methods: {
        getlist(){
            OwnerByData({houseid:this.$route.query.houseid}).then((res) => {
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

    },
};
</script>
<style>
@import "../../assets/css/index.css";

.el-descriptions-item__cell {
    text-align: center !important;
    font-size: 18px !important;
}
</style>