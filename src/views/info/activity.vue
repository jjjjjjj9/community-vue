<template>
  <div>
    <el-card class="box-card box-cards">
        <el-row>
          <el-form :inline="true" class="user-search">
            <el-col :span="24">
              <el-form-item>
                <div class="card_top"><span>社区活动管理</span></div>
              </el-form-item>
  
            </el-col>
          </el-form>
        </el-row>
      </el-card>
    <el-card class="box-card box-cards2">
        <el-tabs v-model="activeName">
            <el-tab-pane label="活动列表" name="baoxiu"><activityadd></activityadd></el-tab-pane>
            <el-tab-pane label="活动报名列表" name="first"><activitylist></activitylist></el-tab-pane>
       </el-tabs>     
    </el-card>
  </div>
</template>
<script>
import activityadd from "./activityadd";
import activitylist from "./activitylist";


export default {
  data() {
    return {    
        activeName:'baoxiu',
      
    };
  },
  components: {
    activityadd,
    activitylist
  },
  created() {
    
  },
  methods: {

  },
};
</script>
<style>
@import "../../assets/css/index.css";

</style>