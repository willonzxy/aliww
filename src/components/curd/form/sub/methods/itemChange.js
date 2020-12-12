import {
  deep_clone
} from '../../../util'
/** 
 * 数组类型的参数移除 
 * */
export function removeItem(symbol) {
    let [attr, index] = symbol.split('$$');
    if (index) {
        this.formInline[attr].splice(+index, 1)
    } else {
        // this.formInline[attr] = [];
        throw new Error('form组件sub/index中removeItem方法无法解析出index索引位')
    }
}
/** 
 * 数组类型配置项添加子项
 */
export function addItem(attr,val) {
    // if (type === 'config-verbose') {
    //     (this.formInline[attr] || (this.formInline[attr] = [])).push({
    //         value: '',
    //         label: '',
    //         type: '', // 这个是控件id
    //     })
    // } else if (type === 'object-array-tool') {
    //     let item = deep_clone(val)
    //     this.formInline[attr].push(item);
    // } else {
    //     this.formInline[attr].push('')
    // }
    if(typeof val === 'object'){
      val = deep_clone(val)
    }
    this.formInline[attr].push(val)
}
/**
 * 上移数据项
 */
export function moveUpItem (symbol) {
  let [attr, index] = symbol.split('$$');
  if (index) {
    let i = parseInt(index)
    let list = this.formInline[attr]
    let pre = list[i - 1], cur = list[i]
    this.formInline[attr].splice(i - 1, 2, cur, pre)
  } else {
    throw new Error('form组件sub/index中moveUpItem方法无法解析出index索引位')
  }
}

/**
 * 下移数据项
 */

export function moveDownItem (symbol) {
  let [attr, index] = symbol.split('$$');
  if (index) {
    let i = parseInt(index)
    let list = this.formInline[attr]
    let next = list[i + 1], cur = list[i]
    this.formInline[attr].splice(i, 2, next, cur)
  } else {
    throw new Error('form组件sub/index中moveDownItem方法无法解析出index索引位')
  }
}
