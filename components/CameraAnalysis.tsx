import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { CameraIcon } from './icons';

interface CameraAnalysisProps {
  isAnalyzing: boolean;
}

export interface CameraAnalysisHandle {
  captureFrame: () => string | null;
}

const CameraAnalysis = forwardRef<CameraAnalysisHandle, CameraAnalysisProps>(({ isAnalyzing }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    captureFrame: () => {
      if (!videoRef.current || videoRef.current.readyState < 3) {
        setError("Camera feed is not ready yet. Please wait a moment.");
        return null;
      }
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      return dataUrl.split(',')[1];
    },
  }));

  useEffect(() => {
    let stream: MediaStream | null = null;
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Camera access denied. Please enable it in your browser settings.');
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-pet-darkest rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
       <div className="absolute top-2 left-3 flex items-center text-white/80 font-medium text-sm z-10">
        <CameraIcon className="w-4 h-4 mr-1.5"/>
        Movement Input
      </div>
      {error ? (
        <p className="text-center text-red-400 text-sm p-4">{error}</p>
      ) : (
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md" />
      )}
      {isAnalyzing && (
         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
            <p className="ml-2 text-white font-bold">ANALYZING</p>
        </div>
      )}
      {/* Simulated overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-pet-light/50 border-dashed rounded-lg animate-pulse">
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pet-light rounded-full"></div>
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pet-light rounded-full"></div>
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-pet-light rounded-full"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-4 h-4 bg-pet-light rounded-full"></div>
      </div>
    </div>
  );
});

CameraAnalysis.displayName = 'CameraAnalysis';

export default CameraAnalysis;
