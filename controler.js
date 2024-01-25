const dbConnection = require('./databases/db');

function getAllBooks(req, res) {
    const getAllBooksQuery = 'SELECT * FROM book';

    dbConnection.query(getAllBooksQuery, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ data: results }));
    });
}

function getBookDetail(req, res) {
    const parts = req.url.split('/');
    const bookId = parts[parts.length - 1];

    if (!bookId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'ID buku harus disertakan sebagai parameter' }));
        return;
    }

    const getBookDetailQuery = 'SELECT * FROM book WHERE id = ?';

    dbConnection.query(getBookDetailQuery, [bookId], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }

        if (results.length === 0) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Buku tidak ditemukan' }));
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ data: results[0] }));
    });
}

function createBook(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        const { title, price, stock, image } = JSON.parse(body);

        if (!title || !price || !stock || !image) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Semua field harus diisi' }));
            return;
        }

        const insertBookQuery = 'INSERT INTO book (title, price, stock, image) VALUES (?, ?, ?, ?)';

        dbConnection.query(insertBookQuery, [title, price, stock, image], (err, results) => {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Buku berhasil ditambahkan', data: { id: results.insertId, title, price, stock, image } }));
        });
    });
}

function updateBook(req, res) {
    const parts = req.url.split('/');
    const bookId = parts[parts.length - 1];

    if (!bookId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'ID buku harus disertakan sebagai parameter' }));
        return;
    }

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        const { title, price, stock, image } = JSON.parse(body);

        if (!title || !price || !stock || !image) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Semua field harus diisi' }));
            return;
        }

        // Query untuk melakukan update data buku berdasarkan ID
        const updateBookQuery = 'UPDATE book SET title=?, price=?, stock=?, image=? WHERE id=?';

        dbConnection.query(updateBookQuery, [title, price, stock, image, bookId], (err, results) => {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            if (results.affectedRows === 0) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Buku tidak ditemukan' }));
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Buku berhasil diperbarui' }));
        });
    });
}

function deleteBook(req, res) {
    const parts = req.url.split('/');
    const bookId = parts[parts.length - 1];

    if (!bookId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'ID buku harus disertakan sebagai parameter' }));
        return;
    }

    // Query untuk menghapus data buku berdasarkan ID
    const deleteBookQuery = 'DELETE FROM book WHERE id=?';

    dbConnection.query(deleteBookQuery, [bookId], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }

        if (results.affectedRows === 0) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Buku tidak ditemukan' }));
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Buku berhasil dihapus' }));
    });
}

module.exports = {
    getAllBooks,
    getBookDetail,
    createBook,
    updateBook,
    deleteBook
};
