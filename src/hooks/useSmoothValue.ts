import { useState, useEffect, useRef } from 'react';

/**
 * Hook para suavizar valores numéricos (Lerp)
 * @param targetValue Valor alvo numérico
 * @param speed Fator de interpolação (0 a 1)
 */
export function useSmoothValue(targetValue: number, speed: number = 0.15): number {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);

  // Guarda o valor alvo numa ref para o loop ler o valor mais recente
  const targetRef = useRef<number>(targetValue);

  useEffect(() => {
    targetRef.current = targetValue;
  }, [targetValue]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setDisplayValue((prev) => {
        const diff = targetRef.current - prev;

        if (Math.abs(diff) < 0.01) {
          return prev;
        }

        // Fórmula do Lerp (interpolação linear)
        return prev + diff * speed;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  return displayValue;
}
