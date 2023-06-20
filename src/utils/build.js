const ini = require("ini")
const process = require("process")
const path = require("path")
const fs = require("fs")

// Checks if a string is a valid number
const isValidNum = (string) => /^\d+(\.\d)?\d*$/.test(string)

class Build {
    constructor() {
        this.buildPath = path.join(__dirname, "../../build.ini")

        if (!fs.existsSync(this.buildPath)) {
            console.error("ERROR: cannot get build info.\n`build.ini` file does not exist.")
            process.exit(1)
        } else {
            try {

                this.config = ini.parse(fs.readFileSync(this.buildPath, "utf-8"))

                if (this.config.BUILD.VERSION == undefined || this.config.BUILD.STATE == undefined || !isValidNum(this.config.BUILD.VERSION) || !["Stable", "Unstable", "Dev"].includes(this.config.BUILD.STATE)) {
                    console.error("ERROR: invalid build information found in `build.ini` file.")
                    process.exit(1)
                }

            } catch(error) {
                console.error("ERROR: something went wrong while fetching the build version.")
                process.exit(1)
            }
        }
    }

    get_version() {
        return this.config.BUILD.VERSION
    }

    get_state() {
        // State can be: Stable (User-friendly), Unstable (testing), "Dev" (Development state)
        return this.config.BUILD.STATE 
    }
}

module.exports = {
    Build
}

if (require.main === module) {
    console.error(`ERROR: \`${path.parse(__filename).name}\` file can\'t be ran as main.`)
    process.exit(1)
}