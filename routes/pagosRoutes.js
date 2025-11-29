const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { Tour, ReservaTour } = require("../models");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  try {
    const { tour_id, cantidad_personas, usuario_id } = req.body;

    const tour = await Tour.findByPk(tour_id);

    if (!tour) {
      return res.status(404).json({ mensaje: "El tour no existe" });
    }

    const total = tour.precio * cantidad_personas;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "mxn",
      metadata: {
        tourId: String(tour_id),
        usuarioId: String(usuario_id),
        cantidad_personas: String(cantidad_personas),
      }
    });

    const reserva = await ReservaTour.create({
      usuario_id,
      tour_id,
      cantidad_personas,
      estado: "pendiente"
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      reserva_id: reserva.id
    });

  } catch (error) {
    console.error("Error en checkout:", error);
    res.status(500).json({ mensaje: "Error al procesar el pago" });
  }
});

module.exports = router;
