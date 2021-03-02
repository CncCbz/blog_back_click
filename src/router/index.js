import Vue from 'vue';
import VueRouter from 'vue-router';

const { getStorage } = require('../common');

//解决跳转同一路径报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    meta: { title: '首页' },
    children: [
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/user'),
        meta: { title: '用户管理' },
        children: [
          {
            path: '/user-increase',
            name: 'increaseUser',
            meta: { title: '添加用户' },
            component: () => import('@/views/user/increase.vue')
          },
          {
            path: '/user-list',
            name: 'listUser',
            meta: { title: '用户列表' },
            component: () => import('@/views/user/list.vue')
          }
        ]
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article'),
        meta: { title: '文章管理' },
        children: [
          {
            path: '/article-increase',
            name: 'increaseArticle',
            meta: { title: '添加文章' },
            component: () => import('@/views/article/increase.vue')
          },
          {
            path: '/article-list',
            name: 'listArticle',
            meta: { title: '文章列表' },
            component: () => import('@/views/article/list.vue')
          },
          {
            path: '/article-edit',
            name: 'editArticle',
            meta: { title: '编辑文章' },
            component: () => import('@/views/article/edit.vue')
          }
        ]
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/ghs'),
        meta: { title: 'GHS' }
      },
      {
        path: '/logs',
        name: 'log',
        component: () => import('@/views/log'),
        meta: { title: '日志' }
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment'),
        meta: { title: '留言管理' }
      }
    ]
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = getStorage('token');
  if (token) {
    if (to.path === '/login') {
      alert(`请不要重复登录！`);
      return next({ name: from.name || 'home' });
    } else if (to.path.includes('ghs')) {
      return next({ name: 'video' });
    }
  } else {
    if (to.path === '/login') {
      return next();
    }
    alert(`请先登录！`);
    next({ name: 'login' });
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
