export const widget_desc = {
    name:{value:'autocomplete',label:'自动输入'}
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
            disabled:false,
            // autocomplete:'off',
            placeholder:'请输入',
            ...config
        }
    }
    return (<el-autocomplete {...params}/>)
}