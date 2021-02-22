import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import SignUp from '@/views/SignUp.vue';
import FindTalent from '@/views/FindTalent.vue';
import FindMentor from '@/views/FindMentor.vue';
import Feedback from '@/views/Feedback.vue';
import UserProfile from '@/views/UserProfile.vue';
import WavesFromTalent from '@/views/WavesFromTalent.vue';
import WavesFromMentors from '@/views/WavesFromMentors.vue';
import BrowseEvents from '@/views/BrowseEvents.vue';
import About from '@/views/About.vue';
import NotFound from '@/views/NotFound.vue';


// all the different paths for the SPA
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/signup',
    name: 'SignUp',
    component: SignUp 
  }, {
    path: '/find-talent',
    name: 'FindTalent',
    component: FindTalent,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/find-mentor',
    name: 'FindMentor',
    component: FindMentor,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/profile/info',
    
  }, {
    path: '/browse-events',
    name: 'BrowseEvents',
    component: BrowseEvents,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/profile',
    name: 'Profile',
    component: UserProfile,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/profile/waves-from-talent',
    name: 'WavesFromTalent',
    component: WavesFromTalent,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/profile/waves-from-mentors',
    name: 'WavesFromMentors',
    component: WavesFromMentors,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which isLoading lazy-loaded when the route isLoading visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router guards 
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = (store.state.user !== null);
  const isLoading = store.state.isLoading;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // to redirect users who aren't logged in
  if (requiresAuth && !isLoggedIn && !isLoading) next({ name: 'Login' })
  else next();
})

export default router