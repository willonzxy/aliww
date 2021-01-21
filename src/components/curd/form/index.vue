<template lang="pug">
    el-form(:inline="config.inline || false" :model="formInline" :label-width="config['label-width']" :label-position="config['label-position'] || 'right'" :ref="config.title" @submit.native.prevent)
        //- 有tab
        el-tabs(v-if="!config.collapse && tabs.length > 1" v-model="activityTab")
            el-tab-pane( v-for="(tab_name,tab_index) in tabs" :label="tab_name" :name="`${tab_index}`" :key="tab_index")
                SubItem(
                    class="m-height-500" 
                    :inline="formConfig.inline" 
                    :formConfig="filterTabFormConfig(tab_name)" 
                    :formInline.sync="formInline" 
                    @change="attrValueChange"  
                    @array-change="attrArrayValueChange" 
                    @object-array-change="attrObjectArrayValueChange" 
                    @object-change="attrObjectValueChange")
        el-collapse(v-else-if="config.collapse && tabs.length > 1" v-model="activityTab" style="margin-bottom:10px")
            el-collapse-item( v-for="(tab_name,tab_index) in tabs" :title="tab_name" :name="`${tab_index}`" :key="tab_index")
                SubItem(
                    class="m-height-500" 
                    :inline="formConfig.inline" 
                    :formConfig="filterTabFormConfig(tab_name)" 
                    :formInline.sync="formInline"
                    @change="attrValueChange"  
                    @array-change="attrArrayValueChange" 
                    @object-array-change="attrObjectArrayValueChange"
                    @object-change="attrObjectValueChange")
        //- 无tab
        SubItem(
            v-else
            class="m-height-500" 
            :inline="config.inline" 
            :formConfig="formConfig" 
            :formInline.sync="formInline" 
            @change="attrValueChange" 
            @select="attrSelectChange" 
            @array-change="attrArrayValueChange" 
            @object-array-change="attrObjectArrayValueChange" 
            @object-change="attrObjectValueChange")
        //- 按钮组
        span(:class="config.btn_group_center ? 'btn-group-center' : '' " :style="{'justify-content':config.btn_group_center, 'margin-top': '20px'}")
            el-form-item(v-if="config.actions.length")
                el-button(v-if="config.actions.includes('submit')" size="small" @click.stop="submit" native-type="submit" :type="btn_style.submit.type" :icon="btn_style.submit.icon") {{btn_style.submit.label}}
                el-button(v-if="config.actions.includes('reset')" size="small" @click.stop="reset" :type="btn_style.reset.type" :icon="btn_style.reset.icon") {{btn_style.reset.label}}
            el-form-item(v-if="dynamicActions.length")
                span(v-for="{type,label,icon,size,handler,show_condition} in dynamicActions" :key="label")
                    el-button(
                        v-if="show_condition ? show_condition(formInline) : true" 
                        :type="type || 'info'"
                        :size="size || 'small'"
                        :icon="icon || ''"
                        style="margin-left: 10px"
                        @click="()=>{injectThis(handler,formInline)}") {{label}}
            //- inline btn 插槽
            slot
</template>

<script>
import SubItem from './sub'
import * as assistMethods from './methods'
import { form_btn_style } from '../normalize.js'
import {
    deep_clone
} from '../util'
function parseString(str,preset){
    return typeof str === 'string' ? JSON.parse(str || preset) : str 
}
export default {
    name:'common-form',
    components: {
        SubItem
    },
    props: {
        config:Object
    },
    computed:{
        btn_style(){
            // 设置btn_style默认值
            let config = this.config;
            let btn_style = config.btn_style;
            if(!btn_style){
                btn_style = form_btn_style
            }else{
                btn_style = {
                    ...form_btn_style,
                    ...btn_style
                }
            }
            return btn_style
        },
        dynamicActions() {
            return this.config.actions.filter(item => typeof item === 'object')
        }
    },
    watch:{
        'config.formConfig':{
            deep:true,
            immediate:true,
            handler(){
                this.handleFormConfig(this.config.title, deep_clone(this.config.formConfig));
            }
        },
        presetFormData(form_data){
            this.formInline = form_data;
            /** 
             * 针对场景：
             * 1、新增了一个配置，然后修改保存的旧值会出现的情况
             * 2、旧值是个字符串类型，而新的配置值已经变成了数组类型了
             * 3、保存的旧值要剔除多余的
            */
            // for(let item of this.formConfig){
            //     let { attr , type , value , data , param_type } = item;
            //     // 1
            //     if(form_data[attr] === undefined){
            //         switch(param_type){
            //             case 'array':this.$set(form_data,attr,parseString(value,'[1]'));break;
            //             case 'boolean':this.$set(form_data,attr,parseString(value,'false'));break;
            //             default:this.$set(form_data,attr,value); break;
            //         }
            //         switch(type){
            //             case 'object-array-tool':this.$set(form_data,attr,parseString(value));break;
            //             case 'object-tool':this.$set(form_data,attr,parseString(value));break;
            //             default:break;
            //         }
            //     }
            //     // 2
            //     else{
            //         switch(param_type){
            //             case 'array':!Array.isArray(form_data[attr]) && this.$set(form_data,attr,[form_data[attr]]);break;
            //             default:break;
            //         }
            //         // 里面的映射值可能会变
            //         if(type === 'object-tool'){
            //             let preset_val = parseString(value,'{}')
            //             // 需要配置的映射值少了，删除旧保存值的那些值
            //             for(let _mapAttr in form_data[attr]){
            //                 if(!data.some(ele=>ele.value === _mapAttr)){
            //                     this.$delete(form_data[attr],_mapAttr)
            //                 }
            //             }
            //             // 映射值多了，则新增一下
            //             for(let { value:_mapAttr } of data ){
            //                 if(form_data[attr][_mapAttr] === undefined){
            //                     this.$set(form_data[attr],_mapAttr,preset_val[_mapAttr])
            //                 }
            //             }
            //         }
            //         // 逻辑同上
            //         if(type === 'object-array-tool'){
            //             let preset_val = typeof value === 'string' ? parseString(value,'[{}]') : value
            //             for(let item of form_data[attr]){
            //                 for(let _mapAttr in item){
            //                     if(!data.some(ele=>ele.value === _mapAttr)){
            //                         this.$delete(item,_mapAttr)
            //                     }
            //                 }
            //             }

            //             for(let { value:_mapAttr } of data ){
            //                 for(let item of form_data[attr]){
            //                     if(item[_mapAttr] === undefined){
            //                         this.$set(item,_mapAttr,preset_val[0][_mapAttr])
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }

            // 剔除旧值
            for( let attr in form_data ){
                if(!this.formConfig.some(i=>i.attr === attr)){
                    this.$delete(form_data,attr)
                }
            }
        }
    },
    data() {
        const {
            config
        } = this;
        return {
            formConfig:[],
            attrs:[],
            formInline:{},
            presetFormData:{},
            tabs:[],
            with_tabs_data:[],
            beforeSubmit:{}, 
            lazyData:{},
            activityTab:'0',
        }
    },
    methods: {
        ...assistMethods,
        filterTabFormConfig(tab_name){
            let result = this.formConfig.filter(i=>!!i).filter(i=>{
                i.tab_name = i.tab_name ? i.tab_name.length ? i.tab_name : '基本配置项' : '基本配置项'
                return i.tab_name === tab_name
            })
            return result
        },
        reset(){
            this.$refs[this.config.title].resetFields();
            /** 剔除包含custom_item_appended标识的字段，还原基础的配置表单*/
            for(let [index,item] of this.formConfig.entries()){
                if(item.custom_item_appended){
                    this.formConfig.splice(index,1)
                }
            }
        },
        injectThis(fn,data){
            fn && fn.call(this,data)
        }
    },
    created() {
        this.getLazyData();
    },
}
</script>
<style lang="scss" scope>
  .mgb-5{
    margin-bottom: 5px;
  }
  .btn-group-center{
      display: flex;
      justify-content: center;
  }
  .m-height-500 {
    max-height: 530px;
    overflow: auto;
  }
</style>
