import { useEffect, useRef } from "react";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>,0123456789";

function toRgb(hex) {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
}

export default function LetterGlitch({
  glitchColors = ["#5e4491", "#A476FF", "#241a38"],
  glitchSpeed = 33,
  centerVignette = false,
  outerVignette = false,
  smooth = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const cellWidth = 10;
    const cellHeight = 20;
    const fontSize = 16;
    let columns = 0;
    let letters = [];
    let frameId;
    let resizeTimer;
    let lastGlitchTime = Date.now();

    const randomChar = () => glyphs[Math.floor(Math.random() * glyphs.length)];
    const randomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

    function drawLetters() {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      context.font = `${fontSize}px monospace`;
      context.textBaseline = "top";
      letters.forEach((letter, index) => {
        context.fillStyle = `rgb(${letter.color.join(", ")})`;
        context.fillText(letter.char, (index % columns) * cellWidth, Math.floor(index / columns) * cellHeight);
      });
    }

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(rect.width / cellWidth);
      const rows = Math.ceil(rect.height / cellHeight);
      letters = Array.from({ length: columns * rows }, () => {
        const color = toRgb(randomColor());
        return { char: randomChar(), color, startColor: color, targetColor: color, progress: 1 };
      });
      drawLetters();
    }

    function animate() {
      const now = Date.now();
      if (now - lastGlitchTime >= glitchSpeed) {
        const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
        for (let i = 0; i < updateCount; i += 1) {
          const letter = letters[Math.floor(Math.random() * letters.length)];
          if (!letter) continue;
          letter.char = randomChar();
          letter.targetColor = toRgb(randomColor());
          letter.startColor = letter.color;
          letter.progress = smooth ? 0 : 1;
          if (!smooth) letter.color = letter.targetColor;
        }
        lastGlitchTime = now;
        drawLetters();
      }

      if (smooth) {
        let needsRedraw = false;
        letters.forEach((letter) => {
          if (letter.progress >= 1) return;
          letter.progress = Math.min(1, letter.progress + 0.05);
          letter.color = letter.startColor.map((value, index) =>
            Math.round(value + (letter.targetColor[index] - value) * letter.progress),
          );
          needsRedraw = true;
        });
        if (needsRedraw) drawLetters();
      }
      frameId = requestAnimationFrame(animate);
    }

    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(frameId);
        resizeCanvas();
        animate();
      }, 100);
    }

    resizeCanvas();
    animate();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [glitchColors, glitchSpeed, smooth]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#101010]">
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      {outerVignette && <div className="outer-vignette" aria-hidden="true" />}
      {centerVignette && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]" aria-hidden="true" />
      )}
    </div>
  );
}
