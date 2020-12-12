import './index.scss'
/** 
 * 装载widget
*/
const widgets = {}
const widgets_desc = [];
const files = require.context('./', false, /\.(js|vue)$/)
files.keys().forEach(key => {
    const desc = files(key).widget_desc;
    if(!desc){
        return
    }
    // desc && widgets_desc.push(desc);
    let { name } = desc || {};
    if(!Array.isArray(name)){
        name = [name]
    }
    name.forEach(_name=>{
        if(!_name){
            return;
        }
        widgets_desc.push(_name);
        if(typeof _name === 'object'){
            _name = _name.value;
            _name && (widgets[_name] = files(key).default);
        }else{
            widgets[_name] = files(key).default
        }
    })
})

// 额外增加一些控件描述
// widgets_desc.push({value:'object-array-tool',label:'对象数组控件'})
// widgets_desc.push({value:'object-tool',label:'对象控件'})

const widgets_desc_for_selected = widgets_desc.map(i=>{
    // 只要注册了中文名提示的控件
    if(typeof i === 'object' && i.label ){
        return {value:i.value,label:i.label}
    }
}).filter(i=>!!i)

export {
    widgets_desc,
    widgets_desc_for_selected
}
export default widgets