<template lang="pug">
    div(class="display-inline-in-btn-inline")
        el-form-item(
            :class="inline ? 'mgb-10':''" 
            :label-width="widget_config['label-width']" 
            v-for="(widget_config,widget_index) in formConfig" 
            :prop="prevAttr ? prevAttr + (widget_config.attr.startsWith('_$$_') ? '' :'.'+widget_config.attr ) : (widget_config.attr.startsWith('_$$_') ? '' :widget_config.attr )" 
            :key="widget_config.attr+widget_config.internal_depth" 
            :rules="widget_config.rules")
            //- 字段含义解析
            template(#label)
                span {{widget_config.label}}
                //- span {{prevAttr ? prevAttr + (widget_config.attr.startsWith('_$$_') ? '' :'.'+widget_config.attr ) : (widget_config.attr.startsWith('_$$_') ? '' :widget_config.attr )}}
                el-tooltip(v-if="widget_config.explain" effect="light" :content="widget_config.explain" placement="top")
                    i(class="el-icon-question mgl-3 question-icon")
            //- 数组类型
            div(v-if="widget_config.param_type === 'array'")
                //- 对象数组类型
                div(
                    v-if="widget_config.children && (widget_config.children[0].param_type === 'object' || widget_config.children[0].param_type === 'array')" 
                    class="small-widget limit-widget-width" 
                    :style="{backgroundColor:generateBackgroundColor(widget_config.internal_depth),padding:'10px',borderRadius:'5px'}")
                    div(v-for="(sub_val,sub_index) in formInline[widget_config.attr]" :key="sub_index" class="mgt-5")
                        SubItem(
                            class="m-height-500" 
                            :inline="inline" 
                            :formConfig="widget_config.children" 
                            :formInline="sub_val" 
                            :prevAttr="prevAttr ? prevAttr + '.' + widget_config.attr+'.' + sub_index : widget_config.attr+'.' + sub_index"
                            :parentIsArrayPreset="true"
                            @change="attrValueChange"  
                            @array-change="attrArrayValueChange" 
                            @object-array-change="attrObjectArrayValueChange"
                            @object-change="attrObjectValueChange"
                            )
                        el-button(
                            v-if="formInline[widget_config.attr].length > 1" 
                            size="small" type="dashed" circle 
                            class="mgl-10 self-circle-btn" 
                            icon="el-icon-minus" 
                            @click.stop="removeItem(`${widget_config.attr}$$${sub_index}`)")
                        el-button(v-if="formInline[widget_config.attr].length > 1 && sub_index > 0"
                            size="small"
                            type="dashed"
                            circle
                            class="mgl-10 self-circle-btn"
                            icon="el-icon-top"
                            @click.stop="moveUpItem(`${widget_config.attr}$$${sub_index}`)")
                        el-button(
                            v-if="sub_index !== (formInline[widget_config.attr].length-1)"
                            size="small"
                            type="dashed"
                            circle
                            class="mgl-10 self-circle-btn"
                            icon="el-icon-bottom"
                            @click.stop="moveDownItem(`${widget_config.attr}$$${sub_index}`)")
                        el-button(
                            v-if="sub_index === formInline[widget_config.attr].length-1" size="small" 
                            type="primary" icon="el-icon-plus" circle 
                            class="mgl-10 self-circle-btn" 
                            @click="addItem(widget_config.attr,sub_val)")
                //- 普通数组类型
                div(
                    v-else-if="widget_config.children"
                    :style="{backgroundColor:generateBackgroundColor(widget_config.internal_depth),borderRadius:'5px',padding:'10px'}")
                    div(v-for="(sub_val,sub_index) in formInline[widget_config.attr]" :key="sub_index" class="array-item")
                        Widget(
                            :type="widget_config.children[0].type" 
                            :config="widget_config.children[0]"
                            v-model="formInline[widget_config.attr][sub_index]" 
                            :uploadUrl.sync="formInline[widget_config.attr][sub_index]"
                            @change="attrArrayValueChange(widget_config.attr,sub_index,$event)"
                            :on-success="(res)=>{ onArrayImgUploadSuccess(widget_config.attr,sub_index,res) }"
                            :on-error="onUploadError"
                            :before-upload="(file)=>{return beforeArrayImgUpload(widget_config.attr,sub_index,file)}"
                            )
                        el-button(
                            v-if="formInline[widget_config.attr].length > 0" 
                            size="small" type="dashed" 
                            circle class="mgl-10" icon="el-icon-minus" 
                            @click.stop="removeItem(`${widget_config.attr}$$${sub_index}`)"
                        )
                        el-button(v-if="formInline[widget_config.attr].length > 1 && sub_index > 0"
                          size="small"
                          type="dashed"
                          circle
                          class="mgl-10 self-circle-btn"
                          icon="el-icon-top"
                          @click.stop="moveUpItem(`${widget_config.attr}$$${sub_index}`)")
                        el-button(v-if="sub_index !== (formInline[widget_config.attr].length-1)"
                          size="small"
                          type="dashed"
                          circle
                          class="mgl-10 self-circle-btn"
                          icon="el-icon-bottom"
                          @click.stop="moveDownItem(`${widget_config.attr}$$${sub_index}`)")
                        el-button(
                            v-if="sub_index === formInline[widget_config.attr].length-1" 
                            size="small" type="primary" icon="el-icon-plus" circle 
                            class="mgl-10" @click.stop="addItem(widget_config.attr,sub_val)")
                    el-button(
                        v-if="!formInline[widget_config.attr].length" size="small" 
                        type="primary" icon="el-icon-plus" 
                        @click.stop="addItem(widget_config.attr)") 添加数据项
                div(v-else) 数组类型配置缺失：需配置children字段来声明数组子元素类型信息
            //- 非数组类型
            div(v-else)
                //- 对象类型
                div(
                    v-if="widget_config.param_type === 'object' || widget_config.type === 'object-tool'" 
                    class="small-widget" 
                    :style="{backgroundColor:generateBackgroundColor(widget_config.internal_depth),borderRadius: '5px',padding:'10px'}")
                    SubItem(
                        :inline="inline" 
                        :formConfig="widget_config.children" 
                        :parentIsArrayPreset="false"
                        :formInline="parentIsArrayPreset ? formInline : formInline[widget_config.attr]"
                        :prevAttr="prevAttr ? prevAttr + (widget_config.attr.startsWith('_$$_') ? '' :'.'+widget_config.attr ) : widget_config.attr "
                        @change="attrValueChange"  
                        @array-change="attrArrayValueChange" 
                        @object-array-change="attrObjectArrayValueChange"
                        @object-change="attrObjectValueChange"
                        )
                //- 普通控件
                div(v-else class="limit-widget-width")
                    Widget(
                        :type="widget_config.type"
                        :config="widget_config" 
                        v-model="formInline[widget_config.attr]"
                        :uploadUrl.sync="formInline[widget_config.attr]"
                        @change="attrValueChange(widget_config.attr,$event)" 
                        @select="attrSelectChange(widget_config.attr,$event)" 
                        :on-success="(res)=>{onUploadSuccess(widget_config.attr,res)}" 
                        :on-error="onUploadError"
                        :before-upload="(file)=>{return beforeUpload(widget_config.attr,file)}"
                        )
</template>
<script>
import Widget from '../../widget/is'
import * as assistMethods from './methods'
import { widgets_desc_for_selected } from '../../widget';
export default {
    name:'SubItem',
    components:{
        Widget
    },
    props:{
        inline:Boolean,
        formConfig:Array, // 控件数组
        formInline:Object,
        prevAttr:String,
        parentIsArrayPreset:{
            type:Boolean,
            default(){
                return false
            }
        }
    },
    methods:{
        ...assistMethods,
        generateBackgroundColor(depth = 0){
            let base = 247 - depth * 8;
            return `rgb(${base},${base},${base})`
        }
    }
}
</script>
<style lang="scss">
    .mgb-5{
        margin-bottom: 5px;
    }
    .mgt-5{
        margin-top: 5px;
    }
    .mgl-3{
        margin-left: 3px;
    }
    .mgl-10{
        margin-left: 10px !important
    }
    .mgr-10{
        margin-right: 10px !important
    }
    .small-widget{
        .el-input{
            width:154px;
        }
        .el-input-number{
            // size=middle
            // .el-input{
            //     width:180px;
            // }
            // size=small
            .el-input{
                width:130px;
            }
        }
    }
    .s-width{
        width:20%;
        min-width: 90px;
    }
    .question-icon{
        position: relative;
        z-index:10
    }
    .array-item{
        display:flex;
        margin-bottom:10px;
        flex-flow: row wrap;
        align-items: center;
        // .is-circle{
        //     width:26px;
        //     height: 26px;
        //     padding: 0;
        // }
    }
    .limit-widget-width{
        max-width: 820px;
    }

    
</style>