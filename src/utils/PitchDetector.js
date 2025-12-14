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

    if (rootMeanSquare < 0.01){
        return -1; //sinal muito fraco
    }
}