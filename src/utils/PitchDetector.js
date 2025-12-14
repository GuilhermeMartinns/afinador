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
}