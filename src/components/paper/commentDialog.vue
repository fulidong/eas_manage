<template>
  <el-dialog
    :title="'评语列表'"
    :visible.sync="isOpen"
    width="900px"
    max-height="500px"
    custom-class="pluisin-user"
    :before-close="handleClose"
  >
    <template #title>
      <h2 class="text-18">评语列表</h2>
      <div class="text-16 mt-10" style="color:red;">*提示：分数区间按左闭右开处理</div>
    </template>
    <div class="flex items-center mb-40">
      <div class="w-300 text-center text-16 font-semibold">评论内容</div>
      <div class="w-200 text-center text-16 font-semibold">分数上限</div>
      <div class="w-200 text-center text-16 font-semibold">分数下限</div>
      <div class="w-100 text-right text-16 font-semibold">操作</div>
    </div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
      <div v-for="(item,idx) in ruleForm.comment_data" :key="idx" class="rounded-4 mt-5 flex items-cente">
        <!-- <el-form-item label="" width="200px" :prop="`comment_data.${idx}.sales_paper_comment_id`">
          <el-input v-model="item.sales_paper_comment_id" class="w-200" />
        </el-form-item> -->
        <el-form-item label="" width="300px" :prop="`comment_data.${idx}.content`">
          <el-input v-model="item.content" class="w-290 ml-10" />
        </el-form-item>
        <el-form-item label="" width="200px" :prop="`comment_data.${idx}.up_score`">
          <el-input v-model="item.up_score" class="w-190 ml-10" />
        </el-form-item>
        <el-form-item label="" width="200px" :prop="`comment_data.${idx}.low_score`">
          <el-input v-model="item.low_score" class="w-190 ml-10" />
        </el-form-item>
        <el-form-item v-if="idx>0" label="" width="100px" prop="">
          <el-button type="danger" size="small" class="ml-20" @click.stop="deleteItems(idx)">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="info" size="small" class="mt-20" @click.stop="addItems()">新增评语</el-button>
    <div class="flex items-center mt-5 justify-center">
      <el-button type="primary" @click.stop="saveComment('ruleForm')">保存评语</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSalesCommentList, saveSalesComment } from '@/api/sales'
export default {
  name: 'UserDiolpg',
  props: {
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
        comment_data: [
          {
            sales_paper_comment_id: '',
            content: '',
            up_score: 0,
            low_score: 0,
            updated_at: '',
            updated_by: ''
          }
        ]
      },
      rules: {
        content: [
          { required: true, message: '请输入评语', trigger: 'blur' },
          { min: 3, message: '长度最少3个字符', trigger: 'blur' }
        ],
        up_score: [
          { required: true, message: '请输入分数上限', trigger: 'blur' }
        ],
        low_score: [
          { required: true, message: '请输入分数下限', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(n) {
      this.isOpen = n
      if (n === true) {
        this.getSalesComment()
      }
    }
  },
  created() {
    this.isOpen = this.dialogVisible
  },
  methods: {
    addItems() {
      const obj = {
        sales_paper_comment_id: '',
        content: '',
        up_score: 0,
        low_score: 0,
        updated_at: '',
        updated_by: ''
      }
      this.ruleForm.comment_data.push(obj)
    },
    deleteItems(i) {
      this.ruleForm.comment_data.splice(i, 1)
    },
    async getSalesComment() {
      try {
        const res = await getSalesCommentList({ sales_paper_id: this.paperId })
        console.log(res, '获取到的数据')
        if (res?.data?.comment_data?.length > 0) {
          this.ruleForm.comment_data = res?.data?.comment_data || []
        }
      } catch (error) { console.log(error, '评论报错') }
    },
    handleClose() {
      this.$emit('closeDialog', false)
    },
    async saveComment(formName) {
      try {
        const obj = {
          sales_paper_id: this.paperId,
          comment_data: this.ruleForm.comment_data
        }
        const res = await saveSalesComment(obj)
        if (res?.code === 200) {
          this.$message({
            type: 'success',
            message: '评语保存成功'
          })
          this.ruleForm.comment_data = [
            {
              sales_paper_comment_id: '',
              content: '',
              up_score: 0,
              low_score: 0,
              updated_at: '',
              updated_by: ''
            }
          ]
          this.getSalesComment()
        } else {
          this.$message('评语保存失败')
        }
      } catch (error) {
        this.$message('服务器错误请稍后重试')
        console.log(error, '接口报错~~~')
      }
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
