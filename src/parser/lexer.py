from enum import Enum, auto
import re

from ..utils.errors import Error

isEOF = lambda string : string == "\0"
isNum = lambda string : bool(re.compile("^[0-9]+$").search(string))
isValidNum = lambda string : bool(re.compile("^\d+(\.\d)?\d*$").search(string))

class Token:
    def __init__(self, value, type, line, col):
        self.value = value
        self.type = type
        self.location = [ line, col ] 

    def __repr__(self):
        return f"Token({self.value}, {self.type}, {self.location})"

class TokenType(Enum):
        # Single character tokens
        OpenParen      = auto(), # Done
        CloseParen     = auto(), # Done
        Comma          = auto(), # Done
        Dot            = auto(), # Done
        Minus          = auto(), # Done
        Plus           = auto(), # Done
        Slash          = auto(), # Done

        # Literals
        Integer        = auto(), # Done
        Float          = auto(), # Done
        Identifier     = auto(), # Done
        L_String       = auto(), # Done

        # One or two character tokens
        Star           = auto(), # Done
        Mod            = auto(), # Done
        Amp            = auto(), # Done
        DoubleColon    = auto(), # Done
        Arrow          = auto(), # Done
        And            = auto(), # Done
        Or             = auto(), # Done
        Not            = auto(), # Done
        NotEqual       = auto(), # Done
        Equal          = auto(), # Done
        EqualEqual     = auto(), # Done
        Greater        = auto(), # Done
        GreaterEqual   = auto(), # Done
        Less           = auto(), # Done
        LessEqual      = auto(), # Done
        
        # Keywords
        OpenEnd        = auto(), # TODO: how am I supposed to lex this? 
        CloseEnd       = auto(), # Done

        If,            = auto(), # Done
        Else,          = auto(), # Done
        BTrue          = auto(), # Done
        BFalse         = auto(), # Done
        Method         = auto(), # Done
        Extern         = auto(), # Done
        For            = auto(), # Done
        Null           = auto(), # Done
        Print          = auto(), # Done
        Return         = auto(), # Done
        While          = auto(), # Done
        Const          = auto(), # Done
        Let            = auto(), # Done
        
        # Datatypes
        Void           = auto(), # Done

        Int8           = auto(), # Done
        Uint8          = auto(), # Done

        Int16          = auto(), # Done
        Uint16         = auto(), # Done

        Int32          = auto(), # Done
        Uint32         = auto(), # Done

        Int64          = auto(), # Done
        Uint64         = auto(), # Done
    
        Float32        = auto(), # Done
        Float64        = auto(), # Done

        Bool           = auto(), # Done
        String         = auto(), # Done

        # Special
        EOF            = auto()  # Done

        def __repr__(self):
            return f"<{self.name}.{self.value}>"

Keywords = {
    "void": TokenType.Void,

    "i8": TokenType.Int8,
    "u8": TokenType.Uint8,

    "i16": TokenType.Int16,
    "u16": TokenType.Uint16,

    "i32": TokenType.Int32,
    "u32": TokenType.Uint32,

    "i64": TokenType.Int64,
    "u64": TokenType.Uint64,
        
    "f32": TokenType.Float32,
    "f64": TokenType.Float64,

    "bool": TokenType.Bool,
    "string": TokenType.String,
    
    "end": TokenType.CloseEnd,
    "if": TokenType.If,
    "else": TokenType.Else,
    "true": TokenType.BTrue,
    "false": TokenType.BFalse,
    "extern": TokenType.Extern,
    "method": TokenType.Method,
    "for": TokenType.For,
    "null": TokenType.Null,
    "print": TokenType.Print,
    "return": TokenType.Return,
    "while": TokenType.While,
    "const": TokenType.Const,
    "let": TokenType.Let
}

class Lexer:
    def __init__(self, path, source):
        self.path = path
        self.source = str(source)
        self.buffer = list(self.source)
        self.buffer.append(" ")
        self.buffer.append("\0") # EOF
        self.tokens = []

        # location
        self.line = 1
        self.col = 1

        self.spaces = ["\r", " ", "\t"]
        self.strings = ["'", '"']
    
    def loc_cpy(self):
        return { "line": self.line, "col": self.col }

    def advance(self):
        if self.buffer[0] == "\n":
            self.line += 1
            self.col = 1
            return self.buffer.pop(0)
        elif isEOF(self.buffer[0]):
            self.buffer.pop(0)
            return self.tokens.append(Token("EOF", TokenType["EOF"], self.line, self.col)) 
        else:
            self.col += 1
            return self.buffer.pop(0)
        
    def eat_whitespaces(self):
        while self.buffer[0] in self.spaces and not isEOF(self.buffer[0]):
            self.advance()

    def make_string(self):
        loc = self.loc_cpy()
        delim = self.advance()
        string_content = "" 
        while not isEOF(self.buffer[0]) and self.buffer[0] != delim:
            string_content += self.advance()

        if self.buffer[0] == delim: self.advance()
        
        if isEOF(self.buffer[0]):
            Error(self.path, loc["line"], loc["col"], "Unexpected EOF", "Expected end of string literal but found end of file.")

        self.tokens.append(Token(f"{delim}{string_content}{delim}", TokenType["L_String"], loc["line"], loc["col"]))

    def make_number(self):
        loc = self.loc_cpy()
        number = ""
        
        while isNum(self.buffer[0]) or self.buffer[0] == ".":
            number += self.advance()
        
        if not isValidNum(number): Error(self.path, loc["line"], loc["col"], "Invalid number", "Invalid number found:", number)

        if "." in number:
            self.tokens.append(Token(number, TokenType["Float"], loc["line"], loc["col"]))
        else:
            self.tokens.append(Token(number, TokenType["Integer"], loc["line"], loc["col"]))

    def make_identifier(self):
        loc = self.loc_cpy()
        ident = ""

        while not isEOF(self.buffer[0]) and self.buffer[0].isalnum():
            ident += self.advance()
        
        reserved = Keywords.get(ident)
        if reserved is None:
            self.tokens.append(Token(ident, TokenType["Identifier"], loc["line"], loc["col"]))
        else:
            self.tokens.append(Token(ident, reserved, loc["line"], loc["col"]))

    def lex(self):
        while len(self.buffer) > 0:
            # Newline
            if self.buffer[0] == "\n":
                self.advance()
            # Spaces    
            elif self.buffer[0] in self.spaces:
                self.eat_whitespaces()
            # OpenParen
            elif self.buffer[0] == "(":
                loc = self.loc_cpy()
                self.tokens.append(Token(self.advance(), TokenType["OpenParen"], loc["line"], loc["col"]))
            # CloseParen
            elif self.buffer[0] == ")":
                loc = self.loc_cpy()
                self.tokens.append(Token(self.advance(), TokenType["CloseParen"], loc["line"], loc["col"]))
            # Dot
            elif self.buffer[0] == ".":
                loc = self.loc_cpy()
                self.tokens.append(Token(self.advance(), TokenType["Dot"], loc["line"], loc["col"]))
            # Comma
            elif self.buffer[0] == ",":
                loc = self.loc_cpy()
                self.tokens.append(Token(self.advance(), TokenType["Comma"], loc["line"], loc["col"]))
            # Minus
            elif self.buffer[0] == "-":
                loc = self.loc_cpy()
                self.advance()
                # Arrow
                if self.buffer[0] == ">":
                    self.advance()
                    self.tokens.append(Token("->", TokenType["Arrow"], loc["line"], loc["col"]))
                else:
                    self.tokens.append(Token("-", TokenType["Minus"], loc["line"], loc["col"]))
            # Plus
            elif self.buffer[0] == "+":
                loc = self.loc_cpy()
                self.tokens.append(Token(self.advance(), TokenType["Plus"], loc["line"], loc["col"]))
            # Equal
            elif self.buffer[0] == "=":
                loc = self.loc_cpy()
                self.advance()
                # Equal Equal
                if self.buffer[0] == "=":
                    self.advance()
                    self.tokens.append(Token("==", TokenType["EqualEqual"], loc["line"], loc["col"]))
                else:  
                    self.tokens.append(Token("=", TokenType["Equal"], loc["line"], loc["col"]))
            elif self.buffer[0] == "!":
                loc = self.loc_cpy()
                self.advance()
                # Not Equal
                if self.buffer[0] == "=":
                    self.advance()
                    self.tokens.append(Token("!=", TokenType["NotEqual"], loc["line"], loc["col"]))
                else:
                    self.tokens.append(Token("!", TokenType["Not"], loc["line"], loc["col"]))
            elif self.buffer[0] == "<":
                loc = self.loc_cpy()
                self.advance()
                # Less Equal
                if self.buffer[0] == "=":
                    self.advance()
                    self.tokens.append(Token("<=", TokenType["LessEqual"], loc["line"], loc["col"]))
                # Less
                else:
                    self.tokens.append(Token("<", TokenType["Less"], loc["line"], loc["col"]))
            elif self.buffer[0] == ">":
                loc = self.loc_cpy()
                self.advance()
                # Greater Equal
                if self.buffer[0] == "=":
                    self.advance()
                    self.tokens.append(Token(">=", TokenType["GreaterEqual"], loc["line"], loc["col"]))
                else:
                    self.tokens.append(Token(">", TokenType["Greater"], loc["line"], loc["col"]))
            elif self.buffer[0] == "/":
                loc = self.loc_cpy()
                self.advance()
                # Single line comment
                if self.buffer[0] == "/":
                    self.advance()
                    while self.buffer[0] != "\n" and not isEOF(self.buffer[0]):
                        self.advance()
                # Multi line comment
                elif self.buffer[0] == "*":
                    self.advance()
                    while ((not isEOF(self.buffer[0])) and (self.buffer[0] != "*" and self.buffer[1] != "/")):
                        self.advance()

                    if isEOF(self.buffer[0]):
                        Error(self.path, loc["line"], loc["col"], "Unexpected EOF", "Expected end of comment but found end of file.")

                    self.advance()
                    self.advance()
                # Slash
                else:
                    self.tokens.append(Token("/", TokenType["Slash"], loc["line"], loc["col"]))
            elif self.buffer[0] == "&":
                loc = self.loc_cpy()
                self.advance()
                # And
                if self.buffer[0] == "&":
                    self.advance()
                    self.tokens.append(Token("&&", TokenType["And"], loc["line"], loc["col"]))
                # Amp
                else:
                    self.tokens.append(Token("&", TokenType["Amp"], loc["line"], loc["col"]))
            # Or
            elif self.buffer[0] == "|" and self.buffer[1] == "|":
                loc = self.loc_cpy()
                self.advance()
                self.advance()
                self.tokens.append(Token("||", TokenType["Or"], loc["line"], loc["col"]))
            # Double colon
            elif self.buffer[0] == ":" and self.buffer[1] == ":":
                loc = self.loc_cpy()
                self.advance()
                self.advance()
                self.tokens.append(Token("::", TokenType["DoubleColon"], loc["line"], loc["col"]))
            # Star
            elif self.buffer[0] == "*":
                loc = self.loc_cpy()
                self.tokens.append(Token(self.advance(), TokenType["Star"], loc["line"], loc["col"]))
            # Modulus
            elif self.buffer[0] == "%":
                loc = self.loc_cpy()
                self.tokens.append(Token(self.advance(), TokenType["Mod"], loc["line"], loc["col"]))
            # L_String
            elif self.buffer[0] in self.strings:
                self.make_string()
            else:
                # Numbers
                if isNum(self.buffer[0]):
                    self.make_number()
                # Identifiers/Keywords
                elif self.buffer[0].isalpha():
                    self.make_identifier()
                elif self.buffer[0] == "\0":
                    self.advance()
                else:
                    loc = self.loc_cpy()
                    Error(self.path, loc["line"], loc["col"], "Illegal character", "Invalid character found:", self.advance())

        return self.tokens

__all__ = [
    "Token",
    "TokenType",
    "Keywords",
    "Lexer"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")