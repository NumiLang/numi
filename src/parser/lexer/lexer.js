const { Error } = require("../../utils/errors")
const { Token, TokenType, Keywords } = require("./tokens")

// Checks if string is EOF
const isEOF      = (string) => string == "\0"

// Check if string is a number
const isNum      = (string) => /^[0-9]+$/.test(string)

// Check if strings is a valid number
const isValidNum = (string) => /^\d+(\.\d)?\d*$/.test(string)

// Check if string is alphabetic
const isAlpha    = (string) => /[a-zA-Z]/.test(string)

// Checks if a string is alphanumeric
const isAlnum    = (string) => /^[a-zA-Z0-9]+$/.test(string)

class Lexer {
    constructor(path, source) {
        
        // Path
        this.path = path

        // File-related stuff
        this.source = source
        this.buffer = this.source.split("")
        
        // Buffer initialization
        this.buffer.push(" ")  // Whitespace
        this.buffer.push("\0") // EOF

        this.tokens = []

        // Location
        this.line = 1
        this.col = 1

        // Miscellaneous
        this.spaces = ["\r", " ", "\t"]
        this.strings = ["'", '"']
    }

    // Copy the current location
    loc_cpy() {
        return {
            "line": this.line,
            "col":  this.col
        }
    }
    
    advance() {
        
        // Newline
        if (this.buffer[0] == "\n") {
            this.line += 1
            this.col = 1

            return this.buffer.shift()

        // EOF
        } else if (isEOF(this.buffer[0])) {
            const loc = this.loc_cpy()

            this.buffer.shift()

            return this.tokens.push(new Token("EOF", TokenType.EOF, loc.line, loc.col)) 
        // ...
        } else {
            this.col += 1

            return this.buffer.shift()
        }
    }

    eat_whitespaces() {
        while (this.spaces.some((k) => k == this.buffer[0]) && !isEOF(this.buffer[0])) {
            this.advance()
        }
    }

    make_string() {
        const loc = this.loc_cpy()

        const delim = this.advance()
        let stringContent = "" 

        while (!isEOF(this.buffer[0]) && this.buffer[0] != delim) {
            stringContent += this.advance()
        }

        if (this.buffer[0] == delim) {
            this.advance()
        }
        
        if (isEOF(this.buffer[0])) {
            new Error(this.path, loc.line, loc.col, "Unexpected EOF", "Expected end of string literal but found end of file.")
        }

        this.tokens.push(new Token(`${delim}${stringContent}${delim}`, TokenType.L_String, loc.line, loc.col))
    }

    make_number() {
        const loc = this.loc_cpy()

        let number = ""
        
        while (isNum(this.buffer[0]) || this.buffer[0] == ".") {
            number += this.advance()
        }
        
        if (!isValidNum(number)) {
            new Error(this.path, loc.line, loc.col, "Invalid number", `Invalid number found: \`${number}\``)
        }

        if (number.includes(".")) {
            this.tokens.push(new Token(number, TokenType.Float, loc.line, loc.col))
        } else {
            this.tokens.push(new Token(number, TokenType.Integer, loc.line, loc.col))
        }
    }

    make_identifier() {
        const loc = this.loc_cpy()

        let ident = ""

        while (!isEOF(this.buffer[0]) && isAlnum(this.buffer[0])) {
            ident += this.advance()
        }
        
        const reserved = Keywords[ident] 

        // Identifier
        if (reserved == undefined) {
            this.tokens.push(new Token(ident, TokenType.Identifier, loc.line, loc.col))
        // Keyword
        } else {
            this.tokens.push(new Token(ident, reserved, loc["line"], loc["col"]))
        }
    }

    lex() {

        while (this.buffer.length > 0) {

            // Newline
            if (this.buffer[0] == "\n") {
                this.advance()
            // Spaces 
            } else if (this.spaces.some((k) => this.buffer[0] == k)) {
                this.eat_whitespaces()
            // OpenParen
            } else if (this.buffer[0] == "(") {
                const loc = this.loc_cpy()

                this.tokens.push(new Token(this.advance(), TokenType.OpenParen, loc.line, loc.col))
            // CloseParen
            } else if (this.buffer[0] == ")") {
                const loc = this.loc_cpy()

                this.tokens.push(new Token(this.advance(), TokenType.CloseParen, loc.line, loc.col))
            // Dot
            } else if (this.buffer[0] == ".") {
                const loc = this.loc_cpy()

                this.tokens.push(new Token(this.advance(), TokenType.Dot, loc.line, loc.col))
            // Comma
            } else if (this.buffer[0] == ",") {
                const loc = this.loc_cpy()

                this.tokens.push(new Token(this.advance(), TokenType.Comma, loc.line, loc.col))
            // Minus
            } else if (this.buffer[0] == "-") {
                const loc = this.loc_cpy()

                this.advance()

                // Arrow
                if (this.buffer[0] == ">") {
                    this.advance()

                    this.tokens.push(new Token("->", TokenType.Arrow, loc.line, loc.col))
                } else {
                    this.tokens.push(new Token("-", TokenType.Minus, loc.line, loc.col))
                }
            // Plus
            } else if (this.buffer[0] == "+") {
                const loc = this.loc_cpy()

                this.tokens.push(new Token(this.advance(), TokenType["Plus"], loc["line"], loc["col"]))
            // Equal
            } else if (this.buffer[0] == "=") {
                const loc = this.loc_cpy()

                this.advance()

                // Equal Equal
                if (this.buffer[0] == "=") {
                    this.advance()
                    this.tokens.push(new Token("==", TokenType.EqualEqual, loc.line, loc.col))
                } else { 
                    this.tokens.push(new Token("=", TokenType.Equal, loc.line, loc.col))
                }
            // Not
            } else if (this.buffer[0] == "!") {
                const loc = this.loc_cpy()

                this.advance()

                // Not Equal
                if (this.buffer[0] == "=") {
                    this.advance()
                    this.tokens.push(new Token("!=", TokenType.NotEqual, loc.line, loc.col))
                } else {
                    this.tokens.push(new Token("!", TokenType.Not, loc.line, loc.col))
                }
            // Less
            } else if (this.buffer[0] == "<") {
                const loc = this.loc_cpy()

                this.advance()

                // Less Equal
                if (this.buffer[0] == "=") {
                    this.advance()

                    this.tokens.push(new Token("<=", TokenType.LessEqual, loc.line, loc.col))
                } else {
                    this.tokens.push(new Token("<", TokenType.Less, loc.line, loc.col))
                }
            // Greater
            } else if (this.buffer[0] == ">") {
                const loc = this.loc_cpy()

                this.advance()

                // Greater Equal
                if (this.buffer[0] == "=") {
                    this.advance()
                    this.tokens.push(new Token(">=", TokenType.GreaterEqual, loc.line, loc.col))
                } else {
                    this.tokens.push(new Token(">", TokenType.Greater, loc.line, loc.col))
                }
            // Slash
            } else if (this.buffer[0] == "/") {
                const loc = this.loc_cpy()

                this.advance()

                // Single line comment
                if (this.buffer[0] == "/") {
                    this.advance()

                    while (this.buffer[0] != "\n" && !isEOF(this.buffer[0])) {
                        this.advance()
                    }
                // Multi line comment
                } else if (this.buffer[0] == "*") {
                    this.advance()

                    while ((!isEOF(this.buffer[0])) && (this.buffer[0] != "*" && this.buffer[1] != "/")) {
                        this.advance()
                    }

                    if (isEOF(this.buffer[0])) {
                        new Error(this.path, loc.line, loc.col, "Unexpected EOF", "Expected end of comment but found end of file.")
                    }

                    this.advance() // Eat `*`
                    this.advance() // Eat `/`
                } else {
                    this.tokens.push(new Token("/", TokenType.Slash, loc.line, loc.col))
                }
            // Amp
            } else if (this.buffer[0] == "&") {
                const loc = this.loc_cpy()

                this.advance()

                // And
                if (this.buffer[0] == "&") {
                    this.advance()

                    this.tokens.push(new Token("&&", TokenType.And, loc.line, loccol))
                } else {
                    this.tokens.push(new Token("&", TokenType.Amp, loc.line, loc.col))
                }
            // Or
            } else if (this.buffer[0] == "|" && this.buffer[1] == "|") {
                const loc = this.loc_cpy()

                this.advance() // Eat `|`
                this.advance() // Eat `|`

                this.tokens.push(new Token("||", TokenType.Or, loc.line, loc.col))
            // Double colon
            } else if (this.buffer[0] == ":" && this.buffer[1] == ":") {
                const loc = this.loc_cpy()

                this.advance() // Eat `:`
                this.advance() // Eat `:`

                this.tokens.push(new Token("::", TokenType.DoubleColon, loc.line, loc.col))
            // Star
            } else if (this.buffer[0] == "*") {
                const loc = this.loc_cpy()

                this.tokens.push(new Token(this.advance(), TokenType.Star, loc.line, loc.col))
            // Modulus
            } else if (this.buffer[0] == "%") {
                const loc = this.loc_cpy()

                this.tokens.push(new Token(this.advance(), TokenType.Mod, loc.line, loc.col))
            // L_String
            } else if (this.strings.some((k) => k == this.buffer[0])) {
                this.make_string()
            } else {

                // Numbers
                if (isNum(this.buffer[0])) {
                    this.make_number()
                // Identifiers / Keywords
                } else if (isAlpha(this.buffer[0])) {
                    this.make_identifier()
                // EOF
                } else if (this.buffer[0] == "\0") {
                    this.advance()
                // Unknown character
                } else {
                    const loc = this.loc_cpy()

                    new Error(this.path, loc.line, loc.col, "Illegal character", `Invalid character found: ${this.advance()}`)
                }
            }
        }

        return this.tokens
    }

}

module.exports = {
    Lexer
}

if (require.main === module) {
    const process = require("process")
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}