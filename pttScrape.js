// const request = require('request');
// const cheerio = require('cheerio');
import request from 'request';
import cheerio from 'cheerio';
export default function (section, startingPage, k) {
  let database = [];
  return (new Promise((resolve, reject) => {
    for (let j = 0; j < Math.floor(k / 10); j++) {
      const p1 = findPttTitle(section, startingPage - j);
      p1.catch(console.error);
      p1.then((html) => {
        let $ = cheerio.load(html);

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
          const p2 = grabPttContent(link);
          p2.catch(console.error);
          p2.then((html) => {
            let $ = cheerio.load(html);
            data.commemts = $('.push').length;
            data.content = $('#main-content').find('.push, .richcontent, .f2')
              .remove().end().text().replace(/\n|,|\t/g, ' ');
            database.push(data);
            if (database.length === k) {
              resolve(database);
            }
          });
        });
      });
    }
  }));
}


function findPttTitle(section, index) {
  return (
    new Promise((resolve, reject) => {
      request(`http://www.ptt.cc/bbs/${section}/index${index}.html`,
        (error, response, html) => {
          if (error || response.statusCode !== 200) {
            reject(error);
          } else {
            resolve(html);
          }
        });
    })
  );
}

function grabPttContent(link) {
  return (
    new Promise((resolve, reject) => {
      request(`http://www.ptt.cc${link}`,
        (error, response, html) => {
          if (error || response.statusCode !== 200) {
            reject(error);
          } else {
            resolve(html);
          }
        })
    })
  );
}