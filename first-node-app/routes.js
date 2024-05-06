const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(
      '<html><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send Message</button></form></html>'
    );
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("close", () => {
      const parsedMessage = Buffer.concat(body).toString().split("=")[1];
      fs.writeFile("message.txt", parsedMessage, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  // res.setHeader("Content-Type", "text/html");
  res.write("<h1>Message Sent Successfully</h1>");
};

module.exports = requestHandler;
