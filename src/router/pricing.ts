export default {
  path: '/pricing',
  component: () => import('@/layouts/Main.vue'),
  children: [
    {
      path: '',
      name: 'pricing',
      component: () => import('@/pages/pricing/Index.vue'),
      meta: { hideNav: true, hideSide: true }
    }
  ]
};
