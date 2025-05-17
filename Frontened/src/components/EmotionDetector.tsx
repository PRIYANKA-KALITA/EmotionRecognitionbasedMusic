import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';
import { Camera } from 'lucide-react';
import type { EmotionDetection } from '../types/emotion';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: EmotionDetection) => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let detector: faceDetection.FaceDetector;
    let animationFrame: number;

    const initializeDetector = async () => {
      try {
        await tf.ready();
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = {
          runtime: 'tfjs' as const,
          maxFaces: 1,
        };
        detector = await faceDetection.createDetector(model, detectorConfig);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsDetecting(true);
        }

        const detectEmotion = async () => {
          if (videoRef.current && detector) {
            const faces = await detector.estimateFaces(videoRef.current);
            if (faces.length > 0) {
              // Simplified emotion detection logic - in a real app, you'd use a more sophisticated model
              const emotions: EmotionDetection[] = [
                { emotion: 'happy', confidence: 0.8 },
                { emotion: 'neutral', confidence: 0.15 },
                { emotion: 'sad', confidence: 0.05 }
              ];
              const dominantEmotion = emotions.reduce((prev, current) => 
                prev.confidence > current.confidence ? prev : current
              );
              onEmotionDetected(dominantEmotion);
            }
          }
          animationFrame = requestAnimationFrame(detectEmotion);
        };

        detectEmotion();
      } catch (err) {
        setError('Failed to initialize emotion detection. Please check camera permissions.');
        setIsDetecting(false);
      }
    };

    initializeDetector();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [onEmotionDetected]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900">
      {error ? (
        <div className="p-4 text-red-400 text-center">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-48 object-cover"
          />
          {isDetecting && (
            <div className="absolute inset-0 border-2 border-purple-500/50 rounded-lg pointer-events-none" />
          )}
        </>
      )}
    </div>
  );
};

export default EmotionDetector;