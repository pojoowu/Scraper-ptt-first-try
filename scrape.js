const request = require('request');
const cheerio = require('cheerio');
let database = [],
  index = 0;
for (let i = 0; i < 5; i++) {
  request(`https://www.ptt.cc/bbs/Hearthstone/index${2716-index}.html`, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);

      $('.r-ent').each((i, el) => {
        const title = $(el).find('.title a').text();
        const link = $(el).find('a').attr('href');
        request(link, (errorIn, responseIn, htmlIn) => {
          if(!errorIn && responseIn.statusCode === 200){
            let mm = cheerio.load(htmlIn);

          }
        });
        const date = $(el).find('.meta').children('.date').text();
        let data = {
          title: title,
          link: link,
          date: date
        };
        database.push(data);
      })
    }
  });
  index++;
}
