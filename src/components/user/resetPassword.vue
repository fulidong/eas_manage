<template>
  <el-dialog
    title="重置密码"
    :visible.sync="isOpen"
    width="40%"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item label="用户id" prop="user_id">
        <div class="w-3/4">
          <el-input v-model="ruleForm.user_id" />
        </div>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="pass_word">
        <div class="w-3/4">
          <el-input v-model="ruleForm.pass_word" />
        </div>
      </el-form-item>
    </el-form>
    <div class="flex items-center justify-center">
      <el-button type="primary" @click.stop="handlePassword('ruleForm')">重置密码</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { resetPassword } from '@/api/user'
export default {
  name: 'PasswordDiolpg',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isOpen: false,
      ruleForm: {
        user_id: '',
        pass_word: ''
      },
      rules: {
        user_id: [
          { required: true, message: '请输入用户id', trigger: 'blur' }
        ],
        pass_word: [
          { type: 'string', required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ]

      }
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
    },
    obj(n) {
      this.ruleForm.user_id = n?.user_id
    }
  },
  created() {
    this.isOpen = this.dialogVisible
  },
  methods: {
    handleClose() {
      this.isOpen = false
      this.$emit('close', false)
    },
    handlePassword(e) {
      try {
        this.$refs[e].validate(async(valid) => {
          if (valid) {
            const res = await resetPassword(this.ruleForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '密码重置成功~'
              })
              this.handleClose()
              this.ruleForm = {
                user_id: '',
                pass_word: ''
              }
            } else {
              this.$message(res?.message || '密码重置失败~')
            }
          }
        })
      } catch (error) {
        console.log(error, '重置密码报错~~~')
      }
    }
  }
}
</script>

<style scoped>

</style>
