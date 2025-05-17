import React, { useRef, useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';

interface CameraModalProps {
  onClose: () => void;
}

const CameraModal = ({ onClose }: CameraModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        setError('Camera access denied. Please enable camera permissions.');
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Emotion Detection
        </h2>

        {hasPermission === null && (
          <div className="text-center text-gray-300">
            <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse" />
            Requesting camera access...
          </div>
        )}

        {hasPermission === false && (
          <div className="text-center text-red-400 p-4">
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        )}

        {hasPermission === true && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-black"
            />
            <div className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraModal;