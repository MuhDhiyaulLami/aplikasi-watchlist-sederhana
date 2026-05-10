import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieModal = ({ movieId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setTrailerKey(null);
      try {
        const [detailRes, creditRes, videoRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`),
        ]);

        const [detailData, creditData, videoData] = await Promise.all([
          detailRes.json(),
          creditRes.json(),
          videoRes.json(),
        ]);

        setDetails(detailData);
        setCast(creditData.cast.slice(0, 6));

        const trailer = videoData.results?.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailerKey(trailer?.key ?? null);
      } catch (error) {
        console.error('Gagal mengambil detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) fetchMovieDetails();
  }, [movieId]);

  if (!movieId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 text-white w-8 h-8 rounded-full z-10 hover:bg-red-700"
        >
          ✕
        </button>

        {isLoading ? (
          <div className="p-20 text-center text-white animate-pulse">Memuat detail film...</div>
        ) : (
          details && (
            <>
              {/* ── BARIS ATAS: Poster | Trailer ── */}
              <div className="flex flex-col md:flex-row gap-0">

                {/* Poster */}
                <div className="md:w-[240px] shrink-0">
                  <img
                    src={details.poster_path ? `${IMAGE_URL}${details.poster_path}` : 'https://via.placeholder.com/500x750'}
                    alt={details.title}
                    className="w-full h-full object-cover rounded-t-2xl md:rounded-tl-2xl md:rounded-tr-none md:rounded-bl-2xl"
                  />
                </div>

                {/* Trailer */}
                <div className="flex-1 bg-black flex items-center rounded-tr-2xl">
                  {trailerKey ? (
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        className="absolute inset-0 w-full h-full rounded-tr-2xl"
                        src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
                        title={`Trailer ${details.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center h-48 text-gray-500 text-sm">
                      Trailer tidak tersedia.
                    </div>
                  )}
                </div>
              </div>

              {/* ── BARIS BAWAH: Detail Film ── */}
              <div className="p-6 text-white space-y-5">

                {/* Judul + meta */}
                <div>
                  <h2 className="text-3xl font-bold text-blue-400 mb-2">{details.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span>📅 {details.release_date?.substring(0, 4)}</span>
                    <span>⏳ {details.runtime} Menit</span>
                    <span>⭐ {details.vote_average?.toFixed(1)}</span>
                    {details.genres?.map(g => (
                      <span key={g.id} className="bg-gray-800 px-2 py-1 rounded border border-gray-700">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sinopsis */}
                <p className="text-gray-300 text-sm leading-relaxed">{details.overview}</p>

                {/* Pemeran */}
                <div>
                  <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-3">Pemeran Utama</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {cast.map(actor => (
                      <div key={actor.id} className="text-center">
                        <img
                          src={actor.profile_path ? `${IMAGE_URL}${actor.profile_path}` : 'https://via.placeholder.com/150'}
                          alt={actor.name}
                          className="w-14 h-14 rounded-full object-cover mx-auto mb-1 border-2 border-gray-700"
                        />
                        <p className="text-xs font-bold truncate">{actor.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default MovieModal;