<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const route = useRoute();
const data = ref(null);
const loading = ref(true);
const activeTab = ref(route.query.tab || "jawaban"); // Use query param if available

onMounted(async () => {
  try {
    const snap = await getDoc(doc(db, "tugas", route.params.id));
    if (snap.exists()) {
      data.value = snap.data();
      // If activeTab is jawaban but fileJawaban is missing, default to soal
      if (activeTab.value === "jawaban" && !data.value.fileJawaban) {
        activeTab.value = "soal";
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Watch for query changes to update tab
watch(() => route.query.tab, (newTab) => {
  if (newTab) activeTab.value = newTab;
});

// Helper to convert GDrive view links to preview links for iframe compatibility
const getEmbedLink = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    if (url.includes("/view")) {
      return url.replace("/view", "/preview");
    }
  }
  return url;
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 p-4 md:p-12 text-white pt-24 md:pt-32">
    <div class="max-w-6xl mx-auto space-y-8 md:space-y-12">
      
      <!-- NAVIGATION BACK -->
      <router-link to="/" class="inline-flex items-center gap-3 text-gray-600 hover:text-white transition group font-black uppercase text-[10px] tracking-widest">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:-translate-x-2 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Portal
      </router-link>

      <!-- LOADING -->
      <div v-if="loading" class="flex flex-col items-center py-32 space-y-4">
        <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Menyiapkan Dokumen...</p>
      </div>

      <div v-else-if="data" class="grid lg:grid-cols-1 gap-8 md:gap-12">
        
        <!-- HEADER CARD -->
        <header class="bg-white/5 border border-white/10 p-6 md:p-16 rounded-[40px] relative overflow-hidden">
          <div class="md:absolute top-0 right-0 p-0 md:p-10 mb-8 md:mb-0">
             <span
                class="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
                :class="data.status === 'selesai'
                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                  : 'bg-yellow-400/10 text-yellow-500 border-yellow-400/20'"
              >
                {{ data.status }}
              </span>
          </div>

          <div class="space-y-6">
            <h1 class="text-3xl md:text-7xl font-black tracking-tighter leading-[1.1] max-w-4xl">
              {{ data.judul }}
            </h1>

            <p class="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
              {{ data.deskripsi || 'Rincian pengerjaan tugas Sistem Informasi.' }}
            </p>

            <div class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 pt-4">
              <div class="flex flex-col gap-1">
                <span class="text-gray-700 text-[9px] font-black uppercase tracking-[0.2em]">Deadline</span>
                <span class="text-white font-bold text-sm">{{ data.deadline }}</span>
              </div>
              <div class="hidden md:block w-px h-10 bg-white/10"></div>
              <div class="flex flex-col gap-1">
                <span class="text-gray-700 text-[9px] font-black uppercase tracking-[0.2em]">Mata Kuliah</span>
                <span class="text-orange-500 font-bold text-sm">Sistem Informasi</span>
              </div>
            </div>
          </div>
        </header>

        <!-- VIEWING SECTION -->
        <section class="space-y-6 md:space-y-8">
          <!-- TABS -->
          <div class="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
            <button 
              @click="activeTab = 'soal'"
              class="px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition duration-300"
              :class="activeTab === 'soal' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-white'"
            >
              Lihat Soal
            </button>
            <button 
              @click="activeTab = 'jawaban'"
              class="px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition duration-300"
              :class="activeTab === 'jawaban' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-white'"
            >
              Lihat Jawaban
            </button>
          </div>

          <!-- IFRAME VIEWER -->
          <div class="bg-white/5 border border-white/10 p-2 md:p-4 rounded-[40px] overflow-hidden shadow-2xl">
            <div class="bg-slate-900/50 rounded-[30px] overflow-hidden relative min-h-[500px] md:min-h-[850px]">
              
              <!-- SOAL VIEW -->
              <iframe
                v-if="activeTab === 'soal' && data.fileSoal"
                :src="getEmbedLink(data.fileSoal)"
                class="absolute inset-0 w-full h-full border-none">
              </iframe>

              <!-- JAWABAN VIEW -->
              <iframe
                v-else-if="activeTab === 'jawaban' && data.fileJawaban"
                :src="getEmbedLink(data.fileJawaban)"
                class="absolute inset-0 w-full h-full border-none">
              </iframe>
              
              <!-- PENDING VIEW -->
              <div v-else-if="activeTab === 'jawaban' && !data.fileJawaban" class="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-center p-6 md:p-10">
                <div class="text-6xl md:text-8xl animate-bounce">⏳</div>
                <h3 class="text-xl md:text-2xl font-black uppercase tracking-tighter text-orange-500">Pengerjaan...</h3>
                <p class="text-gray-600 max-w-xs font-bold uppercase text-[9px] md:text-xs tracking-widest leading-relaxed">
                  Hasil pengerjaan tugas ini sedang dalam proses.
                </p>
              </div>

              <!-- MISSING VIEW -->
              <div v-else class="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-center p-10">
                <div class="text-5xl opacity-20">📁</div>
                <p class="text-gray-600 font-bold uppercase tracking-widest text-[10px]">
                  File {{ activeTab }} tidak tersedia.
                </p>
              </div>

            </div>
          </div>

          <!-- DOWNLOAD BUTTONS -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <a v-if="data.fileSoal" :href="data.fileSoal" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition active:scale-95 text-center">
              Lihat Full Soal
            </a>
            <a v-if="data.fileJawaban" :href="data.fileJawaban" target="_blank" class="bg-green-600 hover:bg-green-700 text-white px-8 md:px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition active:scale-95 text-center">
              Lihat Full Jawaban
            </a>
          </div>
        </section>

      </div>

      <!-- ERROR STATE -->
      <div v-else class="text-center py-24 md:py-32 bg-white/5 border border-white/10 rounded-[40px] space-y-6 px-6">
        <div class="text-5xl md:text-6xl">⚠️</div>
        <h2 class="text-2xl font-black uppercase tracking-tighter">Not Found</h2>
        <p class="text-gray-600 max-w-sm mx-auto font-bold uppercase text-[10px] tracking-widest">Tugas tidak ditemukan atau telah dihapus.</p>
        <router-link to="/" class="inline-block bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-bold transition">Back to Portal</router-link>
      </div>

    </div>
  </div>
</template>