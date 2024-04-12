import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { parse } from './logic/gramatica.js'; 
import { lex } from './logic/lexico.js';
import { analyzeSemantics } from './logic/semantica.js';
import { interpret } from './logic/interpreter.js';
import { translate } from './logic/translate.js';

function App() {
  const [cadena, setCadena] = useState('');
  const [resultado, setResultado] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [interpretacion, setInterpretacion] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [editor, setEditor] = useState(null);

  const editorDidMount = (editor, monaco) => {
    setEditor(editor);
  };
  const capturarConsoleLog = (funcionInterpretar) => {
    const originalConsoleLog = console.log;
    let logs = '';

    console.log = (...args) => {
      logs += args.join(' ') + '\n';
    };

    funcionInterpretar(); 

    console.log = originalConsoleLog; 

    return logs;
  };

  const analizarCadena = () => {
    const tokensGenerados = lex(cadena);
    setTokens(tokensGenerados);
  
    try {
      const ast = parse(cadena);
      const { errors: semanticErrors } = analyzeSemantics(ast);
  
      if (semanticErrors.length > 0) {
        const errorMessage = semanticErrors.join('\n');
        throw new Error(errorMessage);
      }
  
      // Ahora, usa el AST directamente en lugar de resultado.ast
      const logsDeInterpretacion = capturarConsoleLog(() => interpret(ast));
      setInterpretacion(logsDeInterpretacion);
  
      const codigoTraducido = translate(ast);
      setTraduccion(codigoTraducido);
  
      setResultado({
        success: true,
        message: 'Cadena válida',
        ast: ast 
      });
    } catch (error) {
      setResultado({
        success: false,
        message: `Error al analizar la cadena de texto: ${error.message}}`,
        ast: null
      });
      setInterpretacion('');
      setTraduccion('');
    }
  };
  

  const handleInputChange = value => {
    setCadena(value);
    setResultado(null);
    setTokens([]);
    setInterpretacion('');
    setTraduccion('');
  };


  return (
    <div>
      <div style={{ display: 'flex' }}>
        <MonacoEditor
          width="800"
          height="200"
          language="plaintext"
          theme="vs-dark"
          value={cadena}
          onChange={handleInputChange}
          editorDidMount={editorDidMount}
        />
        <div style={{ marginLeft: '20px' }}>
          <h3>Tokens Generados:</h3>
          <ul>
            {tokens.map((token, index) => (
              <li key={index}>{`${token.type} (${token.value})`}</li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={analizarCadena}>Analizar</button>
      {resultado && (
        <div>
          <p>{resultado.message}</p>
          {resultado.success && (
            <>
              <pre>{JSON.stringify(resultado.ast, null, 2)}</pre>
              <h3>Salida de la Interpretación:</h3>
              <pre>{interpretacion}</pre>
              <h3>Traducción a JavaScript:</h3>
              <pre>{traduccion}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
