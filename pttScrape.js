// const request = require('request');
// const cheerio = require('cheerio');
import request from 'request';
import cheerio from 'cheerio';
export default async function (section, startingPage, k) {
  let database = [];
  let canReturn = false;
  for (let j = 0; j < Math.floor(k / 10); j++) {
    let html = await findPttTitle(section, startingPage - j);
    let $ = cheerio.load(html);

    $('.r-ent').each((i, el) => {
      //grabbing the title, link, date
      const title = $(el).find('.title a').text();
      const link = $(el).find('.title a').attr('href');
      const date = $(el).find('.meta .date').text();
      let data = {
        title: title,
        link: link,
        date: date,
        content: '',
        comments: 0
      };
      console.log(link);
      const p2 = grabPttContent(link);
      p2.then((html) => {
        let $ = cheerio.load(html);
        data.commemts = $('.push').length;
        data.content = $('#main-content').find('.push, .richcontent, .f2')
          .remove().end().text().replace(/\n|,|\t/g, ' ');
        console.log(database.length);
        if (database.length < k) {
          database.push(data);
        } else {
          canReturn = true;
        }
      }).catch((error) => {
        data.content = 'deleted';
        database.push(data);
      });
    });
  }
  console.log(database);
  return database;
}

function grabData() {

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