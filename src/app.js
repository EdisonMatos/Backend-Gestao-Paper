const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Criar um usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha, avatar, cargo, setor, tarefas, tags, obs } =
    req.body;

  try {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        avatar,
        cargo,
        setor,
        tarefas,
        tags,
        obs,
      },
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === "P2002") {
      // erro de unique constraint (email)
      res.status(400).json({ error: "Email já está em uso." });
    } else {
      res.status(500).json({ error: "Erro ao criar usuário." });
    }
  }
});

app.get("/", (req, res) => {
  res.send("API rodando!");
});

// Listar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Buscar um usuário pelo id
app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});

// Atualizar usuário pelo id
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, avatar, cargo, setor, tarefas, tags, obs } =
    req.body;

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nome,
        email,
        senha,
        avatar,
        cargo,
        setor,
        tarefas,
        tags,
        obs,
      },
    });
    res.json(usuarioAtualizado);
  } catch (error) {
    if (error.code === "P2025") {
      // registro não encontrado
      res.status(404).json({ error: "Usuário não encontrado para atualizar." });
    } else if (error.code === "P2002") {
      // unique constraint email
      res.status(400).json({ error: "Email já está em uso." });
    } else {
      res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  }
});

// Deletar usuário pelo id
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({
      where: { id },
    });
    res.json({ message: "Usuário deletado com sucesso." });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Usuário não encontrado para deletar." });
    } else {
      res.status(500).json({ error: "Erro ao deletar usuário." });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
