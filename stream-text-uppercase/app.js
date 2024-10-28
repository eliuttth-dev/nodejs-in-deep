const fs = require("fs");
const path = require("path");
const { StringDecoder } = require("string_decoder");

// Get the absolute paths for input and output files
const inputFilePath = path.join(__dirname, "input.txt");
const outputFilePath = path.join(__dirname, "output.txt");

// Create read and write streams
const readStream = fs.createReadStream(inputFilePath);
const writeStream = fs.createWriteStream(outputFilePath);

// Initialize string decoder
const decoder = new StringDecoder("utf8");

//  Handle data and events on the read stream
readStream.on("data", (chunk) => {
  // Decode the buffer chunk into a string
  const decodedChunk = decoder.write(chunk);
  const transformedChunk = decodedChunk.toUpperCase();

  // Write the transformed chunk to the write stream
  writeStream.write(transformedChunk);
});

// Handle the end event
readStream.on("end", () => {
  // Close the string decoder
  decoder.end();    

  // Signal that writing is complete
  writeStream.end();

  console.log("File processing completed");
});

// Handle errors
readStream.on("error", (err) => {
  console.error("An error occurred while reading the file:", err.message);  
})

writeStream.on("error", (err) => {
    console.error("An error occurred while writing to the file:", err.message)
});
