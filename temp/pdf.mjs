import puppeteer from 'puppeteer';

(async () => {
  console.log(puppeteer.defaultBrowserRevision);

  // Start the browser
  const browser = await puppeteer.launch();

  // Open a new blank page
  const page = await browser.newPage();

  // Set screen size
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate the page to a URL and wait for everything to load
  await page.goto('https://doc.doppio.sh', { waitUntil: 'networkidle0' });

  // Use screen CSS instead of print
  await page.emulateMediaType('screen');

  // Render the PDF
  const pdf = await page.pdf({
    path: 'render.pdf', // Output the result in a local file
    printBackground: true,
    format: 'A4',
  });

  // Close the browser
  await browser.close();
})();