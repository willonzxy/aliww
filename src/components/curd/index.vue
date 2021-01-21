<template lang="pug">
    div(v-loading="loading")
      el-card(shadow="never" style="margin-bottom: 10px;")
        slot(name="breadcrumb")
        //- 搜索栏
        SearchBar(ref="searchbar" v-if="config && config.searchBarConfig" :config="config.searchBarConfig" @search="search")
            span
                span(v-for="{type,label,icon,size,handler,show_condition,name } in searchBarGlobalDynamicActions" :key="label")
                    el-button(
                        v-if="show_condition ? ()=>{injectThis(show_condition)} : showSearchBarAction(name) " 
                        :type="type || 'info'"
                        :size="size || 'small'"
                        :icon="icon || ''"
                        @click="()=>{injectThis(handler)}") {{label}}
                slot(name="searchbar")
        div
            slot(name="searchbar-bottom")
      //- add弹窗
      el-dialog(
        @opened="btn_loading = false"
        :visible.sync="modal_show" 
        width='920px' 
        custom-class="fix-dialog-body" 
        @closed="modalClose")
        template(#title)
            span {{`${config && config.addFormConfig && config.addFormConfig.title || (config && config.title)} ${editStatus ? '- 编辑' : '- 新增'}`}}
            el-tooltip(v-if="config && config.addFormConfig && config.addFormConfig.wiki" content="点击跳转到配置说明文档" effect="light" placement="right")
                el-link(:href="config.addFormConfig.wiki" target="_blank" :underline="false")
                    i(class="mgl-10 el-icon-question")
        Form(ref="form" :config="addFormConfig" @submit="submit")
      //- 数据列表
      el-card(shadow="hover")
        el-button(class="reload-btn" v-if="config && config.reloadCache" size="small" type="success" plain icon="el-icon-refresh" @click.stop="reloadDataCache") 缓存
        el-button(:loading="btn_loading" class="add-btn" v-if="config && config.addFormConfig && !config.addFormConfig.disRender" size="small" type="primary" icon="el-icon-plus" @click.stop="openDialog") 新增
        slot(name="inline_btn")
        

        el-button(v-if="!config.ab_export" class="add-btn" size="small" type="success" icon="el-icon-download" @click.stop="exportExcel") 导出
        template(v-else)
            el-button(v-if="!userInfo.admin" class="add-btn" size="small" type="success" icon="el-icon-download" @click.stop="exportExcelB") 导出
            el-button(v-if="userInfo.admin" class="add-btn" size="small" type="success" icon="el-icon-download" @click.stop="exportExcelA") 商家数据导出
            el-button(v-if="userInfo.admin" class="add-btn" size="small" type="success" icon="el-icon-download" @click.stop="exportExcelB") 鱼塘数据导出
        
        //- el-button(class="add-btn" size="small" type="success" icon="el-icon-upload" @click.stop="upload_excel_dialog = true") 解析
        Table(ref="table" :config="tableConfig" @selection-rows-change="handleSelectionChange" @edit="insertEntityDataReadyToEdit" @remove="remove" @log="checkLog" @pass="pass" @setTime="setPublishTime" @weight="toWeightTop")
        //- 分页
        Pagination(:config="paginationConfig" @size-change="onPageSizeChange" @current-change="onPageChange")
      
      el-dialog(:visible.sync="upload_excel_dialog" title="解析excel文件" width="520px" custom-class="fix-dialog-body")
        el-upload(
            class="" 
            multiple
            drag
            name="excel" 
            :with-credentials="true"
            :action="parseExcelApi" 
            :on-success="onUploadExcelSuccess"
            )
            i(class="el-icon-upload")
            div(class="el-upload__text")
                | 将文件拖到此处，或
                em 点击上传
</template>
<script>
import SearchBar from './search'
import Form from './form'
import Table from './table'
import Pagination from './pagination'
import { form_btn_style,searchBarGlobalDynamicActions, pubTimeFormConfig } from './normalize'
import qs from 'querystring'
import _fetch from './util/fetch'
import _URL from 'url'
import { deep_clone } from './util'
// import LogTable from './table/logTable'
// import { checkDataApi } from '@/api/sys.public'
import { exportExcelApiA,exportExcelApiB,parseExcelApi } from '@/api/sys.excel'
import { createNamespacedHelpers} from 'vuex'
import dayjs from 'dayjs'
import { recurMerge } from './form/methods/formConfigHandle'
import XLSX from 'xlsx'
// import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('d2admin/user')
export default {
    name:'common-curd',
    components:{
        SearchBar,
        Form,
        Table,
        Pagination,
        // LogTable
    },
    props:{
        config:Object
    },
    data(){
        return {
            upload_excel_dialog:false,
            parseExcelApi:parseExcelApi,
            btn_loading:false,
            loading: false,
            // 预发布
            pubtime_show: false,
            pubTimeFormConfig,
            pubtime_id: null,
            // 操作日志
            log_show: false,
            log_id: null,
            // api:this.config.api,
            search_data:{},
            searchBarGlobalDynamicActions,
            addFormConfig:{},
            tableConfig:{},
            modal_show:false,
            pageSize:10,
            pageNum:1,
            paginationConfig:{
                total:0
            },
            editStatus:false,
        }
    },
    watch:{
        config:{
            deep:true,
            immediate:true,
            handler(){
                console.log('config change')
                this.addFormConfig = this.handleAddFormConfig()
                this.tableConfig = this.handleTableConfig()
                this.api && this.getTableData();
            }
        }
    },
    computed:{
        api(){
            return this.config && this.config.api;
        },
        // ...mapState('system/auth', ['m_id'])
        ...mapGetters([
            'userInfo'
        ]),
    },
    methods:{
        handleSelectionChange(val){
            this.selectedRows = val
        },
        async exportExcel(){
            let data = this.tableConfig.dataSource;
            // if(this.selectedRows && this.selectedRows.length){
            //     data = this.selectedRows
            // }
            if(!data.length){
                this.$message.error('数据为空')
                return
            }
            let tableHeader = this.config.tableConfig.map(i=>i.title)
            let tableHeaderMap = {};
            this.config.tableConfig.forEach(i=>{
                tableHeaderMap[i.title] = i.key
            })
            let xlsx = [
                tableHeader
            ]
            data.forEach(j=>{
                let item = [];
                tableHeader.forEach(title=>{
                    let key = tableHeaderMap[title];
                    for(let attr in j){
                        // console.log({title,key})
                        // console.log(key)
                        if(attr === key){
                            item.push(j[key]);
                        }
                    }
                })
                
                xlsx.push(item)
            });
            let ws = XLSX.utils.aoa_to_sheet(xlsx);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb,ws, "Sheet1");
            XLSX.writeFile(wb, dayjs().format('YYYY-MM-DD HH:mm:ss')+'.xlsx');
        },
        // 导出excel
        async exportExcelB(){
            // let query = this.search_data || {};
            // console.log(query)
            // exportExcelAction(exportExcelApi + '?' + qs.stringify(query))
            let res = await _fetch({
                url:exportExcelApiB+ '?' + qs.stringify(this.search_data),
                method:'get'
            })
            // console.log(res)
            // if(res.code!==0){
            //     return this.$message.error('导出失败')
            // }
            // console.log(res.data)
            // 本地导出
            let data = res.data;
            // if(this.selectedRows && this.selectedRows.length){
            //     data = this.selectedRows
            // }
            if(!data.length){
                this.$message.error('数据为空')
                return
            }
            let tableHeader = this.config.tableConfig.map(i=>i.title)
            let tableHeaderMap = {};
            this.config.tableConfig.forEach(i=>{
                tableHeaderMap[i.title] = i.key
            })
            let xlsx = [
                tableHeader
            ]
            data.forEach(j=>{
                let item = [];
                tableHeader.forEach(title=>{
                    let key = tableHeaderMap[title];
                    for(let attr in j){
                        // console.log({title,key})
                        // console.log(key)
                        if(attr === key){
                            item.push(j[key]);
                        }
                    }
                })
                
                xlsx.push(item)
            });
            // return
            let ws = XLSX.utils.aoa_to_sheet(xlsx);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb,ws, "Sheet1");
            XLSX.writeFile(wb, res.fileName+'.xlsx');
            // XLSX.writeFile(wb, res.msg+'.xlsx');
        },
        async exportExcelA(){
            let res = await _fetch({
                url:exportExcelApiA + '?' + qs.stringify(this.search_data),
                method:'get'
            })
            // if(res.code!==0){
            //     return this.$message.error('导出失败')
            // }
            let data = res.data;
            // if(this.selectedRows && this.selectedRows.length){
            //     data = this.selectedRows
            // }
            if(!data.length){
                this.$message.error('数据为空')
                return
            }
            let tableHeader = this.config.tableConfig.filter(i=>!i.export_ignore).map(i=>i.title)
            let tableHeaderMap = {};
            this.config.tableConfig.forEach(i=>{
                tableHeaderMap[i.title] = i.key
            })
            let xlsx = [
                tableHeader
            ]
            data.forEach(j=>{
                let item = [];
                tableHeader.forEach(title=>{
                    let key = tableHeaderMap[title];
                    for(let attr in j){
                        // console.log({title,key})
                        // console.log(key)
                        if(attr === key){
                            item.push(j[key]);
                        }
                    }
                })
                
                xlsx.push(item)
            });
            let ws = XLSX.utils.aoa_to_sheet(xlsx);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb,ws, "Sheet1");
            XLSX.writeFile(wb, res.fileName+'.xlsx');
        },
        async parseExcel(){
            
        },
        async onUploadExcelSuccess(res){
            this.upload_excel_dialog = false;
            let { status , msg } = res;
            if(status === 2 ){
                this.$message.error(msg || '导入失败');
            }else{
                this.getTableData(this.search_data)
            }
        },
        async openDialog(){
            this.btn_loading = true
            setTimeout(()=>{
                this.modal_show = true
                // let default_form_data = Object.assign({},this.$refs['form'].originalFormInline)
                // this.$refs['form'].presetFormData = default_form_data;
            },200)
        },
        async openQuickAddialog(){
            this.quick_add = true
            setTimeout(()=>{
                this.quick_add = true
                // let default_form_data = Object.assign({},this.$refs['form'].originalFormInline)
                // this.$refs['form'].presetFormData = default_form_data;
            },200)
        },
        showSearchBarAction(name){
            return this.config && this.config.searchBarConfig.actions &&
            this.config.searchBarConfig.actions.includes(name);
        },
        injectThis(fn,data){
            fn && fn.call(this,data)
        },
        handleTableConfig(){
            let tableConfig = this.config && this.config.tableConfig || [];
            return {
                loading:false,
                dataSource:[],
                tableConfig,
                actions:this.config && this.config.actions || ['edit','delete'],
                api:this.config && this.config.api,
                public_api:this.config && this.config.public_api,
                defaultColumns: this.config && this.config.defaultColumns
            }
        },
        handleAddFormConfig(){
            let config = this.config;
            let addFormConfig = {
                title:config && config.title || ~~((Math.random() + 1.3) * 1e6) + '-表单',
                actions:['submit'],
                inline: true,
                btn_style:{
                    submit:form_btn_style.submit
                },
                ...(config && config.addFormConfig || {})
            }
            return addFormConfig
        },
        onPageChange(pageNum){
            this.search_data = {...this.search_data,pageNum,pageSize:this.pageSize};
            this.getTableData(this.search_data)
        },
        onPageSizeChange(pageSize){
            this.pageSize = pageSize
            this.pageNum = 1
            this.search_data = {...this.search_data,pageNum:this.pageNum,pageSize};
            this.getTableData(this.search_data);
        },
        search(val){
            // this.search_data = val;
            this.search_data = {...val,pageNum:this.pageNum,pageSize:this.pageSize};
            console.log('search',this.search_data)
            this.getTableData(this.search_data)
        },
        rouseEditModal(){ // 唤醒addModal
            this.modal_show = true;
            this.editStatus = true;
        },
        // copyUrl(id){
        //     copyStr(this.api+'/'+id)
        //     this.$message.success('已复制')
        // },
        async remove(_id){
            // let url = _URL.parse(this.getApi()).pathname;
            // url = this.api.includes('${id}') ? url : /$\//.test(url) ? url+_id : url +'/'+_id;
            // console.log(url)
            let res = await _fetch({
                url:this.api.del.api + '?id='+_id,
                method:this.api.del.m||'delete',
            })
            // this.$message.success(res.message)
            this.getTableData()
        },
        insertEntityDataReadyToEdit(_id,entity){
            // console.log(_id,entity)
            this.rouseEditModal();
            // this.$nextTick(()=>{
                
            // })
            setTimeout(()=>{
                let temp = {};
                // let attrs = this.$refs['form'].attrs;
                for(let k in entity){
                    // 仅填入add表单配置项
                    let widget_desc = this.$refs['form'].formConfig.filter(i=>i.attr === k)[0];
                    if(!widget_desc){
                        continue
                    }
                    if(widget_desc.disabled_on_edit){
                        widget_desc.disabled = true;
                        // widget_desc.can_recovery_selection = true;
                    }else{
                        widget_desc.disabled = false;
                    }
                    // if(widget_desc.edit_no_disabled){
                    //     widget_desc.disabled = false;
                    //     // widget_desc.can_recovery_selection = false;
                    // }
                    temp[k] = widget_desc.onbeforeupdate ? widget_desc.onbeforeupdate.call(this.$refs['form'],entity[k],entity) : entity[k]
                }
                let original_form_data = Object.assign({},this.$refs['form'].originalFormInline)
                let _form_data = recurMerge(original_form_data, temp)
                this.$refs['form'].presetFormData = _form_data;
                this.which = _id;
            },200)
        },
        // 提交form表单
        async submit(data){
            // console.log(data)
            let res;
            // console.log(data)
            // url = _URL.parse(this.getApi(data)).pathname;
            if(!this.editStatus){
                // res = await _fetch.post(this.apiFmtObj.url,Object.assign({}, data, this.apiFmtObj.defaultQuery));
                res = await _fetch({
                    url:this.api.add.api,
                    method:this.api.add.m||'post',
                    data
                })
            }else{
                //url = this.api.includes('${id}') ? url : /$\//.test(url) ? url+this.which : url +'/'+this.which;
                // let qstring = qs.stringify(this.apiFmtObj.defaultQuery)
                // if (qstring) url += `?${qstring}`
                // res = await _fetch.put(url,data)
                res = await _fetch({
                    url:this.api.edit.api,
                    method:this.api.edit.m||'put',
                    data:{
                        id:this.which,
                        ...data
                    }
                })
            }
            // 这里需要normalize一下
            this.$message.success('提交成功!');
            this.getTableData();
            this.modal_show = false;
        },
        renderStrTpl(str,obj){
            return str.replace(/\${(.+?)}/g,(i,match)=>{
                if(obj[match]){
                    let val = obj[match];
                    delete obj[match];
                    return val
                }
                return ''
            })
        },
        getApi(query){
            let url = this.api.select.api;
            query = query || this.search_data;
            if(!url){
                console.log('getApi取不到url',query)
                return ''
            }
            query = deep_clone(query)
            // 替换占位符
            url = this.renderStrTpl(this.api.select.api,query);
            let { pathname,query:default_query } = _URL.parse(url);
            if(Object.keys(query).length){
                for(let k in query){
                    (typeof query[k] === 'null' || typeof query[k] === 'undefined' || query[k] === '') && delete query[k]
                }
                url = `${pathname}?${qs.stringify({...qs.parse(default_query || ''),...query})}`
            }
            return url
        },
        async getTableData(query){
            
            // let url;
            // if(!url)return
            this.tableConfig.loading = true;
            this.loading = true
            let res = await _fetch({
                url:this.getApi(),
                method:this.api.select.m||'get'
            }).finally(() => {this.loading = false});
            this.tableConfig.loading = false;
            if(res && res.pageSize){
                // 列表数据
                this.paginationConfig.total = res.total;
                let dataSource = this.config.onbeforerender ? await this.config.onbeforerender.call(this,res.data,res) : res.data;
                this.tableConfig.dataSource = Object.freeze(dataSource);
            }else if(res && !res.pageSize){
                // 非列表数据
                if(!Array.isArray(res)){
                    if(!res.hasOwnProperty('id')){
                        this.tableConfig.dataSource = []
                        this.paginationConfig.total = 0;
                        return
                    }
                    res = [res]
                }
                this.tableConfig.dataSource = Object.freeze(res);
                // id 掺入了业务逻辑 哎!!!
                res.hasOwnProperty('id') && (this.paginationConfig.total = 1);
            }
            // //更新界面上显示的【数据集成接口】
            // this.$emit('search-url-update',url)
//             this.tableConfig.dataSource = [{
// "id": 1,
// "userId": 2,
// "postMan": "清少",
// "storeName": "aaa",
// "storeId": 1,
// "orderId": "abc1",
// "wangwangId": "abc",
// "weChatId": "abc",
// "principle": 10,
// "commission": 5,
// "memo": null,
// "createTime": "2021/01/09 18:47:33",
// "black": false
// }]
        },
        modalClose(){
            this.$refs['form'].reset();
            // 恢复add状态
            this.editStatus = false;
            // 恢复edit disabled的状态
            // let widget_arr = this.$refs['form'].formConfig.filter(i=>i.disabled_on_edit === true);
            let widget_arr = this.$refs['form'].formConfig;
            for(let item of widget_arr){
                //console.log(item)
                // if(item.can_recovery_selection){
                //     console.log({item})
                //     item.disabled = false
                // }
                if(item.disabled_on_add){
                    // console.log(item)
                    item.disabled = true
                }else{
                    item.disabled = false
                }
                
            }
        },
        checkLog (row) {
            this.log_show = true
            this.log_id = row.id
        },
        async pass (row, state) {
            if (state) {
                this.pubtime_id = row.id
                this.pubtime_show = true
                setTimeout(() => {
                  let publishTime = dayjs().add(2,'minute').format('YYYY-MM-DD HH:mm:ss')
                  this.$refs['pubTimeForm'].presetFormData = {publishTime}
                }, 100)
                return
            }
            await this.unpass(row.id)
        },
        async unpass (id) {
        //   await _fetch({
        //       url: `${checkDataApi}/${this.m_id}/${id}`,
        //       method: 'post',
        //       data: {operate: 2}
        //   })
        //   this.optSuccess()
        },
        async pubtimeSubmit (params) {
            // let res = await _fetch({
            //     url: `${checkDataApi}/${this.m_id}/${this.pubtime_id}`,
            //     method: 'post',
            //     data: {operate: 3, ...params}
            // })
            // this.pubtime_show = false
            // this.optSuccess()
        },
        async setPublishTime (row, time) {
            // await _fetch({
            //     url: `${checkDataApi}/${this.m_id}/${row.id}`,
            //     method: 'post',
            //     data: { operate: 3, publishTime: time }
            // })
            // this.optSuccess()
        },
        optSuccess () {
            this.$message.success('操作成功!')
            this.getTableData(this.search_data)
        },
        async toWeightTop (row) {
          // debugger
            // await _fetch({
            //   url: `/weightdata/${this.m_id}/${row.id}`,
            //   method: 'post'
            // })
            // this.optSuccess()
        },
        async reloadDataCache () {
        //   await _fetch({
        //     url: `/reloaddata/${this.m_id}`,
        //     method: 'get'
        //   })
        //   this.optSuccess();
        }
    }
}
</script>
<style lang="scss" scope>
.add-btn {
  float: right;
  margin-bottom: 10px;
  margin-left: 10px;
}
.reload-btn {
  margin-bottom: 10px;
}  
.fix-dialog-body{
    .el-dialog__body{
        max-height: 800px;
        overflow: auto;
    }
}
.el-upload{
    width: 100%;
    height: 100px;
}
</style>
