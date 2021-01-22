import { deep_clone } from "../../util/index";
import { required } from  '../rule'
import _fetch from '../../util/fetch'
export function handleFormConfig(formTitle,formConfig){
    if(!formTitle){
        return this.$message.error(`表单配置中缺少title字段`) 
    }
    // 这些数据是要被返回data中作为响应式数据的
        
        let formInline = {},
            tabs = [],
            beforeSubmit = Object.create(null),
            lazyData = {};
    /** 
     * 1、保存所有属性值
     * 2、记录表单提交前需要处理的属性和函数，在提交前遍历需要预处理的属性并且调用他们的beforeSubmit方法
     * 3、change_submit处理，配合attrValueChange使用
     * 4、lazy组件处理
     * 5、表单值检验预设
    */
    for(let item of formConfig){
        if(!item){
            continue
        }
        let { attr , type , value,param_type } = item;
        // if(!attr || !type ){
        //     this.$message.error(`${formTitle}表单配置中缺少attr或type等关键字段`) 
        // }
        // 1
        // attrs.push(attr);
        // 2
        if(!!item.onbeforesubmit && typeof item.onbeforesubmit === 'function'){
            beforeSubmit[attr] = item.onbeforesubmit
        }
        // 3 select | daterange | number-input | cascader | radio 有效
        if(item.change_submit){
            item.change = () => {
                item.onchange && item.onchange.call(this,this.formInline[attr])
                this.submit();
            }
        }
        // 4
        if(/lazy/i.test(type)){
            lazyData[attr]={
                api:item.api,
                data:[],
                groupBy:item.groupBy,
            }
        }
        if(!item.tab_name || (item.tab_name && !item.tab_name.length)){
            item.tab_name = '基本配置项'
        }
        if(item.disabled_on_add){
            item.disabled = true;
        }
        if(!tabs.includes(item.tab_name)){
            tabs.push(item.tab_name)
        }
        
        //console.log(item.rules[0])
        // 深度遍历，组织出基础的数据结构
        formInline[attr] = DFS(item)[attr]
        // console.log(item)
    }
    

    this.formConfig = formConfig
    // this.attrs = attrs;
    this.formInline = formInline;
    this.originalFormInline = deep_clone(formInline)
    this.tabs = tabs;
    this.beforeSubmit = beforeSubmit;
    this.lazyData = lazyData;
    // return {
    //     formConfig,
    //     attrs,
    //     formInline,
    //     tabs,
    //     beforeSubmit, 
    //     lazyData,
    // }
}

/**
 * 
 * @param {<form-item>} item  必传值
 * @param {Object} prevVal  记录上一次的原始值
 * @param {Number} depth 
 * @param {Object} root  根值
 * @param {Number} _index 记录上一次的数组索引
 * 根据表单类型构建出原始结构值
 * 记录层级深度，便于后期着色
 * tip:array 和  object 类型可以没有type字段
 * 但必须有children字段和param_type字段
 * 
 */
function DFS(item,prevVal = {},depth = 0,root,_index = 0){
    if(depth === 0){
        root = prevVal
    }
    let { attr,param_type,value,type } = item;
    var data = prevVal;
    if(Object.prototype.toString.call(prevVal) === '[object Object]'){
        data = handleInObject(prevVal,attr,param_type,value,type)
    }else if (Array.isArray(prevVal)){
        item.attr = '_$$_' + ~~((1+Math.random()) * 1e6) + depth
        data = handleInArray(prevVal,param_type,value,type,_index)
    }
    if(item.is_required){
        if(!item.rules){
            item.rules = [required]
        }else{
           // console.log(item.rules[0])
            item.rules.push(required)
        }
    }
    // 记录层级深度，方便着色
    item.internal_depth = depth

    if(typeof data === 'object' && Array.isArray(item.children)){
        for(let [index,child_item] of item.children.entries()){
            DFS(child_item,data,depth + 1,root,index)
        }
    }
    return root
}


function handleInObject(formInline,attr,param_type,value,type){
    if(param_type){
        switch(param_type){
            case 'number':formInline[attr] = +(value || 0);break;
            case 'array':formInline[attr] = parseString(value,[]);break;
            case 'object':formInline[attr] = parseString(value,{});break;
            case 'boolean':formInline[attr] = parseString(value,false);break;
            default:formInline[attr] = value || '';break;
        }
    }else{
        if(type === 'object-tool'){
            formInline[attr] = parseString(value,{});
        }else if(type.includes('array')){
            formInline[attr] = parseString(value,[]);
        }else {
            formInline[attr] = value || '';
        }
    }
    return formInline[attr]
}

function handleInArray(formInline,param_type,value,type,_i){
    if(param_type){
        switch(param_type){
            case 'number':formInline.push(+(value || 0));break;
            case 'array':formInline.push(parseString(value,[]));break;
            case 'object':formInline.push( parseString(value,{}));break;
            case 'boolean':formInline.push( parseString(value,false));break;
            default:;break;
        }
    }else{
        if(type === 'object-tool'){
            formInline.push(parseString(value,{}))
        }else if(type.includes('array')){
            formInline.push(parseString(value,[]))
        }
    }
    return formInline[_i || 0]
}

// 当属性的的值发生变化时执行
export function attrValueChange(attr, val) {
    // let value = this.formInline[attr];
    let desc_obj = this.formConfig.filter(i => i.attr === attr)[0];
    if(!desc_obj){
        return
    }
    let func = desc_obj.change || desc_obj.onchange;
    func && func.call(this,val);
}

export function attrSelectChange(attr, val) {
    // let value = this.formInline[attr];
    let desc_obj = this.formConfig.filter(i => i.attr === attr)[0];
    if(!desc_obj){
        return
    }
    let func = desc_obj.select || desc_obj.onselect;
    func && func.call(this,val);
}

export function attrObjectValueChange(attr,map_attr,val){
    let desc_obj = this.formConfig.filter(i => i.attr === attr)[0];
    if(!desc_obj){
        return
    }
    let func = desc_obj.change || desc_obj.onchange;
    func && func.call(this,map_attr,val);
}

export function attrArrayValueChange(attr,index,val){
    // let value = this.formInline[attr][index];
    let desc_obj = this.formConfig.filter(i => i.attr === attr)[0];
    if(!desc_obj){
        return
    }
    let func = desc_obj.change || desc_obj.onchange;
    func && func.call(this,index,val);
}

export function attrObjectArrayValueChange(attr,index,map_attr,val){
    // let value = this.formInline[attr][index][map_attr];
    let desc_obj = this.formConfig.filter(i => i.attr === attr)[0];
    if(!desc_obj){
        return
    }
    let func = desc_obj.change || desc_obj.onchange;
    func && func.call(this,index,map_attr,val);
}

export function getFormAttrConfig(attr){
    return this.formConfig.filter(i=>i.attr === attr)[0];
}
export function getFormAttrIndex(attr){
    return this.formConfig.findIndex(i=>i.attr === attr);
}
/** 
 * 组件的数据需要从远端拉取
*/
export async function getLazyData(attr,api){
    // 有指定属性值的，只更新给属性值的值
    if(attr){
        await pullRemoteData.call(this,attr,api)
    }else{
        for(let key in this.lazyData){
            await pullRemoteData.call(this,key,api || this.lazyData[key].api || '')
        }
    }
    async function pullRemoteData(k,api){
        try {
            let data = [];
            // 待完善
            if(typeof api === 'string'){
                data = await _fetch({
                    url:api,
                    method:'get'
                })
            }
            if(typeof api === 'function'){
                data = await api();
            }
            if(data.data){
                data = data.data;
            }
            // console.log(data)
            let widget_config = this.getFormAttrConfig(k);
            data = widget_config.onload ? await widget_config.onload.call(this,data) : data;
            widget_config.data = this.lazyData[k].data = data;
            // 更新选择项
            this.formConfig.splice(this.getFormAttrIndex(k),1,widget_config)
            // 更新表单值，默认选中第一个
            if(data.length){
                let { dataIndex } = widget_config;
                this.formInline[k] = data[0][dataIndex || 'value'];
                let func = widget_config.change || widget_config.onchange;
                func && func.call(this, data[0][dataIndex || 'value']);
            }
            // this.lazyData[k].data = data;
        } catch (error) {
            console.log('get lazy data error')
            console.log(error)
        }
    }
}

function parseString(str,preset){
    return typeof str === 'string' && str.length ? 
                JSON.parse(str) : 
                typeof str === 'object' ? 
                    str : 
                    preset;
}

// export function recurMerge (base, data) {
//   let temp = {};
//   function recur (temp, base, data) {
//     Object.keys(base).forEach(key => {
//       let bValue = base[key], dValue = data[key];
//       if (!dValue) {
//         temp[key] = bValue;
//         return;
//       }
//       let bType = defineType(bValue), dType = defineType(dValue);
//       if (bType !== dType) { // 直接类型改变了
//         temp[key] = bValue;
//       } else { // 类型没有变
//         if (dType === 'normal') { // 依旧普通类型
//           temp[key] = dValue;
//         } else if (dType === 'object') { // 对象类型
//           handleObj(key, temp, bValue, dValue)
//         } else { // 数组类型
//           handleArr(key, temp, bValue, dValue)
//         }
//       }
//     })
//   }
//   function handleObj (key, temp, bValue, dValue) {
//     if (!temp[key]) temp[key] = {};
//     recur(temp[key], bValue, dValue);
//   }
//   function handleArr (key, temp, bValue, dValue) {
//     let bValue0 = bValue[0], dValue0 = dValue[0]; // 取出第0位
//     let bType0 = defineType(bValue0), dType0 = defineType(dValue0);
//     if (bType0 === dType0) { //类型相同
//       // recur(temp[key], bValue, dValue);
//       if (bType0 === 'normal') {
//         temp[key] = dValue;
//       }
//       if (bType0 === 'object') {
        
//       }
//     } else { // 类型不同，直接替换
//       temp[key] = bValue;
//     }
//   }
//   recur (temp, base, data);
//   return temp;
// }

export function recurMerge (base, data) {
  function recur(base, data) {
    base && Object.keys(base).forEach(key => {
      let bValue = base[key], dValue = data[key];
      if (!dValue) return; // 新增加的属性
      let bType = defineType(bValue), dType = defineType(dValue);
      if (bType !== dType) return // 类型直接变了
      if (bType === 'normal') base[key] = dValue; // 普通类型，直接赋值
      if (bType === 'object') recur(base[key], dValue); // 对象类型
      if (bType === 'array') handleArrayType(base[key], dValue);// 数组类型
    })
  }
  function handleArrayType (base, data) {
    data.forEach((item,index) => {
      let dType = defineType(item), bType = base[index] && defineType(base[index]);
      if (bType !== dType) return; // 类型变了
      if (bType === 'normal') base[index] = data[index]
      if (bType === 'object') recur(base[index], data[index])
      if (bType === 'array') handleArrayType (base[index], data[index])
    })
  }
  recur (base, data);
  return base;
}

function defineType (value) {
  if(Object.prototype.toString.call(value) === '[object Object]'){ // 对象
    return 'object';
  }else if (Array.isArray(value)){ // 数组
    return 'array';
  } else {
    return 'normal';
  }
}
