import { useMemo } from "react";
import type { DomainPhase } from "@/types";

interface WarpSequenceProps {
  phase: DomainPhase;
}

interface Streak {
  id: number;
  angle: number;
  length: number;
  thickness: number;
  color: string;
  duration: number;
  delay: number;
  startDist: number;
}

interface Star {
  id: number;
  angle: number;
  distance: number;
  thickness: number;
  color: string;
  duration: number;
  delay: number;
}

const COLORS = [
  "#4fc3f7",
  "#7c4dff",
  "#b39ddb",
  "#ffffff",
  "#e91e63",
  "#9c27b0",
  "#81d4fa",
];

function generateStreaks(count: number): Streak[] {
  return Array.from({ length: count }, (_, i) => {
    const baseAngle = (360 / count) * i;
    return {
      id: i,
      angle: baseAngle + (Math.random() - 0.5) * (360 / count) * 0.9,
      length: 8 + Math.random() * 18,
      thickness: 1 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 0.4 + Math.random() * 0.5,
      delay: Math.random() * 1.8,
      startDist: 5 + Math.random() * 25,
    };
  });
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const baseAngle = (360 / count) * i;
    return {
      id: i,
      angle: baseAngle + (Math.random() - 0.5) * (360 / count) * 0.8,
      distance: 40 + Math.random() * 60,
      thickness: 1.5 + Math.random() * 2.5,
      color: COLORS[3],
      duration: 1.4 + Math.random() * 1.0,
      delay: Math.random() * 2,
    };
  });
}

export function WarpSequence({ phase }: WarpSequenceProps) {
  const streaks = useMemo(() => generateStreaks(200), []);
  const stars = useMemo(() => generateStars(50), []);

  const isWarping = phase === "warping";
  const isFlashing = phase === "flashing";

  if (!isWarping && !isFlashing) return null;

  return (
    <>
      <style>{`
        @keyframes streakPass {
          0%   { transform: rotate(var(--rot)) translateX(var(--start)); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: rotate(var(--rot)) translateX(var(--end)); opacity: 0; }
        }
        @keyframes starBurst {
          0% {
            transform: translate(-50%, -50%) rotate(var(--rot)) translateX(0) scaleX(0.05);
            opacity: 0;
          }
          8% { opacity: 1; }
          100% {
            transform: translate(-50%, -50%) rotate(var(--rot)) translateX(var(--dist)) scaleX(1);
            opacity: 1;
          }
        }
        @keyframes coreFlare {
          0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
        }
        @keyframes flashFade {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes starfieldFade {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {isWarping && (
        <canvas
          ref={(canvas) => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext("2d")!;

            // Deep space background
            ctx.fillStyle = "#00010a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars — tiny bright dots
            for (let i = 0; i < 800; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const r = Math.random() * 1.2;
              const brightness = 0.3 + Math.random() * 0.7;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.35})`;
              ctx.fill();
            }

            // Space dust — very faint clusters
            for (let i = 0; i < 200; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const r = 1.5 + Math.random() * 3;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(100, 120, 200, ${Math.random() * 0.06})`;
              ctx.fill();
            }

            // Subtle nebula patches
            // const nebula = (x: number, y: number, r: number, color: string) => {
            //   const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            //   grad.addColorStop(0, color);
            //   grad.addColorStop(1, "transparent");
            //   ctx.fillStyle = grad;
            //   ctx.fillRect(x - r, y - r, r * 2, r * 2);
            // };
            // nebula(
            //   canvas.width * 0.2,
            //   canvas.height * 0.3,
            //   180,
            //   "rgba(80, 40, 120, 0.12)"
            // );
            // nebula(
            //   canvas.width * 0.8,
            //   canvas.height * 0.6,
            //   220,
            //   "rgba(30, 60, 140, 0.1)"
            // );
            // nebula(
            //   canvas.width * 0.5,
            //   canvas.height * 0.15,
            //   150,
            //   "rgba(60, 20, 100, 0.08)"
            // );
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            pointerEvents: "none",
            opacity: 0,
            animation: "starfieldFade 1.2s ease-in forwards",
          }}
        />
      )}

      {isWarping && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9991,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {stars.map((streak) => (
            <div
              key={streak.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '2px',
                height: `${streak.thickness}px`,
                background: `linear-gradient(to right, ${streak.color}, ${streak.color}aa 30%, transparent)`,
                borderRadius: '2px',
                boxShadow: `0 0 ${streak.thickness * 3}px ${streak.color}`,
                ['--rot' as string]: `${streak.angle}deg`,
                ['--dist' as string]: `${streak.distance}vmax`,
                transform: 'translate(-50%, -50%) rotate(var(--rot)) translateX(0) scaleX(0.05)',
                transformOrigin: '0% 50%',
                animation: `starBurst 2s cubic-bezier(0.15, 0.4, 0.3, 1) ${streak.delay}s forwards`,
                opacity: 0,
              }}
            />
          ))}

          {streaks.map((streak) => (
            <div
              key={streak.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                height: `${streak.thickness}px`,
                width: `${streak.length}vmax`,
                background: `linear-gradient(to right, transparent, ${streak.color} 30%, ${streak.color} 70%, transparent)`,
                borderRadius: "9999px",
                boxShadow: `0 0 ${streak.thickness * 3}px ${streak.color}`,
                ["--rot" as string]: `${streak.angle}deg`,
                ["--start" as string]: `${streak.startDist}vmax`,
                ["--end" as string]: `${
                  streak.startDist + 60 + Math.random() * 40
                }vmax`,
                transform: `rotate(${streak.angle}deg) translateX(${streak.startDist}vmax)`,
                transformOrigin: "0% 50%",
                marginTop: `-${streak.thickness / 2}px`,
                animation: `streakPass ${streak.duration}s linear ${streak.delay}s forwards`,
                opacity: 0,
                zIndex: 2,
              }}
            />
          ))}
        </div>
      )}

      {isFlashing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9995,
            background: "white",
            pointerEvents: "none",
            animation: "flashFade 0.8s ease-out forwards",
          }}
        />
      )}
    </>
  );
}
