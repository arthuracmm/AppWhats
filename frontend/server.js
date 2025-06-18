const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./robot/whatsapp.db'); // caminho pro seu banco

app.use(cors());

// Rota para pegar mensagens
app.get('/mensagens', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

app.listen(3001, () => {
    console.log('API rodando em http://localhost:3001');
});
