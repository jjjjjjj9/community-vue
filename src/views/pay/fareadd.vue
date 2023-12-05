<template>
    <div>
        <div class="demo-drawer__content">
          <el-row :gutter="20">
            <el-form label-width="110px" :model="editForm" ref="editForm">
              
              <el-col :span="12">
                <el-col class="titleq" style="margin-bottom: 20px">车位信息</el-col>
                <div class="grid-content bg-purple">
                  <el-form-item label="选择车位：" prop="name" label-width="140px">
                    <!-- <el-input v-model="editForm.appid"></el-input> -->
                    <el-cascader
                        v-model="editForm.yid"
                        placeholder="选择车位"
                        :options="tableData"
                        :props="{ multiple: true }"
                        filterable></el-cascader>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="12">
                <el-col class="titleq" style="margin-bottom: 20px">费用信息</el-col>
                <div class="grid-content bg-purple">
                  <el-form-item label="费用标题：" prop="title" label-width="140px">
                    <el-input v-model="editForm.title"></el-input>
                  </el-form-item>
                  <el-form-item label="起止时间：" prop="stime" label-width="140px">
                  <el-date-picker v-model="editForm.stime" type="date"  placeholder="选择起止时间"></el-date-picker>

                  </el-form-item>
                  <el-form-item label="截至时间：" prop="etime" label-width="140px">
                  <el-date-picker v-model="editForm.etime" type="date"  placeholder="选择截至时间"></el-date-picker>

                  </el-form-item>
                  <el-form-item label="应缴费用：" prop="pay" label-width="140px">
                    <el-input v-model="editForm.pay"></el-input>
                  </el-form-item>
                  <el-form-item label="备注信息：" prop="remarks">
                  <el-input  type="textarea"  :rows="3" placeholder="请输入备注信息" v-model="editForm.remarks"></el-input>
                </el-form-item>
                  
                </div>
              </el-col>
  
            </el-form>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="goon" class="title" @click="submitForm('editForm')">
              保存</el-button>
          </div>
          <div style="height: 60px; margin-top: 50px"></div>
        </div>
    </div>
</template>
<script>
import debounce from "../../utils/debounce";
import { ParkingLotxlList,BillEdit } from "../../api/userMG";
export default {
    data() {
        return {
            tableData:[],
            editForm: {
                yid:[],
                stime: "",
                etime: '',
                title: '',
                pay: '',
                lxid:1,
                remarks:""
            },
        };
    },
    created() {
        this.getlist();
       
    },
    methods: {
        getlist(){
            ParkingLotxlList({}).then((res) => {
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
        submitForm(){
            const loading = this.$loading({
                lock: true,
                text: '账单生成中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            debounce(() => {

                BillEdit(this.editForm) .then(res => {
                    loading.close();
                    if (res.code == 200) {
                        this.$message({
                            message: "生成成功！",
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
                    this.$message.error("生成失败，请稍后再试！");
                });


          }, 1500);
        }
    },
};
</script>
<style>
@import "../../assets/css/index.css";


</style>