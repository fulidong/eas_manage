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
        <h4 class="text-14">一：单选题</h4>
        <div class="">
          <div v-for="(item,index) in radioList" :key="index" class="mt-40 px-30">
            <div class="text-14 font-semibold">{{ `${item.order}、${item.title} ( )` }}</div>
            <div class="mt-20 flex items-center">
              <div v-for="(it,idx) in item.question_options_data" :key="idx" class="mr-30 text-14">{{ `${it.order}、${it.description}` }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-40">
        <h4 class="text-14">二：多选题</h4>
        <div class="">
          <div v-for="(item,index) in choicesList" :key="index" class="mt-40 px-30">
            <div class="text-14 font-semibold">{{ `${item.order}、${item.title} ( )` }}</div>
            <div class="mt-20 flex items-center">
              <div v-for="(it,idx) in item.question_options_data" :key="idx" class="mr-30 text-14">{{ `${it.order}、${it.description}` }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-40">
        <h4 class="text-14">三：判断题</h4>
        <div class="">
          <div v-for="(item,index) in judgmentList" :key="index" class="mt-40 px-30">
            <div class="text-14 font-semibold">{{ `${item.order}、${item.title} ( )` }}</div>
            <div class="mt-20 flex items-center">
              <div v-for="(it,idx) in item.question_options_data" :key="idx" class="mr-30 text-14">{{ `${it.order}、${it.description}` }}</div>
            </div>
          </div>
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
      detail: {},
      radioList: [],
      choicesList: [],
      judgmentList: []
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
        this.detail = res?.data?.question_data || []
        this.radioList = this.detail?.filter(x => x.question_type_id === 0)
        this.choicesList = this.detail?.filter(x => x.question_type_id === 1)
        this.judgmentList = this.detail?.filter(x => x.question_type_id === 2)
        console.log(this.radioList, this.choicesList, 'timu')
      } catch (error) {
        console.log(error, '试卷预览报错')
      }
    }
  }
}
</script>

<style lang="scss">
    .pluisin-user{
        max-height:800px;
        overflow-y: auto;
    }
</style>
