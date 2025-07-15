const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todos os comentários
router.get("/", async (req, res) => {
  try {
    const comentarios = await prisma.comentario.findMany({
      include: {
        servico: true,
      },
    });
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
});

// Buscar comentário por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comentario = await prisma.comentario.findUnique({
      where: { id },
      include: {
        servico: true,
      },
    });

    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    res.json(comentario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar comentário" });
  }
});

// Criar novo comentário
router.post("/", async (req, res) => {
  const { servicoId, feitoPor, setor, texto } = req.body;

  if (!servicoId || !feitoPor || !setor || !texto) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const comentario = await prisma.comentario.create({
      data: {
        servicoId,
        feitoPor,
        setor,
        texto,
      },
    });

    res.status(201).json(comentario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar comentário" });
  }
});

// Atualizar comentário por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { servicoId, feitoPor, setor, texto } = req.body;

  try {
    const comentarioExistente = await prisma.comentario.findUnique({
      where: { id },
    });
    if (!comentarioExistente) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    const comentarioAtualizado = await prisma.comentario.update({
      where: { id },
      data: {
        servicoId,
        feitoPor,
        setor,
        texto,
      },
    });

    res.json(comentarioAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar comentário" });
  }
});

// Deletar comentário por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comentarioExistente = await prisma.comentario.findUnique({
      where: { id },
    });
    if (!comentarioExistente) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    await prisma.comentario.delete({ where: { id } });
    res.json({ message: "Comentário removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar comentário" });
  }
});

module.exports = router;
