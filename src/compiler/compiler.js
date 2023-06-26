const { Emitter } = require("./emitter")
const { Codegen } = require("./codegen")
const { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NullLiteral } = require("../parser/ast")
const process = require("process")

class Compiler {
    constructor(path, file) {
        this.path = path
        this.emitter = new Emitter(file)
    }

    compile_program(program) {
        let lastEvaluated = { "value": "null", "type": "null" }

        for (const statement of program.body) {
            lastEvaluated = this.compile(statement)
        }

        return lastEvaluated
    }

    compile_binary_expr(binop) {
        // TODO: check for divisions by zero

        const lhs = this.compile(binop.left)
        const rhs = this.compile(binop.right)
        
        if (lhs.type == "number" && rhs.type == "number") {
            return { "value": `(${lhs.value}${binop.op}${rhs.value})`, "type": "number" }
        }

        return { "value": "null", "type": "null" } // TODO: add error for invalid operations
    }

    compile(ast) {
        switch (ast.kind) {
            case "NumericLiteral":
                return {
                    "value": ast.value,
                    "type": "number"
                }

            case "NullLiteral":
                return {
                    "value": "null",
                    "type": "null"
                }

            case "BinaryExpr":
                return this.compile_binary_expr(ast)

            case "Program":
                return this.compile_program(ast)

            default:
                console.error(`ERROR: \`${ast.kind}\` AST node has not been implemented yet.`)
                process.exit(1)
        }
    }
}

module.exports = {
    Compiler
}

if (require.main === module) {
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}