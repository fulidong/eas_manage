<template>
  <div class="dashboard-container">
    <div class="flex items-center">
        <div class="w-3/12 h-[40px] mr-10">
            <el-input v-model="search_name"  placeholder="用户名搜索">
                <i slot="prefix" class="el-input__icon cursor-pointer el-icon-search" @click.stop="searchEvent()"></i>
            </el-input>
        </div>
        <div class="mr-10">
            <el-select v-model="curStatus.value" @change="slectedStatus" placeholder="请选择">
                <el-option
                    v-for="item in statusMenu"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="mr-10">
            <el-select v-model="curAdmin.value" @change="slectedAdmin" placeholder="请选择">
                <el-option
                    v-for="item in adminMenu"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div><el-button type="primary" @click.stop="dialogVisible=true">新增用户</el-button></div>
    </div>
    <div class="h-full mt-5">
        <el-table
            :data="userList"
            border
            max-height="500"
            style="width: 100%">
            <el-table-column
                prop="user_name"
                label="用户名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="login_account"
                label="账号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column  label="是否激活">
                <template slot-scope="scope">
                    <el-switch
                        :value="scope.row.user_status"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeStatus(scope.$index, scope.row)"
                        >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="重置密码">
                <template slot-scope="scope">
                     <el-button type="primary" class="h-[30px]" size="small" @click.stop="handelResetPassword( scope.row)">重置密码</el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="updated_at"
                label="最后更新时间">
            </el-table-column>
            <el-table-column
                prop="updated_by"
                label="最后更新人">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                     <el-button type="warning" class="h-[30px]" size="small" @click.stop="handelUpdata( scope.row)">修改</el-button>
                    <el-button type="danger" class="h-[30px]" size="small" @click.stop="handelDelete( scope.row)">删除</el-button>
                    </template>
            </el-table-column>
        </el-table>
        <div class="flex mt-2 items-center justify-center">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="params.page_index"
                layout="prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
    </div>
    <user-dialog :dialogVisible="dialogVisible" :updataObj="upData" :type="type" @loadEvent="loadEvent" @userDialog="dialogVisible=false"></user-dialog>
    <reset-password :dialogVisible="isOpenReset" :obj="pasObj" @close="isOpenReset = false;pasObj={}"></reset-password>
  </div>
</template>

<script>
import { getUserList,setUserStatus,deleteUser } from '@/api/user.js'
import userDialog from '@/components/user/userDialog.vue' 
import resetPassword from '@/components/user/resetPassword.vue' 
export default {
  name: 'UserBase',
    components:{
        'user-dialog':userDialog,
        'reset-password':resetPassword
    },
    data() {
        return {
        params: {
            key_word: '',
            user_status: -1,
            user_type: -1,
            page_index: 1,
            page_size: 10
        },
        search_name:'',
        total:0,
        userList:[], // 用户数据
        //   是否激活,1.已激活;0.未激活；-1全部.
        curStatus:{
            value:-1,
            label:'全部'
        },
        statusMenu:[
        {
            label:'全部',
            value:-1
        },
        {
            label:'已激活',
            value:1
        },
        {
            label:'未激活',
            value:0
        }],
        //   是否管理员
        curAdmin:{
            value:-1,
            label:'全部'
        },
        adminMenu:[
        {
            label:'全部',
            value:-1
        },
        {
            label:'管理员',
            value:0
        },
        {
            label:'普通用户',
            value:1
        }],
        dialogVisible:false, // 显示用户信息弹框
        type:1,
        upData:{}, // 需要修改数据
        pasObj:{}, // 重置密码数据
        isOpenReset:false // 重置密码
        }
    },
    computed: {
    
    },
    created(){
        this.getMyUserList()
    },

    methods:{
        async getMyUserList(){
            try{
                const res =await getUserList(this.params)
                console.log(res,'fffffffffffffffffff')
                this.userList = res?.data?.user_list||[]
                this.total = res?.data?.total
            }catch(error){
                console.log('获取用户数据错误',error)
            }
        },
        async changeStatus(i,e){
            try{
                console.log(i,e)
                const showStatus = e?.user_status===1?0:1
                this.$set(this.userList,i,{...e,user_status:showStatus})
                const res = await setUserStatus({user_id:e?.user_id,user_status:showStatus})
            }catch(error){
                console.log(error)
                this.$message('服务器内部报错')
            }
        },
        searchEvent(){
            this.params.key_word = this.search_name
            this.getMyUserList()
        },
        slectedStatus(e){
            this.params.user_status = e
            this.getMyUserList()
        },
        slectedAdmin(e){
            this.params.user_type = e
            this.getMyUserList()
        },
        loadEvent(){
            this.dialogVisible = false
            this.type=1
            this.getMyUserList()
        },
        handelUpdata(obj){
            this.upData = obj
            this.type = 2
            this.dialogVisible = true
        },
        handelDelete(obj){
            this.$confirm('此操作将永久删除此用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async() => {
                    const res = await deleteUser({user_id:obj.user_id})
                    if(res.code===200){
                        this.getMyUserList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else{
                        this.$message('删除失败!');
                    }
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleCurrentChange(e){
            this.params.page_index = e
            this.getMyUserList()
        },
        // 重置密码
        handelResetPassword(obj){
            this.pasObj = obj
            this.isOpenReset = true
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
