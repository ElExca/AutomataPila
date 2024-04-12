const tokenTypes = [
 
    { regex: /^:/, token: "DosPuntos" },
    { regex: /^\./, token: "Punto" },
    { regex: /^"/, token: "Comillas" },
    { regex: /^_/, token: "GuionBajo" },
    { regex: /^{/, token: "LlaveApertura" },
    { regex: /^}/, token: "LlaveFinal" },
    { regex: /^\[/, token: "CorcheteApertura" },
    { regex: /^\]/, token: "CorcheteCierre" },
    { regex: /^\(/, token: "ParentesisApertura" },
    { regex: /^\)/, token: "ParentesisCierre" },
    { regex: /^\d+/, token: "Digitos" },
    { regex: /^FCN/, token: "PalabraReservadaFuncion" },
    { regex: /^for/, token: "PalabraReservadaFor" },
    { regex: /^if/, token: "PalabraReservadaIf" },
    { regex: /^print/, token: "PalabraReservadaPrint" },
    { regex: /^\+\+/, token: "Incremento" },
    { regex: /^--/, token: "Decremento" },
    { regex: /^>/, token: "OperadorMayor" },
    { regex: /^</, token: "OperadorMenor" },
    { regex: /^>=/, token: "OperadorIgualMayor" },
    { regex: /^<=/, token: "OperadorIgualMenor" },
    { regex: /^===/, token: "OperadorIgualdad" },
    { regex: /^=/, token: "Igualdad" },
    { regex: /^[a-zA-Z]+/, token: "Letras" },
  ];

function lex(input) {
    let tokens = [];
    let position = 0;

    while (input.length > 0) {
        const whitespace = input.match(/^\s+/);
        if (whitespace) {
            position += whitespace[0].length;
            input = input.slice(whitespace[0].length);
        }

        if (input.length === 0) {
            break;
        }

        let match = false;
        for (let tokenType of tokenTypes) {
            const result = tokenType.regex.exec(input);
            if (result !== null) {
                match = true;
                tokens.push({ type: tokenType.token, value: result[0] });
                position += result[0].length;
                input = input.slice(result[0].length);
                break;
            }
        }

        if (!match) {
            const errorToken = input[0];
            tokens.push({ type: "UNKNOWN", value: `Caracter inesperado '${errorToken}' en la posicion ${position}.` });
            break;
        }
    }

    return tokens;
}

export { lex };
 