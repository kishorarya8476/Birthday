import { useEffect, useRef } from "react";
import "./Confetti.css";

class ConfettiParticle {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = -10 - Math.random() * 100; // Start higher up
    this.size = Math.random() * 10 + 6; // Bigger particles
    this.speedY = Math.random() * 4 + 3; // Faster fall
    this.speedX = Math.random() * 3 - 1.5; // More horizontal movement
    this.color = [
      "#e91e63",
      "#ff6b9d",
      "#ffd1dc",
      "#ffe6ee",
      "#ffeb3b",
      "#4caf50",
      "#00bcd4",
      "#9c27b0",
      "#ff5722",
    ][Math.floor(Math.random() * 9)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 6 - 3; // More rotation
    this.opacity = 1;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.speedY += 0.1; // Gravity effect
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    // Draw different shapes
    if (Math.random() > 0.5) {
      // Rectangle
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      // Circle
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function Confetti() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log("Confetti effect started!"); // Debug log

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particleCount = 200; // More particles
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        particles.current.push(new ConfettiParticle(canvas));
      }, i * 10); // Faster spawn rate
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((particle) => {
        particle.update();
        particle.draw(ctx);
        return particle.y < canvas.height + 50;
      });

      if (particles.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        console.log("Confetti animation complete"); // Debug log
      }
    };

    animate();

    return () => {
      console.log("Confetti cleanup"); // Debug log
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particles.current = [];
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}

export default Confetti;
