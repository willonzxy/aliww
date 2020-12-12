import components from '../widget'
/** 
 * is灵活切换控件类型，减少分支判断
*/
export default ({props,data})=>{
    const { type } = props;
    const component_name = components[type];
    return (<component_name {...data}/>)
}