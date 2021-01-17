import { find, assign } from 'lodash'
import { dataManagerApi } from '@/api/sys.login.js';
import _fetch from '../../components/curd/util/fetch'
const users = [
  { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' }
]

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
    // 模拟数据
    // mock
    //   .onAny(dataManagerApi.login.api)
    //   .reply(config => {
    //     const user = find(users, tools.parse(config.data))
    //     return user
    //       ? tools.responseSuccess(assign({}, user, { token: faker.random.uuid() }))
    //       : tools.responseError({}, '账号或密码不正确')
    //   })
    // 接口请求
    return _fetch({
      url: dataManagerApi.login.api,
      method: 'post',
      data,
      // headers:{
      //   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      // }

    })
  },
  getSessionInfo () {
    // 模拟数据
    // mock
    //   .onAny(dataManagerApi.login.api)
    //   .reply(config => {
    //     const user = find(users, tools.parse(config.data))
    //     return user
    //       ? tools.responseSuccess(assign({}, user, { token: faker.random.uuid() }))
    //       : tools.responseError({}, '账号或密码不正确')
    //   })
    // 接口请求
    return _fetch({
      url: dataManagerApi.getSession.api,
      method: 'get',
      // headers:{
      //   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      // }

    })
  }
})
