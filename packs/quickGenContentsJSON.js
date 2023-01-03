const fs = require("fs")
const glob = require("glob").sync
const path = require("path")


function getDirectories(source) {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}



const dirs = getDirectories(".")

for (const dir of dirs) {
    const files = glob(`${dir}/**/*.**`)
    .map((p) => {
        return path.relative(dir, p);
    })
    .filter (x => x!="contents.json")
    
    fs.writeFileSync(`${dir}/contents.json`, JSON.stringify(files, null, 4))
}