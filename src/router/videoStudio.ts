import { ROUTE_VIDEO_STUDIO_INDEX } from './constants';

export default {
  path: '/video-studio',
  meta: {
    auth: true,
    appName: 'videoStudio'
  },
  component: () => import('@/layouts/Main.vue'),
  children: [
    {
      path: '',
      name: ROUTE_VIDEO_STUDIO_INDEX,
      component: () => import('@/pages/video-studio/Index.vue')
    }
  ]
};
