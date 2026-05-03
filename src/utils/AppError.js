class AppError extends Error {
    constructor(message, statusCode = 400, errorType = 'Bad Request') {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
