<!-- @/views/examinee/components/SelectExamineeDialog.vue -->
<template>
  <el-dialog
    title="选择考生"
    :visible.sync="isVisible"
    width="70%"
    :before-close="handleClose"
    custom-class="select-examinee-dialog"
  >
    <div>
      <!-- 搜索 + 新增按钮（结构复用） -->
      <div class="flex items-center mb-4">
        <div class="w-3/12 h-[40px] mr-10">
          <el-input v-model="search_name" placeholder="用户名/邮箱/电话搜索"
          @keyup.enter.native="searchEvent">
            <i
              slot="prefix"
              class="el-input__icon cursor-pointer el-icon-search"
              @click.stop="searchEvent"
            />
          </el-input>
        </div>
      </div>

      <!-- 多选表格 -->
      <el-table
        ref="examineeTable"
        :data="userList"
        border
        max-height="400"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="user_name" label="用户名称" width="180" />
        <el-table-column prop="phone" label="电话" width="180" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="updated_at" label="最后更新时间" width="160" />
        <el-table-column prop="updated_by" label="最后更新人" width="120" />
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="flex mt-4 justify-center">
      <el-pagination
        :current-page.sync="params.page_index"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 按钮 -->
    <div class="flex items-center mt-4 justify-center">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        确定 (已选 {{ selectedList.length }} 人)
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTestList } from '@/api/test.js' // 复用考生列表接口

export default {
  name: 'SelectExamineeDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {
        key_word: '',
        page_index: 1,
        page_size: 10
      },
      search_name: '',
      total: 0,
      userList: [],
      loading: false,
      selectedList: []
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('close', !val)
      }
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.reset()
          this.getMyUserList()
        }
      }
    }
  },
  methods: {
    // 初始化或重置
    reset() {
      this.params = {
        key_word: '',
        page_index: 1,
        page_size: 10
      }
      this.search_name = ''
      this.selectedList = []
    },

    // 获取考生列表
    async getMyUserList() {
      this.loading = true
      try {
        console.log(this.params, "--------")
        const res = await getTestList(this.params)
        this.userList = res?.data?.examinee_data || []
        this.total = res?.data?.total || 0
      } catch (error) {
        console.log('获取用户数据错误', error)
      } finally {
        this.loading = false
      }
    },

    // 搜索
    searchEvent() {
      this.params.key_word = this.search_name
      this.params.page_index = 1
      this.getMyUserList()
    },

    // 分页
    handleCurrentChange(page) {
      this.params.page_index = page
      this.getMyUserList()
    },

    // 多选变化
    handleSelectionChange(selection) {
      this.selectedList = selection
    },

    // 提交选中项
    handleSubmit() {
      if (this.selectedList.length === 0) {
        this.$message.warning('请至少选择一个考生')
        return
      }

      // ✅ 去重：根据 user_id 或 examinee_id（根据你数据结构）
      // 假设字段是 examinee_id，如果没有，换成 user_name 或其他唯一字段
      const uniqueMap = new Map()
      this.selectedList.forEach(item => {
        const id = item.examinee_id || item.user_name // 根据实际情况调整
        if (id && !uniqueMap.has(id)) {
          uniqueMap.set(id, item)
        }
      })

      const uniqueList = Array.from(uniqueMap.values())
      this.$emit('submit', uniqueList)
    },

    // 关闭弹窗
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.select-examinee-dialog {
  .el-dialog__body {
    padding: 20px;
  }
}
</style>