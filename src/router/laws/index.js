export default [
    {
        path: '/:id',
        component: () => import('@/views/law/index.vue'),
        children: [
            {
                path: 'hehe',
                component: () => import('@/views/law/lawyers.vue')
            },
            {
                path: 'notice',
                component: () => import('@/views/law/notice.vue')
            }
        ]
    },

]