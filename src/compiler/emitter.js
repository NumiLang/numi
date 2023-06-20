const fs = require("fs")
const process = require("process")

class Emitter {
    constructor(file) {
        this.file = file
        this.header = ""
        this.code = ""
    }

    emit(content) {
        this.code += content
    }

    emit_line(content) {
        this.code += `${content}\n`
    }

    emit_header(content) {
        this.header += content
    }

    emit_header_line(content) {
        this.header += `${content}\n`
    }

    write_file() {
        try {
            fs.writeFileSync(`${this.file}.c`, `${this.header}\n${this.code}`)
        } catch(error) {
            console.error("ERROR: something went wrong during compilation.", err)
            console.error(error)
            process.exit(1)
        }
    }
}

module.exports = {
    Emitter
}

if (require.main === module) {
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}