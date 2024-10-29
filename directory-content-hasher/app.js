const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { StringDecoder } = require("string_decoder");

// Define the input directory and output file
const inputDir = path.join(__dirname, "input");
const outputFilePath = path.join(__dirname,"hashes.txt");

// Function to compute hash of a file using streams
function computeFileHash(filePath, callback){
  // Create a read stream for the file
  const readStream = fs.createReadStream(filePath);

  // Create a hash object
  const hash = crypto.createHash("sha256");

  // Initialize StringDecoder for proper decoding
  const decoder = new StringDecoder("utf8");
  
  // Handle data chunks
  readStream.on("data", (chunk) => {
    // Decode the chunk
    const decodedChunk = decoder.write(chunk);

    // Update the hash with the chunk data
    hash.update(decodedChunk, "utf8");
  });

  // Handle end of file
  readStream.on("end", () => {
    // Finalize the hash computation
    const fileHash = hash.digest("hex");
    callback(null, fileHash);    
  });

  // Handle errors
  readStream.on("error", (err) => {
    callback(err);    
  });
};

// Read the input directory
fs.readdir(inputDir, (err, files) => {
  if(err){
    console.error("Error reading input directory:", err);
    process.exit(1);
  }

  // Filer files
  files = files.filter(file => file.endsWith(".txt"));

  // Initialize an array to hold hash results
  const hashResults = [];

  // Process each file
  let filesProcessed = 0;

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    computeFileHash(filePath, (err, hash) => {
      if(err){
        console.error(`Error hashing file ${file}:`, err);
      } else {
        hashResults.push(`${file}: ${hash}`);
      }

      filesProcessed++;

      // When all files have been processed, write the results
      if(filesProcessed === files.length){
        // Write the hash results to the output file using a write stream
        const writeStream = fs.createWriteStream(outputFilePath);
        const buffer = Buffer.from(hashResults.join("\n"), "utf8");

        writeStream.write(buffer, () => {
          writeStream.end();
          console.log("Hashing completed. Results saved to hashes.txt");
        });

        // Handle errors in write stream
        writeStream.on("error", (err) => {
          console.error("Error writing to output file:", err);    
        });
      }
    });
  });
});
