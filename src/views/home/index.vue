<template>
    <div>
        <el-card class="box-card box-cards">
            <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item>
                            <div class="card_top"><span>工作台</span></div>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </el-card>
        <!-- <el-card class="box-card box-cards2"> -->
            <div class="xiayu">
                <el-card shadow="never">
                    <div slot="header" class="clearfix">
                        <span>社区情况</span>
                    </div>
                    <div>
                        <el-row :gutter="20">
                            <el-col :span="4">
                                <el-card shadow="never" class="juzhong">
                                    <div class="shuzi3">{{ tableData.building }}</div>
                                    <div class="title">楼栋</div>
                                </el-card>
                            </el-col>
                            <el-col :span="4">
                                <el-card shadow="never" class="juzhong">
                                    <div class="shuzi3">{{ tableData.house }}</div>
                                    <div class="title">房屋</div>
                                </el-card>
                            </el-col>
                            <el-col :span="4">
                                <el-card shadow="never" class="juzhong">
                                    <div class="shuzi3">{{ tableData.shangpu }}</div>
                                    <div class="title">商铺</div>
                                </el-card>
                            </el-col>
                            <el-col :span="4">
                                <el-card shadow="never" class="juzhong">
                                    <div class="shuzi3">{{ tableData.parking_lot }}</div>
                                    <div class="title">车位</div>
                                </el-card>
                            </el-col>
                            <el-col :span="4">
                                <el-card shadow="never" class="juzhong">
                                    <div class="shuzi3">0</div>
                                    <div class="title">储藏室</div>
                                </el-card>
                            </el-col>
                            <el-col :span="4">
                                <el-card shadow="never" class="juzhong">
                                    <div class="shuzi3">0</div>
                                    <div class="title">安防监控</div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </div>
            <div class="xiayu ">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div >
                            <el-card shadow="never" class="gaodu">
                                <div slot="header" class="clearfix">
                                    <span>实时概况</span>
                                </div>
                                <div>
                                    <el-row :gutter="20">
                                        <el-col :span="6" class="juzhong linmo">
                                                <div class="shuzi">{{ tableData.repair }}</div>
                                                <div class="title">业主报修</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{ tableData.suggestion }}</div>
                                                <div class="title">投诉建议</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{ tableData.seek_help }}</div>
                                                <div class="title">业主求助</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{ tableData.owner_member }}</div>
                                                <div class="title">住户审核</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{tableData.wu}}</div>
                                                <div class="title">物业费待缴</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{tableData.che}}</div>
                                                <div class="title">停车费待缴</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{ tableData.activity_user }}</div>
                                                <div class="title">活动报名待处理</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{ tableData.zhiyuanzhe }}</div>
                                                <div class="title">志愿者待审核</div>
                                        </el-col>
                                        <el-col :span="6" class="juzhong">
                                                <div class="shuzi">{{ tableData.contribution }}</div>
                                                <div class="title">爱心款待校验</div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div >
                            <el-card shadow="never" class="gaodu">
                                <div slot="header" class="clearfix">
                                    <span>软件更新提示</span>
                                </div>
                                <div>
                                    <el-empty :image-size="200"></el-empty>
                                </div>
                            </el-card>
                        </div>
                    </el-col>
                </el-row>
            </div>

            
    </div>
</template>
<script>
import { Home } from "../../api/userMG";
export default {
    data() {
        return {
            tableData: []
        };
    },
    components: {
    },
    created() {
        //数据列表
        this.getfenxi();
    },
    methods: {
        getfenxi() {
            Home({}).then((res) => {
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
        }
    },
};
</script>
<style scoped>
@import "../../assets/css/index.css";

.xiayu {
    margin-top: 20px;

    /* margin-bottom: 20px; */
}

.juzhong {
    text-align: center;
    padding: 10px;
}

.shuzi {
    color: rgb(231, 56, 56);
    font-size: 30px;
    font-weight: 600;
    line-height: 50px;
}

.title {
    color: rgb(94, 92, 92);
    font-size: 18px;
}

.shuzi1 {
    color: rgb(236, 233, 22);
    font-size: 30px;
    font-weight: 600;
    line-height: 50px;
}

.shuzi2 {
    color: rgb(56, 231, 129);
    font-size: 30px;
    font-weight: 600;
    line-height: 50px;
}

.shuzi3 {
    color: rgb(56, 152, 231);
    font-size: 30px;
    font-weight: 600;
    line-height: 50px;
}
.shuzi4 {
    color: rgb(46, 46, 45);
    font-size: 30px;
    font-weight: 600;
    line-height: 50px;
}
.gaodu{
    height: 450px;
}

</style>