<template>
  <el-dialog
    :title="'评语列表'"
    :visible.sync="isOpen"
    width="1400px"
    max-height="500px"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <template #title>
      <h2 class="text-18">{{ type==1?'新增维度':'修改维度' }}</h2>
    </template>
    <div class="flex items-center mb-40">
      <div class="w-180 text-center text-16 font-semibold">维度名称</div>
      <div class="w-200 text-center text-16 font-semibold">平均分</div>
      <div class="w-200 text-center text-16 font-semibold">标准差</div>
      <div class="w-200 text-center text-16 font-semibold">描述</div>
      <div class="w-120 text-right text-16 font-semibold">最高分数上限</div>
      <div class="w-120 text-right text-16 font-semibold">最低分数下限</div>
      <div class="w-150 text-right text-16 font-semibold">是否可选择该维度</div>
      <div v-if="type===1" class="w-100 text-right text-16 font-semibold">操作</div>
    </div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
      <div v-for="(item,idx) in ruleForm.dimension_data" :key="idx" class="rounded-4 mt-5 w-full flex items-center">
        <el-form-item label="" width="200px" :prop="`dimension_data.${idx}.dimension_name`">
          <el-input v-model="item.dimension_name" class="w-190 ml-10" />
        </el-form-item>
        <el-form-item label="" width="200px" :prop="`dimension_data.${idx}.average_mark`">
          <el-input v-model="item.average_mark" class="w-190 ml-10" />
        </el-form-item>
        <el-form-item label="" width="200px" :prop="`dimension_data.${idx}.standard_mark`">
          <el-input v-model="item.standard_mark" class="w-190 ml-10" />
        </el-form-item>
        <el-form-item label="" width="200px" :prop="`dimension_data.${idx}.description`">
          <el-input v-model="item.description" class="w-190 ml-10" />
        </el-form-item>
        <el-form-item label="" width="100px" :prop="`dimension_data.${idx}.max_score`">
          <el-input v-model="item.max_score" class="w-90 ml-10" />
        </el-form-item>
        <el-form-item label="" width="100px" :prop="`dimension_data.${idx}.min_score`">
          <el-input v-model="item.min_score" class="w-90 ml-10" />
        </el-form-item>
        <el-form-item label="" width="200px" :prop="`dimension_data.${idx}.is_choose`">
          <div class="flex w-200 justify-center">
            <el-switch
              v-model="item.is_choose"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </div>
        </el-form-item>
        <el-form-item v-if="idx>0&&type===1" label="" width="100px" prop="">
          <el-button type="danger" size="small" class="ml-20" @click.stop="deleteItems(idx)">删除此维度</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-button v-if="type===1" type="info" size="small" class="mt-20" @click.stop="addItems()">新增维度</el-button>
    <div class="flex items-center mt-5 justify-center">
      <el-button type="primary" @click.stop="saveComment('ruleForm')">提交维度信息</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dimensionCreate, dimensionUpdate } from '@/api/dimension'
export default {
  name: 'UserDiolpg',
  props: {
    type: {
      type: Number,
      default: 1
    },
    dimensionList: {
      type: Array,
      default: () => {
        return []
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    paperId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOpen: false,
      ruleForm: {
        dimension_data: [
          {
            dimension_id: '',
            dimension_name: '',
            average_mark: 0,
            standard_mark: 0,
            description: '',
            max_score: 0,
            min_score: 0,
            is_choose: false
          }
        ]
      },
      rules: {
        dimension_name: [
          { required: true, message: '请输入维度名称', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ],
        average_mark: [
          { required: true, message: '请输入平均分', trigger: 'blur' }
        ],
        standard_mark: [
          { required: true, message: '请输入标准差', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述内容', trigger: 'blur' }
        ],
        max_score: [
          { required: true, message: '请输入最高分数上限', trigger: 'blur' }
        ],
        min_score: [
          { required: true, message: '请输入最低分数下限', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
    },
    type(n) {
      if (this.type === 2) {
        this.ruleForm.dimension_data = this.dimensionList
      } else {
        this.ruleForm.dimension_data = [{
          dimension_id: '',
          dimension_name: '',
          average_mark: 0,
          standard_mark: 0,
          description: '',
          max_score: 0,
          min_score: 0,
          is_choose: false
        }]
      }
    }
  },
  created() {
    this.isOpen = this.dialogVisible
  },
  methods: {
    addItems() {
      const obj = {
        dimension_id: '',
        dimension_name: '',
        average_mark: 0,
        standard_mark: 0,
        description: '',
        max_score: 0,
        min_score: 0,
        is_choose: false
      }
      this.ruleForm.dimension_data.push(obj)
    },
    deleteItems(i) {
      this.ruleForm.dimension_data.splice(i, 1)
    },
    handleClose() {
      this.$emit('closeDialog', false)
    },
    loadData() {
      this.$emit('loadEvent', true)
    },
    async saveComment(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          try {
            const obj = {
              sales_paper_id: this.paperId,
              dimension_data: this.ruleForm.dimension_data
            }
            if (this.type === 1) {
              const res = await dimensionCreate(obj)
              if (res?.code === 200) {
                this.$message({
                  type: 'success',
                  message: '维度新增成功~~~'
                })
                this.ruleForm.dimension_data = [
                  {
                    dimension_id: '',
                    dimension_name: '',
                    average_mark: 0,
                    standard_mark: 0,
                    description: '',
                    max_score: 0,
                    min_score: 0,
                    is_choose: false
                  }
                ]
                this.handleClose()
                this.loadData()
              } else {
                this.$message('维度新增失败')
              }
            }
            if (this.type === 2) {
              const res = await dimensionUpdate(obj)
              if (res?.code === 200) {
                this.$message({
                  type: 'success',
                  message: '维度修改成功~~~'
                })
                this.handleClose()
                this.loadData()
              } else {
                this.$message('维度修改失败')
              }
            }
          } catch (error) {
            this.$message('服务器错误请稍后重试')
            console.log(error, '接口报错~~~')
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
