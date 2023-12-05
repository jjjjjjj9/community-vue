<template>
    <div>
        <el-card class="box-card box-cards">
            <el-row>
                <el-form :inline="true" class="user-search">
                    <el-col :span="24">
                        <el-form-item>
                            <div class="card_top"><span>业主报修</span></div>
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
                <el-table-column prop="lx" label="报修类型" align="center" width="120">
                    <template slot-scope="scope">
                    <div>{{ scope.row.lx==1?"房屋":"公共"}}报修</div>
                    </template>
                </el-table-column>
                
                <el-table-column prop="details" label="报修描述" align="center" width="300"></el-table-column>
                <el-table-column prop="logo" label="报修图片" align="center" width="280">
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
                <el-table-column prop="ctime" label="申请时间" align="center" width="180">
                    <template slot-scope="scope">
                    <div>{{ scope.row.ctime | timestampToTime }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="处理状态" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                    <div v-if="scope.row.status == 0">待受理</div>
                    <div v-if="scope.row.status == 1">安排师傅</div>
                    <div v-if="scope.row.status == 2">维修中</div>
                    <div v-if="scope.row.status == 3">已完成</div>
                    <div v-if="scope.row.status == 4">已评价</div>

                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="220" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success"  @click="handleEdit(scope.$index, scope.row)"  v-if="scope.row.status <3" >维修管理</el-button>
                        <el-button size="mini"  @click="handleEditdel(scope.$index, scope.row)">查看维修记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
        </el-card>

        <!-- 新增 -->
        <el-drawer title="维修管理" :visible.sync="editFormVisible" :before-close="handleClose" direction="rtl"
            custom-class="demo-drawer" ref="drawer" size="30%">
            <div class="demo-drawer__content">
                <el-row>
                    <el-form label-width="110px" :model="editForm" :rules="rules" ref="editForm">
                        <el-col class="titleq" style="margin-bottom: 20px">登记信息</el-col>
                        <el-col :span="22">
                            <div class="grid-content bg-purple">
                                <el-form-item label="状态：" prop="unit" >
                                    <el-select v-model="editForm.status" placeholder="请选择">
                                        <el-option  label="安排师傅" :value=1  v-if="editForm.lx==0 "> </el-option>
                                        <el-option  label="处理记录" :value=2  v-if="editForm.lx>0"> </el-option>
                                        <el-option  label="处理完成" :value=3  v-if="editForm.lx>0"> </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="选择师傅：" prop="enable"  v-if="editForm.status==1">
                                    <el-select v-model="editForm.fid" placeholder="请选择师傅">
                                        <el-option v-for="item in useroptions" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                               
                                <el-form-item label="图片：" prop="name" v-if="editForm.status>1">
                                    <el-upload :action="imgsrc" list-type="picture-card" :on-remove="handleRemove2"
                                        :on-success="handsuccess2" :file-list="fileList2" :limit="3" :before-upload="beforeAvatarUpload">
                                        <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <p style="color:#666">最多上传3张</p>
                                </el-form-item>
                                <el-form-item label="回复信息:" prop="remarks">
                                    <el-input  type="textarea"  :rows="2" placeholder="请输入回复信息" v-model="editForm.remarks"></el-input>
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
        <el-drawer title="维修日志" :visible.sync="editFormVisible1" :before-close="handleClose" direction="rtl"
            custom-class="demo-drawer" ref="drawer" size="30%">
            <div class="demo-drawer__content">
                <el-row>
                        <el-col class="titleq" style="margin-bottom: 20px">维修日志</el-col>
                        <el-col :span="22">
                            <div class="grid-content bg-purple">
                                <div class="block">
                                <el-timeline>
                                    
                                    <el-timeline-item v-for="(itme,index) in logtableData" :key="index"  :timestamp="itme.ctime" placement="top" >
                                        <el-card>
                                            <h4>{{itme.status==1?"安排师傅":itme.status==2?"维修中":itme.status==3?"已完成":itme.status==4?"已评价":""}}</h4>
                                            <p v-if="itme.status==1">师傅姓名：{{itme.name}}</p>
                                            <p v-if="itme.status==1">联系方式：{{itme.phone}}</p>
                                            <p v-if="itme.ioc">
                                                <el-image 
                                                    style="width: 100px; height: 100px"
                                                    :src="itme.ioc.split(',')[0]" 
                                                    :preview-src-list="itme.ioc.split(',')">
                                                </el-image>
                                                <el-image v-if="itme.ioc.split(',')[1]"
                                                    style="width: 100px; height: 100px"
                                                    :src="itme.ioc.split(',')[1]" 
                                                    :preview-src-list="itme.ioc.split(',')">
                                                </el-image>
                                                <el-image  v-if="itme.ioc.split(',')[2]"
                                                    style="width: 100px; height: 100px"
                                                    :src="itme.ioc.split(',')[2]" 
                                                    :preview-src-list="itme.ioc.split(',')">
                                                </el-image>
                                            </p>
                                            
                                            <p v-if="itme.remarks && itme.status<4">回复内容：{{itme.remarks}}</p>
                                            
                                            <div v-if="itme.status==4">
                                                <el-row>
                                                    <el-col :span="4">
                                                    <div class="">服务态度 : </div>
                                                    </el-col>
                                                    <el-col :span="20">
                                                    <div class="">
                                                        <el-rate v-model="itme.aid" disabled> </el-rate>
                                                    </div>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col :span="4">
                                                    <div class="">处理速度 : </div>
                                                    </el-col>
                                                    <el-col :span="20">
                                                    <div class="">
                                                        <el-rate v-model="itme.bid" disabled> </el-rate>
                                                    </div>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col :span="4">
                                                    <div class="">满意度 : </div>
                                                    </el-col>
                                                    <el-col :span="20">
                                                    <div class="">
                                                        <el-rate v-model="itme.cid" disabled> </el-rate>
                                                    </div>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                            <p v-if="itme.status==4">评价内容：{{itme.remarks}}</p>
                                        </el-card>
                                    </el-timeline-item>
                                    
                                </el-timeline>
                                </div>
                            </div>
                        </el-col>

                </el-row>
                <div style="height: 60px; margin-top: 50px"></div>
            </div>
        </el-drawer>
    </div>
</template>
<script>
import Pagination from "../../components/Pagination";
import { imgsrc } from "../../utils/utils";
import debounce from "../../utils/debounce";
import { RepairLogEdit, RepairLogList, RepairList,weiuserlist } from "../../api/userMG";
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
            useroptions:[],
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
                fid:"",
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
        this.getlistmane()

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
        getlistmane() {
            weiuserlist({}).then((res) => {
                // console.log(res)
                            this.useroptions = res.data
                    })
                    .catch((err) => {
                    });
            },
        //显示数据
        userlist(parameter) {
            this.loading = true;
            RepairList(parameter)
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
            if(row.status==0){
                this.title = "安排师傅";
            }else if(row.status==1){
                this.title = "处理完成";
            }
            
            this.editForm={
                id: row.id,
                status:"",
                lx:row.status,
                fid: "",
                name: "",
                phone:"",
                ioc:"",
                remarks:"",
                wxid:row.wxid
            } 
            this.fileList2=[]
            this.lists2=[]
               
           
        },
        //提交添加，修改
        submitForm(info) {
            this.editForm.ioc = this.lists2.join(',')
            this.loading2 = true;
            debounce(() => {//防抖事件
                RepairLogEdit(this.editForm)
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
        handleEditdel(index, row) {
            
            RepairLogList({id:row.id}).then((res) => {
                        this.logtableData = res.data;
                })
                .catch((err) => {});
            this.editFormVisible1 = true;

        },
         //删除
     handleRemove2(file, fileList) {
        this.fileList2 =[]
        this.lists2 = []
        this.fileList2 = fileList
        for (let index = 0; index < fileList.length; index++) {
            if (fileList[index].size) {
                this.lists2.push(fileList[index].response.data)
            } else {
                this.lists2.push(fileList[index].url)
            }
        }
    },
    //上传成功
    handsuccess2(response, file, fileList) {
        let imhlist = [];
        this.lists2 = []
        for (let index = 0; index < fileList.length; index++) {
            //两个数组内容不同，判断显示路径
            if (fileList[index].size) { 
                imhlist.push({ url: fileList[index].response.data })
                this.lists2.push(fileList[index].response.data)
            } else {
                imhlist.push({ url: fileList[index].url })
                this.lists2.push(fileList[index].url)
            }
        }
        this.fileList2 = imhlist;
        // console.log(this.lists2)
        // console.log('fileList' ,imhlist)
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