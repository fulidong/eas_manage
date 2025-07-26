<template>
    <el-dialog
        :title="type==1?'新增用户':'修改用户'"
        :visible.sync="isOpen"
        width="50%"
        :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="考生名称" prop="user_name">
                <el-input v-model="ruleForm.user_name"></el-input>
            </el-form-item>
            <el-form-item label="考生id" prop="examinee_id">
                <el-input v-model="ruleForm.examinee_id"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            </el-form>
            <div class="flex items-center justify-center">
                <el-button type="primary" @click.stop="handleUser('ruleForm')">提交考生信息</el-button>
            </div>
    </el-dialog>
</template>

<script>
import {createTest,updateTest} from '@/api/test'
export default {
    name: 'userDiolpg',
    props:{
        type:{
            type:Number,
            default:1
        },
        dialogVisible:{
            type:Boolean,
            default:false
        },
        updataObj:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return {
            isOpen:false,
            ruleForm:{
                user_name: '',
                examinee_id: '',
                email: '',
                phone:''
            },
             rules: {
                user_name: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, message: '长度最少3个字符', trigger: 'blur' }
                ],
                examinee_id: [
                    { required: true, message: '请输入账号',trigger: 'blur' }
                ],
                email: [
                    { type: 'string', required: true, message: '请输入邮箱', trigger: 'blur' }
                ],
                phone: [
                    { type: 'string', required: true, message: '请输入手机号', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.isOpen = this.dialogVisible
    },
    methods:{
        handleClose(){
            this.$emit('userDialog',false)
        },
        changeStatus(e){
            this.ruleForm.user_status = e
        },
        handleUser(formName){
            this.$refs[formName].validate(async (valid) => {
            if (valid) {
               if(this.type===1){
                 const examinee_data = {examinee_data:this.ruleForm}
                 const res = await createTest(examinee_data)
                 if(res?.code===200){
                    this.$set(this.ruleForm,{
                        user_name: '',
                        examinee_id: '',
                        email: '',
                        phone:''
                    })
                    this.$message({
                        type:'success',
                        message:'考生创建成功'
                    })
                    this.$emit('loadEvent')
                 }else {
                    this.$message('考生信息创建失败')
                 }
               }else{
                const examinee_data = {examinee_data:this.ruleForm}
                const res = await updateTest(examinee_data)
                if(res?.code===200){
                    this.ruleForm={
                        user_name: '',
                        examinee_id: '',
                        email: '',
                        phone:''
                    }
                    this.$message({
                        type:'success',
                        message:'考生信息修改成功'
                    })
                    this.$emit('loadEvent')
                 }else {
                    this.$message('考生信息修改失败')
                 }
               }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        }
    },
    watch:{
        dialogVisible(n){
            this.isOpen = n
        },
        type(n){
            if(n===2){
                const {examinee_id='',user_name='',email='',phone=''} = JSON.parse(JSON.stringify(this.updataObj))
                this.ruleForm.examinee_id = examinee_id
                this.ruleForm.user_name = user_name
                this.ruleForm.phone = phone
                this.ruleForm.email = email
            }
        }
    }
}
</script>

<style scoped>

</style>
