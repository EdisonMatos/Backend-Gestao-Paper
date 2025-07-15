const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 O Mago é implacável!");
});

// Listar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Criar novo usuário
app.post("/usuarios", async (req, res) => {
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
app.get("/usuarios/:id", async (req, res) => {
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
app.put("/usuarios/:id", async (req, res) => {
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
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.usuario.delete({ where: { id: req.params.id } });
    res.json({ message: "Usuário deletado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar usuário." });
  }
});

// Iniciar servidor
app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
