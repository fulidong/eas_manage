<template>
  <div class="app-container">
    <div class="flex items-center">
      <div class="w-300 h-[40px] mr-30">
        <div class="flex items-center">
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
      </div>
      <div class="w-300 h-[40px] mr-30">
        <div class="flex items-center">
          <div class="text-16 whitespace-nowrap">搜索试卷维度：</div>
          <el-select
            v-model="demsitionValue"
            remote
            reserve-keyword
            placeholder="请选择试题维度"
            :remote-method="getSearchDemsitionList"
            :loading="demsitionLoading"
            @change="changeDemistionrId"
          >
            <el-option
              v-for="item in demsitionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div><el-button type="primary" @click.stop="dialogVisible=true">新增题目</el-button></div>
    </div>
    <div class="h-full mt-50 flex flex-col  flex-1">
      <div v-if="questionList.length&&!isLoading">
        <el-table
          :data="questionList"
          border
          max-height="500"
          style="width: 100%"
          @cell-click="jumpDetail"
        >
          <el-table-column
            prop="title"
            label="题目标题"
            width="200"
          />
          <el-table-column
            prop="remark"
            label="备注"
            width="180"
          />
          <el-table-column label="题目类型">
            <template slot-scope="scope">
              <div classs="text-center leading-20 text-16">{{ scope.row.question_type_id===0?'单选':scope.row.question_type_id===1?'多选':'判断' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="order"
            label="题目序号"
          />
          <el-table-column
            prop="sale_paper_id"
            label="关联试卷id"
          />
          <el-table-column
            prop="sales_paper_dimension_id"
            label="关联维度id"
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
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="warning" class="h-[30px]" size="small" @click.stop="handelUpdate( scope.row)">修改</el-button>
              <el-button type="danger" class="h-[30px] ml-10" size="small" @click.stop="handelDelete( scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="isNotData " class="flex-1 mt-100">
        <el-empty description="此试卷暂时没有维度信息" />
      </div>
    </div>
    <create-topic-dialog :type="type" :cur-sale-id="demsitionId" :paper-id="curId" :updata-obj="upData" :dialog-visible="dialogVisible" @loadEvent="getMyQuestionList()" @userDialog="closeDialog" />
    <detail-dialog :dialog-visible="isShowDetail" :detail-obj="detailData" @userDialog="isShowDetail=false" />
  </div>
</template>

<script>
import { getDimensionUsableList, getDimensionList } from '@/api/dimension.js'
import { getQuesitionList, quesitionDelete, getQuesitionDetail } from '@/api/quesition.js'
import createTopicDialog from '@/components/paper/createTopicDialog.vue'
import detailDialog from '@/components/paper/detailDialog.vue'
export default {
  name: 'Topic',
  components: {
    'create-topic-dialog': createTopicDialog,
    'detail-dialog': detailDialog
  },
  data() {
    return {
      list: null,
      listLoading: true,
      value: '',
      curId: '',
      type: 1,
      params: {
        sales_paper_id: '',
        sales_paper_dimension_id: ''
      },
      usableObj: {
        key_word: '',
        page_index: 1,
        page_size: 10
      },
      paperList: [],
      dialogVisible: false,
      questionList: [],
      upData: {},
      detailData: {},
      isNotData: false,
      isShowDetail: false,
      demsitionValue: '',
      demsitionId: '',
      demsitionList: [],
      demsitionLoading: false
    }
  },
  created() {
    this.getSearchList(1)
  },
  methods: {
    async getMyQuestionList() {
      try {
        this.isLoading = true
        this.params.sales_paper_id = this.curId
        this.params.sales_paper_dimension_id = this.demsitionId
        const res = await getQuesitionList(this.params)
        console.log(res, '数据对对对')
        this.questionList = res?.data?.question_data || []
        this.isNotData = !res?.data?.question_data?.length
        this.isLoading = false
      } catch (error) { console.log(error, '获取数据报错') }
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
          this.getSearchDemsitionList()
          this.getMyQuestionList()
        }
        this.loading = false
      } catch (error) { this.loading = false; console.log('试卷可用列表报错', error) }
    },
    async getSearchDemsitionList() {
      try {
        this.demsitionLoading = true
        const res = await getDimensionList({ sales_paper_id: this.curId })
        this.demsitionList = res?.data?.dimension_data?.map(x => {
          return { label: x.dimension_name, value: x.dimension_id
          }
        })
        console.log(res, this.demsitionList, 'gfgggg')
        this.demsitionValue = this.demsitionList[0]?.label
        this.demsitionId = this.demsitionList[0]?.value
        this.demsitionLoading = false
      } catch (error) { console.log('试卷维度列表报错', error) }
    },
    handelDelete(obj) {
      this.$confirm('此操作将永久删除此维度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await quesitionDelete(
          { sales_paper_id: this.curId,
            question_id: obj.question_id
          })
        if (res.code === 200) {
          this.getMyQuestionList()
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
    async handelUpdate(obj) {
      const res = await getQuesitionDetail({ question_id: obj?.question_id })
      console.log(res, '详情的数据')
      if (res?.code === 200) {
        this.upData = res?.data?.question_data
        this.type = 2
        this.dialogVisible = true
      }
    },
    changePaperId(e) {
      this.curId = e
      this.getMyQuestionList()
    },
    changeDemistionrId(e) {
      this.demsitionId = e
      this.getMyQuestionList()
    },
    closeDialog() {
      this.type = 1
      this.$set(this.upData, {})
      this.dialogVisible = false
    },
    async jumpDetail(e) {
      console.log(e)
      const res = await getQuesitionDetail({ question_id: e?.question_id })
      console.log(res, '详情的数据')
      if (res?.code === 200) {
        this.detailData = res?.data?.question_data
        this.isShowDetail = true
      }
    }
  }
}
</script>
