const https = require("https");

https.get("https://textract.us-east-1.amazonaws.com", (res) => {
  console.log("STATUS:", res.statusCode);
}).on("error", (e) => {
  console.error(e);
});