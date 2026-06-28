import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  useGLTF,
} from "@react-three/drei";

import { Suspense, useRef } from "react";

function Controller() {
  const group = useRef();

  // Update this path if your model is stored elsewhere
  const { scene } = useGLTF("/models/black-redComboXboxController.glb");

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    // Smooth floating rotation
    group.current.rotation.y += 0.003;
    group.current.rotation.x = Math.sin(t * 0.7) * 0.05;

    // Mouse parallax
    group.current.rotation.z = state.pointer.x * 0.15;
    group.current.position.y = Math.sin(t) * 0.12;
  });

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={2.6}
        position={[0, -0.7, 0]}
      />
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="h-full w-full">

      <Canvas
        shadows
        dpr={[1, 2]}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 1, 6]}
          fov={35}
        />

        {/* Lighting */}

        <ambientLight intensity={0.9} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
        />

        <pointLight
          position={[-4, 3, 2]}
          intensity={30}
          color="#8b5cf6"
        />

        <pointLight
          position={[4, -2, 2]}
          intensity={15}
          color="#06b6d4"
        />

        <Suspense fallback={null}>
          <Float
            speed={2}
            rotationIntensity={0.35}
            floatIntensity={1.2}
          >
            <Controller />
          </Float>

          <Environment preset="city" />

          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.4}
            blur={3}
            scale={12}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>

    </div>
  );
}

// Preload model
useGLTF.preload("/models/black-redComboXboxController.glb");