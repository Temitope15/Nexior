import { ROUTE_AUTH_CALLBACK, ROUTE_AUTH_LOGIN, ROUTE_AUTH_TOKENS } from './constants';

export default {
  path: '/auth',
  component: () => import('@/layouts/Auth.vue'),
  children: [
    {
      path: 'login',
      name: ROUTE_AUTH_LOGIN,
      component: () => import('@/pages/auth/Login.vue')
    },
    {
      path: 'callback',
      name: ROUTE_AUTH_CALLBACK,
      component: () => import('@/pages/auth/Callback.vue')
    },
    {
      path: 'tokens',
      name: ROUTE_AUTH_TOKENS,
      component: () => import('@/pages/auth/Tokens.vue')
    }
  ]
};
