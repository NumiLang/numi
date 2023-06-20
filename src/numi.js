const { Content } = require("./utils/fileIO")
const { Lexer } = require("./parser/lexer/lexer")
const { Parser } = require("./parser/parser")
const { Compiler } = require("./compiler/compiler")
const path = require("path")

class Numi {
    constructor(filePath) {
        this.path = filePath
        
        // Content
        this.content = new Content(this.path)
        this.source = this.content.get_content()

        // Lexer
        this.lexer  = new Lexer(this.path, this.source)
        this.tokens = this.lexer.lex() // FIXME: Parser consumes tokens, therefore only EOF is shown in dump tokens.

        
        // Parser
        this.parser = new Parser(this.path, this.tokens)
        this.ast    = this.parser.generateAST()
        
        // Compiler
        this.compiler = new Compiler(path.parse(this.path).name, this.ast)
    }

    dump_tokens() {
        return console.log(JSON.stringify(this.tokens, null, 4))
    }

    dump_ast() {
        return console.log(JSON.stringify(this.ast, null, 4))
    }

    compile() {
        this.compiler.compile()
    }

}

module.exports = {
    Numi
}

if (require.main === module) {
    const process = require("process")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}