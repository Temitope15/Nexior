import { ROUTE_LANDING_INDEX } from './constants';

export default {
  path: '/landing',
  component: () => import('@/layouts/Main.vue'),
  children: [
    {
      path: '',
      name: ROUTE_LANDING_INDEX,
      component: () => import('@/pages/landing/Index.vue')
    }
  ]
};
