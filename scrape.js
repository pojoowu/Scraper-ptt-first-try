let database = [],
  index = 0;
const fs = require('fs');
let writeStream = fs.createWriteStream('post.csv');

//Write Headers
writeStream.write(`Title, Link, Content, NbComments, Date \n`);

pttTitles("Hearthstone", (data) => {
  writeStream.write(`${data.title}, ${data.link}, ${data.content},
    ${data.comments}, ${data.date} \n`);
});

function pttTitles(section, callback) {
  const request = require('request');
  const cheerio = require('cheerio');
  let database = [],
    index = 0;
  //for (let i = 0; i < 5; i++) {
  request(`https://www.ptt.cc/bbs/${section}/index.html`, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);

      $('.r-ent').each((i, el) => {
        //grabbing the title, link, date
        const title = $(el).find('.title a').text();
        const link = $(el).find('a').attr('href');
        const date = $(el).find('.meta .date').text();
        let data = {
          title: title,
          link: link,
          date: date,
          content: '',
          comments: 0
        };
        //grabbing contents in each page
        request(`http://www.ptt.cc${link}`, (error, response, html) => {
          if (!error && response.statusCode === 200) {

            let $ = cheerio.load(html);
            $('.push').each(() => {
              data.comments++;
            });
            data.content = $('#main-content').children()
              .remove().end().text().replace(/\n|\t/g, ' ');
            console.log(data);
            callback(data);
          }
        });
      })
    }
    console.log("Done writing");
  });
}
