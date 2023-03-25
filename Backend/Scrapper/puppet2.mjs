import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

// let link = "https://news.ycombinator.com/";
// let link = "https://www.tickertape.in/stocks/reliance-industries-RELI"

export async function scrapeData(link) {
  await Actor.init();

  const crawler = new PuppeteerCrawler({
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },

    maxRequestsPerCrawl: 1,

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
      // const csvData = parse(data);
      await Actor.pushData(data);

      const infos = await enqueueLinks({});

      if (infos.length === 0) {
        console.log(`${request.url} is the last page!`);
      }
    },

    failedRequestHandler({ request }) {
      console.log(`Request ${request.url} failed too many times.`);
    },
  });

  await crawler.run([link]);

  console.log("Crawler finished.");

  await Actor.exit();

  
}

export async function getData(){
  await Actor.init();
  const dataset = await Actor.openDataset("default");
  const value = await dataset.getData();
  console.log(value.items);
  // const security = value.items[0].security;
  // const price = value.items[0].price;
  // console.log("The Security name is: ", security);
  // console.log("The Price is: ", price);
  await Actor.exit();
  // return ({security: security, price:price});
}

// scrapeData();