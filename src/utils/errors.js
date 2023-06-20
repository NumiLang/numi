const process = require("process")

class Error {
    constructor(path, line, col, error_name, message, exitcode = 1) {

        console.error(`${path}:${line}:${col}: Error <${error_name}>:\n${message}`)
        process.exit(exitcode)
    }
}

module.exports = {
    Error
}

if (require.main === module) {
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}