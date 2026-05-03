const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError('Token não fornecido', 401, 'Unauthorized'));
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return next(new AppError('Erro de token', 401, 'Unauthorized'));
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return next(new AppError('Token mal formatado', 401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key_reservas', (err, decoded) => {
        if (err) {
            return next(new AppError('Token inválido', 401, 'Unauthorized'));
        }

        req.userId = decoded.id;
        return next();
    });
};

module.exports = authMiddleware;
