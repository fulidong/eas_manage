<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="isOpen"
    width="50%"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <div>
        <div
          v-for="(item, idx) in ruleForm.dynamicItems"
          :key="idx"
          class="p-10 rounded-4 mt-5"
          :style="{ border: '1px solid #EDEDED' }"
        >
          <el-form-item label="应聘者名称" :prop="`dynamicItems.${idx}.user_name`">
            <el-input v-model="item.user_name" />
          </el-form-item>

          <el-form-item label="邮箱" :prop="`dynamicItems.${idx}.email`">
            <el-input v-model="item.email" />
          </el-form-item>

          <el-form-item label="手机" :prop="`dynamicItems.${idx}.phone`">
            <el-input v-model="item.phone" />
          </el-form-item>

          <el-button v-if="idx > 0" type="danger" size="small" @click.stop="deleteItems(idx)">
            删除
          </el-button>
        </div>

        <el-button v-if="type === 1" type="primary" class="mt-5" size="small" @click.stop="addItem">
          新增应聘者
        </el-button>
      </div>
    </el-form>

    <div class="flex items-center mt-5 justify-center">
      <el-button type="primary" @click.stop="submitForm">提交应聘者信息</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createTest, updateTest } from '@/api/test'

export default {
  name: 'UserDialog',
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
      default: () => ({})
    }
  },
  data() {
    return {
      isOpen: false,
      ruleForm: {
        dynamicItems: []
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, message: '长度最少2个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.type === 1 ? '新增用户' : '修改用户'
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        if (val) {
          // ✅ 对话框打开时，强制根据当前 type 初始化表单
          this.isOpen = true
          this.$nextTick(() => {
            this.resetForm()
          })
        } else {
          this.isOpen = false
        }
      }
    },
    // ✅ 监听 type 和 updataObj，只要变化就尝试重置（打开状态下也生效）
    type: {
      immediate: true,
      handler() {
        if (this.dialogVisible) {
          this.$nextTick(() => {
            this.resetForm()
          })
        }
      }
    },
    updataObj: {
      deep: true,
      handler() {
        if (this.type === 2 && this.dialogVisible) {
          this.$nextTick(() => {
            this.resetForm()
          })
        }
      }
    }
  },
  methods: {
    resetForm() {
      // ✅ 清空所有数据
      this.ruleForm.dynamicItems = []

      if (this.type === 1) {
        // 新增：添加一条空数据（examinee_id 为空，提交时用）
        this.ruleForm.dynamicItems.push({
          user_name: '',
          examinee_id: '',
          email: '',
          phone: ''
        })
      } else if (this.type === 2 && this.updataObj) {
        // 修改：填充数据，保留 examinee_id
        const { examinee_id = '', user_name = '', email = '', phone = '' } = this.updataObj
        this.ruleForm.dynamicItems.push({
          user_name,
          email,
          phone,
          examinee_id
        })
      }
    },

    addItem() {
      this.ruleForm.dynamicItems.push({
        user_name: '',
        examinee_id: '',
        email: '',
        phone: ''
      })
    },

    deleteItems(idx) {
      if (this.ruleForm.dynamicItems.length > 1) {
        this.ruleForm.dynamicItems.splice(idx, 1)
      }
    },

    handleClose() {
      // ✅ 关闭时重置表单验证
      this.$refs.ruleForm?.resetFields?.()
      // ✅ 通过 emit 通知父组件关闭
      this.$emit('userDialog', false)
    },

    async submitForm() {
      try {
        await this.$refs.ruleForm.validate()

        const payload = this.type === 1
          ? { examinee_data: this.ruleForm.dynamicItems }
          : { examinee_data: this.ruleForm.dynamicItems[0] }

        const res = this.type === 1
          ? await createTest(payload)
          : await updateTest(payload)

        if (res?.code === 200) {
          this.$message.success(`${this.type === 1 ? '创建' : '修改'}成功`)
          this.$emit('loadEvent')
          this.handleClose()
        } else {
          this.$message.error(`${this.type === 1 ? '创建' : '修改'}失败`)
        }
      } catch (error) {
        console.log('提交失败', error)
      }
    }
  }
}
</script>

<style lang="scss">
.pluisin-user {
  max-height: 600px;
  overflow-y: auto;
}
</style>