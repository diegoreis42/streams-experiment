const fs = require('fs');
const path = require('path');

// Define the path and name of the file

// Define the text that will be written in the file


const createFile = (fileName, numberOfLines) => {
    const filePath = path.join(__dirname, fileName);
    const writeStream = fs.createWriteStream(filePath);

    const text = 'This is a sample line of text that will be repeated.\n';
    console.log('Starting file generation...');

    for (let i = 0; i < numberOfLines; i++) {
        // Write text to the stream
        if (!writeStream.write(text)) {
            // If the buffer is full, wait for the drain event before continuing
            writeStream.once('drain', () => console.log(`Continuing at line: ${i}`));
        }
    }

    writeStream.end(() => {
        console.log('File generation complete!');
    });
}

// createFile('small.file', 100_000);
// createFile('medium.file', 1_000_000);
createFile('big.file', 5_000_000);