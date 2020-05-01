# DoubtNut Assignment [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e8d178746edfde6f1c41)

### Brief about this project:
```
 1. A user sends their info like name, email, links through JSON.
 2. Then the server stores that JSON on the ram.
 3. There's a template in form of handlebars, that hbs will convert into HTML having all the information extracted from the JSON to create the PDF.
 4. I've created a DB using sqlite which will contain the all the info of the user and the time of request came.
 5. I've used html-to-pdf module to convert the HTML to PDF.
 6. Then the server store that PDF on the RAM.
 7. After this, i've used node-cron to schedule a task which is to query on the User table where it will give all the user requests that are not processed in the last 5 minutes and send the PDF through mail.
```

### Prerequisite before starting the server:
```
 1. Having a JSON file which will in the form mentioned below.
 2. Postman app for testing the API.
``` 

### JSON format:
```json
{
"name": "Your name",
"email": "Your Email",
"links": ["links of the content you want to share","",]
}
```

### Steps to start the server:
```
 1. npm i
 2. npm start
```

### Some changes in the code you have to do to send the mail:
```
1. Put the credentials of your email account on line 27 and 28 in server.js file.
2. Set the senders email ID again on line 44 in server.js file.
3. If you haven't allow the access of non-google apps to login then you have to enable this for nodemailer to send the mail.
Link for the documentation on this [Click here](https://support.google.com/accounts/answer/6010255)
```

### Some more information:
```
* You can send JSON as a file or as a string with key 'jsonData'.
```
