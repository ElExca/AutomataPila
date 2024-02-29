const tokenTypes = [
 
    { regex: /^:/, token: "DosPuntos" },
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
    { regex: /^\+\+/, token: "Incremento" },
    { regex: /^--/, token: "Decremento" },
    { regex: /^>/, token: "OperadorMayor" },
    { regex: /^</, token: "OperadorMenor" },
    { regex: /^>=/, token: "OperadorIgualMayor" },
    { regex: /^<=/, token: "OperadorIgualMenor" },
    { regex: /^===/, token: "OperadorIgualdad" },
    { regex: /^[a-zA-Z]+/, token: "Letras" },
  ];


  
export function lex(input) {
    let tokens = [];
  let position = 0;  // Seguimiento de la posición para mensajes de error más informativos.

  while (input.length > 0) {
    // Ignora espacios y saltos de línea al principio de la cadena de entrada.
    const whitespace = input.match(/^\s+/);
    if (whitespace) {
      position += whitespace[0].length;  // Actualiza la posición.
      input = input.slice(whitespace[0].length);  // Elimina los espacios de la entrada.
    }

    if(input.length === 0) {
      break;  // Si solo quedan espacios en blanco, termina el bucle.
    }

    let match = false;
    for (let tokenType of tokenTypes) {
      const result = tokenType.regex.exec(input);
      if (result !== null) {
        match = true;
        tokens.push({ type: tokenType.token, value: result[0] });
        position += result[0].length;  // Actualiza la posición.
        input = input.slice(result[0].length);
        break;
      }
    }
    if (!match) {
      const errorToken = input[0];
      tokens.push({ type: "Error", value: `Carácter inesperado '${errorToken}' en la posición ${position}.` });
      break;
    }
  }
  return tokens;
}
