const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

recordRoutes.route("/sendLink").post(function (req, res) {
    const link = req.body.link;
    async function fetcher(){
        const scrapper = await import('../Scrapper/puppet2.mjs');
        await scrapper.scrapeData(link);
        return "Scraping Complete"
    }
    let scrape = fetcher();
    if(scrape = "Scraping Complete") res.json("Data Scraped")
    
    // setInterval(()=> fetcher(), 10000);
});

recordRoutes.route("/getData").get(function(req, res){

    async function sendData(){
        const jsonFile = await import("../storage/datasets/default/000000001.json", { assert: { type: 'json' } })
        res.json(jsonFile);
    }
    sendData();
    // setInterval(()=>sendData(), 12000);
})


module.exports = recordRoutes;
