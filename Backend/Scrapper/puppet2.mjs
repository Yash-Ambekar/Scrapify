import { Actor } from "apify";
import {
  PuppeteerCrawler,
  puppeteerUtils,
  Session,
  toughCookieToBrowserPoolCookie,
} from "crawlee";
import puppeteer from "puppeteer";

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

export async function getData() {
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

export async function getDocker(link) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: "ws://localhost:3000/&blockAds&stealth",
  });
  const page = await browser.newPage();

  await page.goto(link, { timeout: 0 });
  const data = await page.content();
  browser.close();

  return data;
}

export async function getApify(link) {
  await Actor.init();

  // Create a PuppeteerCrawler
  const postNavigationHooks = [
    async ({ page }) =>
      page.setCookies([
        {
          SID: "UwgOms7OVrvUSQhZfNT8G4Q23p-3YwXyjVIKVmR4rBSK2L_IyF897L-qQIfAYVjjZAmnXw.",
          APISID: "D6Uj54yelDMgiNDn/ADJvUIEEnU634BG3t",
          SAPISID: "XBvcG-R2r-giBNQO/AZ2XvxZFihM05HtN3",
          "__Secure-1PAPISID": "XBvcG-R2r-giBNQO/AZ2XvxZFihM05HtN3",
          "__Secure-3PAPISID": "XBvcG-R2r-giBNQO/AZ2XvxZFihM05HtN3",
          SIDCC:
            "AFvIBn951_FHvhm0HMaZ6elj9-RriJDm2x-c9CuMw0v9xuMCKAytYjJUxwsla7oFahcMGi3CcA0P",
          PREF: "f6=40000000&tz=Asia.Kolkata&f7=100&f5=30000",
        },
      ]),
  ];
  const crawler = new PuppeteerCrawler({
    // postNavigationHooks,
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },
    async requestHandler({ request, page }) {
      // Convert the URL into a valid key
      const key = request.url.replace(/[:/#]/g, "_");
      // const key = request.url.replace(/\//g, '_');
      // const session = new Session();
      // session.setCookies([
      //   {
      //     SID: "UwgOms7OVrvUSQhZfNT8G4Q23p-3YwXyjVIKVmR4rBSK2L_IyF897L-qQIfAYVjjZAmnXw.",
      //     APISID: "D6Uj54yelDMgiNDn/ADJvUIEEnU634BG3t",
      //     SAPISID: "XBvcG-R2r-giBNQO/AZ2XvxZFihM05HtN3",
      //     "__Secure-1PAPISID": "XBvcG-R2r-giBNQO/AZ2XvxZFihM05HtN3",
      //     "__Secure-3PAPISID": "XBvcG-R2r-giBNQO/AZ2XvxZFihM05HtN3",
      //     SIDCC:
      //       "AFvIBn951_FHvhm0HMaZ6elj9-RriJDm2x-c9CuMw0v9xuMCKAytYjJUxwsla7oFahcMGi3CcA0P",
      //     PREF: "f6=40000000&tz=Asia.Kolkata&f7=100&f5=30000",
      //   },
      // ]);

      // Capture the screenshot

      await page.setCookie(
        ...[
          {
              "name": "__Host-user_session_same_site",
              "value": "H0OoDLMQ1wc8WdyTMiX6DPNzFnijoaF64EwXmgwQuK65PYaA",
              "domain": "github.com",
          },
          {
              "name": "dotcom_user",
              "value": "Yash-Ambekar",
              "domain": ".github.com",
          },
          {
              "name": "has_recent_activity",
              "value": "1",
              "domain": "github.com",
          },
          {
              "name": "_device_id",
              "value": "6311208aeee8b59676363183cdefd6c3",
              "domain": "github.com",
          },
          {
              "name": "_gh_sess",
              "value": "Vggic9yf9o2YPBJvo4YwwqsohuzU%2FwXD2yVHWzXggu%2BtRHFZRrSb2%2FRPyUn7C97FKvGkLdrq8MpN2s%2FE9jnczEx39j6RFeleEyjXzcwA45knc0LeDLVn2%2BNJYEfzsChQmBc9NBOZWh6BPAHW9Ea5p3asaHdXlJM7F8gtWBVamQH9OqUIgCivwyicXiOFp89fdCdG2UwQVs3HjIpUqTON71Qbf7U%2B%2BfOzdvhECjSuOtLpJZSJhBqqjSuUsTzNnKz0FpwtA50NWRP94GcK6IkzFsr4OOlq--5s6ZbWqC1oQSagII--Iz8athL%2BR4Hu3fArLCIk2A%3D%3D",
              "domain": "github.com",
          },
          {
              "name": "_octo",
              "value": "GH1.1.942778586.1672226699",
              "domain": ".github.com",
          },
          {
              "name": "color_mode",
              "value": "%7B%22color_mode%22%3A%22dark%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark_dimmed%22%2C%22color_mode%22%3A%22dark%22%7D%7D",
              "domain": ".github.com",
          },
          {
              "name": "logged_in",
              "value": "yes",
              "domain": ".github.com",
          },
          {
              "name": "preferred_color_mode",
              "value": "dark",
              "domain": ".github.com",
          },
          {
              "name": "tz",
              "value": "Asia%2FKolkata",
              "domain": ".github.com",
          },
          {
              "name": "user_session",
              "value": "H0OoDLMQ1wc8WdyTMiX6DPNzFnijoaF64EwXmgwQuK65PYaA",
              "domain": "github.com",
          },
          {
              "name": "__Host-user_session_same_site",
              "value": "H0OoDLMQ1wc8WdyTMiX6DPNzFnijoaF64EwXmgwQuK65PYaA",
              "domain": "github.com",
          },
          {
              "name": "dotcom_user",
              "value": "Yash-Ambekar",
              "domain": ".github.com",
          },
          {
              "name": "has_recent_activity",
              "value": "1",
              "domain": "github.com",
          },
          {
              "name": "_device_id",
              "value": "6311208aeee8b59676363183cdefd6c3",
              "domain": "github.com",
          },
          {
              "name": "_gh_sess",
              "value": "Vggic9yf9o2YPBJvo4YwwqsohuzU%2FwXD2yVHWzXggu%2BtRHFZRrSb2%2FRPyUn7C97FKvGkLdrq8MpN2s%2FE9jnczEx39j6RFeleEyjXzcwA45knc0LeDLVn2%2BNJYEfzsChQmBc9NBOZWh6BPAHW9Ea5p3asaHdXlJM7F8gtWBVamQH9OqUIgCivwyicXiOFp89fdCdG2UwQVs3HjIpUqTON71Qbf7U%2B%2BfOzdvhECjSuOtLpJZSJhBqqjSuUsTzNnKz0FpwtA50NWRP94GcK6IkzFsr4OOlq--5s6ZbWqC1oQSagII--Iz8athL%2BR4Hu3fArLCIk2A%3D%3D",
              "domain": "github.com",
          },
          {
              "name": "_octo",
              "value": "GH1.1.942778586.1672226699",
              "domain": ".github.com",
          },
          {
              "name": "color_mode",
              "value": "%7B%22color_mode%22%3A%22dark%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark_dimmed%22%2C%22color_mode%22%3A%22dark%22%7D%7D",
              "domain": ".github.com",
          },
          {
              "name": "logged_in",
              "value": "yes",
              "domain": ".github.com",
          },
          {
              "name": "preferred_color_mode",
              "value": "dark",
              "domain": ".github.com",
          },
          {
              "name": "tz",
              "value": "Asia%2FKolkata",
              "domain": ".github.com",
          },
          {
              "name": "user_session",
              "value": "H0OoDLMQ1wc8WdyTMiX6DPNzFnijoaF64EwXmgwQuK65PYaA",
              "domain": "github.com",
          }
      ]
      ).catch((e)=>{
        console.log(e)
      })
      
      await page.waitForNetworkIdle({idleTime:5000})
      await puppeteerUtils.saveSnapshot(page, { key, saveHtml: true });
    },
  });

  // Run the crawler
  await crawler.run([{ url: link }]);

  await Actor.exit();
}
