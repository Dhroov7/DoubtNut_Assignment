const express = require("express");
const app = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const pdf = require("html-pdf");
var nodemailer = require("nodemailer");
const Op = require("sequelize").Op;
const options = { format: "Letter" };
const user = require("./models/index").models.user;

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");

// setting auth credentionls of your email account.
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Your Email ID:",
    pass: "Your Password:",
  },
});

// Using node-cron for scheduling task for checking last request and seding pdf file through mail.
cron.schedule("0 */5 * * * *", async function () {
  try {
    let users = await user.findAll({
      where: {
        updatedAt: {
          [Op.gt]: new Date(Date.now() - 5 * 60 * 1000), // getting all users requests which are less than 5 minutes
        },
      },
    });
    users.forEach((user) => {
      var mailOptions = {
        from: "Your Email ID:",
        to: user.dataValues.email,
        subject: "Your PDF file!",
        attachments: [
          {
            filename: user.dataValues.name + ".pdf",
            path: "./pdf-outputs/" + user.dataValues.name + ".pdf",
            contentType: "application/pdf",
          },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      // Delete the file from the server RAM after sending the mail to the user.
      fs.unlinkSync("./pdf-outputs/" + user.dataValues.name + ".pdf");
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/", (req, res) => {
  // check if the input type is file
  if (req.files && req.files.jsonData) {
    let jsonFile = req.files.jsonData;
    // move the input file to the uploads folder
    jsonFile.mv("./uploads/" + jsonFile.name);
    fs.readFile("./uploads/" + jsonFile.name, "utf8", (err, json) => {
      if (err) {
        return res.status(400).send({
          message: "Something's wrong, please try again later",
        });
      }
      json = JSON.parse(json);
      user
        .upsert({
          name: json.name,
          email: json.email,
        })
        .then(() => {
          // Starting of HTML to PDF conversion
          return res.render(
            "template.hbs",
            {
              info: json,
            },
            function (err, HTML) {
              pdf
                .create(HTML, options)
                .toFile("./pdf-outputs/" + json.name + ".pdf", async function (
                  //set location for creating pdf file
                  err,
                  buffer
                ) {
                  if (err) {
                    return res.status(400).send({
                      message: "Something's wrong, please try again later",
                    });
                  }
                  // update the user request to process the latest request
                  await user.upsert({
                    name: json.name,
                    email: json.email,
                    updatedAt: Date.now(),
                  });

                  res.send("Request processed successfully!");
                });
            }
          );
        });
    });
  } else {
    // input type is not file nor string
    if (!req.body.jsonData) {
      return res.send({
        status: false,
        message: "No input",
      });
    }
    // input type is string
    let json = req.body.jsonData;
     // Starting of HTML to PDF conversion
    res.render(
      "template.hbs",
      {
        info: JSON.parse(json),
      },
      function (err, HTML) {
        pdf
          .create(HTML, options)
          .toFile("./pdf-outputs/" + json.name + ".pdf", async function (
            err,
            result
          ) {
            if (err) {
              return res.status(400).send({
                message: "Something's wrong, please try again later",
              });
            }

            await user.upsert({
              name: json.name,
              email: json.email,
              updatedAt: Date.now(),
            });

            res.send("Request processed successfully!");
          });
      }
    );
  }
});

app.listen(9090, () => {
  console.log("server started at 9090");
});
