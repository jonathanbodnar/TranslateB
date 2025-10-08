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
  const mouseRef = useRef({ x: 0, y: 0, influence: 0 });
  const [isClient, setIsClient] = useState(false);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    timeRef.current += 0.02;

    // Remove debug circle - waves are working!

    // Draw glassy diagonal waves (render back to front for proper layering)
    for (let i = 3; i >= 0; i--) { // Reverse order: 3=back, 0=front
      ctx.save();
      ctx.globalAlpha = 1.0; // Completely opaque - no transparency

      // Create multi-stop glass gradients
      // Create more horizontal gradient (gentler angle)
      const gradient = ctx.createLinearGradient(0, height, width, height * 0.3);
      
      if (i === 0) {
        // Purple glass (back layer - most subtle)
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.15)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
        gradient.addColorStop(1, 'rgba(196, 181, 253, 0.03)');
      } else if (i === 1) {
        // Red-pink glass
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.18)');
        gradient.addColorStop(0.5, 'rgba(248, 113, 113, 0.1)');
        gradient.addColorStop(1, 'rgba(252, 165, 165, 0.04)');
      } else if (i === 2) {
        // Blue glass
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.12)');
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0.05)');
      } else {
        // Light purple glass (front layer - most visible)
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
        gradient.addColorStop(0.5, 'rgba(196, 181, 253, 0.15)');
        gradient.addColorStop(1, 'rgba(221, 214, 254, 0.06)');
      }

      ctx.fillStyle = gradient;

      // Create smooth glass wave bands
      ctx.beginPath();
      
      // Create flowing glass sheet effect with depth
      const waveOffset = i * 200; // Much more vertical spacing between waves
      const waveSpeed = 0.3 + i * 0.15; // Different speeds for each wave
      const depthScale = 1 - ((3 - i) * 0.1); // i=0 is front (closest), i=3 is back (furthest)
      
      // Draw top edge of glass sheet (more horizontal flow)
      for (let x = 0; x <= width; x += 5) {
        const progress = x / width;
        // Create flowing horizontal waves with gentle curves
        const baseY = height * 0.4 + waveOffset - i * 150; // Start 10% lower
        
        // Multiple sine waves for complex glass flow with depth scaling
        const wave1 = Math.sin(progress * Math.PI * 1.5 + timeRef.current * waveSpeed) * 25 * depthScale;
        const wave2 = Math.sin(progress * Math.PI * 3 + timeRef.current * waveSpeed * 0.7) * 15 * depthScale;
        const wave3 = Math.sin(progress * Math.PI * 0.8 + timeRef.current * waveSpeed * 1.3) * 10 * depthScale;
        
        // Add subtle mouse influence
        const mouse = mouseRef.current;
        const mouseDistance = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(baseY - mouse.y, 2));
        const mouseInfluence = mouse.influence * Math.exp(-mouseDistance / 200) * 15;
        
        const finalY = baseY + wave1 + wave2 + wave3 + mouseInfluence;
        
        if (x === 0) {
          ctx.moveTo(x, finalY);
        } else {
          ctx.lineTo(x, finalY);
        }
      }
      
      // Draw bottom edge of glass sheet (parallel but offset)
      const sheetThickness = (40 + i * 15) * depthScale; // Thickness scales with depth
      for (let x = width; x >= 0; x -= 5) {
        const progress = x / width;
        // Bottom edge with depth offset
        const baseY = height * 0.6 + waveOffset + sheetThickness - i * 80;
        
        const wave1 = Math.sin(progress * Math.PI * 1.5 + timeRef.current * waveSpeed) * 25;
        const wave2 = Math.sin(progress * Math.PI * 3 + timeRef.current * waveSpeed * 0.7) * 15;
        const wave3 = Math.sin(progress * Math.PI * 0.8 + timeRef.current * waveSpeed * 1.3) * 10;
        
        // Add subtle mouse influence for bottom edge too
        const mouse = mouseRef.current;
        const mouseDistance = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(baseY - mouse.y, 2));
        const mouseInfluence = mouse.influence * Math.exp(-mouseDistance / 200) * 15;
        
        const finalY = baseY + wave1 + wave2 + wave3 + mouseInfluence;
        ctx.lineTo(x, finalY);
      }
      
      ctx.closePath();
      ctx.fill();

      // Add realistic glass lighting effects
      ctx.restore();

      // Glass depth shadow (cast by layer above) - only for back layers
      if (i < 3) { // i=3 is furthest back, no shadow needed
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const progress = x / width;
          const baseY = height * 0.4 + waveOffset - i * 150 - 5; // Slightly offset shadow, 10% lower
          const wave1 = Math.sin(progress * Math.PI * 1.5 + timeRef.current * waveSpeed) * 20 * depthScale;
          const finalY = baseY + wave1;
          
          if (x === 0) ctx.moveTo(x, finalY);
          else ctx.lineTo(x, finalY);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Top edge highlight (subtle glass reflection) - opacity decreases with depth
      ctx.save();
      const highlightOpacity = 0.3 * Math.pow(depthScale, 2); // Much more subtle highlights
      ctx.globalAlpha = highlightOpacity;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1 + i * 0.3; // Thinner, more refined highlights
      ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
      ctx.shadowBlur = 2;
      
      ctx.beginPath();
      for (let x = 0; x <= width; x += 5) {
        const progress = x / width;
        const baseY = height * 0.4 + waveOffset - i * 150; // Start 10% lower
        const wave1 = Math.sin(progress * Math.PI * 1.5 + timeRef.current * waveSpeed) * 25;
        const wave2 = Math.sin(progress * Math.PI * 3 + timeRef.current * waveSpeed * 0.7) * 15;
        const wave3 = Math.sin(progress * Math.PI * 0.8 + timeRef.current * waveSpeed * 1.3) * 10;
        const mouse = mouseRef.current;
        const mouseDistance = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(baseY - mouse.y, 2));
        const mouseInfluence = mouse.influence * Math.exp(-mouseDistance / 200) * 15;
        const finalY = baseY + wave1 + wave2 + wave3 + mouseInfluence;
        
        if (x === 0) ctx.moveTo(x, finalY);
        else ctx.lineTo(x, finalY);
      }
      ctx.stroke();
      ctx.restore();

      // Bottom edge shadow (subtle glass depth) - opacity decreases with depth
      ctx.save();
      const shadowOpacity = 0.08 * Math.pow(depthScale, 1.5); // Much more subtle shadows
      ctx.globalAlpha = shadowOpacity;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 0.8 + i * 0.2; // Thinner, more refined shadows
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 2 + i * 0.5;
      
      ctx.beginPath();
      for (let x = 0; x <= width; x += 5) {
        const progress = x / width;
        const baseY = height * 0.6 + waveOffset + sheetThickness - i * 80;
        const wave1 = Math.sin(progress * Math.PI * 1.5 + timeRef.current * waveSpeed) * 25;
        const wave2 = Math.sin(progress * Math.PI * 3 + timeRef.current * waveSpeed * 0.7) * 15;
        const wave3 = Math.sin(progress * Math.PI * 0.8 + timeRef.current * waveSpeed * 1.3) * 10;
        const mouse = mouseRef.current;
        const mouseDistance = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(baseY - mouse.y, 2));
        const mouseInfluence = mouse.influence * Math.exp(-mouseDistance / 200) * 15;
        const finalY = baseY + wave1 + wave2 + wave3 + mouseInfluence;
        
        if (x === 0) ctx.moveTo(x, finalY);
        else ctx.lineTo(x, finalY);
      }
      ctx.stroke();
      ctx.restore();

      // Inner glass reflection (subtle depth illusion) - fades with depth
      ctx.save();
      const innerOpacity = 0.05 * Math.pow(depthScale, 1.8); // Very subtle inner reflections
      ctx.globalAlpha = innerOpacity;
      const innerGradient = ctx.createLinearGradient(0, height, width, height * 0.3);
      innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      innerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.strokeStyle = innerGradient;
      ctx.lineWidth = 0.5 + i * 0.2; // Thinner, more subtle inner reflections
      
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const progress = x / width;
        const baseY = height * 0.4 + waveOffset + (sheetThickness * 0.3) - i * 150; // 10% lower
        const wave1 = Math.sin(progress * Math.PI * 1.5 + timeRef.current * waveSpeed) * 20;
        const wave2 = Math.sin(progress * Math.PI * 3 + timeRef.current * waveSpeed * 0.7) * 12;
        const finalY = baseY + wave1 + wave2;
        
        if (x === 0) ctx.moveTo(x, finalY);
        else ctx.lineTo(x, finalY);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Update mouse influence
    mouseRef.current.influence *= 0.95; // Fade out over time
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      influence: Math.min(mouseRef.current.influence + 0.2, 1)
    };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      onMouseMove={handleMouseMove}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'normal',
        opacity: 0.6,
        filter: 'blur(0.5px)',
        backdropFilter: 'blur(1px)'
      }}
    />
  );
};

export default SimpleWaves;
