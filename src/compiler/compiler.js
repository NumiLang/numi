const { Emitter } = require("./emitter")

class Compiler {
    constructor(file, ast) {
        this.emitter = new Emitter(file)
        this.ast = ast
    }

    compile() {
        this.emitter.emit_header("#include <stdio.h>")
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