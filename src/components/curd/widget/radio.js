export const widget_desc = {
    name:[{value:'radio',label:'单选控件'},'lazy-radio'],
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
            ...config
        }
    }
    const { dataIndex , show , options , data:datasource } = config;
    return (<el-radio-group {...params}>
            {
                (options ||  datasource || []).map(item => (
                    <el-radio
                        key={ item[dataIndex] || item['value'] }
                        label={ item[dataIndex] || item['value'] } 
                    >
                    { item[show] || item['label'] }
                    </el-radio>
                ))
            }
        </el-radio-group>)
}