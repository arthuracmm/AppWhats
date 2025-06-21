const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('whatsapp.db');

db.run(`CREATE TABLE IF NOT EXISTS mensagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contato TEXT,
    texto TEXT,
    horario TEXT,
    remetente TEXT
)`);

function runAsync(stmt, params) {
    return new Promise((resolve, reject) => {
        stmt.run(params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

async function salvarMensagens(contato, mensagens) {
    const stmt = db.prepare(`INSERT INTO mensagens (contato, texto, horario, remetente) VALUES (?, ?, ?, ?)`);
    for (const msg of mensagens) {
        await runAsync(stmt, [contato, msg.text, msg.time, msg.sender]);
    }
    stmt.finalize();
}

// Fecha o banco
function fecharBanco() {
    db.close();
}

module.exports = { salvarMensagens, fecharBanco };
