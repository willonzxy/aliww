<template lang="pug">
    d2-container
        Curd(ref="curd" :config="config")
</template>
<script>
import Curd from '@/components/curd'
import { dataManagerApi } from '@/api/sys.user.js';
import { deep_clone } from '@/components/curd/util';
import { numAndEn } from '@/components/curd/form/rule.js'
import jsMd5 from 'js-md5'
export default {
    name:'DataRecord',
    components:{
        Curd,
    },
    data(){
        const that = this;
        return {
            config:{
                defaultColumns:true,
                api:dataManagerApi,
                title:'用户管理',
                actions:['edit','delete'],

                searchBarConfig:{
                    btn_group_center:'center',
                    actions:['submit','reset'],
                    inline:true,
                    'label-width':'100px',
                    formConfig:[
                        { attr:'name',type:'input',label:'昵称'},
                        { attr:'admin',type:'radio',label:'管理员',data:[{value:0,label:'否'},{value:1,label:'是'}]},
                        
                    ]
                },
                addFormConfig:{
                    btn_group_center:'center',
                    'label-width':'100px',
                    inline:false,
                    actions:['submit','reset'],
                    formConfig:[
                        { attr:'account',type:'input',label:'账号',placeholder:"用于登录的账号名",is_required:true,rules:[numAndEn]},
                        { attr:'name',type:'input',label:'昵称',placeholder:"昵称",is_required:true},
                        { 
                            attr:'password',type:'input',label:'密码','min':6,
                            is_required:true,
                            'show-password':true,
                            placeholder:"输入后系统将自动加密该密码，请务必记住您的输入",
                            onbeforesubmit(val,data){
                                // console.log(val)
                                return jsMd5(val)
                                // return val
                            },
                            onbeforeupdate(val){
                                return ''
                            }
                        },
                        { attr:'admin',type:'radio',label:'管理员',data:[{value:0,label:'否'},{value:1,label:'是'}],value:0,param_type:'number'},
                    ]
                },
                tableConfig:[
                    // {
                    //     key:'id',
                    //     title:'id',
                    // },
                    {
                        key:'name',
                        title:'昵称',
                    },
                    {
                        key:'account',
                        title:'账号',
                    },
                    
                ]
            }
        }
    },
    methods:{
        
    }
}
</script>