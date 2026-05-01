<template>
  <footer class="mt-32 border-t border-white/5 bg-slate-950">
    <div class="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-16">

      <!-- 🔥 BRAND -->
      <div class="space-y-6">
        <h3 class="text-3xl font-black text-orange-500 flex items-center gap-3">
          <img src="/logo.png" alt="SIPEGAS Logo" class="w-10 h-10 rounded-full" />
          SIPEGAS
        </h3>
        <p class="text-gray-500 leading-relaxed text-sm">
          Sistem Pengumpulan Tugas (SIPEGAS) adalah platform portofolio tugas mahasiswa Sistem Informasi. Dirancang khusus untuk memfasilitasi peninjauan tugas oleh dosen secara efisien dan transparan.
        </p>
      </div>

      <!-- 👤 PROFIL -->
      <div>
        <h3 class="text-white font-black mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
          <span class="w-2 h-5 bg-orange-500 rounded-full"></span>
          Profil Mahasiswa
        </h3>
        <ul class="space-y-6 text-sm">
          <li class="flex flex-col gap-1">
            <span class="text-gray-600 text-[10px] uppercase font-black tracking-widest">Nama Lengkap</span>
            <span class="text-gray-300 font-bold">Muhammad Ganjar</span>
          </li>
          <li class="flex flex-col gap-1">
            <span class="text-gray-600 text-[10px] uppercase font-black tracking-widest">Nomor Induk Mahasiswa</span>
            <span class="text-gray-300 font-bold">2403010203</span>
          </li>
          <li class="flex flex-col gap-1">
            <span class="text-gray-600 text-[10px] uppercase font-black tracking-widest">Program Studi</span>
            <span class="text-gray-300 font-bold">Teknik Informatika — 2024</span>
          </li>
        </ul>
      </div>

      <!-- 📊 INFO -->
      <div>
        <h3 class="text-white font-black mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
          <span class="w-2 h-5 bg-green-500 rounded-full"></span>
          Informasi Portal
        </h3>
        <ul class="space-y-4 text-sm">
          <li class="flex items-center justify-between border-b border-white/5 pb-4">
            <span class="text-gray-600 font-bold uppercase text-[10px]">Mata Kuliah</span>
            <span class="text-gray-300 font-bold">Sistem Informasi</span>
          </li>
          <li class="flex items-center justify-between border-b border-white/5 pb-4">
            <span class="text-gray-600 font-bold uppercase text-[10px]">Teknologi</span>
            <span class="text-gray-300 font-bold">Vue 3 + Cloud Firebase</span>
          </li>
          <li class="flex items-center justify-between border-b border-white/5 pb-4">
            <span class="text-gray-600 font-bold uppercase text-[10px]">Status Sistem</span>
            <span class="text-green-500 font-black tracking-widest text-[10px]">OPERATIONAL</span>
          </li>
        </ul>
      </div>

    </div>

    <!-- 🔻 BOTTOM -->
    <div class="border-t border-white/5 py-10 bg-black/40">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          © 2026 <span class="text-orange-500">SIPEGAS Portal</span> — Developed by Muhammad Ganjar
        </p>
        <div class="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-700">
          <a href="#" class="hover:text-orange-500 transition duration-300">Privacy Policy</a>
          <a href="#" class="hover:text-orange-500 transition duration-300">Terms of Use</a>
        </div>
      </div>
    </div>

  </footer>
</template>