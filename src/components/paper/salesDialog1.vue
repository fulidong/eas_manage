<template>
  <el-dialog
    :title="type==1?'新增试卷':'修改试卷'"
    :visible.sync="isOpen"
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
      <el-form-item label="最低分数上限" prop="min_score">
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
  name: 'UserDiolpg',
  props: {
    type: {
      type: Number,
      default: 1
    },
    dialogVisible: {
      type: Boolean,
      default: false
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
        sales_paper_name: '',
        recommend_time_lim: '',
        max_score: 0,
        min_score: 0,
        is_enabled: 1,
        mark: '',
        expression: '',
        rounding: '',
        is_sum_score: 1
      },
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
          { required: true, message: '请输入最低分数上限', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
    },
    type(n) {
      console.log(n, 'fdfdfdd')
      if (n === 2) {
        // const { sales_paper_id = '', sales_paper_name = '', recommend_time_lim = '', max_score = 0, min_score = 0, is_enabled = true, mark = '', expression = '', rounding = '', is_sum_score = true } = JSON.parse(JSON.stringify(this.updataObj))
        const obj = { sales_paper_id, sales_paper_name, recommend_time_lim, max_score, min_score, is_enabled:is_enabled === 1, mark, expression, rounding, is_sum_score }
        console.log(obj, '这个数据是啥')
        // this.$set(this.ruleForm, { ...obj })
        this.ruleForm = { ...obj }
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
    handleUser(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.type === 1) {
            const salespaperdata = { sales_paper_data: { ...this.ruleForm,is_enabled:this.ruleForm.is_enabled ? 1 : 0, max_score: Number(this.ruleForm?.max_score), min_score: Number(this.ruleForm?.min_score) }}
            console.log(this.ruleForm, "111111")
            const res = await salesCreate(salespaperdata)
            if (res?.code === 200) {
              this.$set(this.ruleForm, {
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
              })
              this.$message({
                type: 'success',
                message: '试卷创建成功'
              })
              this.$emit('loadEvent')
            } else {
              this.$message('试卷创建失败')
            }
          } else {
            const salespaperdata = { sales_paper_data: { ...this.ruleForm,is_enabled:this.ruleForm.is_enabled ? 1 : 0, max_score: Number(this.ruleForm?.max_score), min_score: Number(this.ruleForm?.min_score) }}
            console.log(this.ruleForm, "111111")
            const res = await salesUpdate(salespaperdata)
            if (res?.code === 200) {
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
              this.$message({
                type: 'success',
                message: '试卷修改成功'
              })
              this.$emit('loadEvent')
            } else {
              this.$message('试卷修改失败')
            }
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
