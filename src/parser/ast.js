const { TokenType } = require("./lexer/tokens")

const NodeType = {
    Statement:      "Statement",
    NullLiteral:    "NullLiteral",
    NumericLiteral: "NumericLiteral",
    Identifier:     "Identifier",
    BinaryExpr:     "BinaryExpr"
}


function Stmt() {
    this.kind = NodeType
    return {
        "kind": this.kind
    }
}

function Program() {
    this.kind = "Program"
    this.body = []

    return {
        "kind": this.kind,
        "body": this.body
    }
}


// Expressions will have a value at runtime unlike the statements
function Expr() {
    return {}
}

function BinaryExpr(lhs, rhs, op) {
    this.kind = NodeType.BinaryExpr
    this.lhs = lhs
    this.rhs = rhs
    this.op = op

    return {
        "kind": this.kind,
        "left": this.lhs,
        "right": this.rhs,
        "op": this.op
    }
}

// ---

// Literal/Primary expression types

function Identifier(value) {
    this.kind = NodeType.Identifier
    this.value = value

    return {
        "kind": this.kind,
        "value": this.value
    }
}

function NumericLiteral(value) {
    this.kind = NodeType.NumericLiteral
    this.value = value

    return {
        "kind": this.kind,
        "value": this.value
    }
}

function NullLiteral() {
    this.kind = NodeType.NullLiteral
    this.value = "null"

    return {
        "kind": this.kind,
        "value": this.value
    }
}

module.exports = {
    Stmt,
    Program,
    Expr,
    BinaryExpr,
    Identifier,
    NumericLiteral,
    NullLiteral
}

if (require.main === module) {
    const process = require("process")
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}