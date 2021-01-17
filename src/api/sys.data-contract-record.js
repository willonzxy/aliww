const actionPrefix = '/manager';
// 店铺
export const dataManagerApi = {
    add:{
        m:'post',
        api:actionPrefix + '/contract-add'
    },
    select:{
        m:'get',
        api:actionPrefix + '/contract-record'
    },
    edit:{
        m:'post',
        api:actionPrefix + '/contract-edit'
    },
    del:{
        m:'delete',
        api:actionPrefix + '/contract-del'
    }
}

