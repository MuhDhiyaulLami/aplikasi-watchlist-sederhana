🎬 watchlist.cinema

watchlist.cinema adalah aplikasi katalog film modern yang dibangun menggunakan React.js dan Tailwind CSS. Aplikasi ini memungkinkan pengguna untuk menjelajahi film populer, mencari judul film secara real-time, hingga mengelola daftar tontonan pribadi (watchlist) dengan data yang diambil langsung dari TMDB (The Movie Database) API.
🚀 Fitur Utama
-Dynamic Fetching: Mengambil data film terbaru secara langsung dari TMDB API.

-Advanced Filtering: Filter film berdasarkan Genre (Action, Drama, Horror, dll) dan Kategori (Paling Populer & Baru Rilis).

-Search Functionality: Fitur pencarian film yang terintegrasi dengan sistem pagination.

-Smart Pagination: Navigasi halaman yang mulus dan sinkron dengan filter yang sedang aktif.

-Personal Watchlist: Simpan film favoritmu ke daftar tontonan menggunakan LocalStorage (Data tetap tersimpan meskipun browser di-refresh).

-Detail Modal: Informasi lengkap mengenai sinopsis, trailer, rating, dan detail film dalam tampilan modal yang elegan.

-Responsive Design: Tampilan yang dioptimalkan untuk berbagai ukuran layar (Mobile & Desktop) menggunakan Tailwind CSS.

🛠️ Tech Stack
Core: React.js (Vite)

Styling: Tailwind CSS

Icons: Lucide React (Opsional, sesuaikan dengan yang kamu pakai)

Data Source: TMDB API

💡 Cara Menjalankan Proyek
Clone repository ini:
git clone https://github.com/MuhDhiyaulLami/aplikasi-watchlist-sederhana.git

Install dependencies:
npm install

Buat file .env di root folder dan masukkan API Key kamu:
VITE_TMDB_API_KEY=taro api disini

Jalankan aplikasi:
npm run dev