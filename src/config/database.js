const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new Database(dbPath);

function initDb() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS salas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            capacidade INTEGER NOT NULL,
            localizacao TEXT NOT NULL,
            status TEXT CHECK(status IN ('ATIVA', 'INATIVA')) DEFAULT 'ATIVA'
        );

        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sala_id INTEGER NOT NULL,
            nome_solicitante TEXT NOT NULL,
            email TEXT NOT NULL,
            data TEXT NOT NULL,
            horario_inicio TEXT NOT NULL,
            horario_fim TEXT NOT NULL,
            finalidade TEXT NOT NULL,
            status TEXT CHECK(status IN ('ATIVA', 'CANCELADA')) DEFAULT 'ATIVA',
            FOREIGN KEY (sala_id) REFERENCES salas (id)
        );
    `);

    const count = db.prepare("SELECT COUNT(*) as count FROM salas").get();
    if (count.count === 0) {
        db.prepare(`INSERT INTO salas (nome, capacidade, localizacao, status) VALUES (?, ?, ?, ?)`).run('Sala Alpha', 10, 'Andar 1', 'ATIVA');
        db.prepare(`INSERT INTO salas (nome, capacidade, localizacao, status) VALUES (?, ?, ?, ?)`).run('Sala Beta', 20, 'Andar 2', 'ATIVA');
        db.prepare(`INSERT INTO salas (nome, capacidade, localizacao, status) VALUES (?, ?, ?, ?)`).run('Sala Gama', 5, 'Andar 1', 'INATIVA');
        console.log('Dados iniciais inseridos.');
    }
}

initDb();
console.log('Banco de dados SQLite iniciado.');

module.exports = db;
