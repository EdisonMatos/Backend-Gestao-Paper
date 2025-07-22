const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todos os registros
router.get("/", async (req, res) => {
  try {
    const registros = await prisma.registroRotina.findMany();
    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar registros" });
  }
});

// Buscar registro por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const registro = await prisma.registroRotina.findUnique({ where: { id } });
    if (!registro) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }
    res.json(registro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar registro" });
  }
});

// Criar novo registro
router.post("/", async (req, res) => {
  const { dataConclusao, comentario, feitoPor, rotinaId } = req.body;

  if (!dataConclusao || !comentario || !feitoPor || !rotinaId) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const registro = await prisma.registroRotina.create({
      data: {
        dataConclusao: new Date(dataConclusao),
        comentario,
        feitoPor,
        rotinaId,
      },
    });
    res.status(201).json(registro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar registro" });
  }
});

// Atualizar registro por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { dataConclusao, comentario, feitoPor, rotinaId } = req.body;

  try {
    const registroExistente = await prisma.registroRotina.findUnique({
      where: { id },
    });
    if (!registroExistente) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    const registroAtualizado = await prisma.registroRotina.update({
      where: { id },
      data: {
        dataConclusao: new Date(dataConclusao),
        comentario,
        feitoPor,
        rotinaId,
      },
    });
    res.json(registroAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar registro" });
  }
});

// Deletar registro por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const registroExistente = await prisma.registroRotina.findUnique({
      where: { id },
    });
    if (!registroExistente) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    await prisma.registroRotina.delete({ where: { id } });
    res.json({ message: "Registro removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar registro" });
  }
});

module.exports = router;
