import fs from 'fs';

import readline from 'readline';

import os from 'os';

import path from 'path';

module.exports = (filePath) => {

    if (!filePath) {
        return;
    }

    let suffix = ".tpl";

    let dist = "./output/";

    let tpl = "define(function(){" + os.EOL + "{{content}}" + os.EOL + "});";

    //D:\2016project\f\mstatics\assets\js\
    let paths = filePath.substr(0, filePath.lastIndexOf("\\js\\") + 4),

        //gogo.tpl
        originalFileName = filePath.substr(filePath.lastIndexOf("\\") + 1, filePath.length),

        //gogo
        fileName = originalFileName.substr(0, originalFileName.length - suffix.length);


    if (!fs.existsSync(path.resolve(paths,dist))) {

        fs.mkdirSync(path.resolve(paths,dist));

    }

    let distFile = path.resolve(paths,dist) + "\\" +fileName + ".js";

    let fRead = fs.createReadStream(filePath),

        fWrite = fs.createWriteStream(distFile);

    let readLineInterface = readline.createInterface({

        input: fRead

    });

    let index = 1;

    let fileContent = "";

    readLineInterface.on('line', (line) => {

        if (index == 1) {

            fileContent += "return ['" + line + "'," + os.EOL;

        }

        if (index > 1) {

            fileContent += "'" + line + "'," + os.EOL;

        }

        index++;
    });

    readLineInterface.on("close", () => {

        fileContent = fileContent.substr(0, fileContent.lastIndexOf(","));

        fileContent += "].join('');";

        console.log("%s","Writing File ...", distFile);

        fWrite.write(tpl.replace(/{{content}}/g, fileContent) + os.EOL);

        console.log("%s","Writing success...");

    });
};

