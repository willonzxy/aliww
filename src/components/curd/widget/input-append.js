/** 
 * 有前置预设的输入框
*/
export const widget_desc = {
    name:'input-append',
}
export default ({props,listeners,data})=>{
    const { config = {} } = props;
    const params = {
        on:listeners,
        model:data.model, // 是的v-model生效
        style:data.style,
        staticStyle:data.staticStyle,
        class:data.class,
        staticClass:data.staticClass,
        attrs:{
            size:'small',
            clearable:true,
            disabled:false,
            placeholder:'请输入',
            ...config
        }
    }
    return (
        <el-input {...params}>
            <template slot="append">{config.label || ''}</template>
        </el-input>
    )
}