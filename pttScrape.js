// const request = require('request');
// const cheerio = require('cheerio');
import request from 'request';
import cheerio from 'cheerio';
export default function (section, k, callback) {
  let database = [];
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
            data.content = $('#main-content').find('.push, .richcontent, .f2')
            .remove().end().text().replace(/\n|,/g, ' ').replace(/\t/g, ' ');
            database.push(data);
            if(database.length === 5){
              callback(database);
            }
          }
        });
      })
    }
    console.log("Done writing");
  });
}
