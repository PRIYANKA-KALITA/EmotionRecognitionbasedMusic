import React from 'react';
import { Music, Percent } from 'lucide-react';
import type { Song, Emotion } from '../types/emotion';

interface MusicRecommendationsProps {
  currentEmotion: Emotion;
  recommendations: Song[];
}

const MusicRecommendations: React.FC<MusicRecommendationsProps> = ({
  currentEmotion,
  recommendations
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Recommended for your {currentEmotion} mood
        </h2>
        <div className="flex items-center space-x-2 text-purple-400">
          <Music className="w-5 h-5" />
          <span>{recommendations.length} songs</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((song) => (
          <div
            key={song.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors duration-200"
          >
            <img
              src={song.albumArt}
              alt={`${song.album} by ${song.artist}`}
              className="w-full aspect-square object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-white truncate">{song.title}</h3>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-purple-400">{song.genre}</span>
                <div className="flex items-center space-x-1 text-green-400">
                  <Percent className="w-4 h-4" />
                  <span>{song.moodMatch}% match</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicRecommendations;