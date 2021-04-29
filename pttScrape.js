// const request = require('request');
// const cheerio = require('cheerio');
import request from 'request';
import cheerio from 'cheerio';
export default async function grabPttArticles(section, startingPage, k) {
  const indices = Array(Math.floor(k/10)).fill(0).map((val, index) => startingPage - index);
  const database = await Promise.all(indices.map((index) => getPttArticleByIndex(section, index)));
  return [].concat(...(database)).splice(0, k);
}

async function getPttArticleByIndex(section, index){
  const html = await findHTML(`https://www.ptt.cc/bbs/${section}/index${index}.html`);
  const $body = cheerio.load(html);
  const $titles = $body('.r-ent');
  const results = await Promise.all($titles.map((i, el) => grabData($body(el))));
  return results.reverse();
}
//   let j = 0,
//     stopping = false;
//   while (j < k && !stopping) {
//     let html = await findHTML(`${section}/index${startingPage - j}`);
//     let $ = cheerio.load(html);
//     $('.r-ent').each(async function (i, el) {
//       let data = await grabData(i, el, $);
//       if (database.length < k) {
//         database.push(data);
//       } else {
//         stopping = true;
//       }
//     });
//     j++;
//   }
//   console.log("Done");
//   return database;
// }

async function grabData($el) {
  //grabbing the title, link, date
  const title = $el.find('.title a').text();
  const link = $el.find('.title a').attr('href');
  const date = $el.find('.meta .date').text();
  const data = {
    title: title,
    link: link,
    date: date,
    content: null,
    comments: null
  };
  try {
    const html = await findHTML(`http://www.ptt.cc/${link}`);
    const $ = cheerio.load(html);
    data.commemts = $('.push').length;
    data.content = $('#main-content').find('.push, .richcontent, .f2')
      .remove().end().text().replace(/\n|,|\t/g, ' ');
  } catch (error) {
    data.content = "deleted";
  }
  return data;
}


function findHTML(link) {
  return (
    new Promise((resolve, reject) => {
      request(link,
        (error, response, html) => {
          if (error) {
            reject(error);
          } 
          else if(response.statusCode !== 200){
            reject(new Error(`Get response with status code ${response.statusCode}`));
          }
          else {
            resolve(html);
          }
        });
    })
  );
}