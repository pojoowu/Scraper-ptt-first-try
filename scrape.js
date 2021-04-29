import fs from 'fs';
let writeStream = fs.createWriteStream('post.csv');
import fn from './pttScrape.js';

//Write Headers
writeStream.write(`Title, Link, Content, NbComments, Date \n`);
try {
  const database = await fn("Hearthstone", 2716, 100);
  for (let data of database) {
    writeStream.write(`${data.title}, ${data.link}, ${data.content},
  ${data.comments}, ${data.date} \n`);
  }
} catch (error) {

}