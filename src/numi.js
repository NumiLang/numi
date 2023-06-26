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
        this.tokens = this.lexer.lex()
        this.tokens_cpy = this.tokens.slice()
        
        // Parser
        this.parser = new Parser(this.path, this.tokens_cpy)
        this.ast    = this.parser.generateAST()
        
        // Compiler
        this.compiler = new Compiler(this.path, path.parse(this.path).name)
    }

    dump_tokens() {
        return console.log(this.tokens)
    }

    dump_ast() {
        return console.log(JSON.stringify(this.ast, null, 4))
    }

    compile() {
        return console.log(this.compiler.compile(this.ast)) // temp
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