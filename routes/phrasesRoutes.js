// routes/phrasesRoutes.js
const express = require('express');
const router = express.Router();
const phrasesController = require('../controllers/phrasesController');
const authMiddleware = require('../middleware/authMiddleware'); 
const isAdmin = require('../middleware/isAdmin');

// Rutas públicas de consulta
router.get('/', phrasesController.getAll);
router.get('/idioma/:lang', phrasesController.getByIdioma);

// Rutas protegidas (crear/editar/borrar) - solo admin
router.post('/', authMiddleware, isAdmin('admin'), phrasesController.create);
router.put('/:id', authMiddleware, isAdmin('admin'), phrasesController.update);
router.delete('/:id', authMiddleware, isAdmin('admin'), phrasesController.remove);

//router.post('/', authMiddleware, isAdmin, phrasesController.create);
//router.put('/:id', authMiddleware, isAdmin, phrasesController.update);
//router.delete('/:id', authMiddleware, isAdmin, phrasesController.remove);

module.exports = router;
