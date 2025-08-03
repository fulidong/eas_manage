<template>
  <div style="min-height:calc(100vh - 50px)" class="app-container flex flex-col">
    <div class="flex items-center">
      <div class="w-1/12 h-[40px] mr-10">
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
      <div><el-button type="primary" @click.stop="dialogVisible=true">新增维度</el-button></div>
      <div class="ml-20"><el-button type="warning" @click.stop="type=2;dialogVisible=true">修改维度</el-button></div>
    </div>
    <div class="h-full mt-20 flex flex-col  flex-1">
      <div v-if="dimensionList.length&&!isLoading">
        <el-table
          :data="dimensionList"
          border
          max-height="500"
          style="width: 100%"
        >
          <el-table-column
            prop="dimension_id"
            label="维度id"
            width="180"
          />
          <el-table-column
            prop="dimension_name"
            label="维度名称"
            width="180"
          />
          <el-table-column
            prop="average_mark"
            label="平均分"
          />
          <el-table-column
            prop="standard_mark"
            label="标准差"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            prop="max_score"
            label="最高分数上限"
          />
          <el-table-column
            prop="min_score"
            label="最低分数下限"
          />
          <el-table-column label="是否启用该维度">
            <template slot-scope="scope">
              <div classs="text-center leading-20 text-16">{{ scope.row.is_choose===true?'是':'否' }}</div>
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
            width="100"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="danger" class="h-[30px]" size="small" @click.stop="handelDelete( scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="isNotData " class="flex-1 mt-100">
        <el-empty description="此试卷暂时没有维度信息" />
      </div>
      <dimension-dialog :type="type" :paper-id="curId" :dialog-visible="dialogVisible" :dimension-list="dimensionList" @closeDialog="dialogVisible=false;type=1" @loadEvent="getMyDimensionList()" />
    </div>
  </div></template>

<script>
import { getDimensionList, getDimensionUsableList, dimensionDelete } from '@/api/dimension.js'
import dimensionDialog from '@/components/paper/dimensionDialog.vue'
export default {
  name: 'Dimension',
  components: {
    'dimension-dialog': dimensionDialog
  },
  data() {
    return {
      value: '',
      curId: '',
      params: {
        sales_paper_id: ''
      },
      usableObj: {
        key_word: '',
        page_index: 1,
        page_size: 10
      },
      type: 1,
      loading: false,
      paperList: [],
      dialogVisible: false,
      isShowUpdate: false,
      dimensionList: [],
      isLoading: false,
      isNotData: false
    }
  },
  created() {
    this.getSearchList(1)
  },
  methods: {
    async getMyDimensionList() {
      try {
        this.isLoading = true
        this.params.sales_paper_id = this.curId
        const res = await getDimensionList(this.params)
        console.log(res, '数据对对对')
        this.dimensionList = res?.data?.dimension_data || []
        this.isNotData = !res?.data?.dimension_data?.length
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
          this.getMyDimensionList()
        }
        this.loading = false
      } catch (error) { this.loading = false; console.log('试卷可用列表报错', error) }
    },
    handelDelete(obj) {
      this.$confirm('此操作将永久删除此维度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await dimensionDelete(
          { sales_paper_id: this.curId,
            sales_paper_dimension_id: obj.dimension_id
          })
        if (res.code === 200) {
          this.getMyDimensionList()
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
    changePaperId(e) {
      this.curId = e
      this.getMyDimensionList()
    }
  }
}
</script>
