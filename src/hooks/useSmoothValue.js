import { useState, useEffect, useRef} from 'react';

/**hook para suavizar valores númericos (Lerp)
 * @param {number} targetValue
 * @param {number} speed
 */

export function useSmoothValue(targetValue, speed = 0.15) {
    const [displayValue, setDisplayValue] = useState(targetValue);

    //guarda o valor alvo numa ref para o loop de animação ler o valor mais recente
    const targetRef = useRef(targetValue);

    //atualiza a ref sempre que o valor do microfone mudar
    useEffect(() => {
        targetRef.current = targetValue;
    }, [targetValue]);

    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            setDisplayValue((prev) => {
                const diff = targetRef.current - prev;
                
                //se a difereça for muito pequena
                if (Math.abs(diff) < 0.01) {
                    return prev;
                }

                //fórmula do Lerp (interpolação linear)
                return prev + diff * speed;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        //inicia o loop visual
        animate();

        //limpeza (para o loop se o componente sair da tela)
        return () => cancelAnimationFrame(animationFrameId);
    }, [speed]);

    return displayValue;
}