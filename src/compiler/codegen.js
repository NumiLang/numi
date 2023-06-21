const { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NullLiteral } = require("../parser/ast")
const { Error } = require("../utils/errors")
const { TokenType } = require("../parser/lexer/tokens")

class Codegen {
    constructor() {
        undefined
    }
}

module.exports = {
    Codegen
}

if (require.main === module) {
    const process = require("process")
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}