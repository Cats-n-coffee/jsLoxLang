# JsLoxLang

This is my version of the Lox language from Crafting Interpreters. My version is in Javascript.

## Scanner / Lexer

Takes the code and splits it into tokens, that will then be given to the parser. 
It reads strings raw source code and does its job of creating tokens.

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