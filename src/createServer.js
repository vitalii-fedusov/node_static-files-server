/* eslint-disable no-console */
'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    const pathname = normalizedUrl.pathname.slice(1) || 'index.html';

    res.setHeader('Content-Type', 'text/plain');

    if (!req.url.startsWith('/file/')) {
      res.end('pathname should start with /file/');

      return;
    }

    if (req.url.includes('../')) {
      res.statusCode = 400;

      res.end();

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;

      res.end();

      return;
    }

    const path = pathname.slice(5);

    fs.readFile(`public/${path}`, (err, data) => {
      if (!err) {
        res.end(data);
      }

      res.statusCode = 404;
      res.end();
    });
  });

  return server;
}

module.exports = {
  createServer,
};
