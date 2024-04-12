function analyzeSemantics(ast) {
    let errors = [];
    let functionsStatus = new Map();

    ast.forEach(statement => {
        if (statement.type === "Function") {
            const functionName = statement.identifier;
            let localVariablesStatus = new Map();

            if (functionsStatus.has(functionName)) {
                errors.push(`Error Semántico: Nombre de función duplicado '${functionName}'`);
            } else {
                functionsStatus.set(functionName, { variables: localVariablesStatus });

                statement.body.forEach(content => {
                    if (content.type === "Declaration") {
                        content.variables.forEach(varDecl => {
                            const variable = varDecl.identifier;
                            if (localVariablesStatus.has(variable)) {
                                errors.push(`Error Semántico: Variable duplicada '${variable}' dentro de la función ${functionName}`);
                            } else {
                                localVariablesStatus.set(variable, {
                                    initialized: varDecl.initialized,
                                    read: false,
                                    type: content.type.replace("Declaration", "").toLowerCase()
                                });
                            }
                        });
                    } else if (content.type === "IfVarDig" || content.type === "ForVarDig" ) {
                        verifyVariableDeclared(content.variable, localVariablesStatus, errors, functionName, content.type);
                    } else if (content.type === "IfVarVar"|| content.type === "ForVarVar") {
                        verifyVariableDeclared(content.variable1, localVariablesStatus, errors, functionName, content.type);
                        verifyVariableDeclared(content.variable2, localVariablesStatus, errors, functionName, content.type);
                        
                        if (content.type === "ForVarVar" && content.variable1 === content.variable2) {
                            errors.push(`Error Semántico: Uso de la misma variable '${content.variable1}' como contador y límite en el bucle 'for' en la función ${functionName}`);
                        }
                    }
                });
            }
        }
    });

    return { errors, variablesStatus: new Map() }; 
}

function verifyVariableDeclared(variable, localVariablesStatus, errors, functionName, contentType) {
    if (!localVariablesStatus.has(variable)) {
        errors.push(`Error Semántico: Intento de usar la variable no declarada '${variable}' en '${contentType}' en la función ${functionName}`);
    } else {
        let varStatus = localVariablesStatus.get(variable);
        varStatus.read = true; // Marca que la variable fue leída.
    }
}


export { analyzeSemantics };
