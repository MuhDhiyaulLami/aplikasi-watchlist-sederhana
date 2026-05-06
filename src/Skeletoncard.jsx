const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
      {/* Kotak untuk Poster */}
      <div className="w-full h-[300px] md:h-[350px] bg-gray-700"></div>
      
      {/* Kotak untuk Teks */}
      <div className="p-4">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-600 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;