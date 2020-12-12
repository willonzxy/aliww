export const widget_desc = {
    name:{value:'textarea',label:'多行输入框'}
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
            type:'textarea',
            clearable:true,
            disabled:false,
            placeholder:'请输入',
            size:'small',
            ...config
        }
    }
    return (<el-input {...params}/>)
}