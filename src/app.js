const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usuariosRouter = require("./modulos/usuarios");
const clientesRouter = require("./modulos/clientes");
const servicosRouter = require("./modulos/servicos");
const comentariosRouter = require("./modulos/comentarios");

app.use("/usuarios", usuariosRouter);
app.use("/clientes", clientesRouter);
app.use("/servicos", servicosRouter);
app.use("/comentarios", comentariosRouter);

app.get("/", (req, res) => {
  res.send("🚀 O Mago é implacável!");
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
