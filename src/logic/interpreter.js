function interpret(ast) {
    const context = {
        variables: new Map(),  
        functions: new Map()  
    };

    ast.forEach(node => {
        if (node.type === 'Function') {
            context.functions.set(node.identifier, node.body);
        }
    });

    ast.forEach(node => {
        if (node.type === 'Function') {
            executeFunction(node, context);
        }
    });
}

function executeFunction(funcNode, context) {
    console.log(`Ejecutando función: ${funcNode.identifier}`);
    funcNode.body.forEach(statement => {
        executeStatement(statement, context);
    });
}

function executeStatement(statement, context) {
    switch (statement.type) {
        case 'Declaration':
            executeDeclaration(statement, context);
            break;
        case 'Print':
            executePrint(statement, context);
            break;
        case 'IfVarDig':
        case 'IfVarVar':
        case 'IfDigDig':
            executeIf(statement, context);
            break;
        case 'ForVarDig':
        case 'ForVarVar':
        case 'ForDigDig':
            executeFor(statement, context);
            break;
        default:
            console.log("Tipo de sentencia no reconocido:", statement.type);
    }
}

function executeDeclaration(declaration, context) {
    declaration.variables.forEach(varDecl => {
        if (!context.variables.has(varDecl.identifier)) {
            context.variables.set(varDecl.identifier, varDecl.value);
            console.log(`Variable declarada: ${varDecl.identifier} = ${varDecl.value}`);
        } else {
            console.error(`Error: Variable duplicada ${varDecl.identifier}`);
        }
    });
}

function executePrint(printStmt, context) {
    const message = printStmt.message;
    console.log("Impresión:", message);
}

function executeIf(ifStmt, context) {
    let condition = evaluateCondition(ifStmt, context);
    if (condition) {
        console.log(`Condición verdadera, ejecutando bloque if.`);
        ifStmt.body.forEach(statement => {
            executeStatement(statement, context);
        });
    } else {
        console.log(`Condición falsa, omitiendo bloque if.`);
    }
}

function evaluateCondition(ifStmt, context) {
    switch (ifStmt.type) {
        case 'IfVarDig':
            let varValue = context.variables.get(ifStmt.variable);
            return compare(varValue, ifStmt.operator, ifStmt.value);
        case 'IfVarVar':
            let varValue1 = context.variables.get(ifStmt.variable1);
            let varValue2 = context.variables.get(ifStmt.variable2);
            return compare(varValue1, ifStmt.operator, varValue2);
        case 'IfDigDig':
            return compare(ifStmt.value1, ifStmt.operator, ifStmt.value2);
        default:
            throw new Error("Tipo de condición desconocido");
    }
}

function compare(left, operator, right) {
    switch (operator) {
        case '<=':
            return left <= right;
        case '>=':
            return left >= right;
        case '=<':
            return left <= right;
        case '=>':
            return left >= right;
        case '===':
            return left === right;
        case '<':
            return left < right;
        case '>':
            return left > right;
        default:
            throw new Error(`Operador desconocido: ${operator}`);
    }
}

function executeFor(forStmt, context) {
    switch (forStmt.type) {
        case 'ForVarDig':
            forVarDig(forStmt, context);
            break;
        case 'ForVarVar':
            forVarVar(forStmt, context);
            break;
        case 'ForDigDig':
            forDigDig(forStmt, context);
            break;
    }
}

function forVarDig(forStmt, context) {
    const start = context.variables.get(forStmt.variable) || 0; 
    const end = forStmt.value;
    const step = (forStmt.counter === '++' ? 1 : -1);

    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
        context.variables.set(forStmt.variable, i);
        forStmt.body.forEach(statement => executeStatement(statement, context));
    }
}

function forVarVar(forStmt, context) {
    if (forStmt.variable1 === forStmt.variable2) {
        console.error(`Error: Bucle 'for' no puede usar la misma variable para inicio y fin.`);
        return;
    }
    const start = context.variables.get(forStmt.variable1);
    const end = context.variables.get(forStmt.variable2);
    const step = (forStmt.counter === '++' ? 1 : -1);

    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
        context.variables.set(forStmt.variable1, i);
        forStmt.body.forEach(statement => executeStatement(statement, context));
    }
}

function forDigDig(forStmt, context) {
    const start = forStmt.value1;
    const end = forStmt.value2;
    const step = (forStmt.counter === '++' ? 1 : -1);

    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
        forStmt.body.forEach(statement => executeStatement(statement, context));
    }
}

export { interpret };