const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false;
const app = next({ dev, hostname: "localhost", port: "3000" });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
