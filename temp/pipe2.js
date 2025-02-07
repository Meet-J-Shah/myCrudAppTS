const fs=require('node:fs');
let rs = fs.createReadStream("./text.txt");
let ws = fs.createWriteStream("./output.txt");

function callback(msg) {
    console.log(msg);
}

// pipeReadToWrite() accepts two streams a 
// readStream and s writeStream and a callback function.
function pipeReadToWrite(readStream, writeStream, callback) {
    // handles any error occurred in the stream
    function handleError(err) {
        // close the streams and call callback
        readStream.close();
        writeStream.close();
        callback(err);
    }

    readStream
        .on("error", handleError)   
        .pipe(writeStream)
        .on("error", handleError)
        .on("finish", callback);
}

pipeReadToWrite(rs, ws, callback);