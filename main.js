// Création d'un browser
const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const targetUrl = "YOUR_URL";

  const response = await page.goto(targetUrl);

  if (response.status() > 399) {
    throw new Error(`
    Une erreur est survenue lors de la navigation, code : ${response.status()}`);
  }

  // Prendre le contenu de la page en photo
  await page.screenshot({
    path: `./screenshots/image.png`,
  });

  await page.screenshot({
    path: `./screenshots/image-full.png`,
    fullPage: true,
  });

  const latency =
    response._request._timing.responseEnd -
    response._request._timing.requestStart;

  console.log(
    `La latence de la page ${targetUrl} est de ${latency.toFixed(0)} ms`
  );

  await page.close();
  await browser.close();
}

run();
