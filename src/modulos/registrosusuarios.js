const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todos os registros de usuários
router.get("/", async (req, res) => {
  try {
    const registros = await prisma.registroUsuarios.findMany({
      include: {
        usuario: true, // Inclui o usuário relacionado
      },
    });
    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar registros de usuários" });
  }
});

// Buscar registro de usuário por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await prisma.registroUsuarios.findUnique({
      where: { id },
      include: {
        usuario: true,
      },
    });

    if (!registro) {
      return res
        .status(404)
        .json({ error: "Registro de usuário não encontrado" });
    }

    res.json(registro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar registro de usuário" });
  }
});

// Criar novo registro de usuário
router.post("/", async (req, res) => {
  const { usuarioId, natureza, tipo, subtipo, descricao, data } = req.body;

  // Apenas o usuarioId é obrigatório para criar a relação
  if (!usuarioId) {
    return res.status(400).json({ error: "O campo usuarioId é obrigatório" });
  }

  try {
    const novoRegistro = await prisma.registroUsuarios.create({
      data: {
        usuarioId,
        natureza,
        tipo,
        subtipo,
        descricao,
        data: data ? new Date(data) : null, // Converte a data se ela for fornecida
      },
    });

    res.status(201).json(novoRegistro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar registro de usuário" });
  }
});

// Atualizar registro de usuário por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { usuarioId, natureza, tipo, subtipo, descricao, data } = req.body;

  try {
    const registroExistente = await prisma.registroUsuarios.findUnique({
      where: { id },
    });
    if (!registroExistente) {
      return res
        .status(404)
        .json({ error: "Registro de usuário não encontrado" });
    }

    const registroAtualizado = await prisma.registroUsuarios.update({
      where: { id },
      data: {
        usuarioId,
        natureza,
        tipo,
        subtipo,
        descricao,
        data: data ? new Date(data) : undefined, // Atualiza a data se fornecida
      },
    });

    res.json(registroAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar registro de usuário" });
  }
});

// Deletar registro de usuário por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const registroExistente = await prisma.registroUsuarios.findUnique({
      where: { id },
    });
    if (!registroExistente) {
      return res
        .status(404)
        .json({ error: "Registro de usuário não encontrado" });
    }

    await prisma.registroUsuarios.delete({ where: { id } });
    res.json({ message: "Registro de usuário removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar registro de usuário" });
  }
});

module.exports = router;
