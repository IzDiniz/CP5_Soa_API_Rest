const db = require('../config/database');

class Reserva {
    static create(reserva) {
        const { sala_id, nome_solicitante, email, data, horario_inicio, horario_fim, finalidade } = reserva;
        const stmt = db.prepare(
            `INSERT INTO reservas (sala_id, nome_solicitante, email, data, horario_inicio, horario_fim, finalidade, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'ATIVA')`
        );
        const result = stmt.run(sala_id, nome_solicitante, email, data, horario_inicio, horario_fim, finalidade);
        return { id: result.lastInsertRowid, ...reserva, status: 'ATIVA' };
    }

    static findAll() {
        return db.prepare(`SELECT * FROM reservas`).all();
    }

    static findById(id) {
        return db.prepare(`SELECT * FROM reservas WHERE id = ?`).get(id);
    }

    static cancel(id) {
        const stmt = db.prepare(`UPDATE reservas SET status = 'CANCELADA' WHERE id = ?`);
        return stmt.run(id);
    }

    static checkConflict(sala_id, data, horario_inicio, horario_fim) {
        return db.prepare(
            `SELECT * FROM reservas
             WHERE sala_id = ? AND data = ? AND status = 'ATIVA'
             AND (
                (horario_inicio < ? AND horario_fim > ?) OR
                (horario_inicio >= ? AND horario_inicio < ?) OR
                (horario_fim > ? AND horario_fim <= ?)
             )`
        ).get(sala_id, data, horario_fim, horario_inicio, horario_inicio, horario_fim, horario_inicio, horario_fim);
    }
}

module.exports = Reserva;
