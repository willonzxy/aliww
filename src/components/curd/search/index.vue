<template lang="pug">
    Form(ref="searchForm" :config="searchConfig" @submit="search" class="btn-inline")
        slot
</template>
<script>
import Form from '../form'
import { form_btn_style } from '../normalize'
export default {
    components:{
        Form
    },
    props:{
        config:Object
    },
    computed:{
        searchConfig(){
            const config = this.config
            return {
                // 随机一个表单名字
                title:~~((Math.random() + 1) * 1e6) + '-搜索栏',
                actions:['submit'],
                inline: true,
                btn_style:{
                    submit:form_btn_style.search,
                    reset:form_btn_style.searchBarResetBtn
                },
                ...config
            }
        }
    },
    methods:{
        search(val){
            this.$emit('search',val)
        }
    }
}
</script>
<style lang="scss">
    .btn-inline{
        .display-inline-in-btn-inline{
            display:inline
        }
    }
    
</style>