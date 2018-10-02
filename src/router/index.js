import Vue from 'vue'
import Router from 'vue-router'
import Shop from '@/components/Shop'

// Allows the user to switch between pages without refreshing the page
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', // Home page
      name: 'Shop',
      component: Shop
    }
  ]
})
