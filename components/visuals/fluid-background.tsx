// @ts-nocheck
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import { useTheme } from 'next-themes'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from '@/lib/shaders/fluid'

/**
 * FluidPlane - 3D plane with liquid shader effect
 * Creates animated liquid background that reacts to mouse movement
 */
function FluidPlane() {
  const mesh = useRef<THREE.Mesh>(null)
  const { theme } = useTheme()

  // Uniform variables passed to shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#050505') }, // Dark base (background color)
      uColor2: { value: new THREE.Color('#00ffff') }, // Accent (glow color)
    }),
    []
  )

  // Update colors based on theme
  useEffect(() => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial
      if (theme === 'light') {
        material.uniforms.uColor1.value = new THREE.Color('#fafafa')
        material.uniforms.uColor2.value = new THREE.Color('#0000ff')
      } else {
        material.uniforms.uColor1.value = new THREE.Color('#050505')
        material.uniforms.uColor2.value = new THREE.Color('#00ffff')
      }
    }
  }, [theme])

  // Animation loop (60 FPS)
  useFrame((state: any) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial

      // Update time for wave animation
      material.uniforms.uTime.value = state.clock.getElapsedTime()

      // Smooth mouse interpolation (to avoid jitter)
      const targetX = state.pointer.x * 0.5 + 0.5
      const targetY = state.pointer.y * 0.5 + 0.5

      // Lerp (Linear Interpolation) for smooth movement of "spot" following mouse
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(targetX, targetY),
        0.1
      )
    }
  })

  return (
    // @ts-ignore - R3F JSX elements
    <mesh ref={mesh} scale={[10, 10, 1]}>
      {/* Stretch to full screen */}
      {/* @ts-ignore */}
      <planeGeometry args={[2, 2, 128, 128]} />
      {/* 128x128 grid for wave detail */}
      {/* @ts-ignore */}
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}

/**
 * FluidBackground - R3F Canvas wrapper
 * Fixed background layer that doesn't re-render on navigation
 */
export default function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: false, antialias: true }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  )
}

