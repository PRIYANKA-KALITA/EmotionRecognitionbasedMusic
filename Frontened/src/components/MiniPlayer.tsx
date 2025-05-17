// src/components/MiniPlayer.tsx
import React from "react";

interface MiniPlayerProps {
  embedUrl: string;
  onClose: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ embedUrl, onClose }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background dark:bg-backgroundLight border-t border-gray-700 p-4 flex items-center justify-between">
      <iframe
        src={embedUrl}
        width="300"
        height="80"
        frameBorder="0"
        allow="encrypted-media"
        className="flex-shrink-0"
      ></iframe>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
      >
        Close Player
      </button>
    </div>
  );
};

export default MiniPlayer;
