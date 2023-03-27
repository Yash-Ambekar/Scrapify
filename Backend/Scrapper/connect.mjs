import puppeteer from 'puppeteer'

export async function connect(link){
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle0' }); // URL is given by the "user" (your client-side application)
    const screenshotBuffer = await page.screenshot({
        path:'screenshot.jpg',
        fullPage: true
    });

    // // Respond with the image

    await browser.close();
    return screenshotBuffer;
}