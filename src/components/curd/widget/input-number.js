export const widget_desc = {
    name:['input-number',{value:'number-input',label:'数字输入框'}]
}
export default ({props,listeners,data})=>{
    const { config = {} } = props;
    const params = {
        on:listeners,
        model:data.model,
        style:data.style,
        staticStyle:data.staticStyle,
        class:data.class,
        staticClass:data.staticClass,
        attrs:{
            size:'small',
            clearable:true,
            'controls-position':"right",
            ...config
        }
    }
    return (<el-input-number {...params}/>)
}