const Sala = require('../models/Sala');
const AppError = require('../utils/AppError');

class SalaController {
    create(req, res, next) {
        try {
            const { nome, capacidade, localizacao, status } = req.body;

            if (!nome || !capacidade || !localizacao) {
                throw new AppError('Nome, capacidade e localização são obrigatórios', 400, 'Bad Request');
            }

            if (status && !['ATIVA', 'INATIVA'].includes(status)) {
                throw new AppError('Status deve ser ATIVA ou INATIVA', 400, 'Bad Request');
            }

            const novaSala = Sala.create({ nome, capacidade, localizacao, status });
            res.status(201).json(novaSala);
        } catch (error) {
            next(error);
        }
    }

    index(req, res, next) {
        try {
            const salas = Sala.findAll();
            res.status(200).json(salas);
        } catch (error) {
            next(error);
        }
    }

    show(req, res, next) {
        try {
            const { id } = req.params;
            const sala = Sala.findById(id);

            if (!sala) {
                throw new AppError('Sala não encontrada', 404, 'Not Found');
            }

            res.status(200).json(sala);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SalaController();
