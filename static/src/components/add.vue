<template>
  <div>
    <div class="topBar">
      <i class="fa fa-angle-left" @click="back"></i>
      <span class="title">{{title}}</span>
      <i class="fa fa-check save" @click="save"></i>
    </div>

    <div class="contentBox">
      <mt-cell class="mint-field" title="时间" :value="memo.time" @click.native="openPicker"></mt-cell>
      <mt-cell title="是否重复" class="mint-field">
        <mt-switch v-model="memo.iscycle"></mt-switch>
      </mt-cell>
      <mt-cell class="mint-field" title="日期" :value="dateFormat" @click.native="openPickerDate" v-show="!memo.iscycle"></mt-cell>
      <mt-field label="接收者" placeholder="请输入接收者邮箱" v-model="memo.email"></mt-field>
      <mt-field label="主题" placeholder="请输入主题" v-model="memo.name"></mt-field>
      <mt-field label="内容" placeholder="请输入内容" v-model="memo.content" type="textarea"></mt-field>
    </div>

    <div style="text-align: center;margin-top: 50px" v-if="title=='编辑'">
      <mt-button size="small" type="danger" @click="remove">删除任务</mt-button>
    </div>


    <!--时间插件-->
    <template>
      <mt-datetime-picker
        ref="picker"
        type="time"
        @confirm="timeConfirm"
        v-model="time">
      </mt-datetime-picker>
    </template>

    <!--日期插件-->
    <template>
      <mt-datetime-picker
        ref="pickerdate"
        type="date"
        @confirm="dateConfirm"
        v-model="date">
      </mt-datetime-picker>
    </template>
  </div>

</template>

<script>
  export default {
    name: 'add',
    computed:{

    },
    data () {
      return {
        title:'',
        change:false,
        memo:{
            name:'',
            content:'',
            time:'',
            date:'',
            iscycle:false,
            email:''
        },
        oldMemo:null,
        date:'',
        time:'',
        dateFormat:'',
        isSaved:false,
      }
    },
    methods:{
      back(){
          this.$router.replace('/')
      },
      openPicker() {
        this.time = this.memo.time
        this.$refs.picker.open();
      },
      openPickerDate(){
        this.date = this.memo.date
        this.$refs.pickerdate.open();
      },
      timeConfirm(time){
          this.memo.time = time;
          console.log(this.memo.time)
      },
      dateConfirm(date){
          this.memo.date = date
      },
      save(){
          if(!this.memo.name || !this.memo.content){
            this.$toast({
              message: '请填写主题和内容！',
              position: 'bottom',
              duration: 3000
            });
            return
          }
          this.memo.rundate = new Date(this.dateFormat + ' ' + this.memo.time + ':00');
          this.memo.hour = this.memo.time.split(':')[0];
          this.memo.minute = this.memo.time.split(':')[1];
          this.memo.second = 0;
          if(this.title == '新建'){
            this.memo.username = this.$store.state.user.username;
            console.log(this.memo);
            if(this.memo.rundate < Date.now() && !this.memo.iscycle){
              this.$toast({
                message: '时间无效！',
                position: 'bottom',
                duration: 3000
              });
              return false
            }
            this.$.ajax({
              method:"POST",
              url:'memo',
              data:this.qs(this.memo)
            }).then((res=>{
              if(res.data == 0){
                  this.isSaved = true;
                  this.$router.replace('./');
                this.$toast({
                  message: '新建成功！',
                  position: 'bottom',
                  duration: 3000
                });
              }
            }))
          }else {
            if(this.memo.rundate < Date.now() && !this.memo.iscycle){
              this.$toast({
                message: '时间无效！',
                position: 'bottom',
                duration: 3000
              });
              return false
            }
            this.$.ajax({
              method:"POST",
              url:'memo/update',
              data:this.qs(this.memo)
            }).then((res=>{
              if(res.code == 0){
                this.isSaved = true;
                this.$router.replace('./');
              }else {
                  console.log(res)
              }
            }))
          }

      },
      remove(){
        this.$messageBox.confirm('确定要删除此提醒吗？').then(action => {
          this.$.ajax({
            method:"GET",
            url:'memo/remove?id=' + this.memo._id,
          }).then((res=>{
            if(res.code == 0){
              this.isSaved = true;
              this.$router.replace('./');
            }else {
              this.$toast({
                message: '删除失败！',
                position: 'bottom',
                duration: 3000
              });
            }
          }))
        }).catch(()=>{

        })
      }
    },
    mounted(){
        if(this.$route.query.id){
            this.title = '编辑';
            this.memo = this.$store.getters.getMemoByid(this.$route.query.id)[0];
            this.$set(this.memo, 'time', (this.memo.hour>9?this.memo.hour:('0' + this.memo.hour)) + ':' + (this.memo.minute>9?this.memo.minute:('0' + this.memo.minute)))
            this.$set(this.memo, 'date', new Date(this.memo.rundate))
        }else{
            this.title = '新建';
            this.memo.time = ((new Date()).getHours()>9?(new Date()).getHours(): ('0' + (new Date()).getHours()) )+ ':' + (((new Date()).getMinutes())>9?(new Date()).getMinutes() : ('0' + (new Date()).getMinutes()))
            this.memo.date = new Date();
            this.memo.email = this.$store.state.user.email
        }
    },
    watch:{
        memo:{
            handler(){
                if(this.memo && !this.oldMemo){
                    this.oldMemo = JSON.stringify(this.memo);
                }else if(this.oldMemo){
                  this.change = true;
                }
//                console.log(this.memo)
                if(this.memo && this.memo.date){
                  this.dateFormat = this.memo.date.getFullYear() + '-' + (this.memo.date.getMonth() + 1) + '-' + this.memo.date.getDate()
                }
            },
            deep:true
        }
    },
    beforeRouteLeave (to, from, next) {
        console.log('要走了');
        if((this.title=='新建' || this.change) && !this.isSaved){
          this.$messageBox({
            title: '提示',
            message: "是否保存该提醒？",
            showCancelButton: true,
            confirmButtonText:'保存',
            cancelButtonText:'放弃'
          }).then(action => {
            console.log(action);
            if(action == 'confirm'){
              this.save();
            }else {
              next()
            }

          }).catch((action)=>{
            console.log(action)
          })
        }else {
            next()
        }
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    }
  }
</script>

<style scoped>
  .save{
    font-size: 24px;
    color: #666;
    padding: 8px;
    position: absolute;
    right: 12px;
  }
</style>
