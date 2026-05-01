<script setup>
import { ref, onMounted } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";


const user = ref(null);
const isScrolled = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (u) => user.value = u);
  window.addEventListener("scroll", () => {
    isScrolled.value = window.scrollY > 20;
  });
});

const logout = async () => {
  await signOut(auth);
  location.href = "/";
};
</script>

<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="isScrolled ? 'py-4 bg-slate-950/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'py-6 md:py-8 bg-transparent'"
  >
    
    <div class="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">

      <!-- 🔥 Logo + Avatar -->
      <router-link to="/" class="flex items-center gap-3 md:gap-4 group">
        <div class="relative">
          <div class="absolute inset-0 bg-orange-500 blur-lg opacity-0 group-hover:opacity-40 transition duration-500 rounded-full"></div>
          <img
            src="/logo.png"
            class="relative w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 shadow-xl group-hover:border-orange-500/50 transition duration-500 object-cover"
          />
        </div>

        <div class="block">
          <h1 class="font-black text-xl md:text-2xl tracking-tighter leading-none text-white group-hover:text-orange-500 transition duration-300">
            SIPEGAS
          </h1>
          <p class="hidden sm:block text-[8px] md:text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">Student Portal</p>
        </div>
      </router-link>

      <!-- 🧭 Menu -->
      <div class="flex items-center gap-4 md:gap-10">
        
        <div class="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
          <router-link to="/" class="text-gray-400 hover:text-white transition duration-300">Portal</router-link>
          <a href="/#materi" class="text-gray-400 hover:text-white transition duration-300">Materi</a>
          <a href="/#tugas" class="text-gray-400 hover:text-white transition duration-300">Tugas</a>
        </div>

        <!-- AUTH ACTIONS -->
        <div class="flex items-center gap-2 md:gap-4">
          <router-link v-if="!user"
            to="/login"
            class="bg-orange-500 hover:bg-orange-600 text-white px-5 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition active:scale-95">
            Login
          </router-link>

          <template v-else>
            <router-link
              to="/admin"
              class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition mr-2">
              Admin
            </router-link>

            <button @click="logout"
              class="bg-white/5 hover:bg-red-500/10 border border-white/10 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500 transition">
              <span class="sm:hidden">Exit</span>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </template>
        </div>

      </div>
    </div>
  </nav>
</template>