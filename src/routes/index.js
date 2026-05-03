const express = require('express');
const router = express.Router();

const SalaController = require('../controllers/SalaController');
const ReservaController = require('../controllers/ReservaController');
const authMiddleware = require('../middlewares/auth');
const jwt = require('jsonwebtoken');

// Rota para gerar token de teste
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Mock de login simples para o trabalho
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret_key_reservas', { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ error: 'Credenciais inválidas' });
});

// Rotas de Salas
router.post('/salas', authMiddleware, SalaController.create);
router.get('/salas', SalaController.index);
router.get('/salas/:id', SalaController.show);

// Rotas de Reservas
router.post('/reservas', authMiddleware, ReservaController.create);
router.get('/reservas', ReservaController.index);
router.get('/reservas/:id', ReservaController.show);
router.delete('/reservas/:id', authMiddleware, ReservaController.cancel);

module.exports = router;
