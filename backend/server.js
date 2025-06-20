const express = require('express');
const cors = require('cors');
const db = require('./database');
const { enviarMensagem, iniciarWhatsApp } = require('./whatsapp');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/mensagens', (req, res) => {
    db.all('SELECT * FROM mensagens ORDER BY contato', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/enviar', async (req, res) => {
    const { contato, mensagem } = req.body;
    if (!contato || !mensagem) {
        return res.status(400).json({ erro: 'Contato e mensagem obrigatórios.' });
    }

    try {
        await enviarMensagem(contato, mensagem);
        res.status(200).json({ sucesso: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao enviar mensagem.' });
    }
});

app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
    iniciarWhatsApp().catch(console.error);
});
