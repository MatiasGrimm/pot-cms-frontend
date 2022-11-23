import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';

Vue.use(VueRouter);

const DEFAULT_TITLE = 'Potshop';

const routes = [
  {
    path: '/',
    name: 'FrontPage',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/admin',
    component: () => import('../views/AdminPanel.vue'),
    // redirect: '/admin/users',
    children: [
      {
        path: 'inventory',
        name: 'InventoryList',
        component: () => import('../components/List/InventoryList.vue'),
        children: [
          // {
          //   path: ':Id',
          //   name: 'UserDetails',
          //   component: () => import('../components/Admin/Details/UserDetails.vue'),
          // },
        ],
      },
      {
        path: 'sales',
        name: 'SaleHistoryList',
        component: () => import('../components/Admin/List/SaleHistoryList.vue'),
        children: [
          // {
          //   path: ':Id',
          //   name: 'UserDetails',
          //   component: () => import('../components/Admin/Details/UserDetails.vue'),
          // },
        ],
      },
      {
        path: 'staff',
        name: 'StaffList',
        component: () => import('../components/Admin/List/StaffList.vue'),
        children: [
          // {
          //   path: ':Id',
          //   name: 'UserDetails',
          //   component: () => import('../components/Admin/Details/UserDetails.vue'),
          // },
        ],
      },
      {
        path: 'products',
        name: 'ProductList',
        component: () => import('../components/Admin/List/ProductList.vue'),
        children: [
          // {
          //   path: ':Id',
          //   name: 'UserDetails',
          //   component: () => import('../components/Admin/Details/UserDetails.vue'),
          // },
        ],
      },
      {
        path: 'locations',
        name: 'LocationList',
        component: () => import('../components/Admin/List/LocationList.vue'),
        children: [
          // {
          //   path: ':Id',
          //   name: 'UserDetails',
          //   component: () => import('../components/Admin/Details/UserDetails.vue'),
          // },
        ],
      },
    //   {
    //     path: 'users',
    //     name: 'UserList',
    //     component: () => import('../components/Admin/UserList.vue'),
    //     children: [
    //       {
    //         path: ':Id',
    //         name: 'UserDetails',
    //         component: () => import('../components/Admin/Details/UserDetails.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: 'companies',
    //     name: 'CompanyList',
    //     component: () => import('../components/Admin/CompanyList.vue'),
    //     children: [
    //       {
    //         path: ':Id',
    //         name: 'CompanyDetails',
    //         component: () => import('@/components/Admin/Details/CompanyDetails.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: 'sqlScripts',
    //     name: 'SqlScriptList',
    //     component: () => import('../components/Admin/SqlScriptList.vue'),
    //     children: [
    //       {
    //         path: ':Id',
    //         name: 'SQLDetails',
    //         component: () => import('@/components/Admin/Details/SqlScriptDetails.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path:'configuration',
    //     name:'Configuration',
    //     component: () => import('@/views/Configuration.vue'),
    //     redirect: {name: 'ConfigurationList'},
    //     children: [
    //       {
    //         path:'list',
    //         name:'ConfigurationList',
    //         component: () => import('@/components/Admin/ConfigurationList.vue')
    //       },
    //       {
    //         path:':Id',
    //         name:'ConfigurationDetails',
    //         component: () => import('@/components/Admin/Details/ConfigurationDetails.vue')
    //       }
    //     ]
    //   },
    //   {
    //     path: 'configurationFiles',
    //     name: 'ConfigurationFileList',
    //     component: () => import('../components/Admin/ConfigurationFileList.vue'),
    //     children: [
    //       {
    //         path: ':Id',
    //         name: 'ConfigurationFileDetails',
    //         component: () => import('@/components/Admin/Details/ConfigurationFileDetails.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: 'applications',
    //     name: 'ApplicationList',
    //     component: () => import('@/components/Admin/ApplicationList.vue'),
    //     children: [
    //       {
    //         path: ':Id',
    //         name: 'ApplicationDetails',
    //         component: () => import('@/components/Admin/Details/ApplicationDetails.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: 'applicationReleases',
    //     name: 'ApplicationReleaseList',
    //     component: () => import('@/components/Admin/ApplicationReleaseList.vue'),
    //     children: [
    //       {
    //         path: ':Id',
    //         name: 'ApplicationReleaseDetails',
    //         component: () => import('@/components/Admin/Details/ApplicationReleaseDetails.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: 'applicationElements',
    //     name: 'ApplicationElementList',
    //     component: () => import('@/components/Admin/ApplicationElementList.vue'),
    //     children: [
    //       {
    //         path: ':Id',
    //         name: 'ApplicationElementDetails',
    //         component: () => import('@/components/Admin/Details/ApplicationElementsDetails.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: 'license',
    //     name:'License',
    //     component: ()=> import('@/views/License.vue'),
    //     redirect: { name: 'LicenseList' },
    //     children:[
    //       {
    //         path:'list',
    //         name:'LicenseList',
    //         component: () => import('@/components/Admin/LicenseList.vue')
    //       },
    //       {
    //         path:':Id',
    //         name:'LicenseDetails',
    //         component: () => import('@/components/Admin/Details/LicenseDetails.vue')
    //       }
    //     ]
    //   },
    //   {
    //     path: 'checklog',
    //     name:'UpdateCheckLog',
    //     component: ()=> import('@/views/UpdateCheckLog.vue'),
    //     redirect: { name: 'CheckLogList' },
    //     children:[
    //       {
    //         path:'list',
    //         name:'CheckLogList',
    //         component: () => import('@/components/Admin/CheckLogList.vue')
    //       },
    //       {
    //         path:':Id',
    //         name:'CheckLogDetails',
    //         component: () => import('@/components/Admin/Details/CheckLogDetails.vue')
    //       }
    //     ]
    //   },
    //   {
    //     path: 'downloadlog',
    //     name:'UpdateDownloadLog',
    //     component: ()=> import('@/views/UpdateDownloadLog.vue'),
    //     redirect: { name: 'DownloadLogList' },
    //     children:[
    //       {
    //         path:'list',
    //         name:'DownloadLogList',
    //         component: () => import('@/components/Admin/DownloadLogList.vue')
    //       },
    //       {
    //         path:':Id',
    //         name:'DownloadLogDetails',
    //         component: () => import('@/components/Admin/Details/DownloadLogDetails.vue')
    //       }
    //     ]
    //   }
   ],
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
  },
  // {
  //   path: '/activate',
  //   name: 'Activate',
  //   component: () => import('../views/ActivateAccount.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title ? `${to.meta.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  });
});

router.beforeEach(async (to, from, next) => {
  let success = await store.dispatch('ENSURE_AUTH');
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    success = store.getters.isAdmin;
  } else if (to.matched.some((record) => record.meta.requiresManager)) {
    success = store.getters.isManager;
  } else if (!to.matched.some((record) => record.meta.requiresAuth)) {
    success = true;
  }

  // if not, redirect to login page.
  if (!success) {
    next({
      path: '/',
    });
  } else {
    next();
  }
});

export default router;
