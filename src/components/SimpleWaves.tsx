import React, { useEffect, useRef, useState } from 'react';

interface SimpleWavesProps {
  width?: number;
  height?: number;
  className?: string;
}

const SimpleWaves: React.FC<SimpleWavesProps> = ({
  width = 800,
  height = 600,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    timeRef.current += 0.02;

    // Draw simple animated waves
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.globalAlpha = 0.1 + i * 0.02;

      // Create diagonal gradient
      const gradient = ctx.createLinearGradient(0, height, width, 0);
      
      if (i === 0) {
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      } else if (i === 1) {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      }

      ctx.fillStyle = gradient;

      // Draw diagonal wave
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 10) {
        const progress = x / width;
        const baseY = height - (progress * height);
        const waveY = baseY + Math.sin(progress * Math.PI * 2 + timeRef.current + i) * (30 + i * 10);
        ctx.lineTo(x, waveY);
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient, width, height]);

  if (!isClient) {
    return <div className={className} style={{ width, height }} />;
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'normal',
        opacity: 1
      }}
    />
  );
};

export default SimpleWaves;
