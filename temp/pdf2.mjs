import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';


(async () => {
  console.log(puppeteer.defaultBrowserRevision);

  // Start the browser
  const browser = await puppeteer.launch();

  // Open a new blank page
  const page = await browser.newPage();

  // Set screen size
  await page.setViewport({ width: 1920, height: 1080 });

  // Open the index.html file
  const htmlContent = readFileSync('./pdf.html', 'utf-8');

  // Now we use setContent instead of goto
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Use screen CSS instead of print
  await page.emulateMediaType('screen');

  // Render the PDF
  const pdf = await page.pdf({
    path: 'render2.pdf', // Output the result in a local file
    printBackground: true,
    format: 'A4',
  });

  // Close the browser
  await browser.close();
})();