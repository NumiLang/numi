const process = require("process")
const fs = require("fs")
const { Build } = require("../../src/utils/build")
const { Numi } = require("../../src/numi")

const help = `Usage: numi.py [options] [commands]
Commands:
    new         [name]         Setup the file structure for a new Numi project with the given name.
    c           [file]         Compiles the given file.
    cr          [file]         Compiles and runs the produced executable.
    repl                       Runs the REPL.
    dump-ast    [file]         Prints the Program AST.
Options:
    --h, --help                Displays this usage information.
    --v, --version             Displays the compiler version.

NB: This help message is still a work in progress and some features might be missing!`

function main() {
    const args = process.argv.slice(2)

    if (!args) {
        console.error("ERROR: not enough arguments provided.")
        console.error(help)
        process.exit(1)
    }

    // Help
    else if (["--h", "--help"].includes(args[0])) {
        console.log(help)
        process.exit(0)
    }

    // Version
    else if (["--v", "--version"].includes(args[0])) {
        const build = new Build()
        const version = build.get_version()
        const state = build.get_state()
        console.log(`Numi ${version} ${state}`)
        process.exit(0)
    }

    // Repl
    else if (args[0] == "repl") {
        const { repl } = require("./repl")

        repl()
    }

    // Dump tokens
    else if (args[0] == "dump-tokens") {
        if (!args[1]) { console.error("ERROR: missing file path."); process.exit(1) }
        if (!fs.existsSync(args[1])) { console.error("ERROR: provided file does not exist."); process.exit(1) } 

        const path = args[1]

        const numi = new Numi(path)

        numi.dump_tokens()
        process.exit(0)
    }
    
    // Dump AST
    else if (args[0] == "dump-ast") {
        if (!args[1]) { console.error("ERROR: missing file path."); process.exit(1) }
        if (!fs.existsSync(args[1])) { console.error("ERROR: provided file does not exist."); process.exit(1) } 

        const path = args[1]

        const numi = new Numi(path)

        numi.dump_ast()
        process.exit(0)
    }
    
    // Compile
    else if (args[0] == "c") {
        if (!args[1]) { console.error("ERROR: missing file path."); process.exit(1) }
        if (!fs.existsSync(args[1])) { console.error("ERROR: provided file does not exist."); process.exit(1) } 

        const path = args[1]

        const numi = new Numi(path)

        numi.compile()
        process.exit(0)
    }

    // Not implemented
    else if (["new", "cr"].includes(args[0])) {
        console.log("Not implemented")
        process.exit(0)
    }

    else {
        console.error("ERROR: invalid input.")
        console.error(help)
        process.exit(1)
    }
}

if (require.main === module) {
    main()
}