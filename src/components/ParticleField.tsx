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
  particleCount = 50,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [isClient, setIsClient] = useState(false);

  // Initialize particles
  const initializeParticles = () => {
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      targetOpacity: Math.random() * 0.5 + 0.1,
      life: Math.random() * 100,
      maxLife: Math.random() * 200 + 100
    }));
  };

  // Create particle burst on click
  const createBurst = (x: number, y: number) => {
    const burstParticles: Particle[] = Array.from({ length: 15 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = Math.random() * 3 + 2;
      return {
        id: particlesRef.current.length + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        opacity: 1,
        targetOpacity: 0,
        life: 0,
        maxLife: 60
      };
    });

    particlesRef.current = [...particlesRef.current, ...burstParticles];
  };

  // Update particles
  const updateParticles = () => {
    const mouse = mouseRef.current;
    
    particlesRef.current = particlesRef.current.filter(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction
      if (mouse.isMoving) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += dx * force * 0.001;
          particle.vy += dy * force * 0.001;
          particle.targetOpacity = Math.min(1, particle.targetOpacity + force * 0.5);
        }
      }

      // Fade in/out
      const fadeSpeed = 0.02;
      if (particle.opacity < particle.targetOpacity) {
        particle.opacity = Math.min(particle.targetOpacity, particle.opacity + fadeSpeed);
      } else if (particle.opacity > particle.targetOpacity) {
        particle.opacity = Math.max(particle.targetOpacity, particle.opacity - fadeSpeed);
      }

      // Update life
      particle.life++;
      
      // Fade out near end of life
      if (particle.life > particle.maxLife * 0.8) {
        particle.targetOpacity = 0;
      }

      // Boundary wrapping
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Remove dead particles
      return particle.life < particle.maxLife && particle.opacity > 0.01;
    });

    // Add new particles if needed
    while (particlesRef.current.length < particleCount) {
      particlesRef.current.push({
        id: Date.now() + Math.random(),
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: 0,
        targetOpacity: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: Math.random() * 200 + 100
      });
    }
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
      
      // Create radial gradient for glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(147, 197, 253, 0.8)');
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
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
    }, 100);
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
