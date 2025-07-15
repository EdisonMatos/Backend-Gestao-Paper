const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Criar novo usuário
router.post("/", async (req, res) => {
  const { nome, email, senha, avatar, cargo, setor } = req.body;
  try {
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha, avatar, cargo, setor },
    });
    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Buscar usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.params.id },
    });
    if (!usuario)
      return res.status(404).json({ error: "Usuário não encontrado." });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});

// Atualizar usuário por ID
router.put("/:id", async (req, res) => {
  const { nome, email, senha, avatar, cargo, setor } = req.body;
  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: req.params.id },
      data: { nome, email, senha, avatar, cargo, setor },
    });
    res.json(usuarioAtualizado);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
});

// Deletar usuário por ID
router.delete("/:id", async (req, res) => {
  try {
    await prisma.usuario.delete({ where: { id: req.params.id } });
    res.json({ message: "Usuário deletado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar usuário." });
  }
});

module.exports = router;
