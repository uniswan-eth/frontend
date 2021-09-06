import DashboardLayout from '@/views/Layout/DashboardLayout.vue';
import AuthLayout from '@/views/Pages/AuthLayout.vue';

import NotFound from '@/views/NotFoundPage.vue';

const routes = [
  {
    path: '/test/',
    // redirect: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard.vue')
      },
      {
        path: '/explorer',
        name: 'explorer',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Explorer.vue')
      },
      {
        path: '/nft/:contract/:tokenid',
        name: 'nft',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Nft.vue')
      },
      {
        path: '/account/:address',
        name: 'account',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Account.vue')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Orders.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "demo" */ '../views/About.vue')
      },

      // {
      //   path: '/icons',
      //   name: 'icons',
      //   component: () => import(/* webpackChunkName: "demo" */ '../views/Icons.vue')
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/UserProfile.vue')
      // },
      // {
      //   path: '/maps',
      //   name: 'maps',
      //   component: () => import(/* webpackChunkName: "demo" */ '../views/GoogleMaps.vue')
      // },
      // {
      //   path: '/tables',
      //   name: 'tables',
      //   component: () => import(/* webpackChunkName: "demo" */ '../views/RegularTables.vue')
      // }
    ]
  },
  {
    path: '/',
    redirect: 'login',
    component: AuthLayout,
    children: [
      {
        path: '/',
        name: 'landing',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Landing.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Register.vue')
      },
      { path: '*', component: NotFound }
    ]
  }
];

export default routes;
