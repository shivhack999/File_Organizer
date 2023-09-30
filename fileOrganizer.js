const fs = require("fs");
const path = require("path");
// const os = require("os")
let types = {
  videoFolder: [
    ".mp4",
    ".mkv",
    ".h264",
    ".avi",
    ".mpg",
    ".mov",
    ".m4v",
    ".flv",
    ".3gp",
    ".wmv",
    ".vob",
  ],
  docFolder: [
    ".doc",
    ".docx",
    ".pdf",
    ".txt",
    ".xls",
    ".xlsx",
    ".xlsm",
    ".ppt",
    ".pps",
    ".pptx",
    ".html",
    ".rtf",
  ],
  photos: [".jpeg", ".png", ".gif", ".psd", ".ai", ".tiff", ".tif", ".jpg"],
  appsFolder: [".exe", ".msi"],
  Mp3Folder: [".mp3", ".ogg"],
  zipfolder: [".zip", ".rar"],
};
let input = process.argv.slice(2);
let command = input[0];
switch (command) {
  case "tree":
    treefn(input[1]);
    break;
  case "organize":
    organizefn(input[1]);
    break;
  case "help":
    helpfn();
    break;
  default:
    console.log("Pls🙏 input the right command");
    break;
}
function treefn(direc) {
  if (direc == undefined) {
    console.log("Pls Enter the correct directory");
    return;
  } else {
    treehelper(input[1]);
    return;
  }
}
function organizefn(direc) {
  let intermediate_folder_path;
  // directory is valid or not or if directory is not given
  // make a folder of name file_Organizer
  if (direc == undefined) {
    console.log("Pls Enter the correct directory");
    return;
  } else {
    let doesExit = fs.existsSync(direc);
    if (doesExit) {
      intermediate_folder_path = path.join(direc, "file_Organizer");
      let direcExist = fs.existsSync(intermediate_folder_path);
      if (direcExist == false) {
        fs.mkdirSync(intermediate_folder_path);
        // console.log("directory Added correctly");
      }
      helper(input[1], intermediate_folder_path);
    } else {
      console.log("Please Enter the correct Directory");
      return;
    }
  }
}

function helper(direc, intermediate_folder_path) {
  let read_directory = fs.readdirSync(direc); // list of all the files and folder in the directory
  for (let i = 0; i < read_directory.length; i++) {
    let address = fs.lstatSync(path.join(direc, read_directory[i])); //it will store the directory of every iteration
    if (address.isFile()) {
      // checking whether it is File
      let file_extension = path.extname(read_directory[i]); // storing the extension format of the file
      let filename = read_directory[i]; // storing the filename
      for (let folder in types) {
        let extension_arr = types[folder];
        for (let j = 0; j < extension_arr.length; j++) {
          // checking that from which folder the file belongs
          if (
            file_extension == extension_arr[j] ||
            file_extension == extension_arr[j].toUpperCase()
          ) {
            let belongs_to = folder; // storing the folder through which it belongs
            let dest = path.join(intermediate_folder_path, belongs_to);
            // console.log(read_directory[i], "--->", belongs_to);
            if (fs.existsSync(dest) == false) {
              // checking directory exist, if no create the directory
              // creating the directory as per the file belongs_to variable
              fs.mkdirSync(path.join(intermediate_folder_path, folder));
            }
            moveFiles(filename, direc, dest); // moving the files to the destination directory
          }
        }
      }
    }
  }
  successful();
}
function moveFiles(add, src, destination) {
  console.log("Processing....................\n");
  src = path.join(src, add); // directory of file where it exist
  destination = path.join(destination, add); // directory where we have to move the file
  fs.copyFileSync(src, destination); // function used for copy the file by using the fs module
  console.log(destination); // printing the directory of the moved files
  fs.unlinkSync(src); // deleting the file after moving the file to the desired directory
}
function successful() {
  console.log("\nAll files have moved succesfully!");
  return;
}
function treehelper(direc) {
  let isdirectory = fs.lstatSync(direc).isDirectory();
  if (isdirectory) {
    let readDirectory = fs.readdirSync(direc);
    for (let i = 0; i < readDirectory.length; i++) {
      let check = fs.lstatSync(path.join(direc, readDirectory[i]));
      if (check.isFile()) {
        console.log(
          "                                                       ",
          "|-----",
          `${readDirectory[i]}`
        );
      } else {
        // console.log(`\n                       -----------${readDirectory[i]}-------------`);
        treehelper(path.join(direc, readDirectory[i]));
        // console.log("Foler finished completely\n");
      }
    }
  }
}
function helpfn() {
  console.log(`
    List all the commands: 
            node fileOrganizer.js tree "directory_Path"
            node fileOrganizer.js organize "directory_Path"
            node fileOrganizer.js help`);
}
