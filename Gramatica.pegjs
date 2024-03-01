Start
    = Program


Program
    = Statement*

Statement
= Function


Content 
    = IF
    /FOR
    /contenido

contenido
= _ "contenido" _

Function
    = "FCN_"_ Identifier _"("_ Parametros?_ ")"_ "["_ Content _ "]"

IF
    = "if" _ condition _ "(" _ Content _ ")"

FOR
    = "for"  _ bucle _ "{" _ Content _ "}"

Parametros = _ Identifier ( _ "," _ Identifier _ )*

Identifier
    = [a-zA-Z] [a-zA-Z]*

Increment
    = "++"
Decrement
    = "--"

Operator
  = "<"
  / ">"
  / "<="
  / ">="
  / "=<"
  / "=>"
  / "==="

condition
    = Identifier _ Operator _ Digit
    / Digit _ Operator _ Digit
    / Identifier _ Operator _ Identifier


bucle
    = Identifier _ ":" _ Identifier _ ":" _ Increment
    / Identifier _ ":" _ Digit _ ":" _ Increment
    / Digit _ ":" _ Digit _ ":" _ Increment
    / Identifier _ ":" _ Identifier _ ":" _ Decrement
    / Identifier _ ":" _ Digit _ ":" _ Decrement
    / Digit _ ":" _ Digit _ ":" _ Decrement

Digit
     = [0-9]+ { return parseInt(text(""), 10); }



_ "espacio" = [ \t\n\r]* { return null; }