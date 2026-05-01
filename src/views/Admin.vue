<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// ================= STATE =================
const activeSection = ref("tugas"); // 'tugas' or 'materi'

// --- Tugas State ---
const judulTugas = ref("");
const deskripsiTugas = ref("");
const deadlineTugas = ref("");
const statusTugas = ref("proses");
const linkSoal = ref("");
const linkJawaban = ref("");
const tugas = ref([]);
const editTugasId = ref(null);

// --- Materi State ---
const judulMateri = ref("");
const deskripsiMateri = ref("");
const linkMateri = ref("");
const materi = ref([]);
const editMateriId = ref(null);

const keyword = ref("");
const saving = ref(false);

let unsubTugas = null;
let unsubMateri = null;

// ================= SYNC DATA =================
onMounted(() => {
  const qTugas = query(collection(db, "tugas"), orderBy("createdAt", "desc"));
  unsubTugas = onSnapshot(qTugas, (snap) => {
    tugas.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  });

  const qMateri = query(collection(db, "materi"), orderBy("createdAt", "desc"));
  unsubMateri = onSnapshot(qMateri, (snap) => {
    materi.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  });
});

onUnmounted(() => {
  if (unsubTugas) unsubTugas();
  if (unsubMateri) unsubMateri();
});

// ================= TUGAS ACTIONS =================
const simpanTugas = async () => {
  if (!judulTugas.value) return alert("Judul wajib diisi!");
  saving.value = true;
  try {
    const data = {
      judul: judulTugas.value,
      deskripsi: deskripsiTugas.value,
      deadline: deadlineTugas.value,
      status: statusTugas.value,
      fileSoal: linkSoal.value,
      fileJawaban: linkJawaban.value,
      createdAt: serverTimestamp()
    };
    console.log("Saving tugas data:", data);
    if (editTugasId.value) {
      await updateDoc(doc(db, "tugas", editTugasId.value), data);
      alert("Tugas diperbarui!");
    } else {
      const docRef = await addDoc(collection(db, "tugas"), data);
      console.log("Tugas added with ID:", docRef.id);
      alert("Tugas dipublish!");
    }
    resetTugas();
  } catch (err) {
    console.error("Error saving tugas:", err);
    alert("Gagal menyimpan tugas: " + err.message);
  } finally {
    saving.value = false;
  }
};

const mulaiEditTugas = (t) => {
  editTugasId.value = t.id;
  judulTugas.value = t.judul;
  deskripsiTugas.value = t.deskripsi || "";
  deadlineTugas.value = t.deadline;
  statusTugas.value = t.status;
  linkSoal.value = t.fileSoal || "";
  linkJawaban.value = t.fileJawaban || "";
};

const resetTugas = () => {
  editTugasId.value = null;
  judulTugas.value = "";
  deskripsiTugas.value = "";
  deadlineTugas.value = "";
  statusTugas.value = "proses";
  linkSoal.value = "";
  linkJawaban.value = "";
};

// ================= MATERI ACTIONS =================
const simpanMateri = async () => {
  if (!judulMateri.value) return alert("Judul materi wajib diisi!");
  saving.value = true;
  try {
    const data = {
      judul: judulMateri.value,
      deskripsi: deskripsiMateri.value,
      link: linkMateri.value,
      createdAt: serverTimestamp()
    };
    console.log("Saving materi data:", data);
    if (editMateriId.value) {
      await updateDoc(doc(db, "materi", editMateriId.value), data);
      alert("Materi diperbarui!");
    } else {
      const docRef = await addDoc(collection(db, "materi"), data);
      console.log("Materi added with ID:", docRef.id);
      alert("Materi ditambahkan!");
    }
    resetMateri();
  } catch (err) {
    console.error("Error saving materi:", err);
    alert("Gagal menyimpan materi: " + err.message);
  } finally {
    saving.value = false;
  }
};

const mulaiEditMateri = (m) => {
  editMateriId.value = m.id;
  judulMateri.value = m.judul;
  deskripsiMateri.value = m.deskripsi || "";
  linkMateri.value = m.link || "";
};

const resetMateri = () => {
  editMateriId.value = null;
  judulMateri.value = "";
  deskripsiMateri.value = "";
  linkMateri.value = "";
};

const hapus = async (coll, id) => {
  if (!confirm("Hapus data ini?")) return;
  await deleteDoc(doc(db, coll, id));
};

// ================= SEARCH & STATS =================
const filteredTugas = computed(() => tugas.value.filter(t => t.judul.toLowerCase().includes(keyword.value.toLowerCase())));
const filteredMateri = computed(() => materi.value.filter(m => m.judul.toLowerCase().includes(keyword.value.toLowerCase())));

</script>

<template>
  <div class="min-h-screen bg-slate-950 p-4 md:p-12 text-white pt-48 md:pt-56">
    <div class="max-w-6xl mx-auto space-y-12">
      
      <!-- 🚀 HEADER -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 class="text-4xl md:text-6xl font-black text-orange-500 tracking-tighter">Admin Panel</h1>
          <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-3">Sistem Informasi — Content Management</p>
        </div>

        <div class="flex gap-4">
          <div class="bg-white/5 border border-white/10 px-6 py-4 rounded-[25px] flex flex-col items-center min-w-[140px]">
            <span class="text-[10px] text-gray-600 uppercase font-black tracking-widest">Total Konten</span>
            <span class="text-3xl font-black text-white">{{ tugas.length + materi.length }}</span>
          </div>
        </div>
      </header>

      <!-- TABS SELECTOR (Standalone Row) -->
      <div class="flex p-2 bg-white/5 border border-white/10 rounded-[30px] w-fit mx-auto md:mx-0">
        <button 
          @click="activeSection = 'tugas'" 
          :class="activeSection === 'tugas' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-gray-500 hover:text-white'" 
          class="px-10 py-3.5 rounded-[22px] font-black uppercase text-xs tracking-widest transition-all duration-500"
        >
          Kelola Tugas
        </button>
        <button 
          @click="activeSection = 'materi'" 
          :class="activeSection === 'materi' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-gray-500 hover:text-white'" 
          class="px-10 py-3.5 rounded-[22px] font-black uppercase text-xs tracking-widest transition-all duration-500"
        >
          Kelola Materi
        </button>
      </div>

      <div class="grid lg:grid-cols-3 gap-10">
        
        <!-- 📝 FORM PANEL -->
        <div class="lg:col-span-1">
          <div class="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-8 sticky top-32">
            
            <div v-if="activeSection === 'tugas'" class="space-y-6">
              <h2 class="text-xl font-bold flex items-center gap-3">
                <span class="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                {{ editTugasId ? 'Edit Tugas' : 'Post Tugas Baru' }}
              </h2>
              <div class="space-y-4">
                <input v-model="judulTugas" placeholder="Judul Tugas" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition" />
                <textarea v-model="deskripsiTugas" placeholder="Deskripsi Singkat" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition h-24 resize-none"></textarea>
                <div class="grid grid-cols-2 gap-4">
                  <input type="date" v-model="deadlineTugas" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition text-sm" />
                  <select v-model="statusTugas" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 transition appearance-none text-sm">
                    <option value="proses">🕒 Proses</option>
                    <option value="selesai">✅ Selesai</option>
                  </select>
                </div>
                <input v-model="linkSoal" placeholder="Link G-Drive Soal (PDF)" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition text-xs font-mono" />
                <input v-model="linkJawaban" placeholder="Link G-Drive Jawaban (PDF)" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500 transition text-xs font-mono" />
              </div>
              <button @click="simpanTugas" :disabled="saving" class="w-full py-5 bg-orange-500 hover:bg-orange-600 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50">
                {{ saving ? 'Processing...' : (editTugasId ? 'Update' : 'Publish') }}
              </button>
              <button v-if="editTugasId" @click="resetTugas" class="w-full text-xs font-bold uppercase text-gray-600 hover:text-white transition">Cancel Edit</button>
            </div>

            <div v-else class="space-y-6">
              <h2 class="text-xl font-bold flex items-center gap-3">
                <span class="w-1.5 h-6 bg-green-500 rounded-full"></span>
                {{ editMateriId ? 'Edit Materi' : 'Tambah Materi' }}
              </h2>
              <div class="space-y-4">
                <input v-model="judulMateri" placeholder="Judul Materi" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500 transition" />
                <textarea v-model="deskripsiMateri" placeholder="Keterangan Materi" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500 transition h-24 resize-none"></textarea>
                <input v-model="linkMateri" placeholder="Link Download Materi" class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500 transition text-xs font-mono" />
              </div>
              <button @click="simpanMateri" :disabled="saving" class="w-full py-5 bg-green-500 hover:bg-green-600 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition shadow-xl shadow-green-500/20 active:scale-95 disabled:opacity-50">
                {{ saving ? 'Processing...' : (editMateriId ? 'Update' : 'Save Materi') }}
              </button>
              <button v-if="editMateriId" @click="resetMateri" class="w-full text-xs font-bold uppercase text-gray-600 hover:text-white transition">Cancel Edit</button>
            </div>

          </div>
        </div>

        <!-- 📂 LIST PANEL -->
        <div class="lg:col-span-2 space-y-6">
          <input v-model="keyword" placeholder="Search content..." class="w-full bg-white/5 border border-white/10 rounded-[30px] px-8 py-5 focus:outline-none focus:border-orange-500 transition" />

          <div class="space-y-4">
            <template v-if="activeSection === 'tugas'">
              <div v-for="t in filteredTugas" :key="t.id" class="bg-white/5 border border-white/5 p-6 rounded-[30px] flex items-center justify-between group hover:border-orange-500/20 transition-all duration-300">
                <div class="flex items-center gap-6">
                  <div class="w-1.5 h-10 rounded-full" :class="t.status === 'selesai' ? 'bg-green-500' : 'bg-yellow-500'"></div>
                  <div>
                    <h3 class="font-bold group-hover:text-orange-400 transition">{{ t.judul }}</h3>
                    <p class="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{{ t.deadline }} — {{ t.status }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="mulaiEditTugas(t)" class="p-3 bg-white/5 hover:bg-yellow-500/10 text-yellow-500 rounded-xl transition border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click="hapus('tugas', t.id)" class="p-3 bg-white/5 hover:bg-red-500/10 text-red-500 rounded-xl transition border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </template>

            <template v-else>
              <div v-for="m in filteredMateri" :key="m.id" class="bg-white/5 border border-white/5 p-6 rounded-[30px] flex items-center justify-between group hover:border-green-500/20 transition-all duration-300">
                <div class="flex items-center gap-6">
                  <div class="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <h3 class="font-bold group-hover:text-green-400 transition">{{ m.judul }}</h3>
                    <p class="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Materi Kuliah</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="mulaiEditMateri(m)" class="p-3 bg-white/5 hover:bg-yellow-500/10 text-yellow-500 rounded-xl transition border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click="hapus('materi', m.id)" class="p-3 bg-white/5 hover:bg-red-500/10 text-red-500 rounded-xl transition border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </template>
            
            <div v-if="activeSection === 'tugas' && filteredTugas.length === 0" class="text-center py-20 text-gray-600 italic text-sm">No tasks found.</div>
            <div v-if="activeSection === 'materi' && filteredMateri.length === 0" class="text-center py-20 text-gray-600 italic text-sm">No materials found.</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>