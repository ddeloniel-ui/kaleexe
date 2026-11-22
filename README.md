# KALE.exe — A Little Reminder For You

Interactive vintage transparent Nokia 3310 digital gift experience built with React, TypeScript, Tailwind CSS, and Vite.

## Deploy ke Vercel

Proyek ini sudah dikonfigurasi dengan `vercel.json` dan `.npmrc` agar siap dideploy sebagai static Vite app di Vercel.

### Cara 1: Via GitHub + Vercel Dashboard
1. Push seluruh file proyek (termasuk folder `public/assets/aistudio/` dan `vercel.json`) ke repository GitHub.
2. Buka [vercel.com/new](https://vercel.com/new) dan pilih repository tersebut.
3. Pengaturan akan otomatis terdeteksi:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
4. Klik **Deploy**.

### Cara 2: Via Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

## Jalankan Secara Lokal
```bash
npm install --legacy-peer-deps
npm run dev
```
