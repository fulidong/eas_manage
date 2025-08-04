<template>
  <div style="max-height:calc(100vh - 150px)" class="app-container flex flex-col">
    <div class="flex items-center">
      <div class="w-w-300 h-[40px] mr-20 flex items-center">
        <div class="text-16 whitespace-nowrap">搜索可用试卷：</div>
        <el-select
          v-model="value"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="getSearchList"
          :loading="loading"
          @change="changePaperId"
        >
          <el-option
            v-for="item in paperList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="mr-20">
        <el-select v-model="curStatus.value" placeholder="请选择" @change="slectedStatus">
          <el-option
            v-for="item in stageList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="w-300 h-[40px] mr-20">
        <el-input v-model="search_name" placeholder="用户名搜索">
          <i slot="prefix" class="el-input__icon cursor-pointer el-icon-search" @click.stop="searchEvent()" />
        </el-input>
      </div>
    </div>
    <div class="h-full mt-30 flex-1" style="min-height:calc(100vh - 250px)">
      <el-table
        :data="provideList"
        border
        max-height="800"
        style="width: 100%"
      >
        <el-table-column
          prop="examinee_name"
          label="考生名称"
          width="180"
        />
        <el-table-column
          prop="examinee_email"
          label="考生邮箱"
          width="180"
        />
        <el-table-column
          prop="examinee_phone"
          label="考生电话"
        />
        <el-table-column
          prop="sales_paper_id"
          label="关联试卷id"
        />
        <el-table-column
          prop="sales_paper_name"
          label="试卷名称"
        />
        <el-table-column
          prop="stage_number"
          label="关联试卷id"
        />
        <el-table-column label="是否激活">
          <template slot-scope="scope">
            <div class="">{{ showName(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ReportPath"
          label="报告地址"
        />
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
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="primary" class="h-[30px]" size="small" @click.stop="handelplush( scope.row)">发放试卷</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="isNotData " class="flex-1 mt-200 mb-200">
            <el-empty description="暂无数据" />
          </div>
        </template>
      </el-table>
    </div>
    <div class="flex mt-20 items-center justify-center">
      <el-pagination
        :current-page.sync="params.page_index"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getQuestionPlushList, questionPlush } from '@/api/quesition.js'
import { getDimensionUsableList } from '@/api/dimension.js'
export default {
  name: 'Pubilish',
  data() {
    return {
      params: {
        sales_paper_id: '',
        stage_number: -1,
        key_word: '',
        page_index: 1,
        page_size: 10
      },
      usableObj: {
        key_word: '',
        page_index: 1,
        page_size: 10
      },
      curStatus: {
        value: -1,
        label: '全部'
      },
      stageList: [{
        label: '全部',
        value: -1
      },
      {
        label: '未开始',
        value: 0
      },
      {
        label: '未提交',
        value: 1
      },
      {
        label: '已提交',
        value: 2
      },
      {
        label: '已算分',
        value: 3
      },
      {
        label: '已出报告',
        value: 4
      },
      {
        label: '处理失败',
        value: 5
      }
      ],
      loading: false,
      paperList: [],
      value: '',
      curId: '',
      search_name: '',
      provideList: [],
      total: 0,
      isNotData: false
    }
  },
  watch: {

  },
  created() {
    this.getSearchList(1)
  },
  methods: {
    showName(e) {
      const obj = {
        0: '未开始',
        1: '未提交',
        2: '已提交',
        3: '已算分',
        4: '已出报告',
        5: '处理失败'
      }
      return obj[e?.stage_number]
    },
    async getQuestionList() {
      try {
        const res = await getQuestionPlushList(this.params)
        this.provideList = res?.data?.provide_data || []
        this.total = res?.data?.total
        this.isNotData = !this.provideList?.length
        console.log(res, '接口的数据')
      } catch (error) {
        console.log('接口报错了', error)
      }
    },
    async getSearchList(type = 0) {
      try {
        this.loading = true
        const res = await getDimensionUsableList(this.usableObj)
        this.paperList = res?.data?.sales_paper_list?.map(x => {
          return { label: x.sales_paper_name, value: x.sales_paper_id
          }
        })
        console.log(res, this.paperList, 'gfgggg')
        if (type === 1) {
          this.value = this.paperList[0]?.label
          this.curId = this.paperList[0]?.value
          this.getQuestionList()
        }
        this.loading = false
      } catch (error) { this.loading = false; console.log('试卷可用列表报错', error) }
    },
    slectedStatus(e) {
      this.params.stage_number = e
      this.getQuestionList()
    },
    changePaperId(e) {
      this.curId = e
      this.params.sales_paper_id = this.curId
      this.getQuestionList()
    },
    handleCurrentChange(e) {
      this.params.page_index = e
      this.getQuestionList()
    },
    searchEvent() {
      this.params.key_word = this.search_name
      this.getQuestionList()
    },
    async handelplush(e) {
      try {
        const obj = {
          sales_paper_id: e?.sales_paper_id,
          examinee_ids: [e?.examinee_id]
        }
        const res = await questionPlush(obj)
        if (res?.code === 200) {
          this.$message({
            type: 'success',
            message: '试卷发放成功~~~'
          })
          this.getQuestionList()
        } else {
          this.$message('试卷发放失败~~~')
        }
        console.log(res, '接口的数据')
      } catch (error) {
        console.log('接口报错了', error)
      }
    }
  }
}
</script>

