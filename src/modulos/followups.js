const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todos os follow-ups
router.get("/", async (req, res) => {
  try {
    const followups = await prisma.followup.findMany({
      include: { servico: true }, // inclui o serviço relacionado
    });
    res.json(followups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar follow-ups" });
  }
});

// Buscar follow-up por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const followup = await prisma.followup.findUnique({
      where: { id },
      include: { servico: true },
    });
    if (!followup) {
      return res.status(404).json({ error: "Follow-up não encontrado" });
    }
    res.json(followup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar follow-up" });
  }
});

// Criar novo follow-up
router.post("/", async (req, res) => {
  const {
    servicoId,
    nomeServico,
    setor,
    empresa,
    representante,
    status,
    comentario,
  } = req.body;

  if (
    !servicoId ||
    !nomeServico ||
    !setor ||
    !empresa ||
    !representante ||
    !status ||
    !comentario
  ) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const followup = await prisma.followup.create({
      data: {
        servicoId,
        nomeServico,
        setor,
        empresa,
        representante,
        status,
        comentario,
      },
    });
    res.status(201).json(followup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar follow-up" });
  }
});

// Atualizar follow-up por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    servicoId,
    nomeServico,
    setor,
    empresa,
    representante,
    status,
    comentario,
    conclusao,
  } = req.body;

  try {
    const followupExistente = await prisma.followup.findUnique({
      where: { id },
    });
    if (!followupExistente) {
      return res.status(404).json({ error: "Follow-up não encontrado" });
    }

    const followupAtualizado = await prisma.followup.update({
      where: { id },
      data: {
        servicoId,
        nomeServico,
        setor,
        empresa,
        representante,
        status,
        comentario,
        conclusao: conclusao ? new Date(conclusao) : undefined,
      },
    });
    res.json(followupAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar follow-up" });
  }
});

// Deletar follow-up por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const followupExistente = await prisma.followup.findUnique({
      where: { id },
    });
    if (!followupExistente) {
      return res.status(404).json({ error: "Follow-up não encontrado" });
    }

    await prisma.followup.delete({ where: { id } });
    res.json({ message: "Follow-up removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar follow-up" });
  }
});

module.exports = router;
