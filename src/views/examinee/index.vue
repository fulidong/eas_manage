<template>
  <div style="max-height:calc(100vh - 150px)" class="app-container flex flex-col">
    <div class="flex items-center">
      <div class="w-3/12 h-[40px] mr-10">
        <el-input v-model="search_name" placeholder="用户名搜索" @keyup.enter.native="searchEvent">
          <i slot="prefix" class="el-input__icon cursor-pointer el-icon-search" @click.stop="searchEvent()" />
        </el-input>
      </div>
      <div><el-button type="primary" @click.stop="handelAdd()">新增应聘者</el-button></div>
    </div>
    <div class="h-full mt-30" style="min-height:calc(100vh - 250px)">
      <el-table
        :data="userList"
        border
        max-height="500"
        style="width: 100%"
      >
        <el-table-column
          prop="user_name"
          label="用户名称"
          width="180"
        />
        <el-table-column
          prop="phone"
          label="电话"
          width="180"
        />
        <el-table-column
          prop="email"
          label="邮箱"
        />
        <!-- <el-table-column prop="status" label="是否激活" /> -->
        <el-table-column
          prop="updated_at"
          label="最后更新时间"
        />
        <el-table-column
          prop="updated_by"
          label="最后更新人"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="warning" class="h-[30px]" size="small" @click.stop="handelUpdata( scope.row)">修改</el-button>
            <el-button type="danger" class="h-[30px]" size="small" @click.stop="handelDelete( scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex mt-2 items-center justify-center">
        <el-pagination
          :current-page.sync="params.page_index"
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <user-dialog v-if="dialogVisible" :dialog-visible="dialogVisible" :updata-obj="upData" :type="type" @loadEvent="loadEvent" @userDialog="dialogVisible=false" />
  </div>
</template>

<script>
import { getTestList, deleteTest } from '@/api/test.js'
import userDialog from '@/components/examinee/userDialog.vue'
export default {
  name: 'Examinee',
  components: {
    'user-dialog': userDialog
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
      userList: [], // 用户数据
      dialogVisible: false, // 显示用户信息弹框
      type: 1,
      upData: {} // 需要修改数据
    }
  },
  created() {
    this.getMyUserList()
  },
  methods: {
    async getMyUserList() {
      try {
        const res = await getTestList(this.params)
        this.userList = res?.data?.examinee_data || []
        this.total = res?.data?.total
      } catch (error) {
        console.log('获取用户数据错误', error)
      }
    },
    searchEvent() {
      this.params.key_word = this.search_name
      this.getMyUserList()
    },
    loadEvent() {
      this.dialogVisible = false
      this.type = 1
      this.getMyUserList()
    },
    handelDelete(obj) {
      this.$confirm('此操作将永久删除此应聘者, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteTest({ examinee_id: obj.examinee_id })
        if (res.code === 200) {
          this.getMyUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message('删除失败!')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handelAdd() {
      this.upData = {}
      this.type = 1
      this.dialogVisible = true
    },
    handelUpdata(obj) {
      this.upData = obj
      this.type = 2
      this.dialogVisible = true
    },
    handleCurrentChange(e) {
      this.params.page_index = e
      this.getMyUserList()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

