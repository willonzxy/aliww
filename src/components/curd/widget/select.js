export const widget_desc = {
    name:[{value:'select',label:'下拉框'},'lazy-select'],
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
            filterable:true,
            clearable:true,
            size:'small',
            ...config
        }
    }
    const { dataIndex , show , options , data:datasource } = config;
    return (<el-select {...params}>
            {
                (options || datasource || []).map(item => (
                    <el-option 
                        key={item[dataIndex] || item['value']}  
                        label={item[show] || item['label']} 
                        value={item[dataIndex] || item['value']} 
                    />
                ))
            }
        </el-select>)
}