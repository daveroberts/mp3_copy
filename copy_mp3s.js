const DEST_DIR = `Z:\\Desktop\\iPodMusic\\Music`

const fs = require("fs")
const path = require("path")

console.log(`Starting`)
process.chdir(__dirname)

let blacklist = fs.readFileSync('blacklist.txt').toString().split(/\r?\n/)

function get_all_files(dirPath, opts = {}, arrayOfFiles = null) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = get_all_files(dirPath + "/" + file, opts, arrayOfFiles)
    } else {
      if (should_get_file(file)){
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    }
  })
  return arrayOfFiles
}

function should_get_file(file){
  for(let bl of blacklist){
    if (bl == ''){ continue }
    let regex = new RegExp(bl, 'i')
    if (file.match(regex)){
      let matchy = file.match(regex)
      return false
    }
  }
  if (!file.endsWith("mp3")){ return false }
  return true
}

function get_random_file(files){
  let idx = Math.floor(Math.random() * files.length)
  return files[idx]
}


let files = get_all_files("Z:/Music")
for(let i = 0; i < 200; i++){
  let filepath = get_random_file(files)
  if (!filepath){ continue }
  let basename = path.basename(filepath)
  let dirname = path.dirname(filepath)
  let destpath = path.join(DEST_DIR, basename)
  console.log(basename)
  fs.copyFileSync(filepath, destpath)
}
console.log(`Done`)