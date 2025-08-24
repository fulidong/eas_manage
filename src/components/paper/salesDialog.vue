<template>
  <el-dialog
    :title="type==1?'新增试卷':'修改试卷'"
    :visible.sync="dialogVisible"
    width="40%"
    max-height="500px"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="试卷ID" prop="sales_paper_id">
        <el-input v-model="ruleForm.sales_paper_id" disabled class="w-300" />
      </el-form-item>
      <el-form-item label="试卷名称" prop="sales_paper_name">
        <el-input v-model="ruleForm.sales_paper_name" class="w-300" />
      </el-form-item>
      <el-form-item label="推荐试卷作答时长/分钟" prop="recommend_time_lim">
        <el-input v-model="ruleForm.recommend_time_lim" type="number" class="w-300" />
      </el-form-item>
      <el-form-item label="最高分数上限" prop="max_score">
        <el-input v-model="ruleForm.max_score" type="number" class="w-300" />
      </el-form-item>
      <el-form-item label="最低分数下限" prop="min_score">
        <el-input v-model="ruleForm.min_score" type="number" class="w-300" />
      </el-form-item>
      <el-form-item label="是否启用试卷" prop="is_enabled">
        <el-switch
          v-model="ruleForm.is_enabled"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="备注" prop="mark">
        <el-input v-model="ruleForm.mark" type="textarea" class="w-full" />
      </el-form-item>
      <el-form-item label="标准记分公式" prop="expression">
        <el-input v-model="ruleForm.expression" class="w-300" />
      </el-form-item>
      <el-form-item label="保留小数位" prop="rounding">
        <el-input v-model="ruleForm.rounding" class="w-300" />
      </el-form-item>
      <el-form-item label="是否存在总分" prop="is_sum_score">
        <el-radio v-model="ruleForm.is_sum_score" :label="true">是</el-radio>
        <el-radio v-model="ruleForm.is_sum_score" :label="false">否</el-radio>
      </el-form-item>
    </el-form>
    <div class="flex items-center mt-5 justify-center">
      <el-button type="primary" @click.stop="handleUser('ruleForm')">提交试卷信息</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { salesCreate, salesUpdate } from '@/api/sales'

export default {
  name: 'UserDialog',
  props: {
    type: {
      type: Number,
      default: 1 // 1: 新增, 2: 修改
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    updataObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 表单数据（初始为空）
      ruleForm: {
        sales_paper_id: '',
        sales_paper_name: '',
        recommend_time_lim: '',
        max_score: 0,
        min_score: 0,
        is_enabled: true,    // 前端用布尔
        mark: '',
        expression: '',
        rounding: '',
        is_sum_score: true
      },
      // 表单验证规则
      rules: {
        sales_paper_id: [
          { message: '请输入试卷ID', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ],
        sales_paper_name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ],
        recommend_time_lim: [
          { required: true, message: '请输入推荐作答时长/分钟', trigger: 'blur' }
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
    // 监听弹窗打开/关闭
    dialogVisible: {
      handler(n) {
        if (n) {
          // 弹窗打开
          this.resetForm() // 先重置
          if (this.type === 2 && this.updataObj) {
            // 如果是修改，回显数据
            this.fillForm(this.updataObj)
          }
        } else {
          // 弹窗关闭 → 重置表单（防残留）
          this.resetForm()
        }
      },
      immediate: true // 立即执行一次（可选）
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      this.ruleForm = {
        sales_paper_id: '',
        sales_paper_name: '',
        recommend_time_lim: '',
        max_score: 0,
        min_score: 0,
        is_enabled: true,
        mark: '',
        expression: '',
        rounding: '',
        is_sum_score: true
      }
    },

    // 回显数据（修改时）
    fillForm(data) {
      this.ruleForm = {
        sales_paper_id: data.sales_paper_id || '',
        sales_paper_name: data.sales_paper_name || '',
        recommend_time_lim: data.recommend_time_lim || '',
        max_score: Number(data.max_score) || 0,
        min_score: Number(data.min_score) || 0,
        is_enabled: data.is_enabled === 1, // 1/0 → true/false
        mark: data.mark || '',
        expression: data.expression || '',
        rounding: data.rounding || '',
        is_sum_score: data.is_sum_score === 1
      }
    },

    // 关闭弹窗（点击 x 或遮罩）
    handleClose() {
      this.$emit('userDialog', false)
    },

    // 提交表单
    handleUser(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 提交前：转换 is_enabled 为 1/0，其他字段处理
          const submitData = {
            ...this.ruleForm,
            is_enabled: this.ruleForm.is_enabled ? 1 : 0, // true/false → 1/0
            max_score: Number(this.ruleForm.max_score),
            min_score: Number(this.ruleForm.min_score),
            is_sum_score: this.ruleForm.is_sum_score ? 1 : 0
          }

          const salespaperdata = { sales_paper_data: submitData }
          console.log(salespaperdata, "salespaperdata")
          try {
            let res = null
            if (this.type === 1) {
              res = await salesCreate(salespaperdata)
            } else {
              res = await salesUpdate(salespaperdata)
            }

            if (res && res.code === 200) {
              this.$message.success(this.type === 1 ? '试卷创建成功' : '试卷修改成功')
              this.$emit('loadEvent') // 刷新列表
              this.$emit('userDialog', false) // 关闭弹窗
            } else {
              this.$message.error(this.type === 1 ? '试卷创建失败' : '试卷修改失败')
            }
          } catch (error) {
            this.$message.error('请求失败，请重试')
            console.error(error)
          }
        } else {
          console.log('表单验证失败')
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
