import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const Loader: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const singularityRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const letterPathsRef = useRef<(SVGPathElement | null)[]>([]);
  const sweepRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // -------------------------------------------------------------
    // CANVAS DEEP SPACE STAR-DUST PARTICLE ENGINE
    // -------------------------------------------------------------
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; alpha: number; speedY: number }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize 65 faint star-dust particles
    for (let i = 0; i < 65; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        speedY: -(Math.random() * 0.4 + 0.1)
      });
    }

    let isParticleEngineActive = true;
    const renderParticles = () => {
      if (!isParticleEngineActive || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(renderParticles);
    };
    renderParticles();

    // -------------------------------------------------------------
    // GSAP CINEMATIC TIMELINE SEQUENCE
    // -------------------------------------------------------------
    const tl = gsap.timeline({
      onComplete: () => {
        isParticleEngineActive = false;
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
        sessionStorage.setItem('jaleelo_loader_seen', 'true');
        setIsVisible(false);
      }
    });

    // 1. Initial State Setup
    gsap.set(singularityRef.current, { scale: 0.1, opacity: 0 });
    gsap.set(svgRef.current, { opacity: 0, scale: 0.98 });
    gsap.set(sweepRef.current, { opacity: 0, x: '-100%' });
    gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });

    // Prepare SVG Path Stroke Dashlengths
    const paths = letterPathsRef.current.filter(Boolean) as SVGPathElement[];
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fillOpacity: 0,
        strokeOpacity: 1
      });
    });

    // 2. TIMELINE CHOREOGRAPHY
    // Stage 1: 0.3s Silence -> Singularity Glow Appears (0.6s)
    tl.to(singularityRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.3
    })
    // Stage 2: Singularity softly expands into canvas
    .to(singularityRef.current, {
      scale: 2.5,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
    // Stage 3: SVG Typography Path Morphing & Drawing (0.8s)
    .to(svgRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power1.out'
    }, '-=0.2')
    .to(paths, {
      strokeDashoffset: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power2.inOut'
    }, '-=0.2')
    // Fill opacity smoothly fades in solid white typography
    .to(paths, {
      fillOpacity: 1,
      duration: 0.4,
      ease: 'power1.out'
    }, '-=0.3')
    // Stage 4: Light Sweep Specular Sheen (0.6s)
    .to(sweepRef.current, {
      opacity: 0.8,
      x: '100%',
      duration: 0.7,
      ease: 'power2.inOut'
    }, '-=0.2')
    // Stage 5: Precision Baseline Growth (0.5s)
    .to(lineRef.current, {
      scaleX: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'expo.out'
    }, '-=0.4')
    // Hold briefly for confidence & calm (0.3s)
    .to({}, { duration: 0.3 })
    // Stage 6: Seamless Hero Reveal Transition (0.7s)
    // Baseline stretches full-screen width, letters dissolve into particles upward
    .to(lineRef.current, {
      width: '100vw',
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    })
    .to(svgRef.current, {
      y: -25,
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.6,
      ease: 'power2.in'
    }, '-=0.4')
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut'
    }, '-=0.4');

    return () => {
      tl.kill();
      isParticleEngineActive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      id="luxury-loader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#030508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
      aria-label="Loading Experience"
    >
      {/* DEEP SPACE CANVASES & LIGHT PARTICLES */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.7
        }}
      />

      {/* CENTRAL GLOW SINGULARITY */}
      <div
        ref={singularityRef}
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 40%, rgba(0,0,0,0) 70%)',
          boxShadow: '0 0 60px 20px rgba(255,255,255,0.4)',
          pointerEvents: 'none'
        }}
      />

      {/* LOGO & VECTOR PATH CONTAINER */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* LIGHT SWEEP OVERLAY MASK */}
        <div
          ref={sweepRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
            mixBlendMode: 'overlay'
          }}
        />

        {/* VECTOR SVG TYPOGRAPHY FOR JALEELO */}
        <svg
          ref={svgRef}
          width="360"
          height="80"
          viewBox="0 0 540 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            overflow: 'visible',
            filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.25))'
          }}
        >
          {/* J */}
          <path
            ref={(el) => (letterPathsRef.current[0] = el)}
            d="M 40 20 L 75 20 M 60 20 L 60 65 C 60 80 45 85 30 78 C 22 74 20 65 20 65"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* A */}
          <path
            ref={(el) => (letterPathsRef.current[1] = el)}
            d="M 95 80 L 125 20 L 155 80 M 105 60 L 145 60"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* L */}
          <path
            ref={(el) => (letterPathsRef.current[2] = el)}
            d="M 175 20 L 175 80 L 220 80"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* E */}
          <path
            ref={(el) => (letterPathsRef.current[3] = el)}
            d="M 285 20 L 240 20 L 240 80 L 285 80 M 240 50 L 275 50"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* E */}
          <path
            ref={(el) => (letterPathsRef.current[4] = el)}
            d="M 350 20 L 305 20 L 305 80 L 350 80 M 305 50 L 340 50"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* L */}
          <path
            ref={(el) => (letterPathsRef.current[5] = el)}
            d="M 370 20 L 370 80 L 415 80"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* O */}
          <path
            ref={(el) => (letterPathsRef.current[6] = el)}
            d="M 470 20 C 440 20 435 50 435 50 C 435 50 440 80 470 80 C 500 80 505 50 505 50 C 505 50 500 20 470 20 Z"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
        </svg>

        {/* PRECISION ENGINEERING BASELINE */}
        <div
          ref={lineRef}
          style={{
            marginTop: '1.25rem',
            width: '280px',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)',
            boxShadow: '0 0 12px 2px rgba(255,255,255,0.6)',
            transformOrigin: 'center center'
          }}
        />
      </div>
    </div>
  );
};
