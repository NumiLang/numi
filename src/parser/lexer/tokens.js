class Token {
    constructor(value, type, line, col) {
        return {
            "value": value,
            "type": type,

            "loc": {
                "line": line,
                "col": col
            }
        }

    }
}

let autoCounter = 0
const auto = (reset = false) => {
    if (reset) {
        iotaCounter = 0
    } else {
        iotaCounter += 1
    }

    return iotaCounter
} 

const TokenType = {
        // Single character tokens
        "OpenParen":    auto(true),
        "CloseParen":   auto(),
        "Comma":        auto(), 
        "Dot":          auto(), 
        "Minus":        auto(), 
        "Plus":         auto(), 
        "Slash":        auto(), 

        // Literals
        "Integer":      auto(), 
        "Float":        auto(), 
        "Identifier":   auto(), 
        "L_String":     auto(), 

        // One or two character tokens
        "Star":         auto(), 
        "Mod":          auto(), 
        "Amp":          auto(), 
        "DoubleColon":  auto(), 
        "Arrow":        auto(), 
        "And":          auto(), 
        "Or":           auto(), 
        "Not":          auto(), 
        "NotEqual":     auto(), 
        "Equal":        auto(), 
        "EqualEqual":   auto(), 
        "Greater":      auto(), 
        "GreaterEqual": auto(), 
        "Less":         auto(), 
        "LessEqual":    auto(), 
        
        // Keywords
        "OpenEnd":      auto(), // how am I supposed to lex this? 
        "CloseEnd":     auto(), 

        "If":           auto(), 
        "Else":         auto(), 
        "BTrue":        auto(), 
        "BFalse":       auto(), 
        "Method":       auto(), 
        "Extern":       auto(), 
        "For":          auto(), 
        "Null":         auto(), 
        "Print":        auto(), 
        "Return":       auto(), 
        "While":        auto(), 
        "Const":        auto(), 
        "Let":          auto(), 
        
        // Datatypes
        "Void":         auto(), 

        "Int8":         auto(), 
        "Uint8":        auto(), 

        "Int16":        auto(), 
        "Uint16":       auto(), 

        "Int32":        auto(), 
        "Uint32":       auto(), 

        "Int64":        auto(), 
        "Uint64":       auto(), 
    
        "Float32":      auto(), 
        "Float64":      auto(), 

        "Bool":         auto(), 
        "String":       auto(), 

        // Special
        "EOF":          auto()
}

const Keywords = {
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

module.exports = {
    Token,
    TokenType,
    Keywords
}

if (require.main === module) {
    const process = require("process")
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}