<template lang='pug'>
    el-popover(trigger="hover" placement="top")
      el-input(v-model="innerUploadUrl" size="mini"
        @input="$emit('update:uploadUrl',innerUploadUrl)")
      el-upload(slot="reference" style="position: relative;" v-on="$listeners" v-bind.sync="conf")
        div(class="xy-center full")
            i(v-if="!uploadUrl" class="el-icon-upload")
            img(v-if="uploadUrl" :src="uploadUrl")
            span(v-if="uploadUrl" title="删除" class="corner-marker-error xy-center" @click.stop="remove")
                i(class="el-icon-close")
        el-button(circle size="mini" icon="fa fa-external-link-square" v-show="uploadUrl"
          style="position: absolute;left: -10px; top: -10px;"
          @click.stop="open(uploadUrl)")
            
</template>
<script>
import util from '@/libs/util'
    import { uploadApi } from '../normalize'
    export const widget_desc = {
        name: {value:'upload',label:'资源上传'}
    }
    export default {
        props: {
            config: {
                type:Object,
                default(){
                    return {}
                }
            },
            uploadUrl:String,
        },
        methods:{
            remove(){
                this.$emit('update:uploadUrl','')
            },
            open (url) {
              window.open(url)
            }
        },
        computed: {
            conf() {
                const config = this.config;
                delete config.data
                return {
                    ...this.$attrs,
                    action: uploadApi,
                    headers: {
                      'X-Token': util.cookies.get('token')
                    },
                    drag: true,
                    'with-credentials': true,
                    'show-file-list':false,
                    ...config,
                    name: 'file' || config.attr,
                }
            }
        },
        watch: {
          uploadUrl (val, oldVal) {
            if (val === oldVal) return;
            this.innerUploadUrl = val;
          }
        },
        data () {
          return {
            innerUploadUrl: ''
          }
        }
    }
</script>
<style lang="scss" scope>
    .el-upload{
        width:100px;
        height:50px;
        img{
            max-width: 100%;
            height:auto;
            max-height: 100%;
            object-fit: contain;
        }
        .el-upload-dragger{
            width:100%;
            height:100%;
            border:1px dashed #c4dee8;
            overflow: visible;
            background: #f6f9fb;
            .el-icon-upload{
                font-size:25px;
                line-height: 50px;
                color: #3399ff;
                margin:0;
            }
        }
    }
    /** 右上角脚标 */
    .corner-marker-error{
        position: absolute;
        top:0px;
        right:0px;
        width:14px;
        height: 14px;
        transform: translate(50%,-50%);
        background-color:#e00d10;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
    }
</style>