<template>
  <div class="hello">
    <h2 class="head">欢迎登录</h2>
    <div class="loginBox">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password" autocomplete="new-password"></mt-field>
      <mt-button type="primary" size="large" style="margin-top: 20px;" @click="login" :disabled="!username || !password">登录</mt-button>
      <div class="loginBottom">
        <router-link to='/update' class="textButton">忘记密码</router-link>
        <router-link to='/sign' class="textButton">注册账号</router-link>
        <!--<span class="textButton">修改密码</span>-->
        <!--<span class="textButton">注册账号</span>-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        username: '',
        password:''
      }
    },
    methods:{
      login(){
          console.log(this.username)
          console.log(this.password)
        this.$.ajax({
          method:"POST",
          url:'login',
          data:this.qs({
            username:this.username,
            password:this.password
          })
        }).then((res=>{
            console.log(res)
          if(res.code == 0){
            console.log("登录成功！");
            console.log(this)
            this.$store.commit('setUserSession',res.data);
            this.$router.push('/')
          }else if(res.code == 2){
            this.$toast({
              message: '密码不正确！',
              position: 'bottom',
              duration: 3000
            });
          }else if(res.code == 1){
            this.$toast({
              message: '用户不存在！',
              position: 'bottom',
              duration: 3000
            });
          }else if(res.code == 3){
            this.$toast({
              message: '用户不可用！',
              position: 'bottom',
              duration: 3000
            });
          }
        }))
      }
    },
    mounted(){
      console.log(this.username);
      setTimeout(()=>{
          if(localStorage.getItem('username')){
              this.username = localStorage.getItem('username')
          }
      },500)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loginBox{
    width: 70%;
    position: absolute;
    top: 140px;
    /*margin: 0 auto;*/
    left: 15%;
    height: 180px;
    /*text-align: center;*/
  }
  .loginBottom{
    display: flex;
    justify-content: space-around;
    width: 80%;
    margin: 8px auto;
  }
</style>
