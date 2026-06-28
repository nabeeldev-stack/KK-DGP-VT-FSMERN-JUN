import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          fullScreen: false,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 150,
                links: { opacity: 0.3 },
              },
              bubble: {
                distance: 200,
                size: 4,
                duration: 2,
                opacity: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: ["#ef4444", "#f87171", "#b91c1c", "#fca5a5"],
            },
            links: {
              color: "#ef4444",
              distance: 120,
              enable: true,
              opacity: 0.15,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.6,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "bounce" },
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200,
              },
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: {
              value: 0.5,
              random: true,
              animation: {
                enable: true,
                speed: 0.3,
                minimumValue: 0.1,
                sync: false,
              },
            },
            size: {
              value: { min: 1, max: 3 },
              random: true,
              animation: {
                enable: true,
                speed: 0.4,
                minimumValue: 0.5,
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Aurora gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-brand/10 via-transparent to-transparent blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-gradient-radial from-brand/8 via-transparent to-transparent blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-radial from-brand/6 via-transparent to-transparent blur-3xl animate-pulse-soft" style={{ animationDelay: "4s" }} />
    </div>
  );
}

