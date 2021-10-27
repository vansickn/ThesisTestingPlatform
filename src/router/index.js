import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/Home.vue')
        },
        {
            path: '/register',
            component: () => import('../views/Register.vue')
        },
        {
            path: '/sign-in',
            component: () => import('../views/SignIn.vue')
        },
        {
            path: '/feed',
            component: () => import('../views/Feed.vue'),
        },
        {
            path: '/account',
            component: () => import('../views/Account.vue'),
        },
        {
            path: '/createtest',
            component: () => import('../views/CreateTest.vue'),
        },
        {
            path: '/mytests',
            component: () => import('../views/MyTests.vue'),
        },
        {
            path: '/test/:testid',
            component: () => import('../views/Test.vue'),
            props: true,
        }

    ]
})

export default router