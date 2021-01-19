import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '首页',
          auth: true
        },
        component: _import('system/index'),
        children:[
          // {
          //   path:'data-manage',
          //   name:'data-manage',
          //   component: _import('system/data-manage/data-record.vue'),
          //   meta: {
          //     title: '数据管理',
          //     auth: true
          //   },
          // },
          {
            path:'data-record',
            name:'data-record',
            component: _import('system/data-manage/data-record-2.vue'),
            meta: {
              title: '数据录入',
              auth: true
            },
          },
          {
            path:'store',
            name:'store',
            component: _import('system/data-manage/store.vue'),
            meta: {
              title: '店铺管理',
              auth: true
            },
          },
          {
            path:'contract',
            name:'contract',
            component: _import('system/data-manage/contract-record.vue'),
            meta: {
              title: '店铺协议管理',
              auth: true,
              admin:true,
            },
          },
          {
            path:'user',
            name:'user',
            component: _import('system/sys-manage/user.vue'),
            meta: {
              title: '用户管理',
              auth: true,
              admin:true,
            },
          },
          {
            path:'my',
            name:'my',
            component: _import('system/sys-manage/my.vue'),
            meta: {
              title: '个人信息',
              auth: true
            },
          }
        ]
      },
      // 系统 前端日志
      // {
      //   path: 'log',
      //   name: 'log',
      //   meta: {
      //     title: '前端日志',
      //     auth: true
      //   },
      //   component: _import('system/log')
      // },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
