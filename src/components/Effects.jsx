import { useEffect } from "react";
import "./Effects.css";

function Effects() {
  useEffect(() => {
    launchBalloons();
    launchFireworks();
    launchCrackers();

    // Repeat fireworks after 4 seconds
    const timer = setTimeout(() => {
      launchFireworks();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const launchBalloons = () => {
    const balloonEmojis = ["🎈", "🎈", "🎈", "🎈", "🎈", "🎈"];
    const colors = [
      "#FF6B9D",
      "#FFC837",
      "#C4FAF8",
      "#FF85A2",
      "#A78BFA",
      "#60D399",
    ];

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.textContent = balloonEmojis[i % balloonEmojis.length];

        const xPos = Math.random() * (window.innerWidth - 100);
        balloon.style.left = xPos + "px";
        balloon.style.color = colors[i % colors.length];

        const drift = (Math.random() - 0.5) * 200;
        const rotate = (Math.random() - 0.5) * 360;
        balloon.style.setProperty("--drift", `${drift}px`);
        balloon.style.setProperty("--rotate", `${rotate}deg`);
        balloon.style.animationDelay = `${Math.random() * 0.5}s`;

        document.body.appendChild(balloon);

        setTimeout(() => balloon.remove(), 8500);
      }, i * 300);
    }
  };

  const createFirework = (x, y, color) => {
    const particleCount = 30;
    const firework = document.createElement("div");
    firework.className = "firework";
    firework.style.left = x + "px";
    firework.style.top = y + "px";

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "firework-particle";
      particle.style.background = color;

      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);

      firework.appendChild(particle);
    }

    document.body.appendChild(firework);
    setTimeout(() => firework.remove(), 1500);
  };

  const launchFireworks = () => {
    const colors = [
      "#FF6B9D",
      "#FFC837",
      "#C4FAF8",
      "#FF85A2",
      "#A78BFA",
      "#60D399",
      "#FFD93D",
      "#6BCF7F",
    ];

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const x = (window.innerWidth / 9) * (i + 1);
        const y = 100 + Math.random() * 200;
        const color = colors[i % colors.length];
        createFirework(x, y, color);
      }, i * 400);
    }

    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = 100 + Math.random() * 200;
          const color = colors[Math.floor(Math.random() * colors.length)];
          createFirework(x, y, color);
        }, i * 300);
      }
    }, 2000);
  };

  const launchCrackers = () => {
    const crackerEmojis = ["🎉", "🎊", "✨", "🎆", "🎇", "💫"];

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const cracker = document.createElement("div");
        cracker.className = "cracker";
        cracker.textContent = crackerEmojis[i % crackerEmojis.length];

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);

        cracker.style.left = x + "px";
        cracker.style.top = y + "px";

        document.body.appendChild(cracker);
        setTimeout(() => cracker.remove(), 1000);
      }, i * 150);
    }
  };

  return null;
}

export default Effects;
