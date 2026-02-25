const DEST_DIR = `Z:\\Desktop\\iPodMusic\\Music`;

const LIMIT_GB = 5
const LIMIT_BYTES = LIMIT_GB * 1024 * 1024 * 1024

const fs = require("fs");
const path = require("path");

console.log(`Starting`);
process.chdir(__dirname);

let blacklist = fs.readFileSync("blacklist.txt").toString().split(/\r?\n/);

function get_all_files(dirPath, opts = {}, arrayOfFiles = null) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = get_all_files(dirPath + "/" + file, opts, arrayOfFiles);
    } else {
      if (should_get_file(file)) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

function should_get_file(file) {
  for (let bl of blacklist) {
    if (bl == "") {
      continue;
    }
    let regex = new RegExp(bl, "i");
    if (file.match(regex)) {
      let matchy = file.match(regex);
      return false;
    }
  }
  if (!file.endsWith("mp3")) {
    return false;
  }
  return true;
}

function get_random_file(files) {
  let idx = Math.floor(Math.random() * files.length);
  return files[idx];
}

// Source - https://stackoverflow.com/a
// Posted by anon, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-26, License - CC BY-SA 4.0

function format_bytes(bytes, decimals = 2) {
  if (!+bytes) return '0 bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

let files = get_all_files("Z:/Music");
let total_bytes_copied = 0
let total_files_copied = 0
while(total_bytes_copied < LIMIT_BYTES){
  let filepath = get_random_file(files);
  if (!filepath) {
    continue;
  }
  let basename = path.basename(filepath);
  let destpath = path.join(DEST_DIR, basename);
  let num_bytes_file = fs.statSync(filepath).size
  
  fs.copyFileSync(filepath, destpath);
  total_bytes_copied += num_bytes_file
  total_files_copied++;
  let percent_done = (100 * (total_bytes_copied / LIMIT_BYTES)).toFixed(2)
  console.log(`${total_files_copied} files copied: ${format_bytes(total_bytes_copied)} copied.  ${percent_done}% done: ${basename}`);
}
console.log(`Done`);
