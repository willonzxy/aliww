const actionPrefix = '/manager';


// 数据录入
// export const dataRecordApi = `${actionPrefix}/data-record`

export const dataManagerApi = {
    add:{
        m:'post',
        api:actionPrefix + '/data-add'
    },
    select:{
        m:'get',
        api:actionPrefix + '/data-record'
    },
    edit:{
        m:'post',
        api:actionPrefix + '/data-edit'
    },
    del:{
        m:'delete',
        api:actionPrefix + '/data-del'
    }

}

// 数据查询
// export const dataViewApi = `${actionPrefix}/data-view`

