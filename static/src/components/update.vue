<template>
  <div class="hello">
    <div class="topBar">
      <i class="fa fa-angle-left" @click="back"></i>
      <span class="title">修改密码</span>
    </div>
    <div class="loginBox">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username" :readonly="isLogin"></mt-field>
      <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="email" :readonly="isLogin"></mt-field>
      <mt-field label="新密码" placeholder="输入新密码" type="password" v-model="newPassword" autocomplete="new-password"></mt-field>
      <mt-button type="primary" size="large" style="margin-top: 20px;" @click="update" :disabled="!username || !newPassword || !email">提交</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sign',
    data () {
      return {
        username: '',
        newPassword:'',
        email:'',
        isLogin:false
      }
    },
    methods:{
      update(){
        this.$.ajax({
          method:"POST",
          url:'update',
          data:this.qs({
            username:this.username,
            newPassword:this.newPassword,
            email:this.email
          })
        }).then((res)=>{
          console.log(res)
          if(res.data == 0){
            this.$toast({
              message: '修改成功，请重新登录！',
              position: 'bottom',
              duration: 3000
            });
            this.logout()
          }else{
            this.$toast({
              message: '修改失败！',
              position: 'bottom',
              duration: 3000
            });
          }
        })
      },
      back(){
        this.$router.push({path:'/'})
      },
      logout () {
        this.$.ajax({
          url: 'logout',
          method: 'get'
        }).then(res => {
          if (res.code === 0) {
            this.$store.commit('setUserSession',{})
            this.$router.push({path:'/login'});
          }
        })
      },
    },
    mounted(){
      console.log(this.username);
      setTimeout(()=>{
          if(this.$store.state.user && this.$store.state.user.username){
            this.username = this.$store.state.user.username
            this.email = this.$store.state.user.email
            this.newPassword = ''
            this.isLogin = true;
          }

      },50)
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

