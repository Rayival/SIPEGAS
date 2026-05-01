import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";
import Detail from "../views/Detail.vue";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const requireAuth = (to, from, next) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();
    if (user) {
      next();
    } else {
      next("/login");
    }
  });
};

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/admin", component: Admin, beforeEnter: requireAuth },
  { path: "/tugas/:id", component: Detail }
];

export default createRouter({
  history: createWebHistory(),
  routes
});