const { Emitter } = require("./emitter")
const { Codegen } = require("./codegen")
const { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NullLiteral } = require("../parser/ast")
const { Error } = require("../utils/errors")
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
        
        // TODO: keep track of lines and columns 
        // TODO: fix that
        if (!lhs.type == "number" || !rhs.type == "number") {
            new Error(this.path, 0, 0, "Invalid operation", "Currently, we only accept operations with numbers.")
        }

        switch (binop.op) {
            // + (Addition)
            case "+":
                return { "value": `(${lhs.value}+${rhs.value})`, "type": "number" }       

            // - (Subtraction)
            case "-":
                return { "value": `(${lhs.value}-${rhs.value})`, "type": "number" }    

            // * (Multiplication)
            case "*":
                return { "value": `(${lhs.value}*${rhs.value})`, "type": "number" }

            // / (Division)
            case "/":
                return { "value": `(${lhs.value}/${rhs.value})`, "type": "number" }

            // % (Modulus)
            case "%":
                return { "value": `(${lhs.value}%${rhs.value})`, "type": "number" }    

            // Invalid op
            default:
                // TODO: keep track of position
                new Error(this.path, 0, 0, "Invalid operator", "Invalid operator found in expression.")
        }
        

        return { "value": "null", "type": "null" } // TODO: add error for invalid operations
    }

    compile(node) {
        switch (node.kind) {
            case "NumericLiteral":
                return {
                    "value": node.value,
                    "type": "number"
                }

            case "NullLiteral":
                return {
                    "value": "null",
                    "type": "null"
                }

            case "BinaryExpr":
                return this.compile_binary_expr(node)

            case "Program":
                return this.compile_program(node)

            default:
                console.error(`ERROR: \`${node.kind}\` AST node has not been implemented yet.`)
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