import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();

  
page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
  );

  await page.goto('https://lacontroller.org/audits-and-reviews/');

  await page.screenshot({
    path: 'screenshot.jpg',
  });

  await browser.close();
})();