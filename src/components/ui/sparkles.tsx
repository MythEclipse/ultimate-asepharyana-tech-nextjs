"use client";
import React, { useId } from "react";
import { useEffect, useState, type ComponentType } from "react";
import type { Container, Engine } from "@tsparticles/engine";
import { cn } from "@/lib/utils/index";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  
  const [init, setInit] = useState(false);
  const [ParticlesComp, setParticlesComp] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    // Dynamic import inside useEffect ensures the SSR worker never attempts to bundle or load these libraries
    const initParticles = async () => {
      try {
        const { default: Particles, initParticlesEngine } = await import("@tsparticles/react");
        const { loadSlim } = await import("@tsparticles/slim");
        
        await initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine);
        });
        
        setParticlesComp(() => Particles as ComponentType<any>);
        setInit(true);
      } catch (error) {
        console.error("Failed to initialize particles:", error);
      }
    };
    
    initParticles();
  }, []);

  const particlesLoaded = async (container?: Container) => {};

  const generatedId = useId();

  if (!init || !ParticlesComp) {
    return <div className={cn("h-full w-full", className)} />;
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <ParticlesComp
        id={id || generatedId}
        className={cn("h-full w-full")}
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: background || "transparent",
            },
          },
          fullScreen: {
            enable: false,
            zIndex: 1,
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: false,
                mode: "repulse",
              },
              resize: {
                enable: true,
              },
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: particleColor || "#ffffff",
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "out",
              },
              random: true,
              speed: speed || 4,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                width: 400,
                height: 400,
              },
              value: particleDensity || 120,
            },
            opacity: {
              value: {
                min: 0.1,
                max: 1,
              },
              animation: {
                enable: true,
                speed: speed || 4,
                startValue: "random",
              },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: {
                min: minSize || 1,
                max: maxSize || 3,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};
