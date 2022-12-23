import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

import * as cheerio from 'cheerio';
import editJsonFile from 'edit-json-file'

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], 
executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});

// If the file doesn't exist, the content will be an empty object by default.
var fileauditsindex = editJsonFile(`./financeindex.json`);

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});
page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
  );



  console.log('browser launched, attempting to pull')

  await page.goto('https://lacontroller.org/financial-reports/');

  console.log('loaded main page, waiting for content')

  await new Promise(r => setTimeout(r, 2000));

  console.log('scrolling front page')

  await page.evaluate( () => {
    window.scrollBy(0, window.innerHeight * 2);
  });

  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: 'screenshot.jpg',
    fullPage: true
  });

  let list = await page.evaluate(() => {
   // return Promise.resolve(document.querySelectorAll('.asp_r_audits_reports'));

   
    const listofaudits = []
    document.querySelectorAll(".asp_r_financial_reports").forEach((item) => {listofaudits.push(item.outerHTML)});

    return listofaudits
   
  });
  
 console.log(list);

 const listofauditsprocessed = list.map((eachHtmlBlock) => {
  const $ = cheerio.load(eachHtmlBlock);

 // console.log($(".asp_res_image_url"))

  var linkUrl = $(".asp_res_image_url").attr("href");

  console.log(linkUrl);

  var image = $(".asp_image").attr("data-src");

  var name = $(".search-title-field").text();

  var firstgroup = $(".search-sub-head").html();

  var arrayOfStuff = firstgroup.split('<br>');

  var year = arrayOfStuff[0];

  var dept = arrayOfStuff[1];

  var objectOfIndex = {
    image,
    name,
    year,
    dept,
    link: linkUrl
  }

  console.log(objectOfIndex)

  return objectOfIndex

  
})

fileauditsindex.set("audits", listofauditsprocessed)
fileauditsindex.save()


  await browser.close(
  );
})();