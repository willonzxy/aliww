import copyStr from 'copy-to-clipboard';
import { fetch as _fetch } from './util'
import _URL from 'url'
import dayjs  from 'dayjs'
import util from '@/libs/util';
export { uploadApi } from '@/api/sys.upload'


/** 
 * 预设几个按钮按钮配置（写死的）
*/
export const form_btn_style = {
    submit:{
        type:'primary',
        label:'提交',
        icon:'el-icon-check'
    },
    reset:{
        type:'default',
        label:'清空',
        icon:'el-icon-delete'
    },
    searchBarResetBtn:{
        type:'default',
        label:'清空',
        icon:'el-icon-delete'
    },
    search:{
        type:'primary',
        label:'查询',
        icon:'el-icon-search'
    },
    add:{
        type:'primary',
        label:'新增',
        icon:'el-icon-plus'
    }
}

/** 
 * 在所有的searchBar中动态掷入以下按钮，渲染逻辑书写在curd/index.vue中
 * 引入：
 * searchBarConfig:{
 *   actions:['copy-search-url']
 * }
*/
export let searchBarGlobalDynamicActions = [
    // {
    //     name:'copy-search-url',
    //     type:'default',
    //     label:'复制搜索条件的url',
    //     async handler(){
    //         // this指向curd Vue实例
    //         const url = this.getApi();
    //         if(!url){
    //             return
    //         }
    //         let { host } = _URL.parse(url);
    //         if( (host || (host = location.host)) && host.includes('cms') && host.includes('100bt.com')){
    //             await copyUrlWithSign(url,true);
    //         }else{
    //             copyStr(url)
    //         }
    //         this.$message.success('已复制')
    //     }
    // }
]

/** 
 * 在所有的table中动态掷入以下按钮，渲染逻辑书写在table/index.vue中
 * 引入：
 * table:{
 *   actions:['copy-search-url']
 * }
*/
export let tableGlobalDynamicActions = [
    {
        name:'copy-url',
        type:'text',
        label:'复制API',
        explain:'该API可用于客户端数据集成',
        async handler({id}){
            // this指向tabel Vue实例
            let url = this.config.api + '/' + id;
            if(!url){
                return
            }
            url = await copyUrlWithSign(url);
            let { host , protocol } = _URL.parse(url);
            if (this.config.public_api) {
              url = url.replace(protocol+'//'+host,this.config.public_api)
            } else {
              url = util.replaceUrlByEnv(url)
            }
            copyStr(url)
            this.$message.success('已复制')
        }
    },
    {
        name: 'config-tpl',
        type: 'text',
        label: '配置',
        async handler({id, content}) {
            if (!id) {
                this.$message.warning(`当前点选项ID不存在`)
                return
            }
            this.$router.push({
              name: 'templateConfig',
              params: {
                id
              }
            })
        }
    }
]


/** upload handle 
 * return {
 *  statusCode,
 *  uri,
 *  reduceRatio,
 *  suffix_name
 * }
*/
export function processUploadRes(res){
    return {
        statusCode:res.code === 0 ? 200 : -1,
        uri:res.data,
        suffix_name:res.data
    }
}

// 表格的默认展示列合集
export const tableDefaultColumnSets = [
  // {
  //   key: 'id',
  //   title: '序号'
  // },
  // {
  //   key: 'operator',
  //   title: '操作人'
  // },
  // {
  //   key: 'createTime',
  //   title: '创建时间'
  // },
  // {
  //   key: 'updateTime',
  //   title: '更新时间'
  // },
  // {
  //   key: 'publishTime',
  //   title: '发布时间',
  //   width: 180,
  //   auth: true
  // },
  // {
  //   key: 'weight',
  //   title: '权重'
  // },
  // {
  //   key: 'status',
  //   title: '审核状态'
  // },
  // {
  //   key: 'actionLog',
  //   title: '操作日志'
  // },
  // {
  //   key: 'actionReview',
  //   title: '审核',
  //   auth: true,
  //   width: 120
  // }
]

// 预发布时间FormConfig
export const pubTimeFormConfig = {
  actions: [
    'submit',
    'reset'
  ],
  title: '审核通过',
  inline: true,
  btn_group_center: 'center',
  formConfig: [
    {
      attr: 'publishTime',
      label: '发布时间',
      type: 'datetime',
      param_type: 'string',
      is_required: true,
      change_submit: false,
      value: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      explain: '默认时间为当前时间2分钟后'
    }
  ]
}
