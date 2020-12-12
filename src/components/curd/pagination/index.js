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
            'current-page':0,
            'page-sizes':[10, 25, 50],
            'page-size':10,
            'layout':"total, sizes, prev, pager, next, jumper",
            'total':0,
            // 'hide-on-single-page':true,
            ...config
        },
        style: {
          marginTop: '16px',
          textAlign: 'center'
        }
    }
    return (<el-pagination {...params}/>)
}