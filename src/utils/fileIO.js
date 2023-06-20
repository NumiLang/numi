const process = require("process")
const fs = require("fs")

class Content {
    constructor(path) {
        this.path = path

        if (typeof(this.path) != "string") {
            console.error("ERROR: invalid path type.")
            process.exit(1)
        } 

        if (!fs.existsSync(this.path)) {
            console.error("ERROR: no such directory or file.")
            process.exit(1)
        }
    }
    
    get_content() {
        let content

        try {
            content = fs.readFileSync(this.path, "utf-8")
        } catch (error) {
            console.error("ERROR: something went wrong during file content reading.")
            process.exit(1)   
        }

        return content
    }
}

module.exports = {
    Content
}

if (require.main === module) {
    const path = require("path")

    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}