const process = require("process")

function repl() {
    console.log("Not implemented")
    process.exit(0)
}

module.exports = {
    repl
}

if (require.main === module) {
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}