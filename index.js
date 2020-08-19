const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const router = express.Router();
require('dotenv').config(); 

let port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('*', function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, x-access-token");
    next(); 
  });

const sendMail = async (text, email, subject, message) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from: process.env.EMAIL, 
            to: process.env.EMAIL, 
            subject: subject, 
            html: `<h3>${text}</h3>
                    <p style="color:blue;">Email: ${email.toString()}</p>
                    <h4>${message.toString()}</h4>`
        });

    } catch (error) {
        console.log(error);
    }
}  

router.post('/send', async (req, res) => {
    try {
        console.log(req.body);
        sendMail(req.body.text.toString(), req.body.email.toString(), req.body.subject.toString(), req.body.message.toString());
        res.status(200).send({response: "email send"});
    } catch (error) {
        res.status(500).send('Internal serwer error');
    }
});

app.use('/api', router);

app.listen(port, () => console.log('**server started**'));