const { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NullLiteral } = require("./ast")
const { Token, TokenType } = require("./lexer/tokens")
const { Error } = require("../utils/errors")

class Parser {
    constructor(path, tokens) {
        this.program = new Program()
        
        this.path = path
        this.tokens = tokens
    }
    
    // Gets key of object from value 
    getType(type) {        
        return Object.keys(TokenType).find(key => TokenType[key] === type)
    }

    advance() {
        return this.tokens.shift()
    }

    push(content) {
        return this.program.body.push(content)
    }
        
    expect(type) {
        const tok = this.tokens[0]

        if (!tok || tok.type != type) {
            new Error(this.path, tok.loc.line, tok.loc.col, "Unexpected token", `Expected token of type \`${this.getType(type)}\`, but found \`${this.getType(tok.type)}\``)
        }

        return tok
    }

    generateAST() {
        while (this.tokens[0].type != TokenType.EOF) {
            this.push(this.parse_stmt())
        }

        return this.program
    }

    parse_stmt() {
        return this.parse_expr()
    }

    parse_expr() {
        return this.parse_additive_expr()
    }

    // Parses additive expressions (addition and subtraction)
    parse_additive_expr() {
        let left = this.parse_multiplicative_expr() 

        while (["+", "-"].some((k) => this.tokens[0].value == k)) {
            const op = this.advance().value
            const right = this.parse_multiplicative_expr()

            left = new BinaryExpr(left, right, op)
        }

        return left
    }
    
    // Parses multiplicative expressions (multiplication, division and modulus)
    parse_multiplicative_expr() {
        let left = this.parse_primary_expr()

        while (["*", "/", "%"].some((k) => this.tokens[0].value == k)) {
            const op = this.advance().value
            const right = this.parse_primary_expr()

            left = new BinaryExpr(left, right, op)
        }

        return left
    }

    /* Order of precedence
        * Assignment expression
        * Member expression
        * Function call
        * Logical expression
        * Comparison expression
        * Additive expression
        * Multiplicative expression
        * Unary expression
        * Primary expression
    */

    // Parses primary expressions like integer, literals and keywords that map to built-in types
    parse_primary_expr() {
        switch (this.tokens[0].type) {

            case TokenType.Identifier:
                return new Identifier(this.advance().value)

            case TokenType.Null:
                this.advance()
                return new NullLiteral()

            case TokenType.Integer:
                return new NumericLiteral(parseInt(this.advance().value))

            case TokenType.Float:
                return new NumericLiteral(parseFloat(this.advance().value))

            case TokenType.OpenParen:
                this.advance() // Eat the `(`
                const value = this.parse_expr() // Parse the expression inside
                this.expect(TokenType.CloseParen)
                this.advance() // Eat the `)`

                return value

            default:
                const error = this.advance()
                new Error(this.path, error.loc.line, error.loc.col, "Unexpected token", `Unexpected token: \`${error.value}\`.`) 
        }
    }
}

module.exports = {
    Parser
}

if (require.main === module) {
    const process = require("process")
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}