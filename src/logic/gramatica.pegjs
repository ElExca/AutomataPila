Start
  = Program

Program
  = Statement*

Statement
  = Function

Content
  = Declaration
  / Print
  / If
  / For

For
  = ForVarDig
  / ForVarVar
  / ForDigDig

If
  = IfVarDig
  / IfVarVar
  / IfDigDig

Declaration
  = decl:IntVarDecl _ { 
      return {
        type: "Declaration",
        variables: [decl]
      };
    }

IntVarDecl
  = id:Identifier _ ":" _ val:Integer {
      return { identifier: id, value: val, initialized: true };
    }

Function
  = "FCN_" id:Identifier _ "(" _ ")" _ "[" _ body:Content+ _ "]" _ {
      return {
        type: "Function",
        identifier: id,
        body: body
      };
    }

Identifier
  = [a-zA-Z][a-zA-Z]* { return text(); }

Integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "whitespace"
  = [ \t\n\r]*

Print
  = "("_ message:Message _").print" _ {
      return {
        type: "Print",
        message: message
      };
    }

Message
  = '"' chars:([^"]*) '"' { return chars.join(""); }

IfVarDig
  = "if" _ variable:Identifier _ operator:ComparisonOperator _ value:Integer _ "(" _ body:Print+ _ ")" _ {
      return {
        type: "IfVarDig",
        variable: variable,
        operator: operator,
        value: value,
        body: body
      };
    }

IfVarVar
  = "if" _ variable1:Identifier _ operator:ComparisonOperator _ variable2:Identifier _ "(" _ body:Print+ _ ")" _ {
      return {
        type: "IfVarVar",
        variable1: variable1,
        variable2: variable2,
        operator: operator,
        body: body
      };
    }

IfDigDig
  = "if" _ value1:Integer _ operator:ComparisonOperator _ value2:Integer _ "(" _ body:Print+ _ ")" _ {
      return {
        type: "IfDigDig",
        value1: value1,
        operator: operator,
        value2: value2,
        body: body
      };
    }

ComparisonOperator
  = "<=" { return "<="; }
  / ">=" { return ">="; }
  / "=<" { return "<="; } 
  / "=>" { return ">="; } 
  / "===" { return "==="; }
  / "<" { return "<"; }
  / ">" { return ">"; }

ForVarDig
  = "for" _ variable:Identifier _ ":" _  value:Integer _ ":" _ counter:Counter _ "{" _ body:Print+ _ "}" _ {
      return {
        type: "ForVarDig",
        variable: variable,
        value: value,
        counter: counter,
        body: body
      };
    }

ForVarVar
  = "for" _ variable1:Identifier _ ":" _ variable2:Identifier _ ":" _ counter:Counter _ "{" _ body:Print+ _ "}" _ {
      return {
        type: "ForVarVar",
        variable1: variable1,
        variable2: variable2,
        counter: counter,
        body: body
      };
    }

ForDigDig
  = "for" _ value1:Integer _ ":" _ value2:Integer _ ":" _ counter:Counter _ "{" _ body:Print+ _ "}" _ {
      return {
        type: " ForDigDig",
        value1: value1,
        value2: value2,
        counter: counter,
        body: body
      };
    }

Counter
  = "++" { return "++"; }
  / "--" { return "--"; }