const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todos os clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { servicos: true }, // inclui os serviços relacionados
    });
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

// Buscar cliente por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { servicos: true },
    });
    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
});

// Criar novo cliente
router.post("/", async (req, res) => {
  const { empresa, representante, telefone, email, dominio } = req.body;

  if (!empresa || !representante || !telefone || !email || !dominio) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const cliente = await prisma.cliente.create({
      data: {
        empresa,
        representante,
        telefone,
        email,
        dominio,
      },
    });
    res.status(201).json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

// Atualizar cliente por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { empresa, representante, telefone, email, dominio } = req.body;

  try {
    const clienteExistente = await prisma.cliente.findUnique({ where: { id } });
    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { id },
      data: {
        empresa,
        representante,
        telefone,
        email,
        dominio,
      },
    });
    res.json(clienteAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

// Deletar cliente por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const clienteExistente = await prisma.cliente.findUnique({ where: { id } });
    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await prisma.cliente.delete({ where: { id } });
    res.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar cliente" });
  }
});

module.exports = router;
