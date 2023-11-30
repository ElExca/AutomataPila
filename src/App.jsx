import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

function App() {
  const [cadena, setCadena] = useState('');
  const [resultado, setResultado] = useState(null);
  const [pilaInfo, setPilaInfo] = useState([]);

  const analizarCadena = () => {
    const { esValida, infoPila } = analizadorSintactico(cadena);
    setResultado(esValida);
    setPilaInfo(infoPila);
  };

  const editorDidMount = (editor, monaco) => {
    // Puedes realizar acciones cuando el editor se monta
    console.log('Editor montado');
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
          onChange={setCadena}
          editorDidMount={editorDidMount}
        />
        <div style={{ marginLeft: '20px' }}>
          <h3>Información de Pila:</h3>
          <ul>
            {pilaInfo.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={analizarCadena}>Analizar</button>
      {resultado !== null && (
        <p>La cadena {cadena} es {resultado ? 'válida' : 'inválida'}.</p>
      )}
    </div>
  );
}

function analizadorSintactico(cadena) {
  let pila = ['$', 'S'];
  let apuntador = 0;
  let infoPila = [];

  const pushInfo = (X) => {
    infoPila.push(`Push: ${X}, Cadena: ${cadena.slice(apuntador)}`);
  };

  const popInfo = (X) => {
    infoPila.push(`Pop: ${X}, Cadena: ${cadena.slice(apuntador)}`);
  };

  while (pila.length > 0) {
    const X = pila.pop();

    if (!X) {
      break;
    }

    const a = cadena[apuntador];

    if (X === '$') {
      infoPila.push('Analisis completado.');
      break;
    }

    if (X === a) {
      apuntador++;
    } else if (esNoTerminal(X)) {
      const produccion = obtenerProduccion(X, a);

      if (produccion) {
        pushInfo(X);
        if (produccion[0] !== 'ε') {
          for (let i = produccion.length - 1; i >= 0; i--) {
            pila.push(produccion[i]);
          }
        }
      } else {
        infoPila.push(`Error: No se pudo encontrar una producción válida para ${X}.`);
        return { esValida: false, infoPila };
      }
    } else {
      popInfo(X);
      return { esValida: false, infoPila };
    }
  }

  return { esValida: apuntador === cadena.length, infoPila };
}

function esNoTerminal(simbolo) {
  return /[A-Z]/.test(simbolo);
}
function obtenerProduccion(noTerminal, siguiente) {
  switch (noTerminal) {
    case 'VAR':
      return ['L', 'D1'];
    case 'D1':
      return ['ML', 'D2'];
    case 'D2':
      return ['DP', 'D3'];
    case 'D3':
      return ['D', 'MD'];
    case 'MD':
      return /[0-9]/.test(siguiente) ? ['D', 'MD'] : ['ε'];
    case 'ML':
      return /[a-z]/.test(siguiente) ? ['L', 'ML'] : ['ε'];
    case 'D':
      return /[0-9]/.test(siguiente) ? [siguiente] : null;
    case 'L':
      return /[a-z]/.test(siguiente) ? [siguiente] : null;
    case 'DP':
      return [':'];
      case 'S':
        return ['PF', 'C1'];
      case 'PF':
        return ['F'];
      case 'C1':
        return ['PC', 'C2'];
      case 'PC':
        return ['C'];
      case 'C2':
        return ['PN', 'C3'];
      case 'PN':
        return ['N'];
      case 'C3':
        return ['GB', 'C4'];
      case 'GB':
        return ['_'];
      case 'C4':
        return ['L', 'C5'];
      case 'C5':
        return ['ML', 'C6'];
      case 'C6':
        return ['PI', 'C7'];
      case 'PI':
        return ['('];
      case 'C7':
        return ['L', 'C8'];
      case 'C8':
        return ['ML', 'C9'];
        case 'C9':
          if (siguiente === ')') {
            // Si lo que sigue es un paréntesis, haga ['PFF', 'C11']
            return ['PFF', 'C11'];
          } else if (siguiente === ',') {
            // Si lo que sigue es una coma, haga ['CM', 'C10']
            return ['CM', 'C10', ];
          } else {
            // Puedes ajustar según la lógica específica que necesites para otros casos
            return null;
          }
      case 'CM':
        return [',']    
      case 'C10':
        return ['L', 'C14'];
      case 'C14':
        return ['ML', 'C9']
      case 'C11':
        return ['CA', 'C12'];
      case 'CA':
        return ['['];
      case 'PFF':
        return[')']
        case 'C12':
          if (siguiente === ']') {
            return ['VAR', 'C13'];
          } else if (siguiente === 'i') {
            return ['IF'];
          } else if (siguiente === 'f'){
            return ['FOR']
            }
            else{// Agrega cualquier otra lógica necesaria según tu gramática
            return null;
          }
          case 'C13':
            if (siguiente === ']') {
              return [']'];
            } else {
              return null; // Puedes ajustar según la lógica específica que necesites para C13
            }
        case 'IF':
          return ['PRI', 'A1'];
        case 'PRI':
          return ['i'];
        case 'A1':
          return ['PRF', 'A2'];
        case 'PRF':
          return ['f'];
        case 'A2':
          return ['L', 'A3'];
        case 'A3':
          return ['ML', 'A4'];
        case 'A4':
          return ['O', 'A5'];
    case 'O':
      if (siguiente === '==' || siguiente === '>' || siguiente === '<' ||
          siguiente === '>=' || siguiente === '<=') {
        return [siguiente];
      } else {
        return null; // Si no coincide con ninguno de los operadores permitidos
      }
      case 'A5':
        if (/^\d+$/.test(siguiente)) {
          // Si lo que sigue es un número, haga ['D', 'A6']
          return ['D', 'A6'];
        } else if (/^[a-zA-Z]$/.test(siguiente)) {
          // Si lo que sigue es una letra, haga ['OV', 'A7']
          return ['OV', 'A7'];
        } else {
          // Puedes ajustar según la lógica específica que necesites para otros casos
          return null;
        }
        case 'A6':
          return ['MD', 'A7'];
        case 'A7':
          return ['PI', 'A8'];
        case 'A8':
          return ['FOR', 'A9'];
        case 'A9':
          return [')','C13'];
        case 'OV':
          return ['L','ML'];
      case 'FOR':
        return ['PFOR', 'B1']
      case 'PFOR':
        return ['f']
      case 'B1':
        return ['PFOR1', 'B2']
      case 'PFOR1':
        return ['o']
      case 'B2':
        return ['PFOR2', 'B3']
      case 'PFOR2':
        return ['r']
        case 'B3':
          if (/[a-z]/i.test(siguiente)) {
            return ['L', 'B4'];
          } else if (/\d/.test(siguiente)) {
            return ['D', 'B14'];
          } else {
            return null;
          }        
      case 'B4':
        return ['ML', 'B5']
      case 'B5':
        return ['DP', 'B6']
      case  'B6':
  if (/[a-z]/i.test(siguiente)) {
    return ['L', 'B7'];
  } else if (/\d/.test(siguiente)) {
    return ['D', 'B13'];
  } else {
    return null;
  }
      case 'B7':
        return ['ML', 'B8']
      case 'B8':
        return ['DP', 'B9']
        case 'B9':
          if (siguiente === '+') {
            return ['IDP', 'B15'];
          } else if (siguiente === '-') {
            return ['IDM', 'B16'];
          } else {
            return null;
          }
      case 'B10':
        return ['LA', 'B11']
      case 'LA':
        return ['{']
      case 'B11':
        return ['VAR', 'B12']
      case 'B12':
        return ['}']
      case 'B13':
        return ['MD' ,'B8']
      case 'B14':
        return ['MD', 'B5']
        case 'IDP':
          return ['+']
        
        case 'IDM':
          return ['-']
        
        case 'B15':
            return ['IDP1', 'B10'];
        
        case 'IDP1':
            return ['+'];
        
        case 'B16':
            return ['IDM1', 'B10'];
        case 'IDM1':
            return ['-'];
        
      default:
        return null;
    }
  }


export default App;

