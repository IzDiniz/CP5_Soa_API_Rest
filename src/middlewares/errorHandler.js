const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.errorType = err.errorType || 'Internal Server Error';

    const errorResponse = {
        timestamp: new Date().toISOString(),
        status: err.statusCode,
        error: err.errorType,
        message: err.message || 'Ocorreu um erro interno no servidor',
        path: req.originalUrl
    };

    res.status(err.statusCode).json(errorResponse);
};

module.exports = errorHandler;
