<template lang="pug">
    d2-container
        Curd(ref="curd" :config="config")
</template>
<script>
import Curd from '@/components/curd'
import { dataManagerApi } from '@/api/sys.data-manage.js';
import { deep_clone } from '@/components/curd/util';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('d2admin/user')
export default {
    name:'DataRecord',
    components:{
        Curd,
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    },
    watch:{
        // userInfo:{
        //     handler(){
        //         console.log(this.userInfo)
        //         // if(!this.userInfo.admin){
        //         //     this.config.actions.splice(0,2)
        //         //     this.$set(this.config.addFormConfig,'disRender',true)
        //         // }
        //         // this.config.addFormConfig.formConfig[0].value = this.userInfo.
        //     },
        //     immediate:true,
            
        // }
    },
    data(){
        const that = this;
        return {
            config:{
                // defaultColumns:true,
                ab_export:true,
                api:dataManagerApi,
                title:'数据',
                actions:['edit','delete'],
                searchBarConfig:{
                    btn_group_center:'center',
                    actions:['submit','reset'],
                    inline:true,
                    'label-width':'100px',
                    formConfig:[
                        { attr:'postMan',type:'input',label:'放单人',hidden:true,disabled:true,edit_no_disabled:true},
                        { attr:'shopName',type:'input',label:'店铺名'},
                        { attr:'orderId',type:'input',label:'订单号'},
                        { attr:'wangwangId',type:'input',label:'旺旺号'},
                        { attr:'principleA',type:'number-input',label:'本金最小值',min:0,
                        change(val){
                                let principleB_desc = this.formConfig.filter(i => i.attr === 'principleB')[0];
                                principleB_desc.min = val;
                                if(this.formInline.principleB < val){
                                    this.formInline.principleB = val;
                                }
                            }},
                        { attr:'principleB',type:'number-input',label:'本金最大值',min:0},
                        { attr:'commissionA',type:'number-input',label:'佣金最小值',min:0,
                        change(val){
                                let commissionB = this.formConfig.filter(i => i.attr === 'commissionB')[0];
                                commissionB.min = val;
                                if(this.formInline.commissionB < val){
                                    this.formInline.commissionB = val;
                                }
                            }},
                        { attr:'commissionB',type:'number-input',label:'佣金最大值',min:0,},
                        { attr:'weChatId',type:'input',label:'微信号'},
                        { attr:'black',type:'switch',label:'黑名单',param_type:'boolean'},
                        { attr:'createTime',type:'datetime',label:'创建时间',rangeType:true,
                        'value-format':'yyyy/MM/dd HH:mm:ss',
                        format:'yyyy/MM/dd HH:mm:ss',
                            onbeforesubmit(val,data){
                                // console.log(val)
                                let [ a,b ] = val;
                                data.createTimeA = a
                                data.createTimeB = b;
                                return undefined
                            }
                        },
                    ]
                },
                addFormConfig:{
                    btn_group_center:'center',
                    'label-width':'100px',
                    inline:false,
                    actions:['submit','reset'],
                    formConfig:[
                        { attr:'postMan',type:'input',label:'放单人',},
                        { attr:'storeName',type:'input',label:'店铺名'},
                        { attr:'orderId',type:'input',label:'订单号'},
                        { attr:'wangwangId',type:'input',label:'旺旺号'},
                        // { attr:'principleA',type:'number-input',label:'本金最小值',min:0,
                        //     change(val){
                        //         let principleB_desc = this.formConfig.filter(i => i.attr === 'principleB')[0];
                        //         principleB_desc.min = val;
                        //         if(this.formInline.principleB < val){
                        //             this.formInline.principleB = val;
                        //         }
                        //     }
                        // },
                        { attr:'principle',type:'number-input',label:'本金',min:0},
                        // { attr:'commissionA',type:'number-input',label:'佣金最大值',min:0,
                        //     change(val){
                        //         let commissionB = this.formConfig.filter(i => i.attr === 'commissionB')[0];
                        //         commissionB.min = val;
                        //         if(this.formInline.commissionB < val){
                        //             this.formInline.commissionB = val;
                        //         }
                        //     }
                        // },
                        { attr:'commission',type:'number-input',label:'佣金',min:0},
                        { attr:'weChatId',type:'input',label:'微信号'},
                        { attr:'black',type:'switch',label:'黑名单',param_type:'boolean'},
                        { attr:'memo',type:'textarea',label:'备注'},
                    ]
                },
                tableConfig:[
                    {
                        key:'id',
                        title:'id',
                    },
                    {
                        key:'postMan',
                        title:'放单人',
                    },
                    {
                        key:'storeName',
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
                        sortable:true,
                    },
                    // {
                    //     key:'principleB',
                    //     title:'本金最大值',
                    //     sortable:true,
                    // },
                    {
                        key:'commission',
                        title:'佣金',
                        sortable:true,
                    },
                    // {
                    //     key:'commissionB',
                    //     title:'佣金最大值',
                    //     sortable:true,
                    // },
                    {
                        key:'weChatId',
                        title:'微信号',
                    },
                    {
                        key:"black",
                        title:"黑名单"
                    },
                    {
                        key:'memo',
                        title:'备注',
                    },
                    {
                        key: 'createTime',
                        title: '创建时间'
                    },
                    // {
                    //     key: 'updateTime',
                    //     title: '更新时间'
                    // },
                ],
                // onbeforerender(data){
                //     // console.log(data)
                //     data.forEach(i => {
                //         for(let key in i){
                //             if(typeof i[key] === 'boolean'){
                //                 // if(i[key] === false){
                //                 //     i[key] = '-'
                //                 // }else{
                //                 //     i[key] = '是'
                //                 // }
                //                 i[key] = true;
                //             }
                //         }
                //     });
                //     return data
                // }
            }
        }
    },
    methods:{
        
    }
}
</script>
<style>
    .red{
        color:red;
    }
</style>