// routes/reservasRoutes.js
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const path = require("path");
const moment = require("moment");
const { ReservaTour, Tour, Usuario } = require("../models");

// GET /api/reservas/pdf/:reservaId
router.get("/pdf/:reservaId", async (req, res) => {
  try {
    const { reservaId } = req.params;

    const reserva = await ReservaTour.findByPk(reservaId, {
      include: [
        { model: Tour, as: "tour" },
        { model: Usuario, as: "usuario" }
      ]
    });

    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    const { tour, usuario } = reserva;

    const filename = `Reserva_${reservaId}_${tour.nombre.replace(/ /g, "_")}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    doc.pipe(res);

    // =====================================
    // 🌈 FONDO SUAVE VIOLETA
    // =====================================
    doc.rect(0, 0, doc.page.width, doc.page.height)
      .fill("#F3E5FF");

    // =====================================
    // 🌟 PORTADA
    // =====================================
    const logoPath = path.join(__dirname, "..", "public", "imagenes", "logo.png");

    try {
      doc.image(logoPath, doc.page.width / 2 - 80, 70, { width: 160 });
    } catch {}

    doc
      .fontSize(32)
      .fillColor("#6A0DAD")
      .font("Helvetica-Bold")
      .text("Tecnicolor Travel", {
        align: "center",
      });

    doc
      .moveDown(10)
      .fontSize(20)
      .fillColor("#444")
      .text("Comprobante de Reserva", { align: "center" });

    doc.moveDown(1.5);

    doc
      .fontSize(14)
      .fillColor("#555")
      .text(`Reserva Nº: ${reserva.id}`, { align: "center" });

    doc.text(`Fecha: ${moment(reserva.createdAt).format("LLL")}`, {
      align: "center",
    });

    // Línea decorativa
    doc
      .moveTo(100, 260)
      .lineTo(doc.page.width - 100, 260)
      .strokeColor("#6A0DAD")
      .lineWidth(2)
      .stroke();

    doc.addPage();

    // =====================================
    // 🟣 SECCIÓN DATOS DEL CLIENTE
    // =====================================

    // Fondo
    doc
      .roundedRect(40, 40, doc.page.width - 80, 140, 15)
      .fill("#FFFFFF");

    doc.fillColor("#6A0DAD").fontSize(20).font("Helvetica-Bold").text("Datos del Cliente", 60, 55);

    doc
      .fontSize(13)
      .fillColor("#333")
      .font("Helvetica")
      .text(`• Nombre: ${usuario.nombre}`, 60, 95)
      .text(`• Email: ${usuario.email}`, 60, 120);

    // =====================================
    // 🟣 SECCIÓN DETALLES DEL TOUR
    // =====================================

    doc
      .roundedRect(40, 200, doc.page.width - 80, 180, 15)
      .fill("#FFFFFF");

    doc
      .fillColor("#6A0DAD")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Detalles del Tour", 60, 215);

    doc
      .fontSize(13)
      .fillColor("#333")
      .font("Helvetica")
      .text(`• Tour: ${tour.nombre}`, 60, 255)
      .text(`• Descripción: ${tour.descripcion}`, 60, 295)
      .text(`• Precio: $${tour.precio}`, 60, 330);

    // =====================================
    // 🟣 NOTAS FINALES
    // =====================================

    doc
      .roundedRect(40, 420, doc.page.width - 80, 130, 15)
      .fill("#FFFFFF");

    doc
      .fillColor("#6A0DAD")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Información Importante", 60, 435);

    doc
      .fontSize(12)
      .fillColor("#444")
      .font("Helvetica")
      .text(
        "Este documento confirma tu reserva oficial con Tecnicolor Travel. " +
        "Presenta este comprobante si el guía o proveedor te lo solicita. " +
        "Gracias por viajar con nosotros. ¡Tu aventura comienza ahora!",
        60,
        475,
        { align: "center" }
      );

    // =====================================
    // 🟣 FOOTER PROFESIONAL
    // =====================================

    doc
      .moveTo(40, doc.page.height - 70)
      .lineTo(doc.page.width - 40, doc.page.height - 70)
      .strokeColor("#D0B7F7")
      .lineWidth(2)
      .stroke();

    doc
      .fontSize(11)
      .fillColor("#6A0DAD")
      .text(
        "Tecnicolor Travel • tecnicolortravel@gmail.com • +52 33 2448 4234",
        0,
        doc.page.height - 55,
        { align: "center" }
      );

    doc.end();

  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).json({ mensaje: "Error generando PDF" });
  }
});

module.exports = router;
