const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/", usuarioController.listarTodos);
router.post("/", usuarioController.criar);
router.get("/:id", usuarioController.buscarPorId);
router.delete("/:id", usuarioController.deletar);

module.exports = router;
