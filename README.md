# Ibrahim Fawwaz Portfolio — Next.js

Portfolio dinamis berbasis Next.js App Router dan database SQLite lokal. Konten proyek, skills, sertifikat, testimoni, URL CV, serta pesan kontak tersimpan di `data/portfolio.db` dan dikelola melalui `/admin`.

## Menjalankan proyek

1. Salin `.env.example` menjadi `.env.local`, lalu isi kata sandi admin dan session secret.
2. Jalankan `npm install`.
3. Jalankan `npm run db:init` jika file `data/portfolio.db` belum tersedia.
4. Jalankan `npm run dev`, lalu buka `http://localhost:3000`.

Login admin awal jika belum mengatur `.env.local`: `ukk-admin-2026`. Ganti sebelum deployment.

## Konten yang perlu Anda isi

- Tempel URL PDF CV pada Dashboard Admin → Link CV.
- Tambahkan URL gambar/halaman kredensial sertifikat yang asli.
- Ganti testimoni contoh dengan testimoni asli. Jangan menampilkan data contoh di portfolio final.
