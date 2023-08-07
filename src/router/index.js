import Vue from 'vue'
import Router from 'vue-router'
import DistanceCalc from "@/pages/DistanceCalc"
import UserLocation from '@/pages/UserLocation'
import CloseBuy from '@/pages/CloseBuy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      component: DistanceCalc
    },
    {
      path: '/user-location',
      // name: 'HelloWorld',
      component: UserLocation
    },
    {
      path: '/close-buy',
      component: CloseBuy
    }
  ]
})
