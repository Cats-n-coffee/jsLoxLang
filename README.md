# JsLoxLang

This is my version of the Lox language from Crafting Interpreters in Javascript.
I wrote most of my notes in this ReadMe, so this ReadMe shows what I understand from writing this interpreter, some definitions, some important notes from the author of Crafting Inpreters about the way certains parts are implemented, as well as useful notes on how I implemented it in Js.

## JsLox class - Entry file
  - Main method: "directs" the given input: uses the array length to return an error, read or run the prompt.
  - runFile method: read the file, transforms the bytes to a string. Needed if we read code that's already written?
  - runPrompt method: takes input from standard input, transforms it to a buffer. Needed when we're typing?
    In a for loop, we print each line or break out of the loop if there is no line.
  - run method: scans each line to create tokens.
  - error and report methods: "handles" or display errors to the user with a line number and a message.

## Scanner / Lexer

Takes the code and splits it into tokens, that will then be given to the parser. 
It reads strings raw source code and does its job of creating tokens.
Like a finite automata or DFA, it uses regular grammar. Recognizes the lexemes and matches them with tokens. 
So, like a DFA, it will either accept the lexeme (recognize it and create a token), or it will reject it.

The user input is always added to the inputString, but only valid characters that deserve the lexer's attention will be considered as tokens and created as such.

### Scanner class
- Gets the raw input and converts it to tokens.

### Token class
- Creates the actual tokens.

---
  DEFINITIONS:
  - Token: strings that describe what the input given is, or in which category this input belongs. (e.g: Identfier, Number, Operator,...).
  - Pattern: a rule that describes the token. (e.g: Identifier -> letter(letter.digit)*). Uses regex patterns?
  - Lexeme: sequence of characters that matches the pattern. (e.g: 60, runFile, runPrompt, +, ...)
---

## Parser

The parser creates the AST.
It uses context-free grammar. Context-free grammar matches rules of the grammar, but does not care about what is around the given input ("context-free",it does not care about the context).
In this parser we use recursive decent parsing (or top-down parsing), which goes throught the lowest precedence expressions first -> treats the outermost expressions first then walks to the inside expressions (from big chunks to smallers chunks of code).
"Recursive", because even finding a non-terminal grammar rule, it calls itself, hence recursive.

### Navigating through the tokens in the parser

There are a lot of helper methods to navigate and check where we are in the token array:
  - advance : always checks if we have reached the last token, if we have not reached it -> move on to the next.
  - previous: goes back to the previous token.
  - peek: reads the current token.
  - isAtEnd: checks the type of the token to be EOF, which is the closing token. It means we have reached the end of the array.
  - check: checks the type of the current token, to be the same as the type passed in the argument.
Each method return true/false or a token (previous or current). The advance method increments the current index.

## AST (Abstract Syntax Tree)

The AST shows the relationship between the tokens.
For this AST in Js, the simplest way for me to create the syntax tree (the way my brain understood it), was to create an object that holds functions. Each function returns an object with the type of expression, the value and/or other useful information such as the operator.
So if we print the tree, it would look like an object with nested objects.

## Evaluating Expressions

1. What kind of values do we produce?
2. How do we organize those chunks of code?

In this part, we create the interpreter.
Each blob of code holds evaluation logic for each kind of expression we can parse. It uses the syntax tree we made with the parser and `ast.js` file (which returns an object with nested objects).
The main function in this class is the `interpret()` method, and is called from `jsLoxLang.js`. 
The `interpret()` method checks if the expression is undefined, throws an error if it is, or calls the `evaluate()` method.
The `evaluate()` method "directs traffic" by checking the type of expression it encounters. In its switch statement, it calls the appropriate method that will perform the operation (*binary*: addition, subtraction, comparison ..., *literal*: returns the value, *unary*: inverts true/false, negates a value, or *grouping*: unpacks)

## Statements and State

### Statements
Statements will wrap expressions, so in the interpreter the main `interpret()` method will create a statement. 
This statement can be a print statement (stdout), or an expression statement (at the start of chapter 8).
Statements are part of the syntax tree and get their own nodes. Because they have their own type in the AST, we can add them to the `evaluate()` method inside the switch. They will be checked and directed to the correct method.

### Global variables
Variable declarations go on the same level as statements.
So from the top level (program), declarations can be: variable declaration or statements (statements can be expression or print statements).
They have their own node in the AST.
Inside the parser, we look for the `var` keyword, , a variable name, and then for the  `=`  token (and handle errors anywhere in between). The AST node for the **IDENTIFIER** will be created/returned inside the `primary()` method. 

### Environment
We need to bind the variable and its value. The easiest way is to create key-value pairs. 
We create an instance of the Environment class when the Interpreter is used. This instance will be stored outside of the Interpreter class and is the **global scope**.<br>
For block scope, a new instance is created (when the block method fires) and the **current** environment (`this.env`) is passed to the constructor. Results an object with nested objects, inside nested objects.

### Assignment
In the parser, we will call in `expression()` the assignment method, that will run the expression to check left and right side. It looks for an equal sign, checks if the type of expression is `variableExpr`, and perform the change for `assignExpr` type.<br>
In the environment, to assign a value, we *recursively* look for the correct variable name, starting at the current level (current environment), and going outside to the previous environment(s) until we find it.

### Read the environment
Like the previous paragraph Assignment, we read the environment and retrieve values by recursively looking at the current environment and its parents, until we find the variable we are looking for.

### Scope
The scope is created from `{}` (or blocks). Once the `blockStmt` node is created, the interpreter will create a new instance of the Environment class once the `getBlockStmt()` function is fired.  

## Control Flow

This portion added multiple nodes to the AST after parsing.<br>
Logical operators, if/else and while statements each have their own AST node. The 'for loop', kept minimal and simple, does not have an AST node. It only gets its own method in the parser after the `FOR` token has been parsed. <br>
The `forStatement` method handles building the AST with that are already present: <br>
- initializer: creates a variable or an expression
- condition: should be an expression (to be evaluated)
- increment: should be an expression (variable gets assigned to a new value, performs an evaluation)
- body: should be a statement, later assigned to a while loop that will evaluate the condition and the body previously made.