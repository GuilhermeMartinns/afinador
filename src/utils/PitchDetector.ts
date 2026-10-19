export const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;

    // sumOfSquares (soma dos quadrados)
    // precisa elevar ao quadrado para que a frequencia não se "auto anule"
    // pois a onda possui picos (positivos) e vales (negativos)
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
        const val = buffer[i];
        sumOfSquares += val * val;
    }
    
    // root mean square mede o volume do sinal
    // se o som for muito baixo ou silencio não tenta detectar a frequência
    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
    
    // Noise gate
    if (rootMeanSquare < 0.01) {
        return -1; // Silêncio
    }

    // corta o início e o fim do buffer para aumentar a precisão da detecção
    // pois se cortar no meio do pico ou no meio de um vale pode gerar erros de cálculo
    // então tenta cortar mais próximo do repouso (perto de 0)
    let r1 = 0;
    let r2 = SIZE - 1;
    
    // Threshold para achar o começo real da onda
    const threshold = 0.10;

    for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buffer[i]) > threshold) { 
            r1 = i;
            break;
        }
    }

    // Procura o fim real da onda (de trás pra frente)
    for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buffer[SIZE - i]) > threshold) { 
            r2 = SIZE - i;
            break;
        }
    }

    // Se a onda foi muito fraca e não passou do threshold, ignora
    if (r2 <= r1) return -1;

    const buffer2 = buffer.slice(r1, r2);
    const c = new Array(buffer2.length).fill(0);

    for (let i = 0; i < buffer2.length; i++) {
        for (let j = 0; j < buffer2.length - i; j++) {
            c[i] = c[i] + buffer2[j] * buffer2[j + i];
        }
    }
    
    let d = 0;
    // Avança enquanto o valor estiver descendo, mas com proteção para não estourar o array
    while (c[d] > c[d + 1] && d < buffer2.length - 1) {
        d++;
    }

    // Se d chegou no final, não houve ciclo (apenas uma descida constante)
    if (d >= buffer2.length - 2) {
        return -1;
    }

    let maxval = -1;
    let maxpos = -1;

    for (let i = d; i < buffer2.length; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }

    // interpolação de parábolas para aumentar a precisão do afinador
    // sem a interpolação ele pode ficar variando entre 2 frequências
    let T0 = maxpos;
    if (T0 < 1) {
        return -1;
    }

    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    
    if (x1 !== undefined && x2 !== undefined && x3 !== undefined) {
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);
    }

    // Convertendo para hertz (f = 1/T)
    return sampleRate / T0;
};
