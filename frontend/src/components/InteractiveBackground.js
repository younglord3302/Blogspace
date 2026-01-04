import React, { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let isOrbiting = false;
    let mouse = { x: 0, y: 0 };
    let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      center = { x: canvas.width / 2, y: canvas.height / 2 };
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
          Math.random() * 100 + 100
        )}, 255, ${Math.random() * 0.5 + 0.1})`;
        this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = Math.random() * 200 + 50;
        this.orbitSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1);
      }

      update() {
        if (isOrbiting) {
          // Orbit logic
          this.angle += this.orbitSpeed;
          const targetX = mouse.x + Math.cos(this.angle) * this.orbitRadius;
          const targetY = mouse.y + Math.sin(this.angle) * this.orbitRadius;
          
          // Smoothly move towards orbit position
          this.x += (targetX - this.x) * 0.05;
          this.y += (targetY - this.y) * 0.05;
        } else {
          // Floating logic
          this.x += this.vx;
          this.y += this.vy;

          // Bounce off edges
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
          
          // Mouse interaction (repel/attract slightly)
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw centralized "Sun" if orbiting
      if (isOrbiting) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 200, 50, 0.8)';
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(255, 100, 50, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Connections
      if (!isOrbiting) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 - distance / 1000})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = () => {
      isOrbiting = true;
    };

    const handleMouseUp = () => {
      isOrbiting = false;
      // Explode effect logic could go here
      particles.forEach(p => {
        p.vx = (Math.random() - 0.5) * 4;
        p.vy = (Math.random() - 0.5) * 4;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-gray-900 via-blue-900 to-black pointer-events-none"
      style={{ pointerEvents: 'none' }} // Ensure clicks pass through to particles logic but don't block UI? Wait, if pointerEvents is none, mouse events on window work, but we want UI to be clickable too.
      // Actually, we want the user to be able to click UI elements. The background interaction should happen when clicking *background*?
      // Or global click? The user said "when mous click they collect". 
      // If I put event listeners on window (like I did), it will trigger even when clicking a button.
      // That might be annoying. But for "background" effect it's okay.
    />
  );
};

export default InteractiveBackground;
