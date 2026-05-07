import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import MovieModal from './MovieModal';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('popular');
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Pakai null, bukan 'null'
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Watchlist State
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('myWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Simpan Watchlist
  useEffect(() => {
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("gagal mengambil genre:", error);
      }
    };
    fetchGenres();
  }, []);

  // Fungsi Fetch Utama
  const fetchMovies = async (page = 1, query = '', currentCategory = 'popular', genreId = null) => {
    setIsLoading(true);
    try {
      let endpoint = "";
      
      if (query) {
        endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
      } else if (genreId) {
        endpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
      } else {
        endpoint = `${BASE_URL}/movie/${currentCategory}?api_key=${API_KEY}&page=${page}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      setMovies(data.results || []);
      setCurrentPage(page);
      setActiveQuery(query);
      setCategory(currentCategory);
      setSelectedGenre(genreId);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Gagal mengambil data film", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load pertama kali
  useEffect(() => {
    fetchMovies(1, '', 'popular');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTab('home');
      fetchMovies(1, searchInput);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setActiveTab('home');
    setSearchInput('');
    fetchMovies(1, '', newCategory);
  };

  const handleGenreChange = (genreId) => {
    setActiveTab('home');
    setSearchInput('');
    fetchMovies(1, '', category, genreId);
  };

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const isExist = prev.find(item => item.id === movie.id);
      if (isExist) return prev.filter(item => item.id !== movie.id);
      return [...prev, movie];
    });
  };

  const displayedMovies = activeTab === 'home' ? movies : watchlist;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5 font-sans">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-6 tracking-wide">
          watchlist<span className="text-white text-xl md:text-2xl font-light">.cinema</span>
        </h1>
        
        <form onSubmit={handleSearch} className="flex justify-center max-w-xl mx-auto mb-8 shadow-lg">
          <input 
            type="text" 
            className="flex-1 p-3 rounded-l-lg bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Cari film..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-6 py-3 rounded-r-lg font-bold hover:bg-blue-700 transition">
            Cari
          </button>
        </form>

        {/* Tab Navigasi */}
        <div className="flex flex-wrap justify-center gap-4 border-b border-gray-700 pb-4 mb-6">
          <button 
            onClick={() => handleCategoryChange('popular')}
            className={`px-6 py-2 rounded-full font-semibold transition ${category === 'popular' && activeTab === 'home' && !selectedGenre ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Paling Populer
          </button>
          <button 
            onClick={() => handleCategoryChange('now_playing')}
            className={`px-6 py-2 rounded-full font-semibold transition ${category === 'now_playing' && activeTab === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Baru Rilis
          </button>
          <button 
            onClick={() => setActiveTab('watchlist')}
            className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === 'watchlist' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Watchlist Saya ({watchlist.length})
          </button>
        </div>

        {/* Filter Genre */}
        <div className="flex overflow-x-auto gap-3 py-2 no-scrollbar max-w-7xl mx-auto px-4 justify-">
          <button 
            onClick={() => handleCategoryChange('popular')} 
            className={`px-4 py-1 rounded-full border transition ${!selectedGenre ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button 
              key={genre.id}
              onClick={() => handleGenreChange(genre.id)}
              className={`px-4 py-1 rounded-full border whitespace-nowrap transition ${selectedGenre === genre.id ? 'bg-blue-600 border-blue-600' : 'border-gray-600 hover:border-blue-400'}`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </header>

      {/* Info Search */}
      {activeQuery && activeTab === 'home' && (
        <div className="max-w-7xl mx-auto mb-6 text-center">
          <p className="text-gray-400">Hasil pencarian untuk: <span className="text-white font-bold">"{activeQuery}"</span></p>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {isLoading && activeTab === 'home' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayedMovies.length > 0 ? (
          <>
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

            {/* Pagination */}
            {activeTab === 'home' && (
              <div className="flex justify-center items-center gap-6 mt-12 mb-10">
                <button 
                  onClick={() => fetchMovies(Number(currentPage) - 1, activeQuery, category, selectedGenre)}
                  disabled={Number(currentPage) <= 1}
                  className={`px-6 py-2 rounded-lg font-bold ${Number(currentPage) <= 1 ? 'bg-gray-800 text-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Prev
                </button>
                <span className="font-bold text-blue-400">Page {currentPage}</span>
                <button 
                  onClick={() => fetchMovies(Number(currentPage) + 1, activeQuery, category, selectedGenre)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-20 text-xl">
            {activeTab === 'watchlist' ? 'Watchlist kamu masih kosong.' : 'Film tidak ditemukan.'}
          </div>
        )}
      </main>

      {/* Modal */}
      <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
    </div>
  );
}

export default App;