import fetch from './fetch.js'

export {
    deep_clone,
    fetch,
}
/** 简单深拷贝 够用了*/
function deep_clone(obj){
    let tempObj = Array.isArray(obj) ? [] : {};
    for(let k in obj){
        tempObj[k] = obj[k] && isObject(obj[k])  ? deep_clone(obj[k]) : obj[k];
    }
    return tempObj
}

function isObject(o){
    return Array.isArray(o) || Object.prototype.toString.call(o) === '[object Object]'
}
