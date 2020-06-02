<template>
  <div class="hello" style="height: 100%">
    <div class="topBar">
      <span v-if="user" class="textButton username" @click="openUser">{{user.username}}</span>
      <i  class="fa fa-plus" style="color: #666;font-size:24px;position: absolute;right: 12px;" @click="add"></i>
    </div>
    <div class="content">
      <div class="kong" v-if="memoArr.length==0">暂无数据</div>
      <div v-for="item in memoArr" class="memoRow" @click="edit(item)">
        <div class="memo-left">
          <div>
            <span class="memoTime">{{(item.hour>9?item.hour:('0' + item.hour)) + ':' + (item.minute>9?item.minute:('0' + item.minute))}}</span>
            <span class="memoName">{{item.name}}</span>
          </div>
          <div style="margin-top: 3px;font-size: 13px; color:#888;font-weight: 200">
            <span v-if="!item.iscycle" style="font-weight: 400">{{(new Date(item.rundate)).getFullYear() + '-' + ((new Date(item.rundate)).getMonth() + 1) + '-' + (new Date(item.rundate)).getDate()}}</span>
            <span v-if="item.iscycle && !item.isWorkDay">
              <span v-for="(item1, index) in weekList" v-show="item.week.indexOf(String(index)) !== -1" style="padding: 0 2px">{{item1.label}}</span>
            </span>
            <span v-if="item.iscycle && item.isWorkDay">
              <span>跳过节假日</span>
            </span>
            <span> {{item.iscycle?'重复':'不重复'}}</span>
          </div>
        </div>
        <div class="memo-right">
          <mt-switch v-model="item.status" @change="switchStatus(item)" style="margin-top: 6px;" @click.stop.native="catchtap"></mt-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'memo',
  data () {
    return {
      memoArr:[],
      weekList: [{
        label: '周日',
        value: '0',
      }, {
        label: '周一',
        value: 1,
      }, {
        label: '周二',
        value: 2,
      }, {
        label: '周三',
        value: 3,
      }, {
        label: '周四',
        value: 4,
      }, {
        label: '周五',
        value: 5,
      }, {
        label: '周六',
        value: 6,
      },]
    }
  },
  computed:{
      user(){
          return this.$store.state.user;
      }
  },
  methods:{
      getList(){
          console.log(this.user)
          if(this.user && this.user.username){
            this.$.ajax({
              method:"GET",
              url:'memo/getbyuser?username=' + this.user.username
            }).then((res=>{
              if(res.code == 0){
                  this.memoArr = res.data;
                  this.$store.commit('setMemo',this.memoArr)
                  console.log(this.memoArr)
              }else {
                this.memoArr = [];
                this.$toast({
                  message: '获取列表失败！',
                  position: 'bottom',
                  duration: 3000
                });
              }
            }))
          }
      },
      add(){
        this.$router.push({
          name:'add',
          query: {
            id: null,
          }
        })
      },
      edit(item){
        this.$router.push({
          name:'add',
          query: {
            id: item._id,
          }
        })
      },
      switchStatus(a){
        this.$.ajax({
          method:"GET",
          url:'memo/updatestatus?id=' + a._id
        }).then((res=>{
          if(res.code == 0){
              this.getList()
            console.log(res.msg)
          }else {
            this.$toast({
              message: '切换失败！',
              position: 'bottom',
              duration: 3000
            });
          }
        }))
      },
      catchtap(){
            return false
      },
      openUser(){
//        this.$messageBox.confirm('用户名：' + this.user.username + ';' + '邮箱：' + this.user.email).then(action => {
//          console.log(action)
//        }).catch((action)=>{
//            console.log(action)
//        })
        this.$messageBox({
          title: '用户信息',
          message: '用户名：' + this.user.username + ' <br> ' + '邮箱：' + this.user.email,
          showCancelButton: true,
          confirmButtonText:'退出登录',
          cancelButtonText:'修改密码'
        }).then(action => {
          console.log(action);
          if(action == 'confirm'){
            this.$store.commit('setUserSession',{username:'', password:''})
            this.$router.replace('/login')
          }else {
              this.$router.replace('/update')
          }

        }).catch((action)=>{
            console.log(action)
        })
      }
  },
  watch:{
      user:{
        handler(newVal, oldVal) {
          console.log(newVal);
          this.getList()
        },
        deep: true
      }
  },
  mounted(){
      if(this.user && this.user.username){
          this.getList()
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .username{
    display: inline-block;
    max-width: 200px;
    font-size: 20px;
    margin-left:12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .content{
    margin-top:8px;
    height: calc(100% - 87px);
    width: calc(100% - 36px);
    overflow: auto;
    padding:10px 18px;
  }
  .memoName{
    font-size: 16px;
    color:#666;
    max-width: 200px;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }
  .memoTime{
    font-size: 22px;
    color:#444;
    font-weight: 600;
  }
  .memoRow{
    padding:5px 0;
  }
  .memo-left,.memo-right{
    display: inline-block;
  }
  .memo-right{
    float: right;
  }
  .kong{
    text-align: center;
    margin-top: 32px;
    font-size: 18px;
    color: #999;
  }
</style>
