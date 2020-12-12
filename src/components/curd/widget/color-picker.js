export const widget_desc = {
    name:['color-picker',{value:'color',label:'颜色拾取器'}],
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
            'show-alpha':true,
            ...config
        }
    }
    return (<el-color-picker {...params}/>)
}