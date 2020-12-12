export const widget_desc = {
  name:['date-picker',{value:'datetime',label:'时间日期选择器'}],
}
export default ({props,listeners,data})=>{
  const { config = {} } = props;
  const pickerStyle = {
    type:config.rangeType ? 'datetimerange' : 'datetime',
  }
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
          clearable: true,
          format: 'yyyy-MM-dd HH:mm:ss',
          'value-format': 'yyyy-MM-dd HH:mm:ss',
          ...config,
          ...pickerStyle,
      }
  }
  return (<el-date-picker {...params}/>)
}
