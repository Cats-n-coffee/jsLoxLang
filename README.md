# JsLoxLang

This is my version of the Lox language from Crafting Interpreters. My version is in Javascript.

## Scanner / Lexer

Takes the code and splits it into tokens, that will then be given to the parser. 
It reads strings raw source code and does its job of creating tokens.
- Main method: "directs" the given input: uses the array length to return an error, read or run the prompt.
- runFile method: read the file, transforms the bytes to a string. Needed if we read code that's already written?
- runPrompt method: takes input from standard input, transforms it to a buffer. Needed when we're typing?
  In a for loop, we print each line or break out of the loop if there is no line.
- run method: scans each line to create tokens.