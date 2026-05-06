const MovieCard = ({ movie, onOpenModal, onToggleWatchlist, isWatchlisted }) => {
  const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
  const posterPath = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 border border-gray-700 flex flex-col">
      <div className="relative cursor-pointer group" onClick={() => onOpenModal(movie.id)}>
        <img src={posterPath} alt={movie.title} className="w-full h-auto object-cover" />
        {/* Overlay saat di-hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Lihat Detail</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-white font-bold text-sm line-clamp-2">{movie.title}</h3>
          <p className="text-yellow-400 text-xs mt-1 mb-3">⭐ {movie.vote_average?.toFixed(1)}</p>
        </div>
        
        {/* Tombol Watchlist */}
        <button 
          onClick={() => onToggleWatchlist(movie)}
          className={`w-full py-2 rounded font-bold text-sm transition-colors ${
            isWatchlisted ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-700 hover:bg-blue-600 text-white'
          }`}
        >
          {isWatchlisted ? 'Hapus dari Watchlist' : '+ Watchlist'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;