import { useState, useEffect, useRef } from 'react';

/**
 * Hook para suavizar valores numéricos (Lerp) no React Native
 * @param {number} targetValue
 * @param {number} speed
 */
export function useSmoothValue(targetValue, speed = 0.15) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const targetRef = useRef(targetValue);

  useEffect(() => {
    targetRef.current = targetValue;
  }, [targetValue]);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setDisplayValue((prev) => {
        const diff = targetRef.current - prev;
        if (Math.abs(diff) < 0.01) {
          return prev;
        }
        return prev + diff * speed;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed]);

  return displayValue;
}
