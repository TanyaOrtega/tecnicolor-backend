const isAdmin = (rolPermitido) => {
  return (req, res, next) => {
    if (req.usuario.rol !== rolPermitido) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado. No tienes permisos." });
    }
    next();
  };
};

module.exports = isAdmin;
