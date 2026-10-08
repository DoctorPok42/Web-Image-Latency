// Création d'un browser
const { chromium } = require("playwright");

const screenSizes = [
  { name: "mobile", width: 375, height: 667, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15" },
  { name: "tablet", width: 768, height: 1024, userAgent: "Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit/605.1.15" },
  { name: "desktop-1024", width: 1024, height: 768, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
  { name: "desktop-1440", width: 1440, height: 900, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
  { name: "desktop-1920", width: 1920, height: 1080, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
  { name: "desktop-2560", width: 2560, height: 1440, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
];

async function run() {
  const browser = await chromium.launch();
  const targetUrl = "YOUR_URL";

  for (const screen of screenSizes) {
    const page = await browser.newPage({
      viewport: { width: screen.width, height: screen.height },
      userAgent: screen.userAgent,
    });

    const response = await page.goto(targetUrl);

    if (response && response.status() > 399) {
      throw new Error(`
    Une erreur est survenue lors de la navigation pour ${screen.name}, code : ${response.status()}`);
    }

    // Attendre que tous les composants aient fini de charger
    await page.waitForLoadState('networkidle');

    // Prendre le contenu de la page en photo
    await page.screenshot({
      path: `./screenshots/image-${screen.name}.png`,
    });

    await page.screenshot({
      path: `./screenshots/image-${screen.name}-full.png`,
      fullPage: true,
    });

    const latency =
      response._request._timing.responseEnd -
      response._request._timing.requestStart;

    console.log(
      `La latence de la page ${targetUrl} avec r??solution ${screen.width}x${screen.height} (${screen.name}) est de ${latency.toFixed(0)} ms`
    );

    await page.close();
  }

  await browser.close();
}

run();
