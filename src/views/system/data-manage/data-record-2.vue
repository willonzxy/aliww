<template lang="pug">
    d2-container
        Curd(ref="curd" :config="config")
            template(#inline_btn)
                el-button(title="刷新表格数据" class="add-btn" size="small" type="primary" icon="el-icon-refresh" @click="$refs['curd'].getTableData()")
            template(#searchbar-bottom)
                //- el-collapse(v-model="activeNames")
                //-     //- el-card(shadow="never")
                //-     el-collapse-item(title="快速解析" name="quick")
                Form(ref="form" :config="addFormConfig" @keyup.enter.native="submit")
                Form(ref="quick_add_form" :config="quickAddFormConfig" @submit="parseStrToAddForm")
                div(style="text-align:center")
                    el-button(type="primary" icon="el-icon-check" size="small"  @click="submit") 提交
                    el-button(icon="el-icon-delete" size="small" @click="resetAllForm") 清空
        //- el-dialog(:visible.sync="quick_add" title="快速新增" width="720px" custom-class="fix-dialog-body")
        //-     Form(ref="quick_add_form" :config="quickAddFormConfig" @submit="parseStrToAddForm")
</template>
<script>
import Curd from '@/components/curd'
import Form from '@/components/curd/form'
import { dataManagerApi } from '@/api/sys.data-manage.js';
import { dataManagerApi as getUserApi } from '@/api/sys.user.js';
import { dataManagerApi as getStoreApi } from '@/api/sys.data-store.js';
import { deep_clone } from '@/components/curd/util';
import _fetch from '@/components/curd/util/fetch';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('d2admin/user')
import hotkeys from 'hotkeys-js'
export default {
    name:'DataRecord2',
    components:{
        Curd,
        Form
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
            activeNames:'quick',
            // quick_add:false,
            quickAddFormConfig:{
                title:'数据解析',
                btn_group_center:'center',
                'label-width':'100px',
                inline:false,
                actions:[],
                formConfig:[
                    { rows:4,change_submit:true, attr:'str',type:'textarea',label:'数据解析',placeholder:'1.请以+作为分隔符\n2.解析规则：店铺名+订单号+旺旺号+本金+佣金+微信号+黑名单+备注\n3.其中店铺名支持模糊匹配，而黑名单请用1或0表示\n4.此输入框失焦后，稍等片刻数据就会提交到上面的表单'},
                ]
            },
            addFormConfig:{
                title:'数据录入',
                    btn_group_center:'center',
                    'label-width':'100px',
                    inline:true,
                    actions:[],
                    formConfig:[
                        // { attr:'userId',type:'lazy-select',label:'放单人',disabled_on_add:true,api:getUserApi.select.api,dataIndex:'id',show:'name'},
                        { is_required:true,attr:'storeId',type:'select',label:'店铺名',
                        show:'name',dataIndex:'id',
                        placeholder:'支持键入搜索',
                        remote:true,
                        async remoteMethod(qstring){
                            that.refreshStoreNameSelectData(qstring);
                        }},
                        { is_required:true,attr:'orderId',type:'input',label:'订单号'},
                        { is_required:true,attr:'wangwangId',type:'input',label:'旺旺号'},
                        // { attr:'principleA',type:'number-input',label:'本金最小值',min:0,
                        //     change(val){
                        //         let principleB_desc = this.formConfig.filter(i => i.attr === 'principleB')[0];
                        //         principleB_desc.min = val;
                        //         if(this.formInline.principleB < val){
                        //             this.formInline.principleB = val;
                        //         }
                        //     }
                        // },
                        { is_required:true,attr:'principle',type:'number-input',label:'本金',min:0},
                        // { attr:'commissionA',type:'number-input',label:'佣金最大值',min:0,
                        //     change(val){
                        //         let commissionB = this.formConfig.filter(i => i.attr === 'commissionB')[0];
                        //         commissionB.min = val;
                        //         if(this.formInline.commissionB < val){
                        //             this.formInline.commissionB = val;
                        //         }
                        //     }
                        // },
                        { is_required:true,attr:'commission',type:'number-input',label:'佣金',min:0},
                        { is_required:true,attr:'weChatId',type:'input',label:'微信号'},
                        { attr:'black',type:'radio',label:'黑名单',param_type:'number',data:[{value:1,label:'是'},{value:0,label:'否'}]},
                        { attr:'memo',type:'textarea',label:'备注'},
                    ]
                },
            config:{
                // defaultColumns:true,
                ab_export:true,
                api:dataManagerApi,
                title:'数据',
                actions:['edit','delete'],
                // searchBarConfig:{
                //     btn_group_center:'center',
                //     actions:['submit','reset'],
                //     inline:true,
                //     'label-width':'100px',
                //     formConfig:[
                //         { attr:'postMan',type:'input',label:'放单人'},
                //         { attr:'storeName',type:'input',label:'店铺名'},
                        
                //         { attr:'orderId',type:'input',label:'订单号'},
                //         { attr:'wangwangId',type:'input',label:'旺旺号'},
                //         { attr:'principleA',type:'number-input',label:'本金最小值',min:0,
                //         change(val){
                //                 let principleB_desc = this.formConfig.filter(i => i.attr === 'principleB')[0];
                //                 principleB_desc.min = val;
                //                 if(this.formInline.principleB < val){
                //                     this.formInline.principleB = val;
                //                 }
                //             },
                //             onbeforesubmit(val){
                //                 if(val === 0){
                //                     return undefined
                //                 }
                //                 return val
                //             }},
                //         { attr:'principleB',type:'number-input',label:'本金最大值',min:0,
                //             onbeforesubmit(val){
                //                 if(val === 0){
                //                     return undefined
                //                 }
                //                 return val
                //             }},
                //         { attr:'commissionA',type:'number-input',label:'佣金最小值',min:0,
                //             onbeforesubmit(val){
                //                 if(val === 0){
                //                     return undefined
                //                 }
                //                 return val
                //             },
                //         change(val){
                //                 let commissionB = this.formConfig.filter(i => i.attr === 'commissionB')[0];
                //                 commissionB.min = val;
                //                 if(this.formInline.commissionB < val){
                //                     this.formInline.commissionB = val;
                //                 }
                //             }},
                //         { attr:'commissionB',type:'number-input',label:'佣金最大值',min:0,
                //             onbeforesubmit(val){
                //                 if(val === 0){
                //                     return undefined
                //                 }
                //                 return val
                //             }},
                //         { attr:'weChatId',type:'input',label:'微信号'},
                //         { attr:'black',type:'radio',label:'黑名单',param_type:'number',data:[{value:1,label:'是'},{value:0,label:'否'}]},
                //         { attr:'createTime',type:'datetime',label:'创建时间',rangeType:true,
                //         'value-format':'yyyy/MM/dd HH:mm:ss',
                //         format:'yyyy/MM/dd HH:mm:ss',
                //             onbeforesubmit(val,data){
                //                 // console.log(val)
                //                 let [ a,b ] = val;
                //                 data.createTimeA = a
                //                 data.createTimeB = b;
                //                 return undefined
                //             }
                //         },
                //     ]
                // },
                addFormConfig:{
                    disRender:true,
                    btn_group_center:'center',
                    'label-width':'100px',
                    inline:false,
                    actions:['submit','reset'],
                    formConfig:[
                        { attr:'userId',type:'lazy-select',label:'放单人',disabled_on_add:true,api:getUserApi.select.api,dataIndex:'id',show:'name'},
                        {is_required:true,attr:'storeId',type:'select',label:'店铺名',
                        placeholder:'支持键入搜索',
                        show:'name',dataIndex:'id',
                        remote:true,
                        async remoteMethod(qstring){
                            let res = await _fetch(`${getStoreApi.select.api}?name=${qstring}`)
                            let index = that.config.addFormConfig.formConfig.findIndex(i=>i.attr === 'storeId')
                            let config = deep_clone(that.config.addFormConfig.formConfig[index]);
                            config.data = res.data;
                            //that.config.addFormConfig.formConfig.splice(index,1,config)
                            that.$refs['curd'].$refs['form'].formConfig.splice(index,1,config)
                        }
                        },
                        { is_required:true,attr:'orderId',type:'input',label:'订单号'},
                        { is_required:true,attr:'wangwangId',type:'input',label:'旺旺号'},
                        // { attr:'principleA',type:'number-input',label:'本金最小值',min:0,
                        //     change(val){
                        //         let principleB_desc = this.formConfig.filter(i => i.attr === 'principleB')[0];
                        //         principleB_desc.min = val;
                        //         if(this.formInline.principleB < val){
                        //             this.formInline.principleB = val;
                        //         }
                        //     }
                        // },
                        { is_required:true,attr:'principle',type:'number-input',label:'本金',min:0},
                        // { attr:'commissionA',type:'number-input',label:'佣金最大值',min:0,
                        //     change(val){
                        //         let commissionB = this.formConfig.filter(i => i.attr === 'commissionB')[0];
                        //         commissionB.min = val;
                        //         if(this.formInline.commissionB < val){
                        //             this.formInline.commissionB = val;
                        //         }
                        //     }
                        // },
                        { is_required:true,attr:'commission',type:'number-input',label:'佣金',min:0},
                        { is_required:true,attr:'weChatId',type:'input',label:'微信号'},
                        { attr:'black',type:'radio',label:'黑名单',param_type:'number',data:[{value:1,label:'是'},{value:0,label:'否'}]},
                        { attr:'memo',type:'textarea',label:'备注'},
                    ]
                },
                tableConfig:[
                    // {
                    //     key:'id',
                    //     title:'id',
                    // },
                    {
                        key:'postMan',
                        title:'放单人',
                        export_ignore:true,
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
                        export_ignore:true,
                    },
                    {
                        key:"black",
                        title:"黑名单",
                        export_ignore:true,
                    },
                    {
                        key:'memo',
                        title:'备注',
                    },
                    {
                        key: 'createTime',
                        title: '创建时间',
                        export_ignore:true,
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
        async refreshStoreNameSelectData(qstring){
            let res = await _fetch(`${getStoreApi.select.api}?name=${qstring}`)
            let index = this.addFormConfig.formConfig.findIndex(i=>i.attr === 'storeId')
            let config = deep_clone(this.addFormConfig.formConfig[index]);
            config.data = res.data;
            // this.$refs['form'].formConfig.splice(index,1,config);
            this.addFormConfig.formConfig.splice(index,1,config)
        },
        resetAllForm(){
            this.$refs['form'].reset();
            this.$refs['quick_add_form'].reset();
        },
        async submit(){
            try {
                let data = this.$refs['form'].formInline;
                // let store_info = await _fetch({
                //     url:getStoreApi.select.api + '?name='+data.storeId,
                // });
                // console.log(store_info)
                // store_info = store_info.data[0];
                // if(!store_info || !store_info.id){
                //     this.$message.error('未找到第'+(index+1)+'行数据的店铺id,该行数据解析失败')
                //     return
                // }
                // data.storeId = store_info.id;
                await _fetch({
                    url:dataManagerApi.add.api,
                    method:dataManagerApi.add.m,
                    data
                })
                this.$message.success('新增成功');
                this.$refs['curd'].getTableData()
            } catch (error) {
                console.log(error)
                this.$message.error('新增失败')
            }
        },
        async changeStoreIdByName(data){
            let store_info = await _fetch({
                url:getStoreApi.select.api + '?name='+data.storeId,
            });
            console.log(store_info)
            store_info = store_info.data[0];
            if(!store_info || !store_info.id){
                this.$message.error('未找到第'+(index+1)+'行数据的店铺id,该行数据解析失败')
                return
            }
            data.storeId = store_info.id;
            return data
        },
        async parseStrToAddForm(data){
           // console.log(data)
            let { str } = data;
            let rows = str.split('/n');
            rows.length = 1;
            let item = {};
            for(let [i,line] of rows.entries()){
                item = this.parseStr(line)
                // await this.send(item,i)
            }
            await this.refreshStoreNameSelectData(item.storeId)
            await this.changeStoreIdByName(item)
            item.black = +item.black;
            
            // this.quick_add = false;
            // this.$message.success('解析完成')
            this.$refs['form'].presetFormData = item;
            //this.$refs['curd'].getTableData();
        },
        parseStr(line){
            let raw = line.split('+');
            let item = {};
            let config = this.addFormConfig.formConfig.filter(i=>i.attr !== 'userId');
            for(let [j,ele] of config.entries()){
                let { attr } = ele;
                item[attr] = raw[j]
            }
            return item;
        },
        
    },
    mounted() {
        hotkeys('enter', event => {
            event.preventDefault()
            this.submit()
        })
    },
    beforeDestroy () {
        hotkeys.unbind('enter')
    },
}
</script>
<style>
    .red{
        color:red;
    }
</style>