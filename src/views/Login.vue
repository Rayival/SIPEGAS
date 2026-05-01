<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const router = useRouter();

const login = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = "Email dan password wajib diisi!";
    return;
  }

  loading.value = true;
  errorMsg.value = "";
  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/admin");
  } catch (err) {
    console.error(err);
    errorMsg.value = "Login gagal! Periksa kembali email dan password.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6 text-white overflow-hidden relative">
    
    <!-- GLOW EFFECTS -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full"></div>
    
    <div class="w-full max-w-md space-y-8 relative z-10">
      
      <!-- LOGO / TITLE -->
      <div class="text-center space-y-4">
        <div class="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Secure Access</div>
        <h1 class="text-6xl font-black tracking-tighter text-white">SIPEGAS</h1>
        <p class="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Admin Authentication</p>
      </div>

      <!-- LOGIN CARD -->
      <div class="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl space-y-8 backdrop-blur-xl">
        
        <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-2xl text-center animate-shake">
          {{ errorMsg }}
        </div>

        <div class="space-y-6 text-left">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
            <input 
              v-model="email" 
              type="email"
              placeholder="admin@sipegas.com" 
              class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition text-white placeholder:text-gray-700" 
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Password</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition text-white placeholder:text-gray-700" 
              @keyup.enter="login"
            />
          </div>
        </div>

        <div class="space-y-4">
          <button 
            @click="login" 
            :disabled="loading"
            class="w-full bg-orange-500 hover:bg-orange-600 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {{ loading ? 'Authenticating...' : 'Sign In Now' }}
          </button>

          <router-link to="/" class="block text-center text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition">
            ← Back to Portal
          </router-link>
        </div>
      </div>

      <p class="text-center text-gray-700 text-[10px] font-bold uppercase tracking-widest mt-12">
        © 2024 SIPEGAS — Student Portfolio System
      </p>
    </div>
  </div>
</template>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>