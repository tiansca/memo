<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view class="Router"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      transitionName:''
    }
  },
  methods:{
      onBrowserBack(){
          console.log('aaa')
      }
  },
  watch:{
    '$route' (to, from) {
      console.log(to.path)
      if(to.path == '/login' || to.path == '/'){
        this.transitionName = 'slide-right';
      }else{
        this.transitionName = 'slide-left';
      }
      if(to.path == '/' && (!this.$store.state.user || !this.$store.state.user.name)){
          this.$router.replace('/login')
      }else if(to.path == '/login' && this.$store.state.user && this.$store.state.user.name){
          this.$router.replace('/')
      }
    },
    PopupShow: {
      handler(newVal, oldVal) {
        if (newVal.Terms === true) {
          window.history.pushState(null, null, document.URL);
        }
      },
      deep: true
    }
  },
  mounted(){
      // 判断是否登录
    this.$.ajax({
      method:"get",
      url:'self'
    }).then((res=>{
      console.log(res.code)
      if(res.code == 0){
        this.$store.commit('setUserSession',res.data);
        this.$router.push('/')
      }else{
        this.$store.commit('setUserSession',{});
        this.$router.push('/login')
      }
    }))
      // if(localStorage.getItem('username') && localStorage.getItem('password')){
      //   var that = this;
      //   this.$.ajax({
      //     method:"POST",
      //     url:'login',
      //     data:this.qs({
      //       username:localStorage.getItem('username'),
      //       password:localStorage.getItem('password')
      //     })
      //   }).then((res=>{
      //     if(res.data == 0){
      //       this.$store.commit('setUserSession',res.user);
      //     }else{
      //       this.$store.commit('setUserSession',{username:'',password:''});
      //       this.$router.push('/login')
      //     }
      //   }))
      // }else{
      //     this.$router.push('/login')
      // }

    window.history.pushState(null, null, document.URL);
    // 给window添加一个popstate事件，拦截返回键，执行this.onBrowserBack事件，addEventListener需要指向一个方法
    window.addEventListener("popstate", this.onBrowserBack, false);
  },
  destroyed() {
    // 当页面销毁必须要移除这个事件，vue不刷新页面，不移除会重复执行这个事件
    window.removeEventListener("popstate", this.onBrowserBack, false);
  },
}
</script>

<style>
  body,html{
    margin:0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/*页面切换动画*/
.Router {
  position: absolute;
  width: 100%;
  transition: all 0.2s ease;
  top: 0;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(50px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-50px, 0);
}
  .textButton{
    color: #26a2ff;
    padding:5px 3px;
  }
.head{
  text-align: center;
  margin:60px 0;
}
  .topBar{
    /*position: absolute;*/
    /*top:0;*/
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #efefef;
  }
  .topBar>.fa:first-of-type{
    font-size: 32px;
    padding: 8px 12px;
  }
  .topBar .title{
    font-size: 18px;
    margin-left:12px;
  }
  .contentBox{
    width: 90%;
    margin:0 auto;
  }
  .mint-cell-wrapper{
    background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
  }
</style>
