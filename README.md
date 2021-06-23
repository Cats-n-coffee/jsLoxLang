# JsLoxLang

This is my version of the Lox language from Crafting Interpreters in Javascript.

## Scanner / Lexer

Takes the code and splits it into tokens, that will then be given to the parser. 
It reads strings raw source code and does its job of creating tokens.
Like a finite automata(?) or DFA(?), it uses regular grammar. Recognizes the lexemes and matches them with tokens.

The user input is always added to the inputString, but only valid characters that deserve the lexer's attention
will be considered as tokens and created as such.

### JsLox class
1 - Main method: "directs" the given input: uses the array length to return an error, read or run the prompt.
  - runFile method: read the file, transforms the bytes to a string. Needed if we read code that's already written?
  - runPrompt method: takes input from standard input, transforms it to a buffer. Needed when we're typing?
    In a for loop, we print each line or break out of the loop if there is no line.
  - run method: scans each line to create tokens.
  - error and report methods: "handles" or display errors to the user with a line number and a message.

### Scanner class
- Gets the raw input and converts it to tokens.

### Token class
- Creates the actual tokens.

(
  DEFINITIONS:
  - Token: strings that describe what the input given is, or in which category this input belongs. (e.g: Identfier, Number, Operator,...).
  - Pattern: a rule that describes the token. (e.g: Identifier -> letter(letter.digit)*). Uses regex patterns?
  - Lexeme: sequence of characters that matches the pattern. (e.g: 60, runFile, runPrompt, +, ...)
)

## Parser

It uses context-free grammar. Context-free grammar matches rules, but does not care about what is around the given input ("context-free",
it does not care about the context).
In this parser we use recursive decent parsing (or top-down parsing), which goes throught the lowest precedence expressions first ->
treats the outermost expressions first then walks to the inside expressions (from big chunks to smallers chunks of code).
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
