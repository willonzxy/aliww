<template lang="pug">
    d2-container
        Curd(ref="curd" :config="config")
</template>
<script>
import Curd from '@/components/curd'
import { dataManagerApi } from '@/api/sys.data-contract-record.js';
import { dataManagerApi  as storeApi } from '@/api/sys.data-store.js';
import { deep_clone } from '@/components/curd/util';
import _fetch from '@/components/curd/util/fetch';
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
                title:'店铺协议管理',
                actions:['edit','delete'],

                searchBarConfig:{
                    btn_group_center:'center',
                    actions:['submit','reset'],
                    inline:true,
                    'label-width':'100px',
                    formConfig:[
                        { attr:'storeId',type:'autocomplete',label:'店铺名',
                        'trigger-on-focus':true,
                        async fetchSuggestions(qstring,cb){
                            let res = await _fetch(`${storeApi.select.api}?name=${qstring}`)
                            cb(res.data.map(i=>({value:i.name})))
                        },
                        async onbeforesubmit(val){
                            let res = await _fetch(`${storeApi.select.api}?name=${val}`)
                            res = res.data[0].id;
                            return res;
                        }},
                        { attr:'principleA',type:'input-number',label:'本金最小值',
                        change(val){
                                let principleB_desc = this.formConfig.filter(i => i.attr === 'principleB')[0];
                                principleB_desc.min = val;
                                if(this.formInline.principleB < val){
                                    this.formInline.principleB = val;
                                }
                            },onbeforesubmit(val){
                                if(val === 0){
                                    return undefined
                                }
                                return val
                            }},
                        { attr:'principleB',type:'input-number',label:'本金最大值',onbeforesubmit(val){
                                if(val === 0){
                                    return undefined
                                }
                                return val
                            }},
                        { attr:'commission',type:'input-number',label:'佣金',
                        onbeforesubmit(val){
                                if(val === 0){
                                    return undefined
                                }
                                return val
                            }},
                    ]
                },
                addFormConfig:{
                    btn_group_center:'center',
                    'label-width':'100px',
                    inline:true,
                    actions:['submit','reset'],
                    formConfig:[
                        { is_required:true,attr:'storeId',type:'autocomplete',label:'店铺名',
                        'trigger-on-focus':true,
                        async fetchSuggestions(qstring,cb){
                            let res = await _fetch(`${storeApi.select.api}?name=${qstring}`)
                            cb(res.data.map(i=>({value:i.name})))
                        },
                        async onbeforesubmit(val){
                            let res = await _fetch(`${storeApi.select.api}?name=${val}`)
                            res = res.data[0];
                            if(res === undefined){
                                this.$message.error('未找到相关店铺信息，添加失败')
                            }
                            return res.id;
                        }},
                        { attr:'principleA',type:'input-number',label:'本金最小值',
                        min:0,
                        change(val){
                                let principleB_desc = this.formConfig.filter(i => i.attr === 'principleB')[0];
                                principleB_desc.min = val;
                                if(this.formInline.principleB < val){
                                    this.formInline.principleB = val;
                                }
                            }},
                        { attr:'principleB',type:'input-number',label:'本金最大值',min:0,},
                        { attr:'commission',type:'input-number',label:'佣金',min:0,},
                        
                    ]
                },
                tableConfig:[
                    // {
                    //     key:'id',
                    //     title:'id',
                    // },
                    {
                        key:'storeName',
                        title:'店铺名',
                    },
                    {
                        key:'principleA',
                        title:'本金最小值',
                    },
                    {
                        key:'principleB',
                        title:'本金最大值',
                    },
                    {
                        key:'commission',
                        title:'佣金',
                    },
                    
                ]
            }
        }
    },
    methods:{
        
    }
}
</script>