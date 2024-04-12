function translate(ast) {
    return ast.map(node => translateStatement(node)).join('\n');
}

function translateStatement(statement) {
    switch (statement.type) {
        case 'Function':
            return translateFunction(statement);
        case 'Declaration':
            return translateDeclaration(statement);
        case 'Print':
            return translatePrint(statement);
        case 'IfVarDig':
        case 'IfVarVar':
        case 'IfDigDig':
            return translateIf(statement);
        case 'ForVarDig':
        case 'ForVarVar':
        case 'ForDigDig':
            return translateFor(statement);
        default:
            return `// Tipo de sentencia no reconocido: ${statement.type}`;
    }
}

function translateFunction(func) {
    return `function ${func.identifier}() {\n${func.body.map(translateStatement).join('\n')}\n}`;
}

function translateDeclaration(declaration) {
    return declaration.variables.map(varDecl => `let ${varDecl.identifier} = ${varDecl.value};`).join('\n');
}

function translatePrint(print) {
    return `console.log("${print.message}");`;
}

function translateIf(ifStmt) {
    const condition = translateCondition(ifStmt);
    return `if (${condition}) {\n${ifStmt.body.map(translateStatement).join('\n')}\n}`;
}

function translateCondition(ifStmt) {
    switch (ifStmt.type) {
        case 'IfVarDig':
            return `${ifStmt.variable} ${ifStmt.operator} ${ifStmt.value}`;
        case 'IfVarVar':
            return `${ifStmt.variable1} ${ifStmt.operator} ${ifStmt.variable2}`;
        case 'IfDigDig':
            return `${ifStmt.value1} ${ifStmt.operator} ${ifStmt.value2}`;
    }
}

function translateFor(forStmt) {
    const setup = translateForSetup(forStmt);
    const condition = translateForCondition(forStmt);
    const increment = translateForIncrement(forStmt);
    return `for (${setup}; ${condition}; ${increment}) {\n${forStmt.body.map(translateStatement).join('\n')}\n}`;
}

function translateForSetup(forStmt) {
    switch (forStmt.type) {
        case 'ForVarDig':
            return `let ${forStmt.variable} = 0`;
        case 'ForVarVar':
            return `let ${forStmt.variable1} = ${forStmt.variable2}`;
        case 'ForDigDig':
            return `let i = ${forStmt.value1}`;
    }
}

function translateForCondition(forStmt) {
    switch (forStmt.type) {
        case 'ForVarDig':
            return `${forStmt.variable} <= ${forStmt.value}`;
        case 'ForVarVar':
            return `${forStmt.variable1} <= ${forStmt.variable2}`;
        case 'ForDigDig':
            return `i <= ${forStmt.value2}`;
    }
}

function translateForIncrement(forStmt) {
    switch (forStmt.type) {
        case 'ForVarDig':
        case 'ForVarVar':
            return `${forStmt.variable1} ${forStmt.counter}`;
        case 'ForDigDig':
            return `i ${forStmt.counter}`;
    }
}

export { translate };