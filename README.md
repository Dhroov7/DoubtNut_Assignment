# DoubtNut Assignment [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e8d178746edfde6f1c41)

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
```
