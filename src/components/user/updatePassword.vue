<template>
  <el-dialog
    title="修改密码"
    :visible.sync="isOpen"
    width="40%"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item label="请输入旧密码" prop="old_pass_word">
        <div class="w-3/4">
          <el-input v-model="ruleForm.old_pass_word" />
        </div>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="new_pass_word">
        <div class="w-3/4">
          <el-input v-model="ruleForm.new_pass_word" />
        </div>
      </el-form-item>
    </el-form>
    <div class="flex items-center justify-center">
      <el-button type="primary" @click.stop="handlePassword('ruleForm')">修改密码</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updatePassword } from '@/api/user'
export default {
  name: 'PasswordDiolpg',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      ruleForm: {
        old_pass_word: '',
        new_pass_word: ''
      },
      rules: {
        old_pass_word: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        new_pass_word: [
          { type: 'string', required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ]

      }
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
      this.isOpen = false
      this.$emit('close', false)
    },
    handlePassword(e) {
      try {
        this.$refs[e].validate(async(valid) => {
          if (valid) {
            const res = await updatePassword(this.ruleForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '密码修改成功，请重新登陆~'
              })
              this.handleClose()
              await this.$store.dispatch('user/logout')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            } else {
              this.$message(res?.message || '密码修改失败~')
            }
          }
        })
      } catch (error) {
        console.log(error, '修改密码报错~~~')
      }
    }
  }
}
</script>

<style scoped>

</style>
