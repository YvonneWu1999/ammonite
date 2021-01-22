const puppeteer = require('puppeteer');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
const express = require('express');
const app = express();

function isTicket() {
    return document.getElementById('group_15103').innerHTML != '';
    // return document.getElementById('8808_1').innerHTML != '';
}
//'*/10 * * * *'
function scheduleCronstyle() {
    schedule.scheduleJob('*/10 * * * *', function () {
        //scraping
        var currentTicket = "";
        (async () => {
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.goto('https://tghff.tixcraft.com/ticket/area/20_GHMF/8807');
            //wait for the certain element
            await page.waitForSelector('#group_15103');
            await page.waitForFunction(isTicket);
            currentTicket = await page.evaluate(() => {
                var text = document.getElementById('group_15103').innerText;
                let [first, ...second] = text.split(" ");
                ammonite = second.join(" ");
                return ammonite;
                // return document.getElementById('group_15103').innerText;
                // return document.getElementById('group_15103').innerHTML
                //var li = document.getElementById('8808_1').innerHTML;
            });
            console.log(currentTicket);
            if (currentTicket != "Sold out") {
                console.log("ticket is available!!!!");

                //send email
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    // auth: {
                    //     // user: process.env.EMAIL_ACCOUNT, //sender Gmail Address
                    //     // pass: process.env.EMAIL_PASS
                    //     user: 'klxtaro1324@gmail.com', //sender Gmail Address
                    //     pass: '1j45jp32l4'
                    // }
                    auth: {
                        type: "OAuth2",
                        user: process.env.ACCOUNT,
                        clientId: process.env.CLINENTID,
                        clientSecret: process.env.CLINENTSECRET,
                        refreshToken: process.env.REFRESHTOKEN,
                    }
                });

                const mailOptions = {
                    from: 'yvonnewu1324@gmail.com', //sender
                    to: ['107306059@nccu.edu.tw', 'whatamath0626@gmail.com', 'klxtaro1324@gmail.com'], //receiver 'whatamath0626@gmail.com' 'yvonnewu1324@gmail.com'
                    subject: '有票拉快搶(⁎⁍̴̛ᴗ⁍̴̛⁎)', //title
                    html: currentTicket + ' holyyyyyyy go GET that FOOKKING TICKET' + '<a href="https://tghff.tixcraft.com/ticket/area/20_GHMF/8807" target="_blank">快搶菊石阿阿阿</a>',  //text
                    // text: currentTicket + " holyyyyyyy go GET that FOOKKING TICKET" 
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(info.response);
                    }
                });
            }
            await browser.close();
        })();

    });
}
scheduleCronstyle();

app.get('/', (req, res) => {
    res.send('ammonite bae!!!!!!')
})


app.listen(process.env.PORT || 3030, function () {
    console.log('it works yooyoyoy');

});