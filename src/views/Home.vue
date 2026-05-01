<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import ava from "@/assets/img/ava.png";

const tugas = ref([]);
const materi = ref([]);
const loading = ref(true);

let unsubTugas = null;
let unsubMateri = null;

onMounted(() => {
  console.log("Setting up real-time listeners...");
  
  // Real-time listener for Tugas
  const qTugas = query(collection(db, "tugas"), orderBy("createdAt", "desc"));
  unsubTugas = onSnapshot(qTugas, (snap) => {
    tugas.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log("Tugas synced:", tugas.value.length);
    loading.value = false;
  }, (err) => {
    console.error("Error syncing tugas:", err);
    loading.value = false;
  });

  // Real-time listener for Materi
  const qMateri = query(collection(db, "materi"), orderBy("createdAt", "desc"));
  unsubMateri = onSnapshot(qMateri, (snap) => {
    materi.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log("Materi synced:", materi.value.length);
  }, (err) => {
    console.error("Error syncing materi:", err);
  });
});

onUnmounted(() => {
  if (unsubTugas) unsubTugas();
  if (unsubMateri) unsubMateri();
});

const totalTugas = computed(() => tugas.value.length);
const selesai = computed(() =>
  tugas.value.filter(t => t.status === "selesai").length
);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
    
    <!-- 🚀 HERO SECTION -->
    <section class="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 px-4">
      <div class="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-500/10 blur-[100px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div class="space-y-6 md:space-y-8 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Student Portal — 2024
          </div>
          
          <h1 class="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            SIPEGAS <br/>
            <span class="text-orange-500">Sistem <br class="md:hidden"/> Informasi</span>
          </h1>
          
          <p class="text-gray-500 text-base md:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
            SIPEGAS (Sistem Pengumpulan Tugas) adalah platform portofolio digital mahasiswa untuk mempermudah peninjauan hasil pengerjaan tugas secara transparan.
          </p>

          <div class="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="#tugas" class="bg-orange-500 hover:bg-orange-600 text-white px-8 md:px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-orange-500/20 transition active:scale-95">
              Lihat Tugas
            </a>
            <a href="#materi" class="bg-white/5 hover:bg-white/10 border border-white/10 px-8 md:px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm transition">
              Materi Kuliah
            </a>
          </div>
        </div>

        <div class="relative group hidden md:block">
          <div class="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition duration-700"></div>
          <img :src="ava" alt="Hero" class="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl transform group-hover:-translate-y-4 transition duration-700 object-cover" />
        </div>
      </div>
    </section>

    <!-- 📊 STATS -->
    <div class="max-w-7xl mx-auto px-4 -mt-12 md:-mt-16 relative z-20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl text-center">
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Tugas</p>
          <p class="text-3xl md:text-4xl font-black mt-2 text-white">{{ totalTugas }}</p>
        </div>
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl text-center">
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Selesai</p>
          <p class="text-3xl md:text-4xl font-black mt-2 text-green-400">{{ selesai }}</p>
        </div>
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl text-center">
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Materi</p>
          <p class="text-3xl md:text-4xl font-black mt-2 text-blue-400">{{ materi.length }}</p>
        </div>
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl text-center">
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Semester</p>
          <p class="text-3xl md:text-4xl font-black mt-2 text-purple-400">1</p>
        </div>
      </div>
    </div>

    <!-- 📚 MATERI SECTION -->
    <section id="materi" class="max-w-7xl mx-auto px-4 py-24 md:py-32 space-y-12">
      <div class="flex items-center gap-6">
        <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter">Materi Kuliah</h2>
        <div class="h-px flex-1 bg-white/10"></div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div v-for="m in materi" :key="m.id" class="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[40px] group hover:border-orange-500/50 transition duration-500 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl md:text-2xl font-bold mb-4 group-hover:text-orange-400 transition">{{ m.judul }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-8">{{ m.deskripsi || 'Materi pembelajaran untuk mata kuliah Sistem Informasi.' }}</p>
          </div>
          <a :href="m.link" target="_blank" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-center transition shadow-lg shadow-orange-500/10">Download Materi</a>
        </div>
        
        <div v-if="materi.length === 0" class="col-span-full text-center py-20 text-gray-600 italic">Materi belum tersedia.</div>
      </div>
    </section>

    <!-- 📝 TUGAS SECTION -->
    <section id="tugas" class="max-w-7xl mx-auto px-4 py-24 md:py-32 space-y-12">
      <div class="flex items-center gap-6">
        <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter">Daftar Tugas</h2>
        <div class="h-px flex-1 bg-white/10"></div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="flex flex-col items-center py-20 space-y-4">
        <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-600 font-bold text-[10px] uppercase tracking-widest animate-pulse">Synchronizing database...</p>
      </div>

      <!-- LIST -->
      <div v-else class="grid gap-4 md:gap-6">
        <div v-for="t in tugas" :key="t.id"
          class="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white/10 hover:border-orange-500/30 transition duration-300">
          
          <div class="flex items-start gap-5 md:gap-6 w-full md:w-auto">
            <div class="w-1.5 h-12 md:h-16 rounded-full shrink-0 mt-1" :class="t.status === 'selesai' ? 'bg-green-500' : 'bg-yellow-500'"></div>
            <div class="space-y-2 overflow-hidden">
              <h3 class="text-xl md:text-2xl font-bold group-hover:text-orange-400 transition truncate">{{ t.judul }}</h3>
              <p class="text-gray-500 text-xs md:text-sm max-w-md line-clamp-2">{{ t.deskripsi || 'Rincian pengerjaan tugas Sistem Informasi.' }}</p>
              <div class="flex flex-wrap items-center gap-3 md:gap-4 pt-2">
                <span class="text-[10px] font-bold text-gray-600 uppercase tracking-widest">DL: {{ t.deadline }}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10" :class="t.status === 'selesai' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'">
                  {{ t.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-56">
            <router-link :to="'/tugas/' + t.id + '?tab=soal'"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest text-center transition active:scale-95">
              Lihat Soal
            </router-link>
            
            <template v-if="t.fileJawaban">
               <router-link :to="'/tugas/' + t.id + '?tab=jawaban'"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest text-center transition active:scale-95">
                Lihat Jawaban
              </router-link>
            </template>
            <template v-else>
              <div class="flex-1 bg-white/5 text-gray-600 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center border border-white/5 italic">
                Pengerjaan...
              </div>
            </template>
          </div>

        </div>
        
        <div v-if="tugas.length === 0" class="text-center py-20 text-gray-600 italic">Belum ada tugas dipublish.</div>
      </div>
    </section>

  </div>
</template>