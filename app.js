const http = require('http');
const url = require('url');
const querystring = require('querystring');
const dbConnection = require('./databases/db');
const bookControler = require('./controler')

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (req.method === 'GET' && reqUrl.pathname === '/book') {

        bookControler.getAllBooks(req, res)

    } else if (req.method === 'GET' && reqUrl.pathname.startsWith('/book/')) {

        bookControler.getBookDetail(req, res)

    } else if (req.method === 'POST' && reqUrl.pathname === '/book') {

        bookControler.createBook(req, res)

    } else if (req.method === 'PUT' && reqUrl.pathname.startsWith('/book/')) {

        bookControler.updateBook(req, res)

    } else if (req.method === 'DELETE' && reqUrl.pathname.startsWith('/book/')) {

        bookControler.deleteBook(req, res)

    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
