import { createRouter, createWebHistory } from 'vue-router';
import auth from './auth';
import console from './console';
import grok from './grok';
import gemini from './gemini';
import claude from './claude';
import deepseek from './deepseek';
import kimi from './kimi';
import chatgpt from './chatgpt';
import midjourney from './midjourney';
import distribution from './distribution';
import download from './download';
import qrart from './qrart';
import luma from './luma';
import pika from './pika';
import kling from './kling';
import veo from './veo';
import sora from './sora';
import pixverse from './pixverse';
import flux from './flux';
import hailuo from './hailuo';
import headshots from './headshots';
import suno from './suno';
import producer from './producer';
import nanobanana from './nanobanana';
import seedream from './seedream';
import seedance from './seedance';
import serp from './serp';
import wan from './wan';
import site from './site';
import profile from './profile';
import pricing from './pricing';
import videoStudio from './videoStudio';

import { getCookie } from 'typescript-cookie';
import { I18N_DEFAULT_LOCALE } from '@/constants/i18n';
import { getLocale, setI18nLanguage } from '@/i18n';
import { updateSeo, setWebApplicationSchema, setOrganization, resetSeo } from '@/utils/seo';
import { ROUTE_INDEX, ROUTE_STUDIO } from '@/router/constants';

// SEO metadata per route path prefix
const ROUTE_SEO: Record<string, { title: string; description: string; keywords: string[]; category: string }> = {
  chatgpt: {
    title: 'ChatGPT | Voirax',
    description: 'Chat with ChatGPT AI — powered by OpenAI GPT models. Free AI conversations with the latest GPT.',
    keywords: ['ChatGPT', 'GPT', 'AI Chat', 'OpenAI', 'Voirax'],
    category: 'AI Chat'
  },
  claude: {
    title: 'Claude | Voirax',
    description: 'Chat with Claude AI — powered by Anthropic. Intelligent AI conversations with Claude.',
    keywords: ['Claude', 'Anthropic', 'AI Chat', 'Claude AI', 'Voirax'],
    category: 'AI Chat'
  },
  gemini: {
    title: 'Gemini | Voirax',
    description: 'Chat with Gemini AI — powered by Google. Advanced AI conversations with Gemini.',
    keywords: ['Gemini', 'Google AI', 'AI Chat', 'Gemini AI', 'Voirax'],
    category: 'AI Chat'
  },
  grok: {
    title: 'Grok | Voirax',
    description: 'Chat with Grok AI — powered by xAI. Real-time AI conversations with Grok.',
    keywords: ['Grok', 'xAI', 'AI Chat', 'Grok AI', 'Voirax'],
    category: 'AI Chat'
  },
  deepseek: {
    title: 'DeepSeek | Voirax',
    description: 'Chat with DeepSeek AI — advanced reasoning and coding AI assistant.',
    keywords: ['DeepSeek', 'AI Chat', 'AI Coding', 'DeepSeek AI', 'Voirax'],
    category: 'AI Chat'
  },
  kimi: {
    title: 'Kimi | Voirax',
    description: 'Chat with Kimi AI — advanced AI conversations powered by Moonshot AI.',
    keywords: ['Kimi', 'Moonshot AI', 'AI Chat', 'Kimi AI', 'Voirax'],
    category: 'AI Chat'
  },
  midjourney: {
    title: 'Midjourney | Voirax',
    description:
      'Generate stunning AI images with Midjourney — create art, illustrations, and designs with text prompts.',
    keywords: ['Midjourney', 'AI Image', 'AI Art', 'Image Generation', 'Text to Image', 'Voirax'],
    category: 'AI Image Generation'
  },
  flux: {
    title: 'Flux | Voirax',
    description: 'Generate AI images with Flux — fast, high-quality image generation from text descriptions.',
    keywords: ['Flux', 'AI Image', 'Image Generation', 'Text to Image', 'Voirax'],
    category: 'AI Image Generation'
  },
  qrart: {
    title: 'QR Art | Voirax',
    description: 'Generate artistic QR codes with AI — beautiful, scannable QR code art.',
    keywords: ['QR Art', 'AI QR Code', 'QR Code Generator', 'Artistic QR', 'Voirax'],
    category: 'AI Image Generation'
  },
  headshots: {
    title: 'AI Headshots | Voirax',
    description: 'Generate professional AI headshots — perfect for LinkedIn, resumes, and business profiles.',
    keywords: ['AI Headshots', 'Professional Photos', 'AI Portrait', 'LinkedIn Photo', 'Voirax'],
    category: 'AI Image Generation'
  },
  nanobanana: {
    title: 'NanoBanana | Voirax',
    description: 'Generate and edit AI images with NanoBanana — powered by Gemini for creative image generation.',
    keywords: ['NanoBanana', 'AI Image', 'Gemini', 'Image Editing', 'Voirax'],
    category: 'AI Image Generation'
  },
  seedream: {
    title: 'Seedream | Voirax',
    description: 'Generate AI images with Seedream — high-quality image generation by ByteDance.',
    keywords: ['Seedream', 'AI Image', 'ByteDance', 'Image Generation', 'Voirax'],
    category: 'AI Image Generation'
  },
  luma: {
    title: 'Luma | Voirax',
    description: 'Generate AI videos with Luma Dream Machine — create stunning videos from text and images.',
    keywords: ['Luma', 'AI Video', 'Dream Machine', 'Video Generation', 'Text to Video', 'Voirax'],
    category: 'AI Video Generation'
  },
  sora: {
    title: 'Sora | Voirax',
    description: 'Generate AI videos with OpenAI Sora — create realistic videos from text descriptions.',
    keywords: ['Sora', 'OpenAI', 'AI Video', 'Video Generation', 'Text to Video', 'Voirax'],
    category: 'AI Video Generation'
  },
  veo: {
    title: 'Veo | Voirax',
    description: 'Generate AI videos with Google Veo — high-quality video generation from text prompts.',
    keywords: ['Veo', 'Google', 'AI Video', 'Video Generation', 'Voirax'],
    category: 'AI Video Generation'
  },
  pika: {
    title: 'Pika | Voirax',
    description: 'Generate AI videos with Pika — creative video generation and editing with AI.',
    keywords: ['Pika', 'AI Video', 'Video Generation', 'Video Editing', 'Voirax'],
    category: 'AI Video Generation'
  },
  kling: {
    title: 'Kling | Voirax',
    description: 'Generate AI videos with Kling — high-quality video generation by Kuaishou.',
    keywords: ['Kling', 'AI Video', 'Kuaishou', 'Video Generation', 'Voirax'],
    category: 'AI Video Generation'
  },
  pixverse: {
    title: 'Pixverse | Voirax',
    description: 'Generate AI videos with Pixverse — creative video generation from text and images.',
    keywords: ['Pixverse', 'AI Video', 'Video Generation', 'Voirax'],
    category: 'AI Video Generation'
  },
  hailuo: {
    title: 'Hailuo | Voirax',
    description: 'Generate AI videos with Hailuo (MiniMax) — expressive video generation from text.',
    keywords: ['Hailuo', 'MiniMax', 'AI Video', 'Video Generation', 'Voirax'],
    category: 'AI Video Generation'
  },
  seedance: {
    title: 'Seedance | Voirax',
    description: 'Generate AI dance videos with Seedance — AI-powered dance video generation by ByteDance.',
    keywords: ['Seedance', 'AI Video', 'Dance Video', 'ByteDance', 'Voirax'],
    category: 'AI Video Generation'
  },
  wan: {
    title: 'Wan | Voirax',
    description: 'Generate AI videos with Wan — high-quality video generation by Tongyi Wanxiang.',
    keywords: ['Wan', 'Tongyi', 'AI Video', 'Video Generation', 'Voirax'],
    category: 'AI Video Generation'
  },
  suno: {
    title: 'Suno | Voirax',
    description: 'Create AI music with Suno — generate songs, lyrics, and music from text descriptions.',
    keywords: ['Suno', 'AI Music', 'Music Generation', 'AI Song', 'Text to Music', 'Voirax'],
    category: 'AI Music Generation'
  },
  producer: {
    title: 'Producer | Voirax',
    description: 'Create AI music with Producer — generate songs, lyrics, and music with FUZZ models.',
    keywords: ['Producer', 'AI Music', 'Music Generation', 'FUZZ', 'AI Song', 'Voirax'],
    category: 'AI Music Generation'
  },
  distribution: {
    title: 'Affiliate',
    description: 'Join the Ace Data Cloud affiliate program — earn commissions by referring AI services.',
    keywords: ['Affiliate', 'Referral', 'Earn', 'Commission'],
    category: 'Business'
  },
  serp: {
    title: 'Search',
    description:
      'Search the web with Google — powered by SERP API. Get organic results, knowledge graphs, images, and more.',
    keywords: ['Search', 'Google Search', 'SERP', 'Web Search'],
    category: 'Web Search'
  },
  'video-studio': {
    title: 'Video Studio | Voirax',
    description: 'Convert any idea into a ready-to-post short-form video with AI-generated script, music, voiceover, and video.',
    keywords: ['AI Video', 'Short-Form Video', 'Video Generator', 'AI Script', 'Suno', 'Voirax'],
    category: 'AI Video Generation'
  },
  studio: {
    title: 'Video Studio | Voirax',
    description: 'Convert any idea into a ready-to-post short-form video with AI-generated script, music, voiceover, and video.',
    keywords: ['AI Video', 'Short-Form Video', 'Video Generator', 'AI Script', 'Suno', 'Voirax'],
    category: 'AI Video Generation'
  },
  landing: {
    title: 'Voirax - AI Video Creation | Write. We Create.',
    description: 'Turn your ideas into stunning short-form videos instantly. AI-powered script, music, voiceover, and video composition. Pay only $0.38 per video.',
    keywords: ['AI Video', 'Short-Form Video', 'Video Generator', 'AI Script', 'Suno Music', 'Voirax', 'Ace Data Cloud'],
    category: 'AI Video Generation'
  }
};

const routes = [
  {
    path: '/',
    name: ROUTE_INDEX,
    component: () => import('@/pages/landing/Index.vue')
  },
  {
    path: '/studio',
    component: () => import('@/layouts/Main.vue'),
    meta: { auth: true, appName: 'videoStudio', hideNav: true },
    children: [
      {
        path: '',
        name: ROUTE_STUDIO,
        component: () => import('@/pages/studio/Index.vue')
      }
    ]
  },
  {
    path: '/chat/oauth/callback',
    name: 'oauth-callback',
    component: () => import('@/pages/chat/OAuthCallback.vue'),
    meta: { auth: false }
  },
  console,
  auth,
  chatgpt,
  grok,
  gemini,
  claude,
  deepseek,
  kimi,
  qrart,
  luma,
  pika,
  kling,
  veo,
  sora,
  pixverse,
  flux,
  hailuo,
  headshots,
  suno,
  producer,
  nanobanana,
  seedream,
  seedance,
  serp,
  wan,
  midjourney,
  distribution,
  download,
  site,
  profile,
  pricing,
  videoStudio
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (_to, _from, next) => {
  const locale = getLocale(getCookie('LOCALE') || I18N_DEFAULT_LOCALE);
  await setI18nLanguage(locale);
  return next();
});

router.afterEach((to) => {
  // Determine the route prefix (e.g., /chatgpt/conversations/123 → chatgpt)
  const prefix = to.path.split('/').filter(Boolean)[0] || '';
  const seoData = ROUTE_SEO[prefix];

  if (seoData) {
    updateSeo({
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords
    });
    setWebApplicationSchema({
      name: seoData.title,
      description: seoData.description,
      url: `https://hub.acedata.cloud/${prefix}`,
      category: seoData.category
    });
  } else {
    resetSeo();
    setOrganization();
  }
});

export default router;

export * from './constants';
