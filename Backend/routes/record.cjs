const express = require("express");
var path = require('path');
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

recordRoutes.route("/sendLink").post(function (req, res) {
  const link = req.body.link;
  async function fetcher() {
    const scrapper = await import("../Scrapper/puppet2.mjs");
    await scrapper.scrapeData(link);
    return "Scraping Complete";
  }
  let scrape = fetcher();
  if ((scrape = "Scraping Complete")) res.json("Data Scraped");

  // setInterval(()=> fetcher(), 10000);
});

recordRoutes.route("/getData").get(function (req, res) {
  async function sendData() {
    const jsonFile = await import(
      "../storage/datasets/default/000000001.json",
      { assert: { type: "json" } }
    );
    res.json(jsonFile);
  }
  sendData();
  // setInterval(()=>sendData(), 12000);
});

recordRoutes.route("/connect").post(function (req, res) {
  const link = req.body.url;
  async function helper() {
    console.log(link, typeof link);
    const response = await fetch(
      `https://chrome.browserless.io/content?token=${process.env["API_TOKEN"]}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ url: `https://${link}` }),
      }
    );

    // const record = await response.json();
    const text = await response.text();
    console.log(text);
    res.send(text);
  }
  helper();
});

recordRoutes.route("/docker").post(async function (req, res) {
  const link = await req.body.link;
  const docker = await import("../Scrapper/puppet2.mjs");
  const getDocker = await docker.getDocker(link);
  return res.send(getDocker);
});

recordRoutes.route("/apify").post(function (req, res) {
  const link = req.body.link;
  async function getHTML() {
    const apify = await import("../Scrapper/puppet2.mjs");
    console.log(link);
    await apify.getApify(link);
    const key = link.replace(/[:/]/g, "_");
    
  }
  getHTML();
  res.send("Hellew")
});

recordRoutes.route("/getdata").post(function(req, res){
  const link = req.body.link;
  const key = link.replace(/[:/]/g, "_");
  res.sendFile(path.resolve(`./storage/key_value_stores/default/${key}.html.html`));
});

module.exports = recordRoutes;
