<template>
  <div class="login">
    <!-- 用ref拿到子组件，model是表单数据对象 -->
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">研究空间</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="passwd">
        <!-- 在子组件中监听事件必须用.native -->
        <el-input
          v-model="loginForm.passwd"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img src='../assets/logo/logo.png' @click='getCode' class="login-code-img"/>
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <el-button size="small"
          type="primary" @click="resetForm">重置</el-button>
        <el-button size="small"
          type="primary" @click='clearCookie'>清除cookie</el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2020 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import {getCodeImg} from '@/api/login'
import Cookies from 'js-cookie'
import {encrypt, decrypt} from '@/utils/jsencrypt'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  data(){
    return {
      codeUrl: '', //验证码的url
      loginForm: {
        username: 'admin',
        passwd: 'admin123',
        rememberMe: true,
        code: '',
        uuid: '',
      },
      loginRules: { //表单验证规则，对应上面的prop，prop和下面如果不用passwd而用password还会出现奇怪的错误
        username: [
          {required: true, trigger: 'blur', message: "用户名不能为空" }
        ],
        passwd: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: false, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: { //监视变量的变化
    $route: {
      handler: function(route){
        this.redirect = route.query && route.query.redirect
        console.log('in watch $route handler')
      },
      immediate: true, //使得绑定$route时就执行，不然在初始化时（如页面刷新，第一次进入页面）不会执行，只会在发生改变时才执行
    }
  },
  created(){ //创建的时候获取验证码和从cookie中读数据
    this.getCode()
    this.getCookie()
    //效果和监视watch是一样的，不过如果让login是keep-alive就不管用了
    console.log('this.$route', this.$route)
    this.redirect = this.$route.query && this.$route.query.redirect
    console.log('this.loginForm:', this.loginForm)
  },
  methods: {
    getCode(){ //获取验证码
      getCodeImg().then(res => { //向服务器请求验证码
        // this.codeUrl = "data:image/png;base64," + res.img;
        this.codeUrl = '/img/logo.4eeb8a8e.png'
        this.loginForm.uuid = res.uuid;
        console.log('in getCode')
      })
    },
    getCookie(){ //从cookies里获取信息，密码解密
      const username = Cookies.get('username')
      const passwd = Cookies.get('passwd')
      const rememberMe = Cookies.get('rememberMe')

      this.loginForm = {
        username: username ? username : this.loginForm.username,
        passwd: passwd ? decrypt(passwd) : this.loginForm.passwd,
        rememberMe: rememberMe == false ? false : true,
      }
      console.log(this.loginForm)
      console.log('passwd in cookie:', passwd)
    },
    handleLogin(){ //点击登录
      this.$refs.loginForm.validate(valid => { //拿到el-form子组件，表单验证
        if(valid){ //通过验证
          this.loading = true //修改loading状态
          if(this.loginForm.rememberMe){ //往cookie里加入用户名、加密后的密码
            Cookies.set('username', this.loginForm.username)
            //cookie里不能存储密码的明文，可以防止别人偷看浏览器，但这个加密算法写在js里也不安全？
            Cookies.set('passwd', encrypt(this.loginForm.passwd))
            Cookies.set('rememberMe', this.loginForm.rememberMe)
          }
          else{ //否则移除它们
            Cookies.remove('username')
            Cookies.remove('passwd')
            Cookies.remove('rememberMe')
          }
          this.$store //调用全局方法Login，传入表单对象
            .dispatch('Login', this.loginForm)
            .then(() => { //Login成功
              console.log('login success')
              Message.success('login success!')
              console.log('token:', Cookies.get('login-token'))
              // this.$router.push({path: this.redirect || '/'}) //跳转到原本要去的地方
              //             .catch(err => console.log('err:', err))
              // this.$router.back() //返回原本的地方
              // this.$router.push({path: 'http://www.baidu.com'}) //跳转不过去
              window.location.href = this.redirect //自动识别是不是外部地址
            })
            .catch(() => { //失败
              this.loading = false
              this.getCode()
            })
        }
      })
    },
    resetForm(){ //重置表单为初始值
      this.$refs.loginForm.resetFields()
    },
    clearCookie(){
      Cookies.remove('username')
      Cookies.remove('passwd')
      Cookies.remove('rememberMe')
    }
  }
}
</script>


<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("~@/assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
