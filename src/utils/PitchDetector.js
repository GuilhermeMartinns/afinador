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
    if (rootMeanSquare < 0.01){
        return -1; //sinal muito fraco
    }

    // corta o ínicio e o fim do buffer para aumentar a precisão da detecção
    // pois se cortar no meio do pico ou no meio de um vale pode gerar erros de calculo
    // então tenta cortar mais próximo do repouso (perto de 0)
    let r1 = 0;
    let r2 = SIZE -1;
    const threshold = 0.2;

    // corta o inicio vazio
    for (let i = 0; i < SIZE / 2; i++){
        if (Math.abs(buffer[i]) < threshold){
            r1 = i;
            break;
        }
    }

    // corta o final vazio
    for (let i = 1; i < SIZE / 2; i++){
        if (Math.abs(buffer[SIZE -i ] < threshold)){
            r2 = SIZE - i;
            break;
        }
    }
}