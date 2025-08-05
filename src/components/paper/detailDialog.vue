<template>
  <el-dialog
    title="题目详情"
    :visible.sync="isOpen"
    width="40%"
    max-height="800px"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <div class="px-30">
      <div class="text-18 font-semibold text-[#909399]">题型：{{ detailObj.question_type_id===0?'单选':detailObj.question_type_id===1?'多选':'判断' }}</div>
      <h3 class="text-18">{{ detailObj.order+'、'+ detailObj.title+`(${detailObj.remark})` }}</h3>
      <div class="mt-20 flex items-center gap-20">
        <div v-for="(item,idx) in detailObj.question_options_data" :key="idx" class="mr-40 text-16">
          {{
            item.order+'、'+item.description
          }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateTopicDiolpg',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detailObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
    }
  },
  created() {
    this.isOpen = this.dialogVisible
  },
  methods: {
    handleClose() {
      this.$emit('userDialog', false)
    }
  }
}
</script>

<style lang="scss">
    .pluisin-user{
        min-height:300px;
        overflow-y: auto;
    }
</style>
