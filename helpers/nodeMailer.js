const nodemailer = require("nodemailer");

const mailer = (mailto, user) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // use SSL
    port: 25,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS_EMAIL,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup e-mail data
  var mailOptions = {
    from: process.env.EMAIL, // sender address (who sends)
    to: mailto, // list of receivers (who receives)
    subject: `Welcome ${user} from Hackbid`, // Subject line
    html: `<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Contoh Email Keren</title>
        <style type="text/css">
            body {
                background-color: #f2f2f2;
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
    
            .container {
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                margin: 20px auto;
                max-width: 600px;
                padding: 20px;
            }
    
            h1, h2, h3, h4, h5, h6 {
                color: #333333;
                font-weight: 700;
                line-height: 1.2;
                margin: 20px 0 10px;
            }
    
            p {
                color: #666666;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 20px;
            }
    
            a {
                color: #0077cc;
                text-decoration: none;
            }
    
            .button {
                background-color: #0077cc;
                border: none;
                border-radius: 5px;
                color: #ffffff;
                display: inline-block;
                font-size: 16px;
                line-height: 1.2;
                margin: 20px 0;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
            }
    
            .button:hover {
                background-color: #005fa3;
            }
    
            @media screen and (max-width: 600px) {
                .container {
                    margin: 10px auto;
                    max-width: 100%;
                    padding: 10px;
                }
    
                h1, h2, h3, h4, h5, h6 {
                    margin: 10px 0;
                }
    
                p {
                    font-size: 14px;
                }
    
                .button {
                    margin: 10px 0;
                    padding: 5px 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://hackbid-asset.s3.ap-southeast-1.amazonaws.com/foremail.png" style=" width: 350px; margin-left: 20%;"/>
            <h3 style="text-align: center;">👋Hello ${user} Welcome to HackBID</h3>
        <p>Hello ${user},</p>
    
    <p>We would like to express our utmost gratitude for joining the Hackbid application. We are thrilled and excited to have you as part of our community</p>
    
    <p>We hope that the Hackbid application can provide great benefits to you and assist you in achieving your goals and dreams in the world of information technology. We also hope to continue improving this application and providing a better experience for all of its users.</p>
    
    <p>Once again, thank you for your trust and support in the Hackbid application. We hope to continue working together and contributing to the development of the information technology industry in Indonesia.
    
    Warm regards,</p>
    
    [Hackbid Team]
    
    
    
    
        </div>
    </body>
    </html>
     `,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    console.log("Message sent: " + info.response);
  });
};

module.exports = mailer;
