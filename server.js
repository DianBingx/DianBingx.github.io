const http = require('http');
const fs = require('fs');
const path = require('path');
 
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading the file.');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});
 
const port = 3000; // 可以选择其他端口，只要没有被占用即可
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});