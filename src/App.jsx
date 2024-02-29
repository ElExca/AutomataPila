import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as grammar from "../Gramatica";
import { lex } from "./Tokens/tokens.js";

function App() {
  const [cadena, setCadena] = useState('');
  const [resultado, setResultado] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [editor, setEditor] = useState(null);

  const analizarCadena = () => {
    const tokensGenerados = lex(cadena);
    setTokens(tokensGenerados);

    try {
      const result = grammar.parse(cadena);
      setResultado({
        success: true,
        message: 'Cadena válida',
        result: result
      });
    } catch (error) {
      setResultado({
        success: false,
        message: `Error al analizar la cadena de texto: ${error.message}`
      });
    }
  };

  const editorDidMount = (editor, monaco) => {
    setEditor(editor);
  };

  const handleInputChange = value => {
    setCadena(value);
    setResultado(null);
    setTokens([]);
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
            <pre>{JSON.stringify(resultado.result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
