import Vue from 'vue';
import Router from 'vue-router';

import boxRoutes from './router/box';
import dataTableRoutes from './router/dataTable';
import chartRoutes from './router/chart';
import fldRoutes from './router/fldRoutes';
import easterRoutes from './router/easterRoutes';

import Home from '@/views/Home.vue';
import chart from './router/chart';

Vue.use(Router);

// TODO when these simple routes gets too many, move them to their own file inside the router folder.
let simpleRoutes = [
  {
    path: `/kup-btn`,
    name: 'btn',
    component: () => import(`@/views/KupBottoniera.vue`),
  },
  {
    path: `/kup-dash`,
    name: 'dash',
    component: () => import(`@/views/DashExamples.vue`),
  },
  {
    path: `/kup-image`,
    name: 'image',
    component: () => import(`@/views/KupImage.vue`),
  },
  {
    path: `/portals`,
    name: 'portals',
    component: () => import(`@/views/KupPortals.vue`),
  },
  {
    path: `/kup-html`,
    name: 'html',
    component: () => import(`@/views/KupHtmlExamples.vue`),
  },
  {
    path: `/kup-progress-bar`,
    name: 'progressbar',
    component: () => import(`@/views/KupProgressBar.vue`),
  },
  {
    path: `/kup-chips`,
    name: 'chips',
    component: () => import(`@/views/KupChips.vue`),
  },
  {
    path: `/tooltip`,
    name: 'tooltip',
    component: () => import(`@/views/KupTooltip.vue`),
  },
];

const baseRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
];

const routes = [
  ...baseRoutes,
  ...boxRoutes,
  ...chartRoutes,
  ...dataTableRoutes,
  ...fldRoutes,
  ...easterRoutes,
  ...simpleRoutes,
];

export default new Router({
  // If you want to activate the history mode, remember to follow the instructions regarding publicPath prop
  // inside vue.config.js which holds the configuration for Webpack
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
