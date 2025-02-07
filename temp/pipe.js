const fs = require('node:fs');
const path=require('node:path');
const filePath = path.resolve("public", "mj.txt");
const readableStream = fs.createReadStream(filePath);
const writableStream = fs.createWriteStream('text.txt');
// const fd = fs.openSync(filepath, 'r');
readableStream.pipe(writableStream);

writableStream.on('finish', () => {
  console.log('Data has been written successfully.');
});

const zlib = require("zlib");

// gzip() function accepts a filename 
// to be compressed and a callback function
function gzip(filename, callback) {
    // Create the streams
    let source = fs.createReadStream(filename);
    let destination = fs.createWriteStream(filename + ".gz");
    let gzipper = zlib.createGzip();
    
    // Set up the pipeline
    source
        .on("error", callback)
        .pipe(gzipper)
        .pipe(destination)
        .on("error", callback)
        .on("finish", callback);
}

gzip(filePath, (msg) => {
    console.log(msg);
});


