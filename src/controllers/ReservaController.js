const Reserva = require('../models/Reserva');
const Sala = require('../models/Sala');
const AppError = require('../utils/AppError');

class ReservaController {
    create(req, res, next) {
        try {
            const { sala_id, nome_solicitante, email, data, horario_inicio, horario_fim, finalidade } = req.body;

            if (!sala_id || !nome_solicitante || !email || !data || !horario_inicio || !horario_fim || !finalidade) {
                throw new AppError('Todos os campos são obrigatórios', 400, 'Bad Request');
            }

            if (horario_fim <= horario_inicio) {
                throw new AppError('O horário final deve ser maior que o inicial', 400, 'Bad Request');
            }

            const sala = Sala.findById(sala_id);
            if (!sala) {
                throw new AppError('Sala não encontrada', 404, 'Not Found');
            }

            if (sala.status === 'INATIVA') {
                throw new AppError('Não é possível reservar uma sala inativa', 400, 'Bad Request');
            }

            const conflito = Reserva.checkConflict(sala_id, data, horario_inicio, horario_fim);
            if (conflito) {
                throw new AppError('Já existe reserva para esta sala no horário informado', 409, 'Conflict');
            }

            const novaReserva = Reserva.create({
                sala_id, nome_solicitante, email, data, horario_inicio, horario_fim, finalidade
            });

            res.status(201).json(novaReserva);
        } catch (error) {
            next(error);
        }
    }

    index(req, res, next) {
        try {
            const reservas = Reserva.findAll();
            res.status(200).json(reservas);
        } catch (error) {
            next(error);
        }
    }

    show(req, res, next) {
        try {
            const { id } = req.params;
            const reserva = Reserva.findById(id);

            if (!reserva) {
                throw new AppError('Reserva não encontrada', 404, 'Not Found');
            }

            res.status(200).json(reserva);
        } catch (error) {
            next(error);
        }
    }

    cancel(req, res, next) {
        try {
            const { id } = req.params;
            const reserva = Reserva.findById(id);

            if (!reserva) {
                throw new AppError('Reserva não encontrada', 404, 'Not Found');
            }

            if (reserva.status === 'CANCELADA') {
                throw new AppError('Reserva já está cancelada', 400, 'Bad Request');
            }

            Reserva.cancel(id);
            res.status(200).json({ message: 'Reserva cancelada com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReservaController();
