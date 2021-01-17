const actionPrefix = '/manager';
// 店铺
export const dataManagerApi = {
    add:{
        m:'post',
        api:actionPrefix + '/store-add'
    },
    select:{
        m:'get',
        api:actionPrefix + '/store-record'
    },
    edit:{
        m:'post',
        api:actionPrefix + '/store-edit'
    },
    del:{
        m:'delete',
        api:actionPrefix + '/store-del'
    }
}

