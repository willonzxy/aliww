import { uniqueId } from 'lodash'

// // 插件
// import demoPlugins from './modules/demo-plugins'
// // 组件
// import demoComponents from './modules/demo-components'
// // 功能
// import demoPlayground from './modules/demo-playground'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([
  {
    path: '/index',
    title: '首页',
    icon: 'home',
    children: [
      // {
      //   title: '系统管理', icon: 'tv',
      //   children:[
      //     { path: '/index/user', title: '用户管理', icon: 'user' }
      //   ],
      // },
      { path: '/index/user', title: '用户管理', icon: 'user',admin:true },
      { path: '/index/my', title: '个人信息', icon: 'vcard' },
      // {
      //   title: '数据管理', icon: 'database',
      //   children:[
      //     { path: '/index/record', title: '数据录入', icon: 'pencil' }
      //   ],
      // },
      { path: '/index/record', title: '数据管理', icon: 'pencil' },
      { path: '/index/store', title: '店铺管理', icon: 'home' },
      { path: '/index/contract', title: '店铺协议管理', icon: 'calendar-o',admin:true}
    ]
  }
])

// 菜单 顶栏
export const menuHeader = supplementPath([

])
