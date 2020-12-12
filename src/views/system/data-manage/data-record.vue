<template lang="pug">
    d2-container
        Curd(ref="curd" :config="config")
</template>
<script>
import Curd from '@/components/curd'
import { dataRecordApi } from '@/api/sys.data-manage.js';

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
                api:dataRecordApi,
                title:'数据',
                actions:['edit','delete'],

                searchBarConfig:{
                    btn_group_center:'center',
                    actions:['submit','reset'],
                    inline:true,
                    'label-width':'100px',
                    formConfig:[
                        { attr:'postMan',type:'input',label:'放单人'},
                        { attr:'shopName',type:'input',label:'店铺名'},
                        { attr:'orderId',type:'input',label:'订单号'},
                        { attr:'wangwangId',type:'input',label:'旺旺号'},
                        { attr:'principle',type:'number-input',label:'本金',min:0},
                        { attr:'commission',type:'number-input',label:'佣金',min:0},
                        { attr:'webChatId',type:'input',label:'微信号'},
                        { attr:'blockList',type:'switch',label:'黑名单',value:'false'},
                        { attr:'createTime',type:'datetime',label:'创建时间',rangeType:true,},
                    ]
                },
                addFormConfig:{
                    btn_group_center:'center',
                    'label-width':'100px',
                    inline:false,
                    actions:['submit','reset'],
                    formConfig:[
                        { attr:'postMan',type:'input',label:'放单人'},
                        { attr:'shopName',type:'input',label:'店铺名'},
                        { attr:'orderId',type:'input',label:'订单号'},
                        { attr:'wangwangId',type:'input',label:'旺旺号'},
                        { attr:'principle',type:'number-input',label:'本金',min:0},
                        { attr:'commission',type:'number-input',label:'佣金',min:0},
                        { attr:'webChatId',type:'input',label:'微信号'},
                        { attr:'blockList',type:'switch',label:'黑名单',value:'false'},
                        { attr:'memo',type:'textarea',label:'备注'},
                    ]
                },
                tableConfig:[
                    {
                        key:'id',
                        title:'序号',
                    },
                    {
                        key:'postMan',
                        title:'放单人',
                    },
                    {
                        key:'shopName',
                        title:'店铺名',
                    },
                    {
                        key:'orderId',
                        title:'订单号'
                    },
                    {
                        key:'wangwangId',
                        title:'旺旺号',
                    },
                    {
                        key:'principle',
                        title:'本金',
                    },
                    {
                        key:'commission',
                        title:'佣金',
                    },
                    {
                        key:'webChatId',
                        title:'微信号',
                    },
                    {
                        key:'memo',
                        title:'备注',
                    }
                ]
            }
        }
    },
    methods:{
        
    }
}
</script>