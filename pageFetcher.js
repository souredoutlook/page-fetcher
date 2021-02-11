
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const checkArg = function(index) {
  if (process.argv[index] === undefined) {
    console.log(`Invalid argument at argument ${index - 1}`);
    process.exit();
  } else {
    return process.argv[index];
  }
};

const writeTheFileAlready = function(body, startTime) {
  let endTime = Date.now();
  fs.writeFile(destination, body, {encoding: "utf8"}, (err) => {
    if (err) throw err;
    endTime = Date.now() - endTime + startTime;
    
    fs.stat(destination, (err,stats)=>{
      
      if (err) throw err;
      console.log(`Source file has been downloaded and written to destination: "${destination}" \n${stats.size} bytes in ${endTime} milliseconds!`);
      rl.close();
    });
  });
};

const source = checkArg(2);
let destination = checkArg(3);
const doggo = String.fromCodePoint(0x1F415);

console.log(`Fetching ${doggo}${doggo}${doggo} your page from: ${source}`);

let startTime = Date.now();

request(source, (error, response, body) => {
  
  if (!error) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    
    fs.exists(destination, (exists) => {
      if (exists) {
        startTime = Date.now() - startTime;
        process.stdout.write('\x07');
        rl.question(`${destination} already exists... overwrite it? (y) or  (n)`, (input) => {
          if (input === 'y') {
            console.log(`Overwriting ${destination}...`);
            writeTheFileAlready(body, startTime);
          } else if (input === 'n') {
            rl.question(`What should the new destination be? `, (input) => {
              destination = input;
              fs.exists(destination, (exists) => {
                if (exists) {
                  console.log(`${destination} also exists... Exiting process.`);
                  process.exit();
                } else {
                  writeTheFileAlready(body,startTime);
                }
              });
            });
          } else {
            console.log('Instructions unclear. Exiting process.');
            process.exit();
          }
        });
      } else {
        startTime = Date.now() - startTime;
        writeTheFileAlready(body, startTime);
      }
    });
    
  } else {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('error:', error); // Print the error if one occurred
    console.log('Unable to fetch the page, something went wrong... :sad doggo:', doggo,doggo,doggo);
    process.exit();
  }
});