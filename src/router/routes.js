// src/router/routes.js

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/welcome' }, // 기본 경로
      {
        path: 'welcome',
        component: () =>
          import('pages/WelcomePage.vue').catch((error) =>
            console.error('Error loading WelcomePage:', error),
          ),
      },
      {
        path: 'login',
        component: () =>
          import('pages/LoginPage.vue').catch((error) =>
            console.error('Error loading LoginPage:', error),
          ),
      },
      {
        path: 'register',
        component: () =>
          import('pages/RegisterPage.vue').catch((error) =>
            console.error('Error loading RegisterPage:', error),
          ),
      },
      {
        path: '/admin/dashboard',
        component: () =>
          import('pages/admin/DashboardPage.vue').catch((error) =>
            console.error('Error loading DashboardPage:', error),
          ),
      },
      {
        path: '/admin/memberList',
        component: () =>
          import('pages/admin/MemberList.vue').catch((error) =>
            console.error('Error loading MemberList:', error),
          ),
      },
      {
        path: '/admin/menuManagement',
        component: () =>
          import('pages/admin/MenuManagement.vue').catch((error) =>
            console.error('Error loading MenuManagement:', error),
          ),
      },
      {
        path: 'request',
        component: () =>
          import('pages/ApprovalRequest.vue').catch((error) =>
            console.error('Error loading ApprovalRequest:', error),
          ),
      },
      {
        path: 'approval',
        component: () =>
          import('pages/ApprovalPage.vue').catch((error) =>
            console.error('Error loading ApprovalPage:', error),
          ),
      },
      {
        path: '/admin/accessHistory',
        component: () =>
          import('pages/admin/AccessHistory.vue').catch((error) =>
            console.error('Error loading AccessHistory:', error),
          ),
      },
      {
        path: '/admin/newAccessHistory',
        component: () =>
          import('pages/admin/NewAccessHistory.vue').catch((error) =>
            console.error('Error loading NewAccessHistory:', error),
          ),
      },
      {
        path: '/examples/inputPage',
        component: () =>
          import('pages/examples/inputPage.vue').catch((error) =>
            console.error('Error loading inputPage:', error),
          ),
      },
      {
        path: '/examples/testPage',
        component: () =>
          import('pages/examples/testPage.vue').catch((error) =>
            console.error('Error loading testPage:', error),
          ),
      },
      {
        path: '/examples/iconPage',
        component: () =>
          import('pages/examples/iconPage.vue').catch((error) =>
            console.error('Error loading iconPage:', error),
          ),
      },
      {
        path: '/examples/selboxPage',
        component: () =>
          import('pages/examples/selboxPage.vue').catch((error) =>
            console.error('Error loading selboxPage:', error),
          ),
      },
      {
        path: '/examples/etcPage',
        component: () =>
          import('pages/examples/etcPage.vue').catch((error) =>
            console.error('Error loading etcPage:', error),
          ),
      },
      {
        path: '/examples/chartPage',
        component: () =>
          import('pages/examples/chartPage.vue').catch((error) =>
            console.error('Error loading chartPage:', error),
          ),
      },
      {
        path: '/examples/echartPage',
        component: () =>
          import('pages/examples/echartPage.vue').catch((error) =>
            console.error('Error loading echartPage:', error),
          ),
      },
      {
        path: '/examples/echartPage1',
        component: () =>
          import('pages/examples/echartPage1.vue').catch((error) =>
            console.error('Error loading echartPage1:', error),
          ),
      },
      {
        path: '/examples/tablePage',
        component: () =>
          import('pages/examples/tablePage.vue').catch((error) =>
            console.error('Error loading tablePage:', error),
          ),
      },
      {
        path: '/examples/tabulatorPage',
        component: () =>
          import('pages/examples/tabulatorPage.vue').catch((error) =>
            console.error('Error loading tabulatorPage:', error),
          ),
      },
    ],
  },
]

export default routes
