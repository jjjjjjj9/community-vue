<template>
  <div class="lefts">
    <div>
      <img src="../assets/img/bg1.png" class="img"/> 
    </div>
    <el-menu   class="el-menu-vertical-demo" collapse-transition router :default-active="$route.path" unique-opened  background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuid + ''">
        <template slot="title">
          <i class="iconfont" :class="menu.icon"></i>
          <span>{{ menu.menuname }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="chmenu in menu.menus" :index="'/' + chmenu.url" :key="chmenu.menuid">
            <span>{{ chmenu.menuname }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      allmenu: [],
      divs2: true,
      ioc: JSON.parse(localStorage.getItem('userData')).ioc,
      name: JSON.parse(localStorage.getItem('userData')).name,

    };
  },

  created() {
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: "el-icon-s-platform",
          menuname: "工作台",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 11,
            icon: "el-icon-menu",
            menuname: "工作台",
            hasThird: null,
            url: "home/index",
            menus: null,
            list: []
          },{
            menuid: 12,
            icon: "el-icon-menu",
            menuname: "轮播图",
            hasThird: null,
            url: "home/lunbo",
            menus: null,
            list: []
          },],
          list: []
        },{
          menuid: 2,
          icon: "el-icon-office-building",
          menuname: "社区管理",
          hasThird: null,
          url: null,
          menus: [{
            menuid: 21,
            icon: "el-icon-menu",
            menuname: "楼栋管理",
            hasThird: null,
            url: "community/building",
            menus: null,
            list: []
          },{
            menuid: 23,
            icon: "el-icon-menu",
            menuname: "房屋管理",
            hasThird: null,
            url: "community/house",
            menus: null,
            list: []
          },
          {
            menuid: 25,
            icon: "el-icon-menu",
            menuname: "车位管理",
            hasThird: null,
            url: "community/parkingLot",
            menus: null,
            list: []
          }
          // ,{
          //   menuid: 26,
          //   icon: "el-icon-menu",
          //   menuname: "储藏室管理",
          //   hasThird: null,
          //   url: "community/storeroom",
          //   menus: null,
          //   list: []
          // }
          ],
          list: []
        },{
          menuid: 3,
          icon: "el-icon-s-custom",
          menuname: "物业管家",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 31,
            icon: "el-icon-menu",
            menuname: "物业通知",
            hasThird: null,
            url: "property/notice",
            menus: null,
            list: []
          },{
            menuid: 32,
            icon: "el-icon-menu",
            menuname: "业主报修",
            hasThird: null,
            url: "property/repair",
            menus: null,
            list: []
          },{
            menuid: 33,
            icon: "el-icon-menu",
            menuname: "投诉建议",
            hasThird: null,
            url: "property/suggestion",
            menus: null,
            list: []
          },{
            menuid: 34,
            icon: "el-icon-menu",
            menuname: "业主求助",
            hasThird: null,
            url: "property/seek_help",
            menus: null,
            list: []
          },{
            menuid: 35,
            icon: "el-icon-menu",
            menuname: "联系热线",
            hasThird: null,
            url: "property/list",
            menus: null,
            list: []
          }],
          list: []
        },{
          menuid: 4,
          icon: "el-icon-user",
          menuname: "业主管家",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 41,
            icon: "el-icon-menu",
            menuname: "业主管理",
            hasThird: null,
            url: "owner/index",
            menus: null,
            list: []
          },{
            menuid: 42,
            icon: "el-icon-menu",
            menuname: "住户管理",
            hasThird: null,
            url: "owner/household",
            menus: null,
            list: []
          },{
            menuid: 21,
            icon: "el-icon-menu",
            menuname: "车位管理",
            hasThird: null,
            url: "owner/parkingLot",
            menus: null,
            list: []
          },{
            menuid: 21,
            icon: "el-icon-menu",
            menuname: "车辆管理",
            hasThird: null,
            url: "owner/vehicle",
            menus: null,
            list: []
          }],
          list: []
        },{
          menuid: 5,
          icon: "el-icon-s-finance",
          menuname: "缴费管理",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 51,
            icon: "el-icon-menu",
            menuname: "物业费",
            hasThird: null,
            url: "pay/property_fee",
            menus: null,
            list: []
          },{
            menuid: 52,
            icon: "el-icon-menu",
            menuname: "停车费",
            hasThird: null,
            url: "pay/fare",
            menus: null,
            list: []
          }],
          list: []
        },{
          menuid: 6,
          icon: "el-icon-document",
          menuname: "社区资讯",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 61,
            icon: "el-icon-menu",
            menuname: "资讯分类",
            hasThird: null,
            url: "info/info_class",
            menus: null,
            list: []
          },{
            menuid: 62,
            icon: "el-icon-menu",
            menuname: "资讯内容",
            hasThird: null,
            url: "info/info",
            menus: null,
            list: []
          },{
            menuid: 63,
            icon: "el-icon-menu",
            menuname: "社区活动",
            hasThird: null,
            url: "info/activity",
            menus: null,
            list: []
          },{
            menuid: 64,
            icon: "el-icon-menu",
            menuname: "调查问卷",
            hasThird: null,
            url: "info/questionnaire",
            menus: null,
            list: []
          }
          // ,{
          //   menuid: 65,
          //   icon: "el-icon-menu",
          //   menuname: "小区投票",
          //   hasThird: null,
          //   url: "info/index",
          //   menus: null,
          //   list: []
          // }
        ],
          list: []
        },{
          menuid: 7,
          icon: "el-icon-help",
          menuname: "红色服务",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 71,
            icon: "el-icon-menu",
            menuname: "志愿者管理",
            hasThird: null,
            url: "volunteer/zhiyuanzhe",
            menus: null,
            list: []
          },{
            menuid: 72,
            icon: "el-icon-menu",
            menuname: "爱心款管理",
            hasThird: null,
            url: "volunteer/contribution",
            menus: null,
            list: []
          },{
            menuid: 73,
            icon: "el-icon-menu",
            menuname: "爱心物资管理",
            hasThird: null,
            url: "volunteer/material",
            menus: null,
            list: []
          }
        ],
          list: []
        },{
          menuid: 8,
          icon: "el-icon-cpu",
          menuname: "组织架构",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 81,
            icon: "el-icon-menu",
            menuname: "组织架构",
            hasThird: null,
            url: "organization/department",
            menus: null,
            list: []
          },{
            menuid: 82,
            icon: "el-icon-menu",
            menuname: "员工管理",
            hasThird: null,
            url: "organization/admin_user",
            menus: null,
            list: []
          },
          // {
          //   menuid: 83,
          //   icon: "el-icon-menu",
          //   menuname: "角色管理",
          //   hasThird: null,
          //   url: "organization/index",
          //   menus: null,
          //   list: []
          // }
        ],
          list: []
        },{
          menuid: 9,
          icon: "el-icon-s-tools",
          menuname: "系统管理",
          hasThird: null,
          url: "",
          menus: [{
            menuid: 91,
            icon: "el-icon-menu",
            menuname: "基本信息",
            hasThird: null,
            url: "system/system",
            menus: null,
            list: []
          },{
            menuid: 92,
            icon: "el-icon-menu",
            menuname: "用户协议",
            hasThird: null,
            url: "system/user_agreement",
            menus: null,
            list: []
          },{
            menuid: 93,
            icon: "el-icon-menu",
            menuname: "隐私政策",
            hasThird: null,
            url: "system/privacy_policy",
            menus: null,
            list: []
          },{
            menuid: 94,
            icon: "el-icon-menu",
            menuname: "帮助中心",
            hasThird: null,
            url: "system/help",
            menus: null,
            list: []
          },],
          list: []
        }



      ]
    }

    this.allmenu = res.data;
  },
  methods: {
   
  }
};
</script>

<style >
.lefts {
  height: 100vh;
  background-color: #545c64;
}

.lefts .img{
  width: 100%;
  height: 70px;
}

.lefts  .el-submenu__title {
  padding: 0  50px !important;
  text-align: left;
}
.lefts .el-submenu__title i {
    color: #fff;
}
.lefts .el-menu-item-group__title{
  padding: 0 !important;
}
.lefts  .el-submenu .el-menu-item {
  min-width: 180px;
}
</style>