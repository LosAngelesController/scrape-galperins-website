import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

import * as cheerio from 'cheerio';
import editJsonFile from 'edit-json-file'

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], 
executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});

// If the file doesn't exist, the content will be an empty object by default.
var financeindex = editJsonFile(`./financeindex.json`);

const financeall = editJsonFile('./financeexport.json')




  console.log('browser launched, attempting to pull')

  var reports = financeindex.get("finance");

  var lengthofreports = reports.length;

  var arrayOfReports = [];

  for (var i = 0; i <  lengthofreports; i++) {
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080});
  page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    );
  

    console.log(reports[i]);

    await page.goto(reports[i].link);


    //Do something

    console.log('went to ', reports[i].link);


    const elHandleArray = await page.$$('.panel-title');

    console.log('hello')

    for (const el of elHandleArray) {
      await el.click()
    }

    var textofpage = await page.evaluate(() => {

         // return Promise.resolve(document.querySelectorAll('.asp_r_audits_reports'));
         if (document.querySelector(".main-content-pages > .vc-column-innner-wrapper")) {
          
          return document.querySelector(".main-content-pages > .vc-column-innner-wrapper").innerText;   
          } else {
            console.log('no text')
            return ""
          }
       });

       var htmlofpage = await page.evaluate(() => {
        // return Promise.resolve(document.querySelectorAll('.asp_r_audits_reports'));
        if (document.querySelector(".main-content-pages > .vc-column-innner-wrapper")) {
          
        return document.querySelector(".main-content-pages > .vc-column-innner-wrapper").innerHTML;   
        } else {
          console.log('no html')
          return ""
        }
       });

    var pdflink = await page.evaluate(() => {
      if (document.querySelector(".bg-showmore-open > h3 > a")) {
        return document.querySelector(".bg-showmore-open > h3 > a").getAttribute('href').replace("lacontroller.org","wpstaticarchive.lacontroller.io")
      } else {
        console.log("no pdf")
        return ""
        
      }
       
    })

    arrayOfReports.push({
        ...reports[i],
        pdflink,
        textofpage,
        htmlofpage,
        image: reports[i].image.replace("lacontroller.org", "wpstaticarchive.lacontroller.io")
    })

    financeall.set('finance', arrayOfReports);
    financeall.save();

    console.log('pushed')

    await page.close();

    console.log('closing page')
}

  await browser.close(
  );


})();