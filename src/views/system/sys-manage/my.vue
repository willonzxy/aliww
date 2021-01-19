<template lang="pug">
    d2-container
        ecForm(ref="form" :config="config" @submit="updateInfo")
</template>
<script>
import ecForm from '@/components/curd/form'
import { dataManagerApi } from '@/api/sys.user.js';
import { deep_clone } from '@/components/curd/util';

import jsMd5 from 'js-md5'
import api from '@/api'
import _fetch from '@/components/curd/util/fetch';
import {createNamespacedHelpers} from 'vuex'
const { mapActions } = createNamespacedHelpers('d2admin/user')
export default {
    name:'myinfo',
    components:{
        ecForm,
    },
    data(){
        return {
            user_info:{},
            config:{
                title:'个人信息',
                // btn_group_center:'center',
                'label-width':'100px',
                inline:false,
                actions:['submit'],
                formConfig:[
                    { attr:'name',type:'input',label:'昵称',is_required:true,},
                    { attr:'account',type:'input',label:'账号',disabled:true},
                    { attr:'password',type:'input',label:'密码',
                    showPassword:true,
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
                ]
            }
        }
    },
    methods:{
        ...mapActions({
            setUserInfo:'set'
        }),
        appendInfo(data){
            this.$refs['form'].presetFormData = data;
        },
        async updateInfo(data){
                data = {
                    ...this.user_info,
                    ...data,
                };
            // console.log(data)
            delete data.account;
            let res = await _fetch({
                url:dataManagerApi.edit.api,
                method:dataManagerApi.edit.m,
                data
            })
            this.$message.success('success')
            this.getInfo()
            // this.appendInfo(deep_clone(data))
            // this.setUserInfo(deep_clone(data))
        },
        getInfo(){
            api.getSessionInfo()
            .then(res=>{
                // console.log(deep_clone(res))
                // console.log({res})
                this.user_info = deep_clone(res);
                this.setUserInfo(deep_clone(res))
                this.appendInfo(deep_clone(res))
            })
        }
    },
    beforeRouteEnter(to, from, next){
        // console.log(api)
        next(vm => {
            vm.getInfo()
            // access to component instance via `vm`
        })
    },
    // created(){
    //     this.getInfo()
    // }
}
</script>