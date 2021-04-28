// const request = require('request');
// const cheerio = require('cheerio');
import request from 'request';
import cheerio from 'cheerio';
export default function (section, callback) {
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
            data.content = $('#main-content').children().remove().end().text().replace(/\n|,/g, ' ').replace(/\t/g, ' ');
            callback(data);
          }
        });
      })
    }
    console.log("Done writing");
  });
}
