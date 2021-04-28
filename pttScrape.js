// const request = require('request');
// const cheerio = require('cheerio');
import request from 'request';
import cheerio from 'cheerio';
export default function (section, startingPage, k) {
  let database = [];
  return (new Promise((resolve, reject) => {
    for (let j = 0; j < 10; j++) {
      const p1 = new Promise((resolve, reject) => {
        request(`http://www.ptt.cc/bbs/${section}/index${startingPage - j}.html`,
          (error, response, html) => {
            if (error || response.statusCode !== 200) {
              reject(error);
            } else {
              resolve(html);
            }
          });
      });
      p1.catch(() => console.log('An error'));
      p1.then((html) => {
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
          const p2 = new Promise((resolve, reject) => {
            request(`http://www.ptt.cc${link}`,
              (error, response, html) => {
                if (error || response.statusCode !== 200) {
                  reject(error);
                } else {
                  resolve(html);
                }
              })
          });
          p2.catch(() => { });
          p2.then((html) => {
            let $ = cheerio.load(html);
            data.commemts = $('.push').length;
            data.content = $('#main-content').children().remove().end().text()
              .replace(/\n|,/g, ' ').replace(/\t/g, ' ');
            database.push(data);
            if (database.length === k) {
              resolve(database);
            }
          });
        });
      });
    }
  }));
  console.log("Done writing");
}
