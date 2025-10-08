import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Wave {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  offset: number;
  opacity: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  startTime: number;
}

interface GradientWavesProps {
  width?: number;
  height?: number;
  className?: string;
  onRipple?: (x: number, y: number) => void;
}

const GradientWaves: React.FC<GradientWavesProps> = ({
  width = 800,
  height = 600,
  className = '',
  onRipple
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const wavesRef = useRef<Wave[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, influence: 0 });
  const timeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize waves
  const initializeWaves = useCallback(() => {
    wavesRef.current = [
      {
        amplitude: 30,
        frequency: 0.008,
        phase: 0,
        speed: 0.003,
        offset: height * 0.3,
        opacity: 0.08
      },
      {
        amplitude: 25,
        frequency: 0.012,
        phase: Math.PI / 3,
        speed: 0.002,
        offset: height * 0.5,
        opacity: 0.06
      },
      {
        amplitude: 35,
        frequency: 0.006,
        phase: Math.PI / 2,
        speed: 0.004,
        offset: height * 0.7,
        opacity: 0.05
      },
      {
        amplitude: 20,
        frequency: 0.015,
        phase: Math.PI,
        speed: 0.0025,
        offset: height * 0.4,
        opacity: 0.04
      }
    ];
  }, [height]);

  // Create ripple effect
  const createRipple = useCallback((x: number, y: number) => {
    const ripple: Ripple = {
      x,
      y,
      radius: 0,
      maxRadius: 200,
      opacity: 0.4,
      startTime: Date.now()
    };
    ripplesRef.current.push(ripple);
    
    if (onRipple) {
      onRipple(x, y);
    }
  }, [onRipple]);

  // Update waves and ripples
  const updateWaves = useCallback(() => {
    timeRef.current += 1;
    const mouse = mouseRef.current;
    
    // Update wave phases
    wavesRef.current.forEach(wave => {
      wave.phase += wave.speed;
    });

    // Update ripples
    ripplesRef.current = ripplesRef.current.filter(ripple => {
      const elapsed = Date.now() - ripple.startTime;
      const progress = elapsed / 1000; // 1 second duration
      
      if (progress >= 1) return false;
      
      ripple.radius = ripple.maxRadius * progress;
      ripple.opacity = 0.4 * (1 - progress);
      
      return true;
    });

    // Update mouse influence (fade out over time)
    mouse.influence *= 0.95;
  }, []);

  // Render waves
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const mouse = mouseRef.current;

    // Render waves
    wavesRef.current.forEach((wave, waveIndex) => {
      ctx.save();
      ctx.globalAlpha = wave.opacity;

      // Create gradient for the wave
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      
      // Different color schemes for each wave
      const colors = [
        ['rgba(147, 197, 253, 0.8)', 'rgba(59, 130, 246, 0.4)', 'rgba(29, 78, 216, 0.1)'],
        ['rgba(196, 181, 253, 0.6)', 'rgba(139, 92, 246, 0.3)', 'rgba(109, 40, 217, 0.1)'],
        ['rgba(167, 243, 208, 0.5)', 'rgba(34, 197, 94, 0.25)', 'rgba(21, 128, 61, 0.1)'],
        ['rgba(253, 186, 116, 0.4)', 'rgba(251, 146, 60, 0.2)', 'rgba(234, 88, 12, 0.1)']
      ];

      const waveColors = colors[waveIndex % colors.length];
      gradient.addColorStop(0, waveColors[0]);
      gradient.addColorStop(0.5, waveColors[1]);
      gradient.addColorStop(1, waveColors[2]);

      ctx.fillStyle = gradient;

      // Begin wave path
      ctx.beginPath();
      ctx.moveTo(0, height);

      // Draw wave with mouse influence
      for (let x = 0; x <= width; x += 2) {
        const mouseDistance = Math.sqrt(
          Math.pow(x - mouse.x, 2) + Math.pow(wave.offset - mouse.y, 2)
        );
        
        // Mouse influence decreases with distance
        const mouseInfluence = mouse.influence * Math.exp(-mouseDistance / 150);
        
        // Calculate wave height with mouse influence
        let y = wave.offset + 
          wave.amplitude * Math.sin(x * wave.frequency + wave.phase) +
          mouseInfluence * 20 * Math.sin(x * 0.02 + timeRef.current * 0.1);

        // Add ripple influences
        ripplesRef.current.forEach(ripple => {
          const rippleDistance = Math.sqrt(
            Math.pow(x - ripple.x, 2) + Math.pow(y - ripple.y, 2)
          );
          
          if (rippleDistance < ripple.radius) {
            const rippleInfluence = ripple.opacity * 
              Math.sin((rippleDistance / ripple.radius) * Math.PI) * 15;
            y += rippleInfluence;
          }
        });

        ctx.lineTo(x, y);
      }

      // Close the path
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Render ripples
    ripplesRef.current.forEach(ripple => {
      ctx.save();
      ctx.globalAlpha = ripple.opacity * 0.3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    });
  }, [width, height]);

  // Animation loop
  const animate = useCallback(() => {
    updateWaves();
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateWaves, render]);

  // Mouse event handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current = {
      x,
      y,
      influence: Math.min(mouseRef.current.influence + 0.1, 1)
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createRipple(x, y);
  }, [createRipple]);

  // Expose ripple creation to parent
  useEffect(() => {
    if (onRipple) {
      // Store reference for external ripple creation
      (window as any).createWaveRipple = createRipple;
    }
    
    return () => {
      delete (window as any).createWaveRipple;
    };
  }, [createRipple, onRipple]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    initializeWaves();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient, width, height, initializeWaves, animate]);

  if (!isClient) {
    return <div className={className} style={{ width, height }} />;
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${className} cursor-pointer`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'normal',
        opacity: 1
      }}
    />
  );
};

export default GradientWaves;
