export const NOTE_NAMES =["C", "C#","D","D#","E","F","F#","G","G#","A","A#","B"];
export const NOTE_NAMES_FLAT =["C", "Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
export const getNoteDetails = (frequency, isFlatNote = false) => {
    
    const A4 = 440;
    /* pow é potência. O primeiro parâmetro é a base, o segundo é o expoente.
    
    2 é a base  das frequencias musicais, para subir uma oitava, multiplica-se por 2 (dobra a frequencia).
    para descer uma oitava, divide-se por 2 ou multiplica-se por 0.5 (divide a frequência).

    -4.75 é o número de oitavas entre C0 e A4. Ou seja, 4 oitavas completas e 3/4 de oitava (0.75)
    O A4 (440Hz) é a nota de referência para afinação e o C0 é a nota mais baixa do piano padrão.
    Abaixo desse valor a tendência é que o som fique ináudivel para o ouvido humano.

    Cada oitava tem 12 semitons (meio-tons).
    A cada 12 semitons, a frequência dobra.

    C0 = 440 * 2^(-4.75)
    C0 = 440 * 0.03716272234
    C0 = 16.35 Hz (aproximadamente)
    */

    /* 
    A distancia entre as notas musicais é calculada de forma logaritmica e não de forma linear.
    Então para subir uma oitava, a frequência dobra (multiplica por 2).
    Pra descer uma oitava, a frequência é dividida por 2 (ou multiplicada por 0.5).
    Ex: se a frequência capturada for 880Hz e dividirmos por 440Hz, o resultado será 2.
    Log2(2) = 1, ou seja, subiu 1 oitava.
    */
    const C0 =  A4 * Math.pow(2, -4.75);
    
    /*
    Primeiro divide a frequencia capturada pela frequencia do A4 (440Hz)
    Depois calcula o logaritmo base 2 do resultado da divisão entre a frequencia capturada e a frequencia do A4.
    Depois multiplica o resultado do logaritmo por 12 (número de semitons em uma oitava).

    Exemplo:
    se a frequencia for 880Hz:
    halfStepsFromA4 = 12 * log2(880 / 440)
    halfStepsFromA4 = 12 * log2(2)
    halfStepsFromA4 = 12 * 1
    halfStepsFromA4 = 12 (subiu 12 semitons, ou seja, 1 oitava)

    se a frequencia for 466.16 (A#4)
    halfStepsFromA4 = 12 * log2(466.16 / 440)
    halfStepsFromA4 = 12 * log2(1.05945...)
    halfStepsFromA4 = 12 * 0.0833... (dízima periódica)
    halfStepsFromA4 = 1 (aproximandamente) (subiu 1 semiton)

    halfSteps é a distancia em semitons a partir do A4. Se o halfSteps for 0 significa que a nota é A4.
    Se for positivo, significa que a nota está acima do A4.
    Se for negativo, significa que a nota está abaixo do A4.
    */
    const halfStepsFromA4 = 12 * Math.log2(frequency / A4);
    
    /*
    MIDI é o protocolo padrão de numeração das notas musicais em formato digital que computadores, sintetizaroes
    e etc usam para se comunicar.
    Cada nota possui um ID númérico único.
    O número 0 é o C-1 (C menos 1), que é a nota mais baixa possível, praticamente inaudível.
    O número 69 é o A4 (440Hz), que é a nota de referência para afinação.
    
    A base de cálculo é 69 (A4) + a distância em semitons a partir do A4 (halfStepsFromA4).
    Então se o halfStep for 1, o midiNoteNumber será 70 (A#4). A lógica se mantém para notas acima e abaixo do A4.

    preciso arredondar o valor para o número inteiro mais próximo, pois o MIDI trabalha com números inteiros.
    */
    const midiNoteNumber = Math.round(69 + halfStepsFromA4);

    /* calcula qual seria a frequencia perfeita da nota musical correspondente ao midiNoteNumber
    Ex: se o midiNoteNumber for 71 
    perfectFrequency = 440 * 2^((71 - 69) / 12)
    perfectFrequency = 440 * 2^(2 / 12)
    perfectFrequency = 440 * 2^0.1666... (dízima periódica)
    perfectFrequency = 440 * 1.1224
    perfectFrequency = 493.88 Hz (aproximadamente, que é a frequencia do B4)
    */
    const perfectFrequency = A4 * Math.pow(2, (midiNoteNumber - 69) / 12);

    /*Descobre o nome da nota musical a partir do midiNoteNumber
    Divide o midiNoteNumber por 12 e pega o resto da divisão (midiNoteNumber % 12)
    O resto da divisão indica a posíção do indice do array NOTE_NAMES.
    Ex: se o midiNoteNumber for 71
    71 % 12 = 11 (11 é o resto da divisão)
    NOTE_NAMES[11] = "B"

    O noteName pega a posição do noteIndex no array NOTE_NAMES.
    */
    const noteIndex = midiNoteNumber % 12;
    const noteName = isFlatNote ? NOTE_NAMES_FLAT[noteIndex] : NOTE_NAMES[noteIndex];

    /* A base de calcula da oitava é 12 semitons. cada 12 semitons é uma oitava.
    Para descobrir a oitava preciso dividir o midiNoteNumber por 12 para saber 
    quantos ciclos completos de 12 semitons (oitavas) existem.
    Preciso arredondar para baixo (Math.floor) para pegar apenas o número inteiro referente a oitava.
    Preciso subtrair 1, pois o MIDI começa a contar as oitavas a partir do C-1 (C menos 1).
    Sem a subtração, a contagem da oitava ficaria errada por causa da estrutura do padrão MIDI,
    que é diferente da contagem tradicional de oitavas na teoria musical.
    */
    const octave = Math.floor(midiNoteNumber / 12) - 1;

    /*
    cents é a medida em centésimos. Cada semiton (meio-ton) é dividido em 100 cents.
    Cada oitava possui 1200 cents (12 semitons * 100 cents).
    Precio converter em cents pois é mais preciso para afinação,
    pois um semiton (meio-ton) pode ser uma diferença muito grande para afinar um instrumento.
    
    */
    const cents = 1200 * Math.log2(frequency / perfectFrequency);

    return {
        noteName,
        octave,
        cents,
        frequency,
        perfectFrequency
    };
}    
