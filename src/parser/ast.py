######################################################
# This file is not used at all in the parser itself. #
# It's mostly used for "documentation" purposes      #
######################################################
from enum import Enum, auto
from typing import List

class NodeType(Enum):
    Statement      = auto(),
    NullLiteral    = auto(),
    NumericLiteral = auto(),
    Identifier     = auto(),
    BinaryExpr     = auto(),

    def __repr__(self):
        return f"{self.name}.{self.value}"
    
class Stmt:
    def __init__(self):
        self.kind: NodeType

class Program(Stmt):
    def __init__(self, body):
        self.kind = "Program"
        self.body: List[Stmt] = []

    def __repr__(self):
        return str(self.body)

# Expressions will have a value at runtime unlike the statements
class Expr(Stmt):
    pass

class BinaryExpr(Expr):
    def __init__(self, lhs, rhs, op):
        self.kind: NodeType.BinaryExpr
        self.lhs = lhs
        self.rhs = rhs
        self.op  = op

# Literal/Primary expression types

class Identifier(Expr):
    def __init__(self, symbol):
        self.kind: NodeType.Identifier
        self.symbol = symbol

class NumericLiteral(Expr):
    def __init__(self, value):
        self.kind: NodeType.NumericLiteral
        self.value = value

class NullLiteral(Expr):
    def __init__(self):
        self.kind: NodeType.NullLiteral
        self.value = "null"
        
__all__ = [
    "Stmt",
    "Program",
    "Expr", 
    "BinaryExpr", 
    "Identifier", 
    "NumericLiteral",
    "NullLiteral"
]

if __name__ == "__main__":
    import os
    raise Exception(f"`{os.path.basename(__file__)} can\'t be ran as `{__name__}`")