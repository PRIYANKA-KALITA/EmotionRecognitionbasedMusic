import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
}

interface MusicGridProps {
  songs: Song[];
}

const MusicGrid: React.FC<MusicGridProps> = ({ songs }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {songs.map((song, index) => (
        <SongCard key={song.id} song={song} index={index} />
      ))}
    </div>
  );
};

const SongCard: React.FC<{ song: Song; index: number }> = ({ song, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative rounded-lg overflow-hidden bg-[#252525] hover:bg-[#303030] 
                 transition-all duration-300 cursor-pointer"
    >
      <div className="aspect-square relative">
        <img
          src={song.coverUrl}
          alt={`${song.title} by ${song.artist}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300" />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Play className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-400">{song.duration}</span>
          <button className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicGrid;