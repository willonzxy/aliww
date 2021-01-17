<template lang="pug">
    el-table(border :data="config.dataSource" :loading="loading" @selection-change="handleSelectionChange")
        //- el-table-column(type="selection" width="55" align="center")
        el-table-column(v-for="(item) in config.tableConfig" :key="item.key" :prop="item.key" :label="item.title" align="center" :show-overflow-tooltip="true")
          template(slot-scope="{row,$index:index}")
            template {{row[item.key]}}
        //- 默认列渲染
        template(v-if="config.defaultColumns")
          el-table-column(v-for="(item) in displayDefaultColumnSets" :width="item.width" :key="item.key" :prop="item.key" :label="item.title" align="center" :show-overflow-tooltip="true")
            template(slot-scope="{row,$index:index}")
              template(v-if="item.key === 'weight'")
                span {{row[item.key]}}
                el-tooltip(content="将当前数据的权重置为最高" placement="top")
                  el-button(size="mini" type="text" icon="el-icon-upload2" @click="() => $emit('weight',row)")
              template(v-else-if="item.key === 'actionLog'")
                el-button(size="mini" type="info" plain @click="checkLog(row)") 查看
              template(v-else-if="item.key === 'status'") {{statusMap[row[item.key]] || '-'}}
              template(v-else-if="(row.status === undefined || row.status === PROCESSING) && item.key === 'actionReview'")
                el-button(size="small" type="text" class="pass" @click="pass(row,true)") 通过
                el-button(size="small" type="text" class="red" @click="pass(row,false)") 不通过
              template(v-else) {{row[item.key]}}
        el-table-column(v-if="config.actions.length" label="操作" width="150" :fixed="config.fixed === undefined ? 'right' : config.fixed" align="center")
            template(slot-scope="{row,$index:index}")
                div(v-if="config.type === 'staticData' ")
                    el-button(v-if="showEditBtn" type="warning" size="small" @click="edit(index,row)") 编辑 
                    el-button(v-if="showDelBtn" type="danger" size="small" @click="remove(index)") 删除
                div(v-else)
                    div(v-if="row.id !== null && typeof row.id !== 'undefiend'")
                        el-button(v-if="showEditBtn" type="text" size="small"  @click="edit(row.id,row)") 编辑
                        //- el-popconfirm(title="这是一段内容确定删除吗？")
                        el-button(v-if="showDelBtn" type="text" size="small" class="red" @click="remove(row.id)") 删除
                        span(style="margin-left: 5px;" v-for="{type, label, handler,show_condition,name,explain} in tableGlobalDynamicActions" :key="label")
                            el-tooltip(v-if="explain" :content="explain" effect="light" placement="top")
                                el-button(
                                    v-if="show_condition ? ()=>{injectThis(show_condition,row)} : showSearchBarAction(name)" 
                                    :type="type || 'info'"
                                    size="small"
                                    @click="()=>{injectThis(handler,row)}") {{label}}
                            el-button(
                                v-else-if="show_condition ? ()=>{injectThis(show_condition,row)} : showSearchBarAction(name)" 
                                :type="type || 'info'"
                                size="small"
                                @click="()=>{injectThis(handler,row)}") {{label}}

</template>
<script>
import dayjs from 'dayjs'
import { tableGlobalDynamicActions, tableDefaultColumnSets } from '../normalize'
import datePicker from '../widget/date-picker'
import { mapGetters, mapState } from 'vuex'
export default {
    components: {
        datePicker
    },
    props:{
        config:Object
    },
    data(){
        return {
            tableGlobalDynamicActions,
            tableDefaultColumnSets,
            curPubTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            statusMap: {
              0: '已删除',
              1: '待审核',
              2: '不通过',
              3: '通过'
            },
            PROCESSING: 1, // 待审核
            PASS: 3
        }
    },
    computed:{
        ...mapGetters('system/auth', [
          'hasAuth'
        ]),
        loading(){
            return this.config.type === 'staticData' ? false : this.config.loading;
        },
        showEditBtn(){
            return this.config.actions.includes('edit')
        },
        showDelBtn(){
            return this.config.actions.includes('delete')
        },
        displayDefaultColumnSets () {
          return this.tableDefaultColumnSets.filter(item => {
            if (!item.auth) return true
            return this.hasAuth('data', 'REVIEW')
            // return true
          })
        }
    },
    methods:{
        handleSelectionChange(val){
          this.$emit('selection-rows-change',val)
        },
        edit(id,row){
            this.$emit('edit',id,row)
        },
        remove(id){
            this.$alert('确认删除？','系统提示',{
                confirmButtonText:'确认',
                showCancelButton:true,
                cancelButtonText:'取消',
                callback:(action)=>{
                    action === 'confirm' && this.$emit('remove',id)
                }
            })
        },
        showSearchBarAction(name){
            return this.config && 
            this.config.actions.includes(name);
        },
        injectThis(fn,data){
            fn && fn.call(this,data)
        },
        checkLog (row) {
           this.$emit('log', row)
        },
        pass (row, state) {
            if (state) { // 通过 - 交给上层处理发布时间
              this.$emit('pass', row, state)
              return
            }
            this.$alert('审核是否不通过？','系统提示',{
                confirmButtonText:'确认',
                showCancelButton:true,
                cancelButtonText:'取消',
                callback:(action)=>{
                    action === 'confirm' && this.$emit('pass', row, state)
                }
            })
        },
        cancelAction (name) {
            this.$refs[name] && this.$refs[name].forEach((ref) => ref.doClose())
        },
        timeChange (row) {
            this.curPubTime = row.publishTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
        },
        setPubTime (row, name) {
            this.$emit('setTime', row, this.curPubTime)
            this.cancelAction(name)
        }
    }
}
</script>
<style lang="scss">
.red {
  color: #f00;
}
.red:hover{
  color: #f00;
}
.pass {
  color: #67c23a;
}
.pass:hover{
  color: #67c23a;
}
</style>
