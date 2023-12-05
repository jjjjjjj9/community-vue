import Vue from 'vue'
import Router from 'vue-router'

//登录
import login from '@/views/login';
import homeindex from '@/views/home/index';
import lunbo from '@/views/home/lunbo';

import building from '@/views/community/building';
import house from '@/views/community/house';
import parkingLot from '@/views/community/parkingLot';
import storeroom from '@/views/community/storeroom';
import owner from '@/views/owner/index';
import details from '@/views/owner/details';
import household from '@/views/owner/household';
import yparkingLot from '@/views/owner/parkingLot';
import notice from '@/views/property/notice';
import department from '@/views/organization/department';
import admin_user from '@/views/organization/admin_user';
import repair from '@/views/property/repair';
import info_class from '@/views/info/info_class';
import info from '@/views/info/info';
import seek_help from '@/views/property/seek_help';
import suggestion from '@/views/property/suggestion';
import list from '@/views/property/list';
import activity from '@/views/info/activity';
import vehicle from '@/views/owner/vehicle';
import user_agreement from '@/views/system/user_agreement';
import privacy_policy from '@/views/system/privacy_policy';
import help from '@/views/system/help';
import system from '@/views/system/system';
import questionnaire from '@/views/info/questionnaire';
import property_fee from '@/views/pay/property_fee';
import fare from '@/views/pay/fare';
import zhiyuanzhe from '@/views/volunteer/zhiyuanzhe';
import Contribution from '@/views/volunteer/Contribution';
import material from '@/views/volunteer/material';
import duigong from '@/views/system/duigong';




//首页
import index from '@/views/index';

Vue.use(Router)
//cv以下代码解决路由地址重复的报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    { path: '/login', name: '登录', component: login, hidden: true, meta: { requireAuth: false } },
    { path: '/', name: '', component: login, hidden: true, meta: { requireAuth: false } },
    {path: '/index',name: '首页',component: index,iconCls: 'el-icon-tickets',
		children: [
    { path: '/home/index', name: '工作台', component: homeindex, meta: { requireAuth: true } },
    { path: '/home/lunbo', name: '轮播图', component: lunbo, meta: { requireAuth: true } },
    { path: '/community/building', name: '社区管理', component: building, meta: { requireAuth: true } },
    { path: '/community/house', name: '房屋管理', component: house, meta: { requireAuth: true } },
    { path: '/community/parkingLot', name: '车位管理', component: parkingLot, meta: { requireAuth: true } },
    { path: '/community/storeroom', name: '储藏室管理', component: storeroom, meta: { requireAuth: true } },
    { path: '/owner/index', name: '业主管理', component: owner, meta: { requireAuth: true } },
    { path: '/owner/details', name: '业主详情', component: details, meta: { requireAuth: true } },
    { path: '/owner/household', name: '住户管理', component: household, meta: { requireAuth: true } },
    { path: '/owner/parkingLot', name: '车位管理', component: yparkingLot, meta: { requireAuth: true } },
    { path: '/property/notice', name: '物业通知', component: notice, meta: { requireAuth: true } },
    { path: '/organization/department', name: '组织架构', component: department, meta: { requireAuth: true } },
    { path: '/organization/admin_user', name: '员工管理', component: admin_user, meta: { requireAuth: true } },
    { path: '/property/repair', name: '业主报修', component: repair, meta: { requireAuth: true } },
    { path: '/info/info_class', name: '资讯分类', component: info_class, meta: { requireAuth: true } },
    { path: '/info/info', name: '资讯内容', component: info, meta: { requireAuth: true } },
    { path: '/property/seek_help', name: '业主求助', component: seek_help, meta: { requireAuth: true } },
    { path: '/property/suggestion', name: '投诉建议', component: suggestion, meta: { requireAuth: true } },
    { path: '/property/list', name: '联系热线', component: list, meta: { requireAuth: true } },
    { path: '/info/activity', name: '社区活动', component: activity, meta: { requireAuth: true } },
    { path: '/owner/vehicle', name: '车辆管理', component: vehicle, meta: { requireAuth: true } },
    { path: '/system/user_agreement', name: '用户协议', component: user_agreement, meta: { requireAuth: true } },
    { path: '/system/privacy_policy', name: '隐私政策', component: privacy_policy, meta: { requireAuth: true } },
    { path: '/system/help', name: '帮助中心', component: help, meta: { requireAuth: true } },
    { path: '/system/system', name: '基本信息', component: system, meta: { requireAuth: true } },
    { path: '/info/questionnaire', name: '问卷调查', component: questionnaire, meta: { requireAuth: true } },
    { path: '/pay/property_fee', name: '物业费', component: property_fee, meta: { requireAuth: true } },
    { path: '/pay/fare', name: '车费', component: fare, meta: { requireAuth: true } },
    { path: '/volunteer/zhiyuanzhe', name: '志愿者', component: zhiyuanzhe, meta: { requireAuth: true } },
    { path: '/volunteer/Contribution', name: '爱心款', component: Contribution, meta: { requireAuth: true } },
    { path: '/volunteer/material', name: '爱心物资', component: material, meta: { requireAuth: true } },
    { path: '/system/duigong', name: '对公信息', component: duigong, meta: { requireAuth: true } },
    
    
    
    ]},
   
  ]
   
  
})
