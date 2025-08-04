<template>
  <el-dialog
    :title="type==1?'新增题目':'修改题目'"
    :visible.sync="isOpen"
    width="70%"
    max-height="800px"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm.question_data" :rules="rules" label-width="150px" class="demo-ruleForm">
      <div class="flex  justify-between">
        <div>
          <el-form-item label="题目名称" prop="title">
            <el-input v-model="ruleForm.question_data.title" class="w-200" />
          </el-form-item>
          <el-form-item label="题目类型" prop="question_type_id">
            <el-radio-group v-model="ruleForm.question_data.question_type_id">
              <el-radio :label="0">单选题</el-radio>
              <el-radio :label="1">多选题</el-radio>
              <el-radio :label="2">判断题</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.question_data.remark" class="w-200" />
          </el-form-item>
          <el-form-item label="题目序号" prop="order">
            <el-input v-model="ruleForm.question_data.order" type="number" class="w-200" />
          </el-form-item>
        </div>
      </div>
      <div v-if="ruleForm.question_data.question_type_id!=2" class="w-150 flex justify-end">
        <el-button type="primary" @click.stop="addItem()">新增题目选项</el-button>
      </div>
      <div class="mt-30">
        <div v-for="(item,index) in ruleForm.question_data.options" :key="index" class="flex p-20 mt-20" style="border:1px solid #ebebeb;">
          <div>
            <el-form-item label="选项内容" :prop="`options.${index}.description`">
              <el-input v-model="item.description" class="w-300" />
            </el-form-item>
            <el-form-item label="选项序号" :prop="`options.${index}.order`">
              <el-input v-model="item.order" class="w-200" />
            </el-form-item>
          </div>
          <div class="ml-30">
            <el-form-item label="分数" :prop="`options.${index}.score`">
              <el-input v-model="item.score" class="w-200" />
            </el-form-item>
            <div v-if="index>1&&ruleForm.question_data.question_type_id!=2" class="w-150 ml-150">
              <el-button type="danger" @click.stop="deletaItem(index)">删除当前选项</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="flex items-center mt-5 justify-center">
      <el-button type="primary" @click.stop="submitQuestion('ruleForm')">提交提交信息</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { quesitionSave } from '@/api/quesition.js'
export default {
  name: 'CreateTopicDiolpg',
  props: {
    type: {
      type: Number,
      default: 1
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    paperId: {
      type: String,
      default: ''
    },
    curSaleId: {
      type: String,
      default: ''
    },
    updataObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isOpen: false,
      ruleForm: {
        sales_paper_id: '',
        sales_paper_dimension_id: '',
        question_data: {
          question_id: '',
          title: '',
          remark: '',
          question_type_id: 0,
          order: 0,
          options: [
            {
              question_option_id: '',
              description: '',
              score: 0,
              order: ''

            },
            {
              question_option_id: '',
              description: '',
              score: 0,
              order: ''

            }
          ]
        }
      },
      params: {
        sales_paper_id: ''
      },
      paperList: [],
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入选项内容', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
      this.params.sales_paper_id = this.paperId
      this.params.sales_paper_dimension_id = this.curSaleId
    },
    type(n) {
      console.log(n, 'fdfdfdd')
      if (n === 2) {
        // this.curSaleId = this.updataObj?.sales_paper_dimension_id
        console.log(this.updataObj, 'fgggdffgg')
        const { sales_paper_id = '', sales_paper_dimension_id, question_id, title, remark, question_type_id, order, question_options_data } = this.updataObj
        this.ruleForm.sales_paper_id = sales_paper_id
        this.ruleForm.sales_paper_dimension_id = sales_paper_dimension_id
        this.ruleForm.question_data.question_id = question_id
        this.ruleForm.question_data.title = title
        this.ruleForm.question_data.remark = remark
        this.ruleForm.question_data.question_type_id = question_type_id
        this.ruleForm.question_data.order = order
        this.ruleForm.question_data.options = question_options_data?.length ? question_options_data : [
          {
            question_option_id: '',
            description: '',
            score: 0,
            order: ''

          },
          {
            question_option_id: '',
            description: '',
            score: 0,
            order: ''

          }
        ]
      } else {
        this.ruleForm = {
          sales_paper_id: '',
          sales_paper_dimension_id: '',
          question_data: {
            question_id: '',
            title: '',
            remark: '',
            question_type_id: 0,
            order: 0,
            options: [
              {
                question_option_id: '',
                description: '',
                score: 0,
                order: ''

              },
              {
                question_option_id: '',
                description: '',
                score: 0,
                order: ''

              }
            ]
          }
        }
      }
    }
  },
  created() {
    this.isOpen = this.dialogVisible
  },
  methods: {
    handleClose() {
      this.$emit('userDialog', false)
    },
    addItem() {
      this.ruleForm.question_data.options.push({
        question_option_id: '',
        description: '',
        score: 0,
        order: ''

      })
    },
    deletaItem(i) {
      this.ruleForm.question_data.options.splice(i, 1)
    },
    submitQuestion(ruleForm) {
      this.$refs[ruleForm].validate(async(valid) => {
        if (valid) {
          const obj = {
            sales_paper_id: this.paperId,
            sales_paper_dimension_id: this.curSaleId,
            question_data: this.ruleForm.question_data || []
          }
          const res = await quesitionSave(obj)
          console.log(res, '报错的信息')
          if (res?.code === 200) {
            this.$message({
              type: 'success',
              message: '题目创建成功~~~'
            })
            this.ruleForm = {
              sales_paper_id: '',
              sales_paper_dimension_id: '',
              question_data: {
                question_id: '',
                title: '',
                remark: '',
                question_type_id: '',
                order: 0,
                options: [
                  {
                    question_option_id: '',
                    description: '',
                    score: 0,
                    order: ''

                  },
                  {
                    question_option_id: '',
                    description: '',
                    score: 0,
                    order: ''

                  }
                ]
              }
            }
            this.$emit('loadEvent')
            this.handleClose()
          } else {
            this.message({
              type: 'error',
              message: '题目创建失败~~~'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
    .pluisin-user{
        max-height:600px;
        overflow-y: auto;
    }
</style>
