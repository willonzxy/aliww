/** 
 * 只是为了简单的包一层，定义这个组件的预设值和如何传参
 * 使用轻量一点的函数式组件就可以了
*/
// export const widget_desc = {
//     name:['cascader','lazy-cascader'],
// }
import { deep_clone } from '../util/index'
export default ({props,listeners,data})=>{
    let { config = {} } = props;
    let _config = deep_clone(config);
    let _props = _config.props || {};
    delete _config.props;
    let params = {
        on:listeners,
        model:data.model, // 是的v-model生效
        style:data.style,
        staticStyle:data.staticStyle,
        class:data.class,
        staticClass:data.staticClass,
        attrs:{
            size:'small',
            value:undefined,
            disabled:false,
            placeholder:'请选择',
            filterable:true,
            clearable:true,
            props:{
              expandTrigger: 'hover',
              multiple: false,
              checkStrictly: true,
              emitPath: false,
              value: 'id',
              label: 'name',
              children: 'children',
              ..._props
            },
            options:_config.data || [],
            ..._config
        }
    }
    return (<el-cascader {...params}/>)
}