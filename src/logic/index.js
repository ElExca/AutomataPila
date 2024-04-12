const readline = require('readline');
const parser = require("./gramatica");
const analyzeSemantics = require("./semantica");
const lex = require('./lexico');
const { interpret } = require('./interpreter');
const { translate } = require('./translate');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Ingresa la cadena de texto: ', (input) => {
    const tokens = lex(input);

    console.log("Tokens Generados:");
    tokens.forEach((token, index) => {
        console.log(`${index + 1}: ${token.type} (${token.value})`);
    });

    try {
        const ast = parser.parse(input);
        const { errors: semanticErrors, variablesStatus } = analyzeSemantics(ast);
        if (semanticErrors.length > 0) {
            console.error("Errores Semánticos encontrados:");
            semanticErrors.forEach(error => console.error(error));
        } else {
            console.log("Código correcto, no se encontraron errores semánticos.");
            interpret(ast); 
            const translatedCode = translate(ast);
            console.log("Translated JavaScript Code:\n", translatedCode);

        }
    } catch (error) {
        console.error("Error durante el análisis:", error.message);
    } finally {
        rl.close();
    }
});
