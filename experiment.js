import fs from 'fs';
import { performance } from 'perf_hooks';
import { Transform } from 'stream';


export function imageToBase64Stream(filePath, outputFilePath, chunkSize) {
    return new Promise((resolve, reject) => {
        const start = performance.now(); 
        const readStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });
        const writeStream = fs.createWriteStream(outputFilePath);

        const base64Transform = new Transform({
            transform(chunk, _, callback) {
                this.push(chunk.toString('base64')); 
                callback();
            }
        });

        readStream
            .pipe(base64Transform)
            .pipe(writeStream)
            .on('finish', () => {
                const end = performance.now(); 
                const memoryUsage = process.memoryUsage(); 
                resolve({ time: end - start, memoryUsage });
            })
            .on('error', (err) => reject(err));
    });
}


async function testChunkSizes(filePath, outputFilePath, chunkSizes) {
    const results = [];

    for (let chunkSize of chunkSizes) {
        console.log(`\nTesting chunk size: ${chunkSize} bytes`);

        
        const result = await imageToBase64Stream(filePath, outputFilePath, chunkSize);
        console.log(`Time taken: ${result.time}ms`);
        console.log(`Memory usage: RSS=${result.memoryUsage.rss} bytes`);

        
        results.push({
            chunkSize,
            time: result.time,
            memoryUsage: result.memoryUsage.rss 
        });
    }

    return results;
}

const experiment = async (inFile, resultsFile) => {
    const outputFilePath = './output.txt';

    
    const chunkSizes = [16 * 1024, 32 * 1024, 64 * 1024, 128 * 1024, 256 * 1024, 512 * 1024, 1024 * 1024];

    const results = await testChunkSizes(inFile, outputFilePath, chunkSizes);

    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

    console.log('Results saved to results.json.');
}

(async () => {
    experiment('small.file', 'small.json');
    experiment('medium.file', 'medium.json');
    experiment('big.file', 'big.json');
})();
