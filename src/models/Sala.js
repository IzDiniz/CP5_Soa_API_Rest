const db = require('../config/database');

class Sala {
    static create(sala) {
        const { nome, capacidade, localizacao, status } = sala;
        const stmt = db.prepare(
            `INSERT INTO salas (nome, capacidade, localizacao, status) VALUES (?, ?, ?, ?)`
        );
        const result = stmt.run(nome, capacidade, localizacao, status || 'ATIVA');
        return { id: result.lastInsertRowid, nome, capacidade, localizacao, status: status || 'ATIVA' };
    }

    static findAll() {
        return db.prepare(`SELECT * FROM salas`).all();
    }

    static findById(id) {
        return db.prepare(`SELECT * FROM salas WHERE id = ?`).get(id);
    }
}

module.exports = Sala;
