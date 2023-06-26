const gulp = require("gulp")
const header = require("gulp-header")
const fs = require("fs")

const ignored = [
  "package-lock.json",
  "node_modules",
  "dist",
  "src", "cmd", "tests",
  ".git",
  "build.js",
  "example.nm" // Temp
]

const currDir = fs.readdirSync(".").filter(file => !ignored.includes(file))

// Adds file headers
const license = fs.readFileSync("./LICENSE")
const pkg = require('./package.json');
const banner = [
  `\`\n${license}\n\`\n`,
  '/**',
  ' * Numi - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */\n',
  ''].join('\n');
 
gulp.src([
    "./src/**/*.js",
    "./*.js"
])
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('./dist/'))
 
for (const file of currDir) {
  const data = fs.readFileSync(file)
  fs.writeFileSync(`./dist/${file}`, data)
}