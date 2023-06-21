const { Emitter } = require("./emitter")
const { Codegen } = require("./codegen")
const { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NullLiteral } = require("../parser/ast")

class Compiler {
    constructor(path, file, ast) {
        this.path = path
        this.emitter = new Emitter(file)
        this.ast = ast

    }

    compile() {
        this.emitter.emit_header_line("#include <stdio.h>")
        this.emitter.emit_line("int main(int argc, char** argv) {")
        this.emitter.emit_line("    return 0;")
        this.emitter.emit_line("}")

        this.emitter.write_file()
    }
}

module.exports = {
    Compiler
}

if (require.main === module) {
    const process = require("process")
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}