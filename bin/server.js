const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const port = 5000;
const htmlPath = path.join(__dirname, '../build/index.html');
const htmlData = fs.readFileSync(htmlPath, { encoding: 'utf8' });
fs.writeFileSync(htmlPath, htmlData);

// 通常用于加载静态资源
app.use(express.static(path.join(__dirname, '../build/'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'no-cache');
  },
}));

app.use((req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/'));
});

app.listen(port, function() {
  console.log(`The app server is working at http://localhost:${ port }`);
});
