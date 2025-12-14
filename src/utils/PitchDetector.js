export const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;

    //sumOfSquares (soma dos quadrados)
    //precisa elevar ao quadrado para que a frequencia não se "auto anule"
    //pois a onda possui picos (positivos) e vales (negativos)
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
        const val = buffer[i];
        sumOfSquares += val * val;
    }
    
    //root mean square mede o volume do sinal
    //se o som for muito baixo ou silencio não tenta detectar a frequência
    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
    // funciona como um noise gate
    if (rootMeanSquare < 0.01) {
        return -1; // Silêncio
    }

    // corta o ínicio e o fim do buffer para aumentar a precisão da detecção
    // pois se cortar no meio do pico ou no meio de um vale pode gerar erros de calculo
    // então tenta cortar mais próximo do repouso (perto de 0)
    let r1 = 0;
    let r2 = SIZE -1;
    const threshold = 0.2;

    // corta o inicio vazio
    for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
        }
    }

    // corta o final vazio
    for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
        }
    }

    // buffer focado na onda principal (após o corte das partes vazias)
    const buffer2 = buffer.slice(r1, r2);
    const c = new Array(buffer2.length).fill(0);

    //comparação da onda com ela mesma deslocada
    for (let i = 0; i < buffer2.length; i++) {
        for (let j = 0; j < buffer2.length - i; j++) {
        c[i] = c[i] + buffer2[j] * buffer2[j + i];
        }
    }
    
    //Encontra o primeiro pico forte
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

    // interpolação de parábolas
    // para aumentar a precisão do afinador
    //sem a interpolação ele pode ficar variando entre 2 frequencias
    let T0 = maxpos;
    //proteção para o T0 nao for válido ou igual a 0 
    if (T0 < 1 ){
        return -1;
    }

    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    
    if (x1 && x2 && x3){
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);
    }

    //Convertendo para herts
    // frequencia = taxa de amostragem / período (f=1/T)
    return sampleRate / T0;
};