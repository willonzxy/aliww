<template lang="pug">
    d2-container
        Curd(ref="curd" :config="config")
</template>
<script>
import Curd from '@/components/curd'
import { dataManagerApi } from '@/api/sys.data-store.js';
import { deep_clone } from '@/components/curd/util';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('d2admin/user')
export default {
    name:'storeM',
    components:{
        Curd,
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    },
    watch:{
        userInfo:{
            handler(){
                // console.log(this.userInfo)
                if(!this.userInfo.admin){
                    this.config.actions.splice(0,2)
                    this.$set(this.config.addFormConfig,'disRender',true)
                }
            },
            immediate:true,
        }
    },
    data(){
        const that = this;
        return {
            config:{
                
                defaultColumns:true,
                api:dataManagerApi,
                title:'店铺管理',
                actions:['edit','delete'],

                searchBarConfig:{
                    btn_group_center:'center',
                    actions:['submit','reset'],
                    inline:true,
                    'label-width':'100px',
                    formConfig:[
                        { attr:'name',type:'input',label:'店铺名'},
                    ]
                },
                addFormConfig:{
                    btn_group_center:'center',
                    'label-width':'100px',
                    inline:false,
                    actions:['submit','reset'],
                    formConfig:[
                        { attr:'name',type:'input',label:'店铺名',},
                        
                    ]
                },
                tableConfig:[
                    {
                        key:'id',
                        title:'id',
                    },
                    {
                        key:'name',
                        title:'店铺名',
                    },
                    
                ]
            }
        }
    },
    methods:{
        
    }
}
</script>