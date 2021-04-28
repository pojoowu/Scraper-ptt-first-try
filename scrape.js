let database = [],
  index = 0;
import fs from 'fs';
let writeStream = fs.createWriteStream('post.csv');
import fn from './pttScrape.js';

//Write Headers
writeStream.write(`Title, Link, Content, NbComments, Date \n`);

fn("Hearthstone", (data) => {
  writeStream.write(`${data.title}, ${data.link}, ${data.content},
    ${data.comments}, ${data.date} \n`);
});
