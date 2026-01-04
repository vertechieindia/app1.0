import React, { useRef, useEffect, useState } from 'react';
import { Box, BoxProps, styled, keyframes } from '@mui/material';

// Floating animation keyframes
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Pulse animation keyframes
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Rotating animation keyframes
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Typing animation keyframes
const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent }
  50% { border-color: #0077B5 }
`;

// Floating animation component
interface FloatingBoxProps extends BoxProps {
  duration?: number;
  delay?: number;
}

export const FloatingBox = styled(Box)<FloatingBoxProps>(
  ({ duration = 6, delay = 0 }) => ({
    animation: `${float} ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  })
);

// Pulse animation component
interface PulseBoxProps extends BoxProps {
  duration?: number;
  delay?: number;
}

export const PulseBox = styled(Box)<PulseBoxProps>(
  ({ duration = 3, delay = 0 }) => ({
    animation: `${pulse} ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  })
);

// Rotating animation component
interface RotatingBoxProps extends BoxProps {
  duration?: number;
  reverse?: boolean;
}

export const RotatingBox = styled(Box)<RotatingBoxProps>(
  ({ duration = 20, reverse = false }) => ({
    animation: `${rotate} ${duration}s linear infinite ${reverse ? 'reverse' : ''}`,
  })
);

// Typing animation component
interface TypingTextProps {
  text: string;
  typingSpeed?: number;
  delay?: number;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  typingSpeed = 150,
  delay = 0,
  fontSize = '1.5rem',
  fontWeight = 600,
  color = 'inherit',
}) => {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderRight: '0.15em solid #0077B5',
        fontSize,
        fontWeight,
        color,
        width: '0',
        animation: `
          ${typing} ${text.length * typingSpeed}ms steps(${text.length}, end) forwards ${delay}ms,
          ${blinkCaret} 0.75s step-end infinite
        `,
      }}
    >
      {text}
    </Box>
  );
};

// Parallax effect component
interface ParallaxProps extends BoxProps {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const ParallaxBox: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  ...rest
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (boxRef.current) {
        const scrollY = window.scrollY;
        const rect = boxRef.current.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate when element is in view
        if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
          // Calculate offset based on how far the element is in the viewport
          const scrollPercent = (scrollY + windowHeight - elementTop) / (windowHeight + elementHeight);
          setOffset(scrollPercent * speed * 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on first render

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${-offset}px)`;
      case 'down':
        return `translateY(${offset}px)`;
      case 'left':
        return `translateX(${-offset}px)`;
      case 'right':
        return `translateX(${offset}px)`;
      default:
        return `translateY(${-offset}px)`;
    }
  };

  return (
    <Box
      ref={boxRef}
      sx={{
        transform: getTransform(),
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

// Particles background
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface ParticlesBackgroundProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  count = 50,
  color = '#0077B5',
  minSize = 2,
  maxSize = 8,
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  useEffect(() => {
    const initParticles = () => {
      const canvas = canvasRef.current;
      if (!canvas) return [];

      const width = canvas.width;
      const height = canvas.height;
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }

      return newParticles;
    };

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    setParticles(initParticles());

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [count, maxSize, minSize, speed]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const updatedParticles = [...particles];

      // Update and draw particles
      for (let i = 0; i < updatedParticles.length; i++) {
        const p = updatedParticles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Connect particles that are close to each other
        for (let j = i + 1; j < updatedParticles.length; j++) {
          const p2 = updatedParticles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `${color}${Math.floor((p.opacity * 0.5) * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      setParticles(updatedParticles);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, color, dimensions]);

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

// Animated counter component
interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  onComplete?: () => void;
}

export const AnimatedCounter: React.FC<CounterProps> = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  onComplete,
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef({ start: 0, end, current: 0 });
  const frameRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    countRef.current = { start: 0, end, current: 0 };
    startTimeRef.current = 0;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedPercentage = easeOutQuad(percentage);
      
      countRef.current.current = countRef.current.start + (end - countRef.current.start) * easedPercentage;
      setCount(countRef.current.current);

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, onComplete]);

  return (
    <>{prefix}{count.toFixed(decimals)}{suffix}</>
  );
};

// Glitch text effect
const glitch = keyframes`
  0% {
    transform: translate(0);
    text-shadow: 0 0 0 #00f, 0 0 0 #f00;
  }
  2% {
    transform: translate(-5px, 5px);
    text-shadow: -2px 0 0 #00f, 2px 0 0 #f00;
  }
  4% {
    transform: translate(5px, -5px);
    text-shadow: 2px 0 0 #00f, -2px 0 0 #f00;
  }
  6% {
    transform: translate(-5px, -5px);
    text-shadow: -2px 0 0 #00f, 2px 0 0 #f00;
  }
  8% {
    transform: translate(0);
    text-shadow: 0 0 0 #00f, 0 0 0 #f00;
  }
  100% {
    transform: translate(0);
    text-shadow: 0 0 0 #00f, 0 0 0 #f00;
  }
`;

interface GlitchTextProps {
  text: string;
  interval?: number;
  component?: React.ElementType;
  sx?: any;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  interval = 5000,
  component = 'div',
  sx = {},
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const startGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    };

    startGlitch();
    const glitchInterval = setInterval(startGlitch, interval);

    return () => clearInterval(glitchInterval);
  }, [interval]);

  return (
    <Box
      component={component}
      sx={{
        position: 'relative',
        display: 'inline-block',
        animation: isGlitching ? `${glitch} 0.5s ease forwards` : 'none',
        ...sx,
      }}
    >
      {text}
    </Box>
  );
};

// Animated gradient text
const textGradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

interface GradientTextProps {
  text: string;
  gradient?: string;
  duration?: number;
  component?: React.ElementType;
  sx?: any;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  gradient = 'linear-gradient(90deg, #0077B5, #00aff0, #1DA1F2, #0077B5)',
  duration = 5,
  component = 'span',
  sx = {},
}) => {
  return (
    <Box
      component={component}
      sx={{
        background: gradient,
        backgroundSize: '300% 300%',
        animation: `${textGradientAnimation} ${duration}s ease infinite`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        ...sx,
      }}
    >
      {text}
    </Box>
  );
}; 