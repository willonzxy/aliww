export const widget_desc = {
  name:['date-picker',{value:'datetime',label:'时间日期选择器'}],
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
          editable: false,
          clearable: false,
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          'value-format': 'yyyy-MM-dd HH:mm:ss',
          ...config
      }
  }
  return (<el-date-picker {...params}/>)
}
