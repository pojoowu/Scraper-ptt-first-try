function pttTitles(section, callback) {
  const request = require('request');
  const cheerio = require('cheerio');
  const fs = require('fs');
  const writeStream = fs.createWriteStream('post.csv', {
    encoding: 'utf8'
  });

  writeStream.write(`Title, Content, Link, Comments, Date \n`);

  let database = [],
    index = 0;
  //for (let i = 0; i < 5; i++) {
  request(`https://www.ptt.cc/bbs/${section}/index.html`, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);

      $('.r-ent').each((i, el) => {
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
        request(`http://www.ptt.cc${link}`, (error, response, html) => {
          if (!error && response.statusCode === 200) {
            let $ = cheerio.load(html);
            let count = 0;
            $('.push').each(() => {
              data.comments++;
            });
            data.content = $('#main-content').children().remove().end().text().replace(/\n|\t/g, ' ');
            callback(data);
          }
        });

      })
    }
    console.log("Done writing");
  });
}
