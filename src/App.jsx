import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import MovieModal from './MovieModal';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en=US');
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("gagal mengambil genre:", error);
      }
    };
    fetchGenres();
  }, []);

  // ambil film berdasarkan genre
  const fetchMoviesByGenre = async (genreId) => {
    setIsLoading(true);
    setSelectedGenre(genreId);
    setActiveTab('home');
    try {
      const endpoint = '${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}';
      const response = await fetch(endpoint);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching by genre:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // State untuk Tab (home / watchlist)
  const [activeTab, setActiveTab] = useState('home');
  
  // State untuk Modal
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // State untuk Watchlist (Ambil dari LocalStorage saat pertama kali render)
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('myWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Simpan ke LocalStorage setiap kali watchlist berubah
  useEffect(() => {
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setActiveTab('home'); // Kembalikan ke tab home saat mencari
    try {
      const endpoint = query 
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchQuery);
  };

  // Fungsi menambah/menghapus dari watchlist
  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const isExist = prev.find(item => item.id === movie.id);
      if (isExist) {
        return prev.filter(item => item.id !== movie.id); // Hapus
      } else {
        return [...prev, movie]; // Tambah
      }
    });
  };

  // Tentukan film mana yang mau ditampilkan berdasarkan tab aktif
  const displayedMovies = activeTab === 'home' ? movies : watchlist;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5 font-sans">
      
      {/* Header & Navigasi */}
      <header className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-6 tracking-wide">
          watchlist<span className="text-white text-xl md:text-2xl font-light">.cinema</span>
        </h1>
        
        <form onSubmit={handleSearch} className="flex justify-center max-w-xl mx-auto mb-8 shadow-lg">
          <input 
            type="text" 
            className="flex-1 p-3 rounded-l-lg bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Cari film..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-blue-600 px-6 py-3 rounded-r-lg font-bold hover:bg-blue-700 transition">
            Cari
          </button>
        </form>

        {/* Tab Navigasi */}
        <div className="flex justify-center gap-4 border-b border-gray-700 pb-4">
          <button 
            onClick={() => setActiveTab('home')}
            className={`font-bold pb-2 ${activeTab === 'home' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
          >
            Beranda Populer
          </button>
          <button 
            onClick={() => setActiveTab('watchlist')}
            className={`font-bold pb-2 ${activeTab === 'watchlist' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
          >
            Watchlist Saya ({watchlist.length})
          </button>
        </div>
      </header>

      {/* memilih genre */}
      <div className="flex overflow-x-auto gap-3 py-4 no-scrollbar max-w-7xl mx-auto px-4">
        <button onClick={() => { setSelectedGenre(null); fetchMovies(); }} className={`px-4 py-1 rounded-full border whitespace-nowrap transition ${!selectedGenre ? 'bg-blue-600 border-blue-600' : 'border-gray-600 hover:border-blue-400'}`}
        >
          All
        </button>

        {genres.map((genre) => (
    <button 
      key={genre.id}
      onClick={() => fetchMoviesByGenre(genre.id)}
      className={`px-4 py-1 rounded-full border whitespace-nowrap transition ${selectedGenre === genre.id ? 'bg-blue-600 border-blue-600' : 'border-gray-600 hover:border-blue-400'}`}
    >
      {genre.name}
    </button>
    ))}
      </div>

      {/* Area Grid Konten */}
      <main className="max-w-7xl mx-auto">
        {isLoading && activeTab === 'home' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Tampilkan 10 Skeleton Loading */}
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayedMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedMovies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onOpenModal={setSelectedMovieId}
                onToggleWatchlist={toggleWatchlist}
                isWatchlisted={watchlist.some(item => item.id === movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20 text-xl">
            {activeTab === 'watchlist' ? 'Watchlist kamu masih kosong.' : 'Film tidak ditemukan.'}
          </div>
        )}
      </main>

      {/* Komponen Modal Detail Film */}
      <MovieModal 
        movieId={selectedMovieId} 
        onClose={() => setSelectedMovieId(null)} 
      />
      
    </div>
  );
}

export default App;