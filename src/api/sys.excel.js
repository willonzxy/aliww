const actionPrefix = '/auth'

// excel解析导入
export const exportExcelApi = `/api${actionPrefix}/exportExcel`

// excel导出
export const parseExcelApi = `${actionPrefix}/parseExcel`

export const exportExcelAction = function(api){
    let a = document.createElement('a')
    a.href = api
    a.target = '_blank'
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
    a = null;
}