/**
 * Created by anger on 13/4/15.
 */
var fs = require('fs');

//Recursive sync method for removing directories
function deleteFolderRecursive(path){
    if( fs.existsSync(path) ) {

        if(!fs.lstatSync(path).isDirectory()) {
            fs.unlinkSync(path);
        }
        else {

            var files = fs.readdirSync(path)
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            }
            ;
            fs.rmdirSync(path);
        }
    }
};

exports.deleteFolderRecursive = deleteFolderRecursive;