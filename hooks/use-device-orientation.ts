'use client'

import { useState, useEffect, useRef } from 'react'

interface DeviceOrientation {
  beta: number | null // X-axis rotation (left/right tilt)
  gamma: number | null // Y-axis rotation (front/back tilt)
  alpha: number | null // Z-axis rotation (compass)
}

/**
 * Hook to track device orientation (gyroscope)
 * Used for mobile zero-gravity chip effect
 */
export function useDeviceOrientation(): DeviceOrientation {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    beta: null,
    gamma: null,
    alpha: null,
  })
  const isListenerAddedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        beta: event.beta,
        gamma: event.gamma,
        alpha: event.alpha,
      })
    }

    // Request permission for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      ;(DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true)
            isListenerAddedRef.current = true
          }
        })
        .catch(() => {
          // Permission denied or not supported
        })
    } else {
      // Android or older iOS
      window.addEventListener('deviceorientation', handleOrientation, true)
      isListenerAddedRef.current = true
    }

    return () => {
      if (isListenerAddedRef.current) {
        window.removeEventListener('deviceorientation', handleOrientation, true)
        isListenerAddedRef.current = false
      }
    }
  }, [])

  return orientation
}

