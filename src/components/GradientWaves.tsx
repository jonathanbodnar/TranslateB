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

  // Initialize diagonal glass waves
  const initializeWaves = useCallback(() => {
    wavesRef.current = [
      {
        amplitude: 80,
        frequency: 0.003,
        phase: 0,
        speed: 0.008,
        offset: 0, // Will be used differently for diagonal waves
        opacity: 0.06
      },
      {
        amplitude: 60,
        frequency: 0.004,
        phase: Math.PI / 4,
        speed: 0.006,
        offset: 100,
        opacity: 0.05
      },
      {
        amplitude: 70,
        frequency: 0.0035,
        phase: Math.PI / 2,
        speed: 0.007,
        offset: 200,
        opacity: 0.04
      },
      {
        amplitude: 90,
        frequency: 0.0025,
        phase: Math.PI / 6,
        speed: 0.009,
        offset: 300,
        opacity: 0.03
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

    // Render diagonal glass waves
    wavesRef.current.forEach((wave, waveIndex) => {
      ctx.save();
      ctx.globalAlpha = wave.opacity;

      // Glass-like gradient colors (purple/red/blue hues)
      const glassColors = [
        ['rgba(147, 51, 234, 0.4)', 'rgba(168, 85, 247, 0.2)', 'rgba(196, 181, 253, 0.05)'], // Purple
        ['rgba(239, 68, 68, 0.35)', 'rgba(248, 113, 113, 0.18)', 'rgba(252, 165, 165, 0.04)'], // Red
        ['rgba(59, 130, 246, 0.3)', 'rgba(96, 165, 250, 0.15)', 'rgba(147, 197, 253, 0.03)'], // Blue
        ['rgba(168, 85, 247, 0.25)', 'rgba(196, 181, 253, 0.12)', 'rgba(221, 214, 254, 0.02)']  // Light Purple
      ];

      // Create diagonal gradient (bottom-left to top-right)
      const gradient = ctx.createLinearGradient(0, height, width, 0);
      const waveColors = glassColors[waveIndex % glassColors.length];
      gradient.addColorStop(0, waveColors[0]);
      gradient.addColorStop(0.5, waveColors[1]);
      gradient.addColorStop(1, waveColors[2]);

      ctx.fillStyle = gradient;

      // Create diagonal wave path
      ctx.beginPath();
      
      // Start from bottom-left
      ctx.moveTo(0, height);
      
      // Create diagonal wave flowing from bottom-left to top-right
      const points: [number, number][] = [];
      
      for (let progress = 0; progress <= 1; progress += 0.01) {
        // Base diagonal line from bottom-left to top-right
        const baseX = progress * width;
        const baseY = height - (progress * height);
        
        // Add wave distortion
        const waveDistortion = wave.amplitude * Math.sin(
          progress * Math.PI * 4 * wave.frequency + 
          wave.phase + 
          timeRef.current * wave.speed
        );
        
        // Add mouse influence
        const mouseDistance = Math.sqrt(
          Math.pow(baseX - mouse.x, 2) + Math.pow(baseY - mouse.y, 2)
        );
        const mouseInfluence = mouse.influence * Math.exp(-mouseDistance / 200) * 30;
        
        // Add ripple influences
        let rippleInfluence = 0;
        ripplesRef.current.forEach(ripple => {
          const rippleDistance = Math.sqrt(
            Math.pow(baseX - ripple.x, 2) + Math.pow(baseY - ripple.y, 2)
          );
          
          if (rippleDistance < ripple.radius) {
            rippleInfluence += ripple.opacity * 
              Math.sin((rippleDistance / ripple.radius) * Math.PI) * 25;
          }
        });
        
        // Calculate final position with all influences
        const finalX = baseX + (waveDistortion + mouseInfluence + rippleInfluence) * Math.cos(Math.PI / 4);
        const finalY = baseY + (waveDistortion + mouseInfluence + rippleInfluence) * Math.sin(Math.PI / 4);
        
        points.push([finalX, finalY]);
      }
      
      // Draw the wave path
      points.forEach(([x, y], index) => {
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          // Use quadratic curves for smoother waves
          const prevPoint = points[index - 1];
          const cpX = (prevPoint[0] + x) / 2;
          const cpY = (prevPoint[1] + y) / 2;
          ctx.quadraticCurveTo(prevPoint[0], prevPoint[1], cpX, cpY);
        }
      });
      
      // Create a band effect by drawing both sides of the wave
      const bandWidth = 40 + wave.offset / 10;
      
      // Draw the other side of the band
      for (let i = points.length - 1; i >= 0; i--) {
        const [x, y] = points[i];
        const normalX = -Math.sin(Math.PI / 4);
        const normalY = Math.cos(Math.PI / 4);
        const bandX = x + normalX * bandWidth;
        const bandY = y + normalY * bandWidth;
        ctx.lineTo(bandX, bandY);
      }
      
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
        mixBlendMode: 'multiply',
        opacity: 0.8
      }}
    />
  );
};

export default GradientWaves;
