<template>
  <div style="max-height:calc(100vh - 150px)" class="dashboard-container flex flex-col">
    <div class="flex items-center">
      <div class="w-3/12 h-[40px] mr-10">
        <el-input v-model="search_name" placeholder="试卷名搜索" @keyup.enter.native="searchEvent">
          <i slot="prefix" class="el-input__icon cursor-pointer el-icon-search" @click.stop="searchEvent()" />
        </el-input>
      </div>
      <div class="mr-10">
        <el-select v-model="curStatus.value" placeholder="请选择" @change="slectedStatus">
          <el-option
            v-for="item in statusMenu"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div><el-button type="primary" @click.stop="type=1;dialogVisible=true">新增试卷</el-button></div>
    </div>
    <div class="h-full mt-30 flex flex-col flex-1" style="min-height:calc(100vh - 250px)">
      <div>
        <el-table
          :data="salesList"
          
          max-height="800"
          style="width: 100%"
        >
          <el-table-column
            prop="sales_paper_id"
            label="试卷id"
            width="180"
          />
          <el-table-column
            prop="sales_paper_name"
            label="试卷名称"
            width="180"
          />
          <el-table-column
            prop="recommend_time_lim"
            label="推荐作答时长/分钟"
          />
          <el-table-column
            prop="max_score"
            label="最高分数上限"
          />
          <el-table-column
            prop="min_score"
            label="最低分数下限"
          />
          <el-table-column label="是否启用">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.is_enabled"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="是否使用">
            <template slot-scope="scope">
              <div classs="text-center leading-20 text-16">{{ scope.row.is_used===1?'已使用':'未使用' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="mark"
            label="备注"
          />
          <el-table-column label="是否存在总分">
            <template slot-scope="scope">
              <div classs="text-center leading-20 text-16">{{ scope.row.is_sum_score===1?'是':'否' }}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="updated_at"
            label="最后更新时间"
          />
          <el-table-column
            prop="updated_by"
            label="最后更新人"
          />
          <el-table-column
            width="250"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="warning" class="h-[30px]" size="small" @click.stop="handelUpdata( scope.row)">修改</el-button>
              <el-button type="danger" class="h-[30px]" size="small" @click.stop="handelDelete( scope.row)">删除</el-button>
              <el-button type="primary" class="h-[30px]" size="small" @click.stop="handelComment( scope.row)">评语</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="flex mt-20 items-center justify-center">
      <el-pagination
        :current-page.sync="params.page_index"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <sales-dialog :dialog-visible="dialogVisible" :updata-obj="upData" :type="type" @loadEvent="loadEvent" @userDialog="type=1;dialogVisible=false" />
    <comment-dialog :dialog-visible="isShowComment" :paper-id="curObj.sales_paper_id" @loadEvent="loadEvent" @closeDialog="isShowComment=false" />
  </div>
</template>

<script>
import { getSalesList, salesDelete, salesStatus } from '@/api/sales.js'
import salesDialog from '@/components/paper/salesDialog.vue'
import commentDialog from '@/components/paper/commentDialog.vue'
export default {
  name: 'UserBase',
  components: {
    'sales-dialog': salesDialog,
    'comment-dialog': commentDialog
  },
  data() {
    return {
      params: {
        key_word: '',
        sales_paper_status: -1,
        page_index: 1,
        page_size: 10
      },
      search_name: '',
      total: 0,
      salesList: [], // 用户数据
      //   是否激活,1.已激活;0.未激活；-1全部.
      curStatus: {
        value: -1,
        label: '全部'
      },
      statusMenu: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }],
      dialogVisible: false, // 显示用户信息弹框
      type: 1,
      upData: {}, // 需要修改数据
      curObj: {}, // 当前评语的数据
      isShowComment: false // 评语列表
    }
  },
  computed: {

  },
  created() {
    this.getMySalesList()
  },

  methods: {
    async getMySalesList() {
      try {
        const res = await getSalesList(this.params)
        this.salesList = res?.data?.sales_paper_list || []
        this.total = res?.data?.total
      } catch (error) {
        console.log('获取用户数据错误', error)
      }
    },
    async changeStatus(i, e) {
      try {
        console.log(i, e)
        const showStatus = e?.is_enabled === 1 ? 0 : 1
        this.$set(this.salesList, i, { ...e, is_enabled: showStatus })
        const res = await salesStatus({ sales_paper_id: e?.sales_paper_id, sales_paper_status: showStatus })
        console.log(res, '切换状态')
      } catch (error) {
        console.log(error)
        this.$message('服务器内部报错')
      }
    },
    searchEvent() {
      this.params.key_word = this.search_name
      this.getMySalesList()
    },
    slectedStatus(e) {
      this.params.sales_paper_status = e
      this.getMySalesList()
    },
    loadEvent() {
      this.dialogVisible = false
      this.type = 1
      this.getMySalesList()
    },
    handelUpdata(obj) {
      this.upData = obj
      this.type = 2
      this.dialogVisible = true
    },
    handelDelete(obj) {
      this.$confirm('此操作将永久删除此试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await salesDelete({ sales_paper_id: obj.sales_paper_id })
        if (res.code === 200) {
          this.getMySalesList()
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
    handleCurrentChange(e) {
      this.params.page_index = e
      this.getMySalesList()
    },
    handelComment(obj) {
      this.curObj = obj
      this.isShowComment = true
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
