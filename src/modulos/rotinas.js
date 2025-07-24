const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todas as rotinas
router.get("/", async (req, res) => {
  try {
    const rotinas = await prisma.rotina.findMany({
      include: {
        registros: true,
      },
    });
    res.json(rotinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar rotinas" });
  }
});
// Buscar rotina por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rotinaExistente = await prisma.rotina.findUnique({ where: { id } });
    if (!rotinaExistente) {
      return res.status(404).json({ error: "Rotina não encontrada" });
    }

    // Primeiro, exclui registros associados
    await prisma.registroRotina.deleteMany({ where: { rotinaId: id } });

    // Agora exclui a rotina
    await prisma.rotina.delete({ where: { id } });

    res.json({ message: "Rotina removida com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar rotina:", error);
    res.status(500).json({ error: "Erro ao deletar rotina" });
  }
});

// Criar nova rotina
router.post("/", async (req, res) => {
  const {
    nome,
    descricao,
    status,
    complexidade,
    horario,
    janela,
    diaDaSemana,
    setor,
  } = req.body;

  if (
    !nome ||
    !descricao ||
    !status ||
    complexidade === undefined ||
    !horario ||
    janela === undefined ||
    !diaDaSemana ||
    !setor
  ) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const rotina = await prisma.rotina.create({
      data: {
        nome,
        descricao,
        status,
        complexidade,
        horario,
        janela,
        diaDaSemana,
        setor,
      },
    });
    res.status(201).json(rotina);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar rotina" });
  }
});

// Atualizar rotina por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    descricao,
    status,
    complexidade,
    horario,
    janela,
    conclusao,
    diaDaSemana,
    setor,
  } = req.body;

  try {
    const rotinaExistente = await prisma.rotina.findUnique({ where: { id } });
    if (!rotinaExistente) {
      return res.status(404).json({ error: "Rotina não encontrada" });
    }

    const rotinaAtualizada = await prisma.rotina.update({
      where: { id },
      data: {
        nome,
        descricao,
        status,
        complexidade,
        horario,
        janela,
        conclusao: new Date(conclusao),
        diaDaSemana,
        setor,
      },
    });
    res.json(rotinaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar rotina" });
  }
});

// Deletar rotina por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rotinaExistente = await prisma.rotina.findUnique({ where: { id } });
    if (!rotinaExistente) {
      return res.status(404).json({ error: "Rotina não encontrada" });
    }

    await prisma.rotina.delete({ where: { id } });
    res.json({ message: "Rotina removida com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar rotina" });
  }
});

module.exports = router;
