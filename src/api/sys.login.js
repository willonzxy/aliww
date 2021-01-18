const actionPrefix = '/manager';
// 店铺
export const dataManagerApi = {
    login:{
        m:'post',
        api:actionPrefix + '/user-login'
    },
    logout:{
        m:'get',
        api:actionPrefix + '/user-logout'
    },
    getSession:{
        m:'get',
        api:actionPrefix + '/user-logining'
    },
}

