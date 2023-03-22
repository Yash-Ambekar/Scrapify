const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

recordRoutes.route("/sendLink").post(async function (req, res) {
    const link = await req.body.link;
    console.log("Link aali", link);
    async function fetcher(link){
        const scrapper = await import('../Scrapper/puppet2.mjs');
        await scrapper.scrapeData(link);
    }

    console.log("fetcher ke pehele");
    await fetcher(link);
});

module.exports = recordRoutes;
