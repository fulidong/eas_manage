<template>
  <el-dialog
    :title="type==1?'新增用户':'修改用户'"
    :visible.sync="isOpen"
    width="50%"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名称" prop="user_name">
        <el-input v-model="ruleForm.user_name" />
      </el-form-item>
      <el-form-item label="用户账号" prop="login_account">
        <el-input v-model="ruleForm.login_account" />
      </el-form-item>
      <el-form-item v-if="type===1" label="密码" prop="pass_word">
        <el-input v-model="ruleForm.pass_word" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="是否启用" prop="user_status">
        <el-switch
          :value="ruleForm.user_status"
          :active-value="1"
          :inactive-value="0"
          @change="changeStatus"
        />
      </el-form-item>
    </el-form>
    <div class="flex items-center justify-center">
      <el-button type="primary" @click.stop="handleUser('ruleForm')">提交用户信息</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createUser, upDateUser } from '@/api/user'
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
        user_name: '',
        login_account: '',
        pass_word: '',
        email: '',
        user_status: 0
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ],
        login_account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        pass_word: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { type: 'string', required: true, message: '请输入邮箱', trigger: 'blur' }
        ]

      }
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
    },
    type(n) {
      if (n === 2) {
        const { user_id = '', user_name = '', login_account = '', email = '', user_status = '' } = JSON.parse(JSON.stringify(this.updataObj))
        this.ruleForm.user_id = user_id
        this.ruleForm.user_name = user_name
        this.ruleForm.login_account = login_account
        this.ruleForm.email = email
        this.ruleForm.user_status = user_status
        this.ruleForm.del
        delete this.ruleForm.pass_word
        delete this.rules.pass_word
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
    changeStatus(e) {
      this.ruleForm.user_status = e
    },
    handleUser(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.type === 1) {
            const res = await createUser(this.ruleForm)
            if (res?.code === 200) {
              this.$set(this.ruleForm, {
                user_name: '',
                login_account: '',
                pass_word: '',
                email: '',
                user_status: 0
              })
              this.$message({
                type: 'success',
                message: '用户创建成功'
              })
              this.$emit('loadEvent')
            } else {
              this.$message('用户创建失败')
            }
            console.log(res, '信息是什么')
          } else {
            console.log(this.ruleForm, '数据')
            const res = await upDateUser(this.ruleForm)
            if (res?.code === 200) {
              this.ruleForm = {
                user_name: '',
                login_account: '',
                pass_word: '',
                email: '',
                user_status: 0
              }
              this.$message({
                type: 'success',
                message: '用户修改成功'
              })
              this.$emit('loadEvent')
            } else {
              this.$message('用户修改失败')
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

<style scoped>

</style>
