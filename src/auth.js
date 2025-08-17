const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "segredo-muito-seguro";

// ROTA ÚNICA DE LOGIN PARA USUÁRIOS (modelo Usuario)
router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const isValid = senha === usuario.senha;

    if (!isValid) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        cargo: usuario.cargo,
        setor: usuario.setor,
        tipo: usuario.tipo,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        avatar: usuario.avatar || "",
        cargo: usuario.cargo || "",
        setor: usuario.setor || "",
        tipo: usuario.tipo || "",
        tarefas: usuario.tarefas || "sem tarefas",
        tags: usuario.tags || "sem tags",
        obs: usuario.obs || "sem observações",
      },
    });
  } catch (error) {
    console.error("Erro no login de usuário:", error);
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;
