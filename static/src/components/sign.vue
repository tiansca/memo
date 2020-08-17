<template>
  <div class="hello">
    <div class="topBar">
      <i class="fa fa-angle-left" @click="back"></i>
    </div>
    <h2 class="head">注册账号</h2>
    <div class="loginBox">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password" autocomplete="new-password"></mt-field>
      <mt-field label="重复密码" placeholder="请再次输入密码" type="password" v-model="password_repeat" autocomplete="new-password"></mt-field>
      <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="email"></mt-field>
      <mt-button type="primary" size="large" style="margin-top: 20px;" @click="sign" :disabled="!username || !password || !email">注册</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sign',
    data () {
      return {
        username: '',
        password:'',
        password_repeat:'',
        email:''
      }
    },
    methods:{
      sign(){
        if(this.password != this.password_repeat){
          this.$toast({
            message: '两次密码不一致！',
            position: 'bottom',
            duration: 3000
          });
          return
        }
        this.$.ajax({
          method:"POST",
          url:'signup',
          data:this.qs({
            username:this.username,
            password:this.password,
            email:this.email
          })
        }).then((res)=>{
          console.log(res)
          if(res.code == 0){
            this.$toast({
              message: '注册成功！',
              position: 'bottom',
              duration: 3000
            });
            console.log("注册成功！");
            this.$router.push({path:'/login'});
          }else if(res.code == 1){
            this.$toast({
              message: '用户名已被注册！',
              position: 'bottom',
              duration: 3000
            });
          }
        })
      },
      back(){
          this.$router.push({path:'/login'})
      }
    },
    mounted(){
      console.log(this.username);
//      setTimeout(()=>{
//        this.username = ''
//        this.password = ''
//        this.password_repeat = ''
//      },500)
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
