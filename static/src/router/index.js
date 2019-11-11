import Vue from 'vue'
import Router from 'vue-router'
import memo from '@/components/memo.vue'
import login from '@/components/login.vue'
import sign from '@/components/sign.vue'
import add from '@/components/add.vue'
import update from '@/components/update.vue'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'memo',
      component: memo
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/sign',
      name: 'sign',
      component: sign
    },
    {
      path: '/add',
      name: 'add',
      component: add
    },
    {
      path: '/update',
      name: 'update',
      component: update
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
