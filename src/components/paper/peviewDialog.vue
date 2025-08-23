<template>
  <el-dialog
    title="试卷预览"
    :visible.sync="isOpen"
    width="40%"
    max-height="800px"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <div class="pb-50">
      <h3 class="text-18 text-center">{{ salesTitle }}</h3>

      <div class="mt-20">
        <!-- 按顺序遍历所有题目 -->
        <div
          v-for="(item, index) in questionList"
          :key="item.id || index"
          class="mt-40 px-30"
        >
          <!-- 题干 -->
          <div class="text-14 font-semibold">
            {{ `${item.order}、${item.title}` }}
            <span class="text-12 text-gray-500 ml-10">
              ({{ getQuestionTypeName(item.question_type_id) }})
            </span>
            <span class="text-12 text-gray-400 ml-10">( )</span>
          </div>

          <!-- 选项 -->
          <div v-if="item.question_options_data && item.question_options_data.length > 0" class="mt-20">
            <div class="flex flex-wrap items-center">
              <div
                v-for="(option, idx) in item.question_options_data"
                :key="option.id || idx"
                class="mr-30 mb-10 text-14"
              >
                {{ `${option.serial_number}、${option.description}` }}
              </div>
            </div>
          </div>
        </div>

        <!-- 如果没有题目 -->
        <div v-if="questionList.length === 0" class="text-center text-14 text-gray-400 mt-40">
          暂无题目
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getQuesitionPreview } from '@/api/quesition'

export default {
  name: 'PerviewDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    salesId: {
      type: String,
      default: ''
    },
    salesTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOpen: false,
      questionList: [] // 保持原始顺序的题目列表
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
      if (n === true) {
        this.getQuestionData()
      }
    }
  },
  created() {
    this.isOpen = this.dialogVisible
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog', false)
    },

    async getQuestionData() {
      try {
        const res = await getQuesitionPreview({
          sales_paper_id: this.salesId
        })

        const data = res?.data?.question_data || []

        // ✅ 直接使用接口返回的顺序，不做分类
        this.questionList = data
      } catch (error) {
        console.error('试卷预览获取题目失败:', error)
        this.$message.error('获取题目失败，请稍后重试')
        this.questionList = []
      }
    },

    // 根据 question_type_id 返回题型名称
    getQuestionTypeName(typeId) {
      const types = {
        0: '单选题',
        1: '多选题',
        2: '判断题'
      }
      return types[typeId] || '未知题型'
    }
  }
}
</script>

<style lang="scss">
.pluisin-user {
  max-height: 800px;
  overflow-y: auto;
}
</style>