<template>
  <div class="app-container">
    <div>试卷维度管理</div>
  </div>
</template>

<script>
import { getDimensionList } from '@/api/dimension.js'

export default {
  name: 'Dimension',
  data() {
    return {
      params: {
        sales_paper_id: ''
      }
    }
  },
  created() {
    this.getMyDimensionList()
  },
  methods: {
    async getMyDimensionList() {
      try {
        const res = await getDimensionList(this.params)
        console.log(res, '数据对对对')
      } catch (error) { console.log(error, '获取数据报错') }
    }
  }
}
</script>
