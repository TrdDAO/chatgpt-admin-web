import Loadable from 'react-loadable';
import Loading from '@/components/Loading'

export default [
  {
    path: "/dashboard",
    component: Loadable({
      loader: () => import(/*webpackChunkName:'Dashboard'*/'@/views/dashboard'),
      loading: Loading,
    })
  },
  {
    path: "/administrators",
    component: Loadable({
      loader: () => import(/*webpackChunkName:'Administrators'*/'@/views/administrators'),
      loading: Loading,
    })
  },
  {
    path: "/customers",
    component: Loadable({
      loader: () => import(/*webpackChunkName:'Customers'*/'@/views/customers'),
      loading: Loading,
    })
  },
  {
    path: "/subscriptions",
    component: Loadable({
      loader: () => import(/*webpackChunkName:'Subscriptions'*/'@/views/subscriptions'),
      loading: Loading,
    })
  },
  {
    path: "/userEquities",
    component: Loadable({
      loader: () => import(/*webpackChunkName:'UserEquities'*/'@/views/userEquities'),
      loading: Loading,
    })
  },
  // { path: "/bot/sar-bollinger", component: Dashboard },
  // { path: "/bot/grid", component: Dashboard },
  // { path: "/bot/script", component: ScriptBot },
  // { path: "/charts/keyboard", component: KeyboardChart, roles: ["admin","editor"] },
  // { path: "/charts/line", component: LineChart, roles: ["admin","editor"] },
  // { path: "/charts/mix-chart", component: MixChart, roles: ["admin","editor"] },
  {
    path: "/error/404",
    component: Loadable({
      loader: () => import(/*webpackChunkName:'Error404'*/'@/views/error/404'),
      loading: Loading
    }) 
  },
];
