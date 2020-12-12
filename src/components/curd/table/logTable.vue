<template lang="pug">
  d2-container(v-loading="loading" style="overflow: auto;")
    el-table(border :data="data" :loading="loading")
      el-table-column(prop="id" label="ID" align="center" :show-overflow-tooltip="true")
      el-table-column(prop="user" label="操作人" align="center" :show-overflow-tooltip="true")
      el-table-column(prop="requestType" label="请求类型" align="center" :show-overflow-tooltip="true")
      el-table-column(prop="requestUri" label="请求Uri" align="center" :show-overflow-tooltip="true")
      el-table-column(prop="beginDate" label="操作时间" align="center" :show-overflow-tooltip="true")
      el-table-column(prop="consumeTime" label="消耗时间" align="center" :show-overflow-tooltip="true")
      el-table-column(prop="type" label="操作结果" align="center" :show-overflow-tooltip="true")
        template(slot-scope="{row, $index}") {{typeMap[row.type] || '——'}}
      el-table-column(prop="exception" label="异常信息" align="center" min-width="100px" :show-overflow-tooltip="true")
        template(slot-scope="{row, $index}") {{row.exception || '——'}}
    div(slot="footer" style="text-align: center;margin-top: 10px;")
      el-pagination(background layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="pageChange")
</template>
<script>
import { getOptLog } from '@/api/sys.project';
export default {
  props: {
    id: String
  },
  data() {
    return {
      typeMap: {
        succeed: "操作正常",
        error: '操作异常'
      },
      loading: false,
      total: 0,
      pageNum: 1,
      pageSize: 20,
      data: []
    }
  },
  watch: {
    id: {
      deep: true,
      immediate: true,
      handler () {
        this.pageNum = 1;
        this.getLog()
      }
    }
  },
  methods: {
    async getLog () {
      this.loading = true
      let result = await getOptLog({pageNum: this.pageNum, pageSize: this.pageSize}).finally(() => this.loading = false)
      this.pageNum = result.pageNum;
      this.pageSize = result.pageSize;
      this.total = result.total;
      this.data = result.data;
    },
    pageChange (pageNum) {
      this.pageNum = pageNum
      this.getLog();
    }
  }
}
</script>
<style lang="scss">
  .el-tooltip__popper.is-dark {
    max-width: 750px;
  }
</style>
