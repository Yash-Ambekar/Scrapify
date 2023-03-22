import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

// let link = "https://news.ycombinator.com/";

export async function fetchData() {
  
  await Actor.init();

  const crawler = new PuppeteerCrawler({
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },

    maxRequestsPerCrawl: 10,

    async requestHandler({ request, page, enqueueLinks }) {
      console.log(`Processing ${request.url}...`);

      const data = await page.$$eval(".stock-security-sidebar", ($posts) => {
        const scrapedData = [];

        $posts.forEach(($post) => {
          scrapedData.push({
            security: $post.querySelector(".security-name").innerText,
            price: $post.querySelector(".current-price").innerText,
            // title: $post.querySelector(".title a").innerText,
            // rank: $post.querySelector(".rank").innerText,
            // href: $post.querySelector(".title a").href,
          });
        });

        return scrapedData;
      });

      await Actor.pushData(data);

      const infos = await enqueueLinks({});

      if (infos.length === 0) console.log(`${request.url} is the last page!`);
    },

    failedRequestHandler({ request }) {
      console.log(`Request ${request.url} failed too many times.`);
    },
  });

  await crawler.run(["https://www.tickertape.in/stocks/reliance-industries-RELI"]);

  console.log("Crawler finished.");

  await Actor.exit();
}

fetchData();