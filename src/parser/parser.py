from .lexer import Token, TokenType
from ..utils.errors import Error
from typing import List

class Parser:
    def __init__(self, tokens, path):
        self.program = {
            "Program": {
                "body": []
            }
        }
        self.tokens: List[Token] = tokens
        self.path = path
    
    def get_type(self, type: TokenType):
        return str(type).split(".")[1]

    def advance(self):
        return self.tokens.pop(0)
        
    def push(self, content):
        return self.program["Program"]["body"].append(content)
    
    def expect(self, type):
        tok = self.tokens[0]
        if not tok or tok.type != type:
            Error(self.path, tok.location[0], tok.location[1], "Unexpected token", f"Expected token of type `{self.get_type(type)}`, but found `{self.get_type(tok.type)}`", False)

        return tok

    def generateAST(self): 
        while self.tokens[0].type != TokenType.EOF:
            self.push(self.parse_stmt())

        return self.program
    
    def parse_stmt(self):
        return self.parse_expr()
    
    def parse_expr(self):
        return self.parse_additive_expr()
    
    def parse_additive_expr(self):
        # Parses additive expressions (addition and subtraction)
        left = self.parse_multiplicative_expr()
        
        while self.tokens[0].value in ["+", "-"]:
            op = self.advance().value
            right = self.parse_multiplicative_expr()
            left = {
                "kind": "BinaryExpr",
                "left": left,
                "right": right,
                "op": op
            }
            
        return left
    
    def parse_multiplicative_expr(self):
        # Parses multiplicative expressions (multiplication, division and modulus)
        left = self.parse_primary_expr()
        
        while self.tokens[0].value in ["*", "/", "%"]:
            op = self.advance().value
            right = self.parse_primary_expr()
            left = {
                "kind": "BinaryExpr",
                "left": left,
                "right": right,
                "op": op
            }
            
        return left

# Order of precedence
    # Assignment expression
    # Member expression
    # Function call
    # Logical expression
    # Comparison expression
    # Additive expression
    # Multiplicative expression
    # Unary expression
    # Primary expression

    def parse_primary_expr(self):
        # Parses primary expressions like integer, literals and keywords
        match self.tokens[0].type:
            case TokenType.Identifier:
                return {
                    "kind": "Identifier",
                    "value": self.advance().value
                }
            
            case TokenType.Null:
                self.advance()
                return {
                    "kind": "NullLiteral",
                    "value": "null"
                }

            case TokenType.Integer:
                return {
                    "kind": "NumericLiteral",
                    "value": int(self.advance().value)
                }
            
            case TokenType.Float:
                return {
                    "kind": "NumericLiteral",
                    "value": float(self.advance().value)
                }
            
            case TokenType.OpenParen:
                self.advance() # Open Paren
                value = self.parse_expr() # Expression
                self.expect(TokenType.CloseParen)
                self.advance() # Close Paren
                return value
            
            case _:
                err = self.advance()
                Error(self.path, err.location[0], err.location[1], "Unexpected token", "Unexpected token found:", err.value)

__all__ = [
    "Parser"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")
