import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  width?: number;
  height?: number;
  particleCount?: number;
  className?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  width = 800,
  height = 600,
  particleCount = 15,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [isClient, setIsClient] = useState(false);

  // Initialize particles (start with empty array)
  const initializeParticles = () => {
    particlesRef.current = [];
  };

  // Create subtle particles near mouse
  const createMouseParticles = (x: number, y: number) => {
    // Only create particles if mouse is moving
    if (!mouseRef.current.isMoving) return;
    
    // Limit total particles
    if (particlesRef.current.length >= particleCount) return;
    
    // Create 1-2 subtle particles near mouse
    const numParticles = Math.random() < 0.3 ? 1 : 0; // 30% chance
    
    for (let i = 0; i < numParticles; i++) {
      const offsetX = (Math.random() - 0.5) * 40; // Small spread around mouse
      const offsetY = (Math.random() - 0.5) * 40;
      
      const particle: Particle = {
        id: Date.now() + Math.random(),
        x: x + offsetX,
        y: y + offsetY,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.5,
        opacity: 0,
        targetOpacity: Math.random() * 0.3 + 0.1, // Very subtle
        life: 0,
        maxLife: Math.random() * 120 + 80
      };
      
      particlesRef.current.push(particle);
    }
  };

  // Create particle burst on click (smaller and more subtle)
  const createBurst = (x: number, y: number) => {
    const burstParticles: Particle[] = Array.from({ length: 8 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = Math.random() * 1.5 + 1;
      return {
        id: particlesRef.current.length + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 1,
        opacity: 0.8,
        targetOpacity: 0,
        life: 0,
        maxLife: 40
      };
    });

    particlesRef.current = [...particlesRef.current, ...burstParticles];
  };

  // Update particles
  const updateParticles = () => {
    const mouse = mouseRef.current;
    
    // Create new particles near mouse when moving
    if (mouse.isMoving) {
      createMouseParticles(mouse.x, mouse.y);
    }
    
    particlesRef.current = particlesRef.current.filter(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Fade in/out
      const fadeSpeed = 0.03;
      if (particle.opacity < particle.targetOpacity) {
        particle.opacity = Math.min(particle.targetOpacity, particle.opacity + fadeSpeed);
      } else if (particle.opacity > particle.targetOpacity) {
        particle.opacity = Math.max(particle.targetOpacity, particle.opacity - fadeSpeed);
      }

      // Update life
      particle.life++;
      
      // Fade out near end of life
      if (particle.life > particle.maxLife * 0.7) {
        particle.targetOpacity = 0;
      }

      // Apply friction
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Remove dead particles
      return particle.life < particle.maxLife && particle.opacity > 0.01;
    });
  };

  // Render particles
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw particles
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      // Create subtle radial gradient for glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.4)');
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw subtle core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  };

  // Animation loop
  const animate = () => {
    updateParticles();
    render();
    animationRef.current = requestAnimationFrame(animate);
  };

  // Mouse event handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isMoving: true
    };

    // Reset moving flag after a delay
    setTimeout(() => {
      mouseRef.current.isMoving = false;
    }, 150);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createBurst(x, y);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    initializeParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, width, height, particleCount]);

  if (!isClient) {
    return <div className={`${className}`} style={{ width, height }} />;
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
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default ParticleField;
