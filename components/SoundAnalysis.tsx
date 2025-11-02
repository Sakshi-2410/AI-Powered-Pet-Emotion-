
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { MicIcon } from './icons';

interface SoundAnalysisProps {
  isAnalyzing: boolean;
}

export interface SoundAnalysisHandle {
  captureAudio: (durationMs?: number) => Promise<{base64: string, mimeType: string} | null>;
}

const SoundAnalysis = forwardRef<SoundAnalysisHandle, SoundAnalysisProps>(({ isAnalyzing }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // FIX: Initialize useRef with null to satisfy a strict rule that likely requires an initial value.
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useImperativeHandle(ref, () => ({
    captureAudio: async (durationMs: number = 3000) => {
      if (!streamRef.current || !streamRef.current.active || streamRef.current.getAudioTracks().length === 0) {
        setError("Microphone is not ready or has been disconnected. Please check your microphone.");
        return null;
      }
      return new Promise((resolve) => {
        try {
          const recorder = new MediaRecorder(streamRef.current);
          const chunks: Blob[] = [];
          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = async () => {
            if (chunks.length === 0) {
              resolve(null);
              return;
            }
            const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                const base64data = reader.result.split(',')[1];
                resolve({ base64: base64data, mimeType: blob.type });
              } else {
                resolve(null);
              }
            };
            reader.onerror = () => resolve(null);
          };
          recorder.start();
          setTimeout(() => recorder.stop(), durationMs);
        } catch (e) {
          console.error("Error recording audio:", e);
          resolve(null);
        }
      });
    },
  }));

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupAudio = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setError(null);
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        draw();

      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('Microphone access denied. Please enable it in your browser settings.');
      }
    };

    setupAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = () => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const drawVisual = () => {
      animationFrameRef.current = requestAnimationFrame(drawVisual);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgba(255, 251, 235, 0.8)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#F97316';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    drawVisual();
  };

  return (
    <div className="w-full h-full bg-pet-lightest rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-2 left-3 flex items-center text-pet-dark font-medium text-sm">
        <MicIcon className="w-4 h-4 mr-1.5"/>
        Sound Input
      </div>
      {error ? (
        <p className="text-center text-red-500 text-sm p-4">{error}</p>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full" />
      )}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
            <p className="ml-2 text-white font-bold">LIVE</p>
        </div>
      )}
    </div>
  );
});

SoundAnalysis.displayName = 'SoundAnalysis';

export default SoundAnalysis;