export const widget_desc = {
    name:{value:'slider',label:'滑块控件'},
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
            max:100,
            ...config
        }
    }
    return (<el-slider {...params}/>)
}