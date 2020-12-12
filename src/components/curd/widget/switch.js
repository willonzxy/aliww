export const widget_desc = {
    name:{value:'switch',label:'开关控件'},
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
            disabled:false,
            size:'small',
            ...config
        }
    }
    return (<el-switch {...params}/>)
}