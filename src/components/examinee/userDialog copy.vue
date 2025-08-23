<template>
  <el-dialog
    :title="type==1?'新增用户':'修改用户'"
    :visible.sync="isOpen"
    width="50%"
    max-height="500px"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <div class="">
        <div v-for="(item,idx) in ruleForm.dynamicItems" :key="idx" class="p-10 rounded-4 mt-5" :style="{border:'1px solid #EDEDED'}">
          <el-form-item label="应聘者名称" :prop="`dynamicItems.${idx}.user_name`">
            <el-input v-model="item.user_name" />
          </el-form-item>
          <el-form-item label="应聘者id" :prop="`dynamicItems.${idx}.examinee_id`">
            <el-input v-model="item.examinee_id" />
          </el-form-item>
          <el-form-item label="邮箱" :prop="`dynamicItems.${idx}.email`">
            <el-input v-model="item.email" />
          </el-form-item>
          <el-form-item label="手机" :prop="`dynamicItems.${idx}.phone`">
            <el-input v-model="item.phone" />
          </el-form-item>
          <el-button v-if="idx>0" type="danger" size="small" @click.stop="deleteItems(idx)">删除</el-button>
        </div>
        <el-button v-if="type===1" type="primary" class="mt-5" size="small" @click.stop="addItem()">新增应聘者</el-button>
      </div>
    </el-form>
    <div class="flex items-center mt-5 justify-center">
      <el-button type="primary" @click.stop="handleUser('ruleForm')">提交应聘者信息</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createTest, updateTest } from '@/api/test'
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
        dynamicItems: [
          {
            user_name: '',
            examinee_id: '',
            email: '',
            phone: ''
          }
        ]
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ],
        examinee_id: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        email: [
          { type: 'string', required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        phone: [
          { type: 'string', required: true, message: '请输入手机号', trigger: 'blur' }
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
        const { examinee_id = '', user_name = '', email = '', phone = '' } = JSON.parse(JSON.stringify(this.updataObj))
        const obj = { examinee_id, user_name, phone, email }
        this.$set(this.ruleForm.dynamicItems, 0, { ...obj })
      }
    }
  },
  created() {
    this.isOpen = this.dialogVisible
  },
  methods: {
    deleteItems(i) {
      this.ruleForm.dynamicItems.splice(i, 1)
    },
    addItem() {
      const obj = {
        user_name: '',
        examinee_id: '',
        email: '',
        phone: ''
      }
      this.ruleForm.dynamicItems.push(obj)
    },
    handleClose() {
      this.$emit('userDialog', false)
    },
    handleUser(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.type === 1) {
            const examinee_data = { examinee_data: this.ruleForm.dynamicItems }
            const res = await createTest(examinee_data)
            if (res?.code === 200) {
              this.$set(this.ruleForm.dynamicItems, [
                {
                  user_name: '',
                  examinee_id: '',
                  email: '',
                  phone: ''
                }
              ])
              this.$message({
                type: 'success',
                message: '应聘者创建成功'
              })
              this.$emit('loadEvent')
            } else {
              this.$message('应聘者信息创建失败')
            }
          } else {
            const examinee_data = { examinee_data: this.ruleForm.dynamicItems[0] }
            const res = await updateTest(examinee_data)
            if (res?.code === 200) {
              this.ruleForm.dynamicItems = [
                {
                  user_name: '',
                  examinee_id: '',
                  email: '',
                  phone: ''
                }
              ]
              this.$message({
                type: 'success',
                message: '应聘者信息修改成功'
              })
              this.$emit('loadEvent')
            } else {
              this.$message('应聘者信息修改失败')
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
