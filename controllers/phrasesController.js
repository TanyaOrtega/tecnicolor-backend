const { Frase } = require('../models');

module.exports = {
  async getAll(req, res) {
    try {
      const frases = await Frase.findAll({ order: [['categoria', 'ASC'], ['original','ASC']] });
      res.json({ frases });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener frases' });
    }
  },

  async getByIdioma(req, res) {
    try {
      const idioma = req.params.lang;
      const frases = await Frase.findAll({ where: { idioma }, order: [['categoria','ASC'], ['original','ASC']] });
      res.json({ frases });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener frases por idioma' });
    }
  },

  async create(req, res) {
    try {
      const { idioma, categoria, original, traduccion } = req.body;
      if (!idioma || !original) return res.status(400).json({ error: 'Faltan campos obligatorios' });
      const nueva = await Frase.create({ idioma, categoria, original, traduccion });
      res.status(201).json({ frase: nueva });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear frase' });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      await Frase.update(req.body, { where: { id } });
      res.json({ message: 'Frase actualizada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar frase' });
    }
  },

  async remove(req, res) {
    try {
      const id = req.params.id;
      await Frase.destroy({ where: { id } });
      res.json({ message: 'Frase eliminada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar frase' });
    }
  }
};
