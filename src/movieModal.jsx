import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieModal = ({ movieId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        // Ambil detail utama (Durasi, Genre)
        const detailRes = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const detailData = await detailRes.json();
        
        // Ambil daftar aktor (Credits)
        const creditRes = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
        const creditData = await creditRes.json();

        setDetails(detailData);
        setCast(creditData.cast.slice(0, 6)); // Ambil 6 pemeran utama saja
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) fetchMovieDetails();
  }, [movieId]);

  if (!movieId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700">
        
        <button onClick={onClose} className="absolute top-4 right-4 bg-red-600 text-white w-8 h-8 rounded-full z-10 hover:bg-red-700">
          ✕
        </button>

        {isLoading ? (
          <div className="p-20 text-center text-white animate-pulse">Memuat detail film...</div>
        ) : (
          details && (
            <div className="flex flex-col md:flex-row">
              <img 
                src={details.poster_path ? `${IMAGE_URL}${details.poster_path}` : 'https://via.placeholder.com/500x750'} 
                alt={details.title}
                className="w-full md:w-1/3 object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
              />
              <div className="p-6 md:w-2/3 text-white">
                <h2 className="text-3xl font-bold text-blue-400 mb-1">{details.title}</h2>
                
                {/* Info Genre & Durasi */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                  <span>📅 {details.release_date?.substring(0, 4)}</span>
                  <span>⏳ {details.runtime} Menit</span>
                  <div className="flex gap-2">
                    {details.genres?.map(g => (
                      <span key={g.id} className="bg-gray-800 px-2 py-1 rounded border border-gray-700">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">{details.overview}</p>

                {/* Daftar Pemeran */}
                <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-3">Pemeran Utama</h3>
                <div className="grid grid-cols-3 gap-4">
                  {cast.map(actor => (
                    <div key={actor.id} className="text-center">
                      <img 
                        src={actor.profile_path ? `${IMAGE_URL}${actor.profile_path}` : 'https://via.placeholder.com/150'} 
                        alt={actor.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover mx-auto mb-1 border-2 border-gray-700"
                      />
                      <p className="text-xs font-bold truncate">{actor.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MovieModal;